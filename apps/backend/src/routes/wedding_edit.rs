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
};

const MAX_UPLOAD_BYTES: usize = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES: &[(&str, &str)] = &[
    ("image/jpeg", "jpg"),
    ("image/png", "png"),
    ("image/webp", "webp"),
];

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
            w.theme_settings
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

    let wedding_date = parse_wedding_date(&payload.wedding_date)?;
    let akad_date = parse_wedding_date(&payload.akad_date)?;
    let resepsi_date = parse_wedding_date(&payload.resepsi_date)?;

    let mut tx = state.db.begin().await?;

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

    let data = fetch_edit_data(&state.db, wedding_id).await?;
    Ok(Json(data))
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

fn extension_for_content_type(content_type: &str) -> Option<&'static str> {
    ALLOWED_CONTENT_TYPES
        .iter()
        .find(|(ct, _)| *ct == content_type)
        .map(|(_, ext)| *ext)
}

/// POST /api/wedding/upload
/// Wajib header X-Access-Token. Terima multipart field "file", upload ke MinIO,
/// lalu kembalikan URL publiknya untuk disimpan frontend ke state foto.
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
        let extension = extension_for_content_type(&content_type)
            .ok_or_else(|| AppError::InvalidInput("tipe file harus JPEG, PNG, atau WEBP".to_string()))?;

        let bytes = field
            .bytes()
            .await
            .map_err(|_| AppError::InvalidInput("gagal membaca isi file".to_string()))?;

        if bytes.len() > MAX_UPLOAD_BYTES {
            return Err(AppError::InvalidInput("ukuran file maksimal 10MB".to_string()));
        }

        let object_key = format!("weddings/{wedding_id}/{}.{extension}", Uuid::new_v4());

        state
            .s3_client
            .put_object()
            .bucket(&state.config.minio_bucket)
            .key(&object_key)
            .body(ByteStream::from(bytes))
            .content_type(content_type)
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
