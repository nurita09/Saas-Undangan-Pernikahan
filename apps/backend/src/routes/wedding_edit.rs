use axum::{
    extract::{Multipart, Query, State},
    http::HeaderMap,
    Json,
};
use aws_sdk_s3::primitives::ByteStream;
use chrono::{DateTime, NaiveDateTime, Utc};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::AppError,
    models::wedding_edit::{
        EditAuthQuery, LoveStoryEntry, UpdateWeddingPayload, UploadResponse, WeddingEditData,
        WeddingGiftEntry,
    },
    state::AppState,
    utils::url::validate_optional_url,
};

const MAX_UPLOAD_BYTES: usize = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES: &[&str] = &["image/jpeg", "image/png", "image/webp"];

/// Cover undangan (Theme 1-6) boleh berupa video pendek yang di-loop tanpa
/// suara -- lebih besar dari batas foto, tapi tetap wajar untuk klip singkat.
/// Video TIDAK di-resize/re-encode (tidak ada codec video di backend ini);
/// disimpan mentah apa adanya, hanya diberi ekstensi sesuai content-type.
const MAX_VIDEO_UPLOAD_BYTES: usize = 20 * 1024 * 1024;
const ALLOWED_VIDEO_CONTENT_TYPES: &[(&str, &str)] = &[("video/mp4", "mp4"), ("video/webm", "webm")];

fn video_extension_for(content_type: &str) -> Option<&'static str> {
    ALLOWED_VIDEO_CONTENT_TYPES
        .iter()
        .find(|(ct, _)| *ct == content_type)
        .map(|(_, ext)| *ext)
}

/// Sisi terpanjang maksimal setelah resize -- foto kamera/HP (4000px+, bisa
/// 10MB) diperkecil supaya undangan tidak berat dimuat tamu. 1920px masih
/// tajam untuk layar mana pun yang dipakai menampilkan undangan.
const MAX_IMAGE_DIMENSION: u32 = 1920;
const JPEG_QUALITY: u8 = 82;

/// Decode -> resize (kalau kegedean) -> re-encode JPEG. Semua foto keluar
/// sebagai JPEG terkompresi; transparansi PNG tidak dibutuhkan untuk foto
/// undangan, dan ini memangkas ukuran file drastis (10MB -> ratusan KB).
fn process_image(bytes: &[u8]) -> Result<Vec<u8>, AppError> {
    let img = image::load_from_memory(bytes)
        .map_err(|_| AppError::InvalidInput("file bukan gambar yang valid".to_string()))?;

    let img = if img.width() > MAX_IMAGE_DIMENSION || img.height() > MAX_IMAGE_DIMENSION {
        img.thumbnail(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION)
    } else {
        img
    };

    let mut out = std::io::Cursor::new(Vec::new());
    let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, JPEG_QUALITY);
    img.to_rgb8()
        .write_with_encoder(encoder)
        .map_err(|_| AppError::InvalidInput("gagal memproses gambar".to_string()))?;

    Ok(out.into_inner())
}

// Batas jumlah baris per wedding -- selaras dengan batas render di Theme1
// (MAX_LOVE_STORIES=5, MAX_GALLERY_PHOTOS=10) supaya tidak ada data tersimpan
// yang diam-diam tidak pernah tampil.
const MAX_LOVE_STORIES: usize = 5;
const MAX_GALLERY_PHOTOS: usize = 10;
const MAX_WEDDING_GIFTS: usize = 4;

/// Token adalah satu-satunya kredensial (tanpa password) -- cari wedding_id
/// langsung dari access_token yang unik.
async fn authenticate_by_token(db: &PgPool, headers: &HeaderMap) -> Result<Uuid, AppError> {
    let token = headers
        .get("X-Access-Token")
        .and_then(|value| value.to_str().ok())
        .ok_or(AppError::Unauthorized)?;

    sqlx::query_scalar::<_, Uuid>("SELECT id FROM weddings WHERE access_token = $1")
        .bind(token)
        .fetch_optional(db)
        .await?
        .ok_or(AppError::Unauthorized)
}

async fn fetch_edit_data(db: &PgPool, wedding_id: Uuid) -> Result<WeddingEditData, AppError> {
    let mut data = sqlx::query_as::<_, WeddingEditData>(
        r#"
        SELECT
            w.id AS wedding_id,
            w.subdomain_slug,
            w.theme_id,
            w.primary_color,
            w.secondary_color,
            w.music_url,
            d.groom_name,
            d.bride_name,
            d.wedding_date,
            d.location_address,
            d.maps_url,
            d.cover_photo_url,
            d.groom_photo_url,
            d.bride_photo_url,
            d.groom_parents,
            d.bride_parents,
            d.groom_ig,
            d.bride_ig,
            d.akad_date,
            d.akad_location,
            d.akad_maps_url,
            d.resepsi_date,
            d.resepsi_location,
            d.resepsi_maps_url,
            d.gallery_video_url,
            w.theme_settings,
            w.updated_at
        FROM weddings w
        INNER JOIN wedding_details d ON d.wedding_id = w.id
        WHERE w.id = $1
        "#,
    )
    .bind(wedding_id)
    .fetch_optional(db)
    .await?
    .ok_or(AppError::NotFound)?;

    data.love_stories = sqlx::query_as::<_, LoveStoryEntry>(
        "SELECT date, description, photo_url FROM love_stories WHERE wedding_id = $1 ORDER BY order_seq ASC",
    )
    .bind(wedding_id)
    .fetch_all(db)
    .await?;

    data.gallery_photos = sqlx::query_scalar::<_, String>(
        "SELECT photo_url FROM gallery_photos WHERE wedding_id = $1 ORDER BY order_seq ASC",
    )
    .bind(wedding_id)
    .fetch_all(db)
    .await?;

    data.wedding_gifts = sqlx::query_as::<_, WeddingGiftEntry>(
        "SELECT gift_type, bank_name, account_name, account_number FROM wedding_gifts WHERE wedding_id = $1 ORDER BY created_at ASC",
    )
    .bind(wedding_id)
    .fetch_all(db)
    .await?;

    Ok(data)
}

/// GET /api/wedding/edit-auth?slug=... + header X-Access-Token.
/// Validasi token cocok dengan subdomain_slug tertentu. Sekalian kembalikan data
/// terkini untuk prefill form supaya frontend tidak perlu request kedua.
/// Token lewat header (bukan query string) supaya tidak tercatat di access log.
pub async fn edit_auth(
    headers: HeaderMap,
    State(state): State<AppState>,
    Query(query): Query<EditAuthQuery>,
) -> Result<Json<WeddingEditData>, AppError> {
    let token = headers
        .get("X-Access-Token")
        .and_then(|value| value.to_str().ok())
        .ok_or(AppError::Unauthorized)?;

    let wedding_id = sqlx::query_scalar::<_, Uuid>(
        "SELECT id FROM weddings WHERE subdomain_slug = $1 AND access_token = $2",
    )
    .bind(&query.slug)
    .bind(token)
    .fetch_optional(&state.db)
    .await?
    .ok_or(AppError::Unauthorized)?;

    let data = fetch_edit_data(&state.db, wedding_id).await?;
    Ok(Json(data))
}

fn validate_hex_color(value: &str) -> Result<(), AppError> {
    let is_valid =
        value.len() == 7 && value.starts_with('#') && value[1..].chars().all(|c| c.is_ascii_hexdigit());

    if is_valid {
        Ok(())
    } else {
        Err(AppError::InvalidInput(format!(
            "warna '{value}' harus format hex #RRGGBB"
        )))
    }
}

/// Input datang dari <input type="datetime-local"> ("YYYY-MM-DDTHH:MM").
/// Disimpan apa adanya sebagai UTC tanpa konversi timezone -- MVP, cukup untuk
/// round-trip tampil balik jam yang sama di editor & undangan.
fn parse_wedding_date(raw: &Option<String>) -> Result<Option<DateTime<Utc>>, AppError> {
    match raw {
        None => Ok(None),
        Some(s) if s.trim().is_empty() => Ok(None),
        Some(s) => {
            let naive = NaiveDateTime::parse_from_str(s.trim(), "%Y-%m-%dT%H:%M").map_err(|_| {
                AppError::InvalidInput("format tanggal harus YYYY-MM-DDTHH:MM".to_string())
            })?;
            Ok(Some(naive.and_utc()))
        }
    }
}

/// Semua field URL dari input user wajib berskema http(s) -- nilai seperti
/// "javascript:..." dirender frontend sebagai href dan bisa jadi vektor XSS.
fn validate_urls(payload: &UpdateWeddingPayload) -> Result<(), AppError> {
    validate_optional_url("maps_url", &payload.maps_url)?;
    validate_optional_url("akad_maps_url", &payload.akad_maps_url)?;
    validate_optional_url("resepsi_maps_url", &payload.resepsi_maps_url)?;
    validate_optional_url("gallery_video_url", &payload.gallery_video_url)?;
    validate_optional_url("cover_photo_url", &payload.cover_photo_url)?;
    validate_optional_url("music_url", &payload.music_url)?;
    validate_optional_url("groom_photo_url", &payload.groom_photo_url)?;
    validate_optional_url("bride_photo_url", &payload.bride_photo_url)?;

    for story in &payload.love_stories {
        validate_optional_url("love_stories.photo_url", &story.photo_url)?;
    }
    for url in &payload.gallery_photos {
        validate_optional_url("gallery_photos", &Some(url.clone()))?;
    }

    Ok(())
}

fn validate_arrays(payload: &UpdateWeddingPayload) -> Result<(), AppError> {
    if payload.love_stories.len() > MAX_LOVE_STORIES {
        return Err(AppError::InvalidInput(format!(
            "maksimal {MAX_LOVE_STORIES} love story"
        )));
    }
    if payload.gallery_photos.len() > MAX_GALLERY_PHOTOS {
        return Err(AppError::InvalidInput(format!(
            "maksimal {MAX_GALLERY_PHOTOS} foto galeri"
        )));
    }
    if payload.wedding_gifts.len() > MAX_WEDDING_GIFTS {
        return Err(AppError::InvalidInput(format!(
            "maksimal {MAX_WEDDING_GIFTS} wedding gift"
        )));
    }
    for gift in &payload.wedding_gifts {
        if gift.gift_type != "bank" && gift.gift_type != "kado" {
            return Err(AppError::InvalidInput(
                "gift_type harus 'bank' atau 'kado'".to_string(),
            ));
        }
    }
    Ok(())
}

/// PUT /api/wedding/update
/// Wajib header X-Access-Token. Update tabel weddings + wedding_details, lalu
/// replace-all love_stories/gallery_photos/wedding_gifts -- semua dalam satu
/// transaksi supaya undangan tidak pernah tampil setengah-baru setengah-lama.
pub async fn update_wedding(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<UpdateWeddingPayload>,
) -> Result<Json<WeddingEditData>, AppError> {
    let wedding_id = authenticate_by_token(&state.db, &headers).await?;

    let groom_name = payload.groom_name.trim().to_string();
    let bride_name = payload.bride_name.trim().to_string();
    if groom_name.is_empty() || bride_name.is_empty() {
        return Err(AppError::InvalidInput(
            "groom_name dan bride_name wajib diisi".to_string(),
        ));
    }
    validate_hex_color(&payload.primary_color)?;
    validate_hex_color(&payload.secondary_color)?;
    validate_arrays(&payload)?;
    validate_urls(&payload)?;

    let wedding_date = parse_wedding_date(&payload.wedding_date)?;
    let akad_date = parse_wedding_date(&payload.akad_date)?;
    let resepsi_date = parse_wedding_date(&payload.resepsi_date)?;

    // Snapshot data lama SEBELUM update -- dipakai setelah commit untuk
    // menghapus objek MinIO yang tidak direferensikan lagi (foto diganti/dihapus).
    let old_data = fetch_edit_data(&state.db, wedding_id).await?;

    let mut tx = state.db.begin().await?;

    // Optimistic locking: FOR UPDATE mengunci baris sampai commit, lalu versi
    // yang dipegang klien dibandingkan dengan versi DB. Kalau beda, berarti ada
    // simpanan lain sejak form dimuat (mis. tab kedua) -- tolak, jangan timpa.
    let current_updated_at = sqlx::query_scalar::<_, DateTime<Utc>>(
        "SELECT updated_at FROM weddings WHERE id = $1 FOR UPDATE",
    )
    .bind(wedding_id)
    .fetch_one(&mut *tx)
    .await?;

    if let Some(expected) = payload.expected_updated_at {
        if expected != current_updated_at {
            return Err(AppError::Conflict(
                "data undangan sudah berubah di tempat lain (mis. tab lain). Muat ulang halaman ini dulu, lalu ulangi perubahanmu".to_string(),
            ));
        }
    }

    sqlx::query(
        "UPDATE weddings SET primary_color = $1, secondary_color = $2, theme_settings = $3, music_url = $4, updated_at = now() WHERE id = $5",
    )
    .bind(&payload.primary_color)
    .bind(&payload.secondary_color)
    .bind(&payload.theme_settings)
    .bind(&payload.music_url)
    .bind(wedding_id)
    .execute(&mut *tx)
    .await?;

    sqlx::query(
        r#"
        UPDATE wedding_details
        SET groom_name = $1, bride_name = $2, wedding_date = $3,
            location_address = $4, maps_url = $5, cover_photo_url = $6,
            groom_photo_url = $7, bride_photo_url = $8,
            groom_parents = $9, bride_parents = $10,
            groom_ig = $11, bride_ig = $12,
            akad_date = $13, akad_location = $14, akad_maps_url = $15,
            resepsi_date = $16, resepsi_location = $17, resepsi_maps_url = $18,
            gallery_video_url = $19
        WHERE wedding_id = $20
        "#,
    )
    .bind(&groom_name)
    .bind(&bride_name)
    .bind(wedding_date)
    .bind(&payload.location_address)
    .bind(&payload.maps_url)
    .bind(&payload.cover_photo_url)
    .bind(&payload.groom_photo_url)
    .bind(&payload.bride_photo_url)
    .bind(&payload.groom_parents)
    .bind(&payload.bride_parents)
    .bind(&payload.groom_ig)
    .bind(&payload.bride_ig)
    .bind(akad_date)
    .bind(&payload.akad_location)
    .bind(&payload.akad_maps_url)
    .bind(resepsi_date)
    .bind(&payload.resepsi_location)
    .bind(&payload.resepsi_maps_url)
    .bind(&payload.gallery_video_url)
    .bind(wedding_id)
    .execute(&mut *tx)
    .await?;

    replace_love_stories(&mut tx, wedding_id, &payload.love_stories).await?;
    replace_gallery_photos(&mut tx, wedding_id, &payload.gallery_photos).await?;
    replace_wedding_gifts(&mut tx, wedding_id, &payload.wedding_gifts).await?;

    tx.commit().await?;

    // Setelah DB commit sukses, bersihkan objek MinIO yang tak lagi dirujuk.
    // Kegagalan hapus tidak menggagalkan request (data sudah tersimpan benar).
    cleanup_orphaned_photos(&state, wedding_id, &old_data, &payload).await;

    let data = fetch_edit_data(&state.db, wedding_id).await?;
    Ok(Json(data))
}

/// Kumpulkan semua URL foto yang dirujuk data lama, bandingkan dengan payload
/// baru, lalu hapus dari MinIO yang hilang -- HANYA objek milik wedding ini
/// (prefix weddings/{id}/) supaya tidak mungkin menghapus aset wedding lain
/// atau lagu di music library (music_url sengaja tidak ikut dihitung).
async fn cleanup_orphaned_photos(
    state: &AppState,
    wedding_id: Uuid,
    old_data: &WeddingEditData,
    payload: &UpdateWeddingPayload,
) {
    fn theme_photo_urls(settings: &Option<serde_json::Value>) -> Vec<String> {
        let mut urls = Vec::new();
        if let Some(obj) = settings.as_ref().and_then(|v| v.as_object()) {
            for key in ["section1_photo_url", "section2_photo_url"] {
                if let Some(url) = obj.get(key).and_then(|v| v.as_str()) {
                    urls.push(url.to_string());
                }
            }
        }
        urls
    }

    let mut old_urls: Vec<String> = Vec::new();
    old_urls.extend(old_data.cover_photo_url.clone());
    old_urls.extend(old_data.groom_photo_url.clone());
    old_urls.extend(old_data.bride_photo_url.clone());
    old_urls.extend(old_data.love_stories.iter().filter_map(|s| s.photo_url.clone()));
    old_urls.extend(old_data.gallery_photos.iter().cloned());
    old_urls.extend(theme_photo_urls(&old_data.theme_settings));

    let mut new_urls: Vec<String> = Vec::new();
    new_urls.extend(payload.cover_photo_url.clone());
    new_urls.extend(payload.groom_photo_url.clone());
    new_urls.extend(payload.bride_photo_url.clone());
    new_urls.extend(payload.love_stories.iter().filter_map(|s| s.photo_url.clone()));
    new_urls.extend(payload.gallery_photos.iter().cloned());
    new_urls.extend(theme_photo_urls(&payload.theme_settings));

    let owned_prefix = format!(
        "{}/{}/weddings/{wedding_id}/",
        state.config.minio_public_url, state.config.minio_bucket
    );

    for url in old_urls {
        if new_urls.contains(&url) || !url.starts_with(&owned_prefix) {
            continue;
        }

        // "{public_url}/{bucket}/{key}" -> ambil bagian key-nya saja.
        let key = &url[format!("{}/{}/", state.config.minio_public_url, state.config.minio_bucket).len()..];

        if let Err(err) = state
            .s3_client
            .delete_object()
            .bucket(&state.config.minio_bucket)
            .key(key)
            .send()
            .await
        {
            tracing::warn!(error = ?err, key, "gagal menghapus objek MinIO yatim");
        }
    }
}

async fn replace_love_stories(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    wedding_id: Uuid,
    stories: &[LoveStoryEntry],
) -> Result<(), AppError> {
    sqlx::query("DELETE FROM love_stories WHERE wedding_id = $1")
        .bind(wedding_id)
        .execute(&mut **tx)
        .await?;

    for (order_seq, story) in stories.iter().enumerate() {
        sqlx::query(
            "INSERT INTO love_stories (wedding_id, date, description, photo_url, order_seq) VALUES ($1, $2, $3, $4, $5)",
        )
        .bind(wedding_id)
        .bind(&story.date)
        .bind(&story.description)
        .bind(&story.photo_url)
        .bind(order_seq as i32)
        .execute(&mut **tx)
        .await?;
    }

    Ok(())
}

async fn replace_gallery_photos(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    wedding_id: Uuid,
    photo_urls: &[String],
) -> Result<(), AppError> {
    sqlx::query("DELETE FROM gallery_photos WHERE wedding_id = $1")
        .bind(wedding_id)
        .execute(&mut **tx)
        .await?;

    // photo_url NOT NULL di DB -- baris kosong (mis. dari state form yang belum
    // terisi) di-skip saja, bukan bikin error.
    for (order_seq, url) in photo_urls.iter().filter(|u| !u.trim().is_empty()).enumerate() {
        sqlx::query("INSERT INTO gallery_photos (wedding_id, photo_url, order_seq) VALUES ($1, $2, $3)")
            .bind(wedding_id)
            .bind(url)
            .bind(order_seq as i32)
            .execute(&mut **tx)
            .await?;
    }

    Ok(())
}

async fn replace_wedding_gifts(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    wedding_id: Uuid,
    gifts: &[WeddingGiftEntry],
) -> Result<(), AppError> {
    sqlx::query("DELETE FROM wedding_gifts WHERE wedding_id = $1")
        .bind(wedding_id)
        .execute(&mut **tx)
        .await?;

    for gift in gifts {
        sqlx::query(
            "INSERT INTO wedding_gifts (wedding_id, gift_type, bank_name, account_name, account_number) VALUES ($1, $2, $3, $4, $5)",
        )
        .bind(wedding_id)
        .bind(&gift.gift_type)
        .bind(&gift.bank_name)
        .bind(&gift.account_name)
        .bind(&gift.account_number)
        .execute(&mut **tx)
        .await?;
    }

    Ok(())
}

/// POST /api/wedding/upload
/// Wajib header X-Access-Token. Terima multipart field "file" -- gambar
/// (JPEG/PNG/WEBP) dioptimalkan (resize + kompres JPEG); video cover
/// (MP4/WEBM) disimpan mentah tanpa re-encode. Upload ke MinIO, lalu
/// kembalikan URL publiknya.
pub async fn upload_photo(
    headers: HeaderMap,
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, AppError> {
    let wedding_id = authenticate_by_token(&state.db, &headers).await?;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|_| AppError::InvalidInput("multipart form tidak valid".to_string()))?
    {
        if field.name() != Some("file") {
            continue;
        }

        let content_type = field.content_type().unwrap_or_default().to_string();

        if let Some(video_ext) = video_extension_for(&content_type) {
            let bytes = field
                .bytes()
                .await
                .map_err(|_| AppError::InvalidInput("gagal membaca isi file".to_string()))?;

            if bytes.len() > MAX_VIDEO_UPLOAD_BYTES {
                return Err(AppError::InvalidInput("ukuran video maksimal 20MB".to_string()));
            }

            let object_key = format!("weddings/{wedding_id}/{}.{video_ext}", Uuid::new_v4());

            state
                .s3_client
                .put_object()
                .bucket(&state.config.minio_bucket)
                .key(&object_key)
                .body(ByteStream::from(bytes))
                .content_type(&content_type)
                .send()
                .await
                .map_err(|err| {
                    tracing::error!(error = ?err, "gagal upload ke MinIO");
                    AppError::UploadFailed
                })?;

            let url = format!(
                "{}/{}/{}",
                state.config.minio_public_url, state.config.minio_bucket, object_key
            );

            return Ok(Json(UploadResponse { url }));
        }

        if !ALLOWED_CONTENT_TYPES.contains(&content_type.as_str()) {
            return Err(AppError::InvalidInput(
                "tipe file harus JPEG, PNG, WEBP, MP4, atau WEBM".to_string(),
            ));
        }

        let bytes = field
            .bytes()
            .await
            .map_err(|_| AppError::InvalidInput("gagal membaca isi file".to_string()))?;

        if bytes.len() > MAX_UPLOAD_BYTES {
            return Err(AppError::InvalidInput("ukuran file maksimal 10MB".to_string()));
        }

        // Decode + resize + encode itu CPU-bound (bisa ~detik untuk foto besar)
        // -- jalankan di blocking thread pool supaya tidak menyandera runtime async.
        let processed = tokio::task::spawn_blocking(move || process_image(&bytes))
            .await
            .map_err(|_| AppError::UploadFailed)??;

        let object_key = format!("weddings/{wedding_id}/{}.jpg", Uuid::new_v4());

        state
            .s3_client
            .put_object()
            .bucket(&state.config.minio_bucket)
            .key(&object_key)
            .body(ByteStream::from(processed))
            .content_type("image/jpeg")
            .send()
            .await
            .map_err(|err| {
                tracing::error!(error = ?err, "gagal upload ke MinIO");
                AppError::UploadFailed
            })?;

        let url = format!(
            "{}/{}/{}",
            state.config.minio_public_url, state.config.minio_bucket, object_key
        );

        return Ok(Json(UploadResponse { url }));
    }

    Err(AppError::InvalidInput("field 'file' tidak ditemukan".to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hex_color_accepts_valid_and_rejects_invalid() {
        assert!(validate_hex_color("#8B4513").is_ok());
        assert!(validate_hex_color("#abcdef").is_ok());

        for bad in ["8B4513", "#8B451", "#8B45133", "#GGGGGG", "", "#8B451Z"] {
            assert!(validate_hex_color(bad).is_err(), "harusnya menolak: {bad}");
        }
    }

    #[test]
    fn wedding_date_parses_datetime_local_format() {
        let parsed = parse_wedding_date(&Some("2026-12-01T08:30".to_string())).unwrap();
        assert_eq!(parsed.unwrap().to_rfc3339(), "2026-12-01T08:30:00+00:00");
    }

    #[test]
    fn wedding_date_empty_and_none_become_none() {
        assert!(parse_wedding_date(&None).unwrap().is_none());
        assert!(parse_wedding_date(&Some("".to_string())).unwrap().is_none());
        assert!(parse_wedding_date(&Some("   ".to_string())).unwrap().is_none());
    }

    #[test]
    fn wedding_date_rejects_garbage() {
        assert!(parse_wedding_date(&Some("besok sore".to_string())).is_err());
        assert!(parse_wedding_date(&Some("2026-13-45T99:99".to_string())).is_err());
    }

    fn png_bytes(width: u32, height: u32) -> Vec<u8> {
        let img = image::DynamicImage::ImageRgb8(image::RgbImage::from_pixel(
            width,
            height,
            image::Rgb([120, 30, 60]),
        ));
        let mut out = std::io::Cursor::new(Vec::new());
        img.write_to(&mut out, image::ImageFormat::Png).unwrap();
        out.into_inner()
    }

    #[test]
    fn process_image_reencodes_small_image_as_jpeg_without_resize() {
        let processed = process_image(&png_bytes(100, 80)).unwrap();
        let result = image::load_from_memory(&processed).unwrap();

        assert_eq!(&processed[..2], &[0xFF, 0xD8], "harus JPEG (magic bytes)");
        assert_eq!((result.width(), result.height()), (100, 80));
    }

    #[test]
    fn process_image_resizes_oversized_image() {
        let processed = process_image(&png_bytes(3000, 1500)).unwrap();
        let result = image::load_from_memory(&processed).unwrap();

        assert_eq!((result.width(), result.height()), (1920, 960));
    }

    #[test]
    fn process_image_rejects_non_image_bytes() {
        assert!(process_image(b"bukan gambar sama sekali").is_err());
    }

    #[test]
    fn video_extension_for_accepts_allowed_types_and_rejects_others() {
        assert_eq!(video_extension_for("video/mp4"), Some("mp4"));
        assert_eq!(video_extension_for("video/webm"), Some("webm"));
        assert_eq!(video_extension_for("video/quicktime"), None);
        assert_eq!(video_extension_for("image/jpeg"), None);
        assert_eq!(video_extension_for(""), None);
    }
}
