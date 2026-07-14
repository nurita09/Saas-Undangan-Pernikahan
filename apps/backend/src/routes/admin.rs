use axum::{
    extract::{Multipart, Path, Query, State},
    http::{HeaderMap, StatusCode},
    Json,
};
use aws_sdk_s3::primitives::ByteStream;
use chrono::{DateTime, NaiveDate, Utc};
use uuid::Uuid;

use crate::{
    auth::{credentials_match, require_admin_auth},
    error::AppError,
    models::{
        admin::{
            AdminLoginPayload, AdminLoginResponse, MusicTrackDto, SetActiveUntilPayload,
            SetPublishedPayload, SetPublishedResponse, UpdateMusicPayload, UpdateSettingsPayload,
            WeddingListQuery, WeddingListResponse, WeddingSummaryDto,
        },
        wedding::ContactSettingsDto,
    },
    state::AppState,
    utils::url::validate_optional_url,
};

const MAX_MUSIC_UPLOAD_BYTES: usize = 15 * 1024 * 1024;
const ALLOWED_AUDIO_CONTENT_TYPES: &[(&str, &str)] = &[
    ("audio/mpeg", "mp3"),
    ("audio/mp3", "mp3"),
    ("audio/wav", "wav"),
    ("audio/ogg", "ogg"),
    ("audio/mp4", "m4a"),
    ("audio/x-m4a", "m4a"),
];

fn extension_for_audio_content_type(content_type: &str) -> Option<&'static str> {
    ALLOWED_AUDIO_CONTENT_TYPES
        .iter()
        .find(|(ct, _)| *ct == content_type)
        .map(|(_, ext)| *ext)
}

/// POST /api/admin/login
/// Cuma memvalidasi kredensial konstan (ADMIN_USERNAME/ADMIN_PASSWORD di env) untuk
/// feedback UI login. Tidak menerbitkan sesi -- frontend menyimpan sendiri
/// "Basic base64(username:password)" dan mengirim ulang di setiap request admin
/// (mis. POST /api/weddings), yang divalidasi lagi di sana secara independen.
pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<AdminLoginPayload>,
) -> Result<Json<AdminLoginResponse>, AppError> {
    if credentials_match(&payload.username, &payload.password, &state.config) {
        Ok(Json(AdminLoginResponse { success: true }))
    } else {
        Err(AppError::Unauthorized)
    }
}

/// GET /api/music
/// Publik (tanpa admin auth) -- dipakai picker lagu di WeddingEditor, cuma baca.
pub async fn list_music(State(state): State<AppState>) -> Result<Json<Vec<MusicTrackDto>>, AppError> {
    let tracks = sqlx::query_as::<_, MusicTrackDto>(
        "SELECT id, title, artist, file_url FROM music_library ORDER BY title ASC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(tracks))
}

/// POST /api/admin/music
/// Admin upload lagu baru sekali, dipakai berkali-kali oleh banyak wedding.
/// Multipart: field "title" (wajib), "artist" (opsional), "file" (wajib, audio).
pub async fn upload_music(
    headers: HeaderMap,
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<(StatusCode, Json<MusicTrackDto>), AppError> {
    require_admin_auth(&headers, &state.config)?;

    let mut title: Option<String> = None;
    let mut artist: Option<String> = None;
    let mut uploaded_url: Option<String> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|_| AppError::InvalidInput("multipart form tidak valid".to_string()))?
    {
        match field.name() {
            Some("title") => {
                let text = field
                    .text()
                    .await
                    .map_err(|_| AppError::InvalidInput("field title tidak valid".to_string()))?;
                title = Some(text.trim().to_string());
            }
            Some("artist") => {
                let text = field
                    .text()
                    .await
                    .map_err(|_| AppError::InvalidInput("field artist tidak valid".to_string()))?;
                let trimmed = text.trim().to_string();
                if !trimmed.is_empty() {
                    artist = Some(trimmed);
                }
            }
            Some("file") => {
                let content_type = field.content_type().unwrap_or_default().to_string();
                let extension = extension_for_audio_content_type(&content_type).ok_or_else(|| {
                    AppError::InvalidInput("tipe file harus MP3, WAV, OGG, atau M4A".to_string())
                })?;

                let bytes = field
                    .bytes()
                    .await
                    .map_err(|_| AppError::InvalidInput("gagal membaca isi file".to_string()))?;

                if bytes.len() > MAX_MUSIC_UPLOAD_BYTES {
                    return Err(AppError::InvalidInput("ukuran file maksimal 15MB".to_string()));
                }

                let object_key = format!("music/{}.{extension}", Uuid::new_v4());

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
                        tracing::error!(error = ?err, "gagal upload musik ke MinIO");
                        AppError::UploadFailed
                    })?;

                uploaded_url = Some(format!(
                    "{}/{}/{}",
                    state.config.minio_public_url, state.config.minio_bucket, object_key
                ));
            }
            _ => continue,
        }
    }

    let title = title
        .filter(|t| !t.is_empty())
        .ok_or_else(|| AppError::InvalidInput("title wajib diisi".to_string()))?;
    let file_url =
        uploaded_url.ok_or_else(|| AppError::InvalidInput("field 'file' tidak ditemukan".to_string()))?;

    let track = sqlx::query_as::<_, MusicTrackDto>(
        "INSERT INTO music_library (title, artist, file_url) VALUES ($1, $2, $3) RETURNING id, title, artist, file_url",
    )
    .bind(&title)
    .bind(&artist)
    .bind(&file_url)
    .fetch_one(&state.db)
    .await?;

    Ok((StatusCode::CREATED, Json(track)))
}

const DEFAULT_PER_PAGE: i64 = 10;
const MAX_PER_PAGE: i64 = 100;

/// GET /api/admin/weddings?page=1&per_page=10
/// Monitoring: daftar ringkas wedding + jumlah RSVP, berhalaman (terbaru dulu).
pub async fn list_weddings(
    headers: HeaderMap,
    State(state): State<AppState>,
    Query(query): Query<WeddingListQuery>,
) -> Result<Json<WeddingListResponse>, AppError> {
    require_admin_auth(&headers, &state.config)?;

    let page = query.page.unwrap_or(1).max(1);
    let per_page = query.per_page.unwrap_or(DEFAULT_PER_PAGE).clamp(1, MAX_PER_PAGE);
    let offset = (page - 1) * per_page;

    let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM weddings")
        .fetch_one(&state.db)
        .await?;

    let weddings = sqlx::query_as::<_, WeddingSummaryDto>(
        r#"
        SELECT
            w.subdomain_slug,
            w.access_token,
            d.groom_name,
            d.bride_name,
            w.theme_id,
            w.is_published,
            w.active_until,
            w.created_at,
            COUNT(r.id) AS rsvp_count
        FROM weddings w
        INNER JOIN wedding_details d ON d.wedding_id = w.id
        LEFT JOIN rsvp r ON r.wedding_id = w.id
        GROUP BY w.id, d.groom_name, d.bride_name
        ORDER BY w.created_at DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(per_page)
    .bind(offset)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(WeddingListResponse {
        weddings,
        total,
        page,
        per_page,
    }))
}

/// DELETE /api/admin/weddings/{slug}
/// Hapus wedding beserta seluruh data anaknya (details/rsvp/story/galeri/gift
/// ikut lewat ON DELETE CASCADE) DAN semua objek MinIO miliknya
/// (prefix weddings/{id}/). Aksi permanen -- konfirmasi ada di sisi UI.
pub async fn delete_wedding(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<StatusCode, AppError> {
    require_admin_auth(&headers, &state.config)?;

    let wedding_id: Uuid = sqlx::query_scalar("SELECT id FROM weddings WHERE subdomain_slug = $1")
        .bind(&slug)
        .fetch_optional(&state.db)
        .await?
        .ok_or(AppError::NotFound)?;

    sqlx::query("DELETE FROM weddings WHERE id = $1")
        .bind(wedding_id)
        .execute(&state.db)
        .await?;

    // Bersihkan storage SETELAH baris DB terhapus; kegagalan di sini cuma
    // meninggalkan objek yatim (dicatat warn), bukan data setengah terhapus.
    delete_minio_prefix(&state, &format!("weddings/{wedding_id}/")).await;

    Ok(StatusCode::NO_CONTENT)
}

/// Hapus semua objek MinIO di bawah sebuah prefix (paginasi list_objects_v2).
async fn delete_minio_prefix(state: &AppState, prefix: &str) {
    let mut continuation: Option<String> = None;

    loop {
        let list = state
            .s3_client
            .list_objects_v2()
            .bucket(&state.config.minio_bucket)
            .prefix(prefix)
            .set_continuation_token(continuation.clone())
            .send()
            .await;

        let list = match list {
            Ok(output) => output,
            Err(err) => {
                tracing::warn!(error = ?err, prefix, "gagal list objek MinIO untuk dihapus");
                return;
            }
        };

        for object in list.contents() {
            let Some(key) = object.key() else { continue };
            if let Err(err) = state
                .s3_client
                .delete_object()
                .bucket(&state.config.minio_bucket)
                .key(key)
                .send()
                .await
            {
                tracing::warn!(error = ?err, key, "gagal menghapus objek MinIO");
            }
        }

        continuation = list.next_continuation_token().map(str::to_string);
        if continuation.is_none() {
            break;
        }
    }
}

/// PUT /api/admin/weddings/{slug}/active-until
/// Set masa aktif undangan. "YYYY-MM-DD" ditafsirkan sampai 23:59:59 WIB pada
/// hari itu; null/kosong = tanpa batas.
pub async fn set_active_until(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(slug): Path<String>,
    Json(payload): Json<SetActiveUntilPayload>,
) -> Result<Json<WeddingSummaryDto>, AppError> {
    require_admin_auth(&headers, &state.config)?;

    let active_until: Option<DateTime<Utc>> = match payload.active_until.as_deref() {
        None => None,
        Some(raw) if raw.trim().is_empty() => None,
        Some(raw) => {
            let date = NaiveDate::parse_from_str(raw.trim(), "%Y-%m-%d")
                .map_err(|_| AppError::InvalidInput("format active_until harus YYYY-MM-DD".to_string()))?;
            let end_of_day_wib = date.and_hms_opt(23, 59, 59).expect("jam valid");
            // 23:59:59 WIB = 16:59:59 UTC -- active_until adalah instant sungguhan
            // (dibandingkan dengan now() di query gating), bukan jam dinding.
            Some((end_of_day_wib - chrono::Duration::hours(7)).and_utc())
        }
    };

    let result = sqlx::query(
        "UPDATE weddings SET active_until = $1, updated_at = now() WHERE subdomain_slug = $2",
    )
    .bind(active_until)
    .bind(&slug)
    .execute(&state.db)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    let summary = sqlx::query_as::<_, WeddingSummaryDto>(
        r#"
        SELECT
            w.subdomain_slug, w.access_token, d.groom_name, d.bride_name,
            w.theme_id, w.is_published, w.active_until, w.created_at,
            COUNT(r.id) AS rsvp_count
        FROM weddings w
        INNER JOIN wedding_details d ON d.wedding_id = w.id
        LEFT JOIN rsvp r ON r.wedding_id = w.id
        WHERE w.subdomain_slug = $1
        GROUP BY w.id, d.groom_name, d.bride_name
        "#,
    )
    .bind(&slug)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(summary))
}

/// PUT /api/admin/music/{id} -- ganti judul/artis lagu.
pub async fn update_music(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateMusicPayload>,
) -> Result<Json<MusicTrackDto>, AppError> {
    require_admin_auth(&headers, &state.config)?;

    let title = payload.title.trim().to_string();
    if title.is_empty() {
        return Err(AppError::InvalidInput("title wajib diisi".to_string()));
    }
    let artist = payload.artist.map(|a| a.trim().to_string()).filter(|a| !a.is_empty());

    let track = sqlx::query_as::<_, MusicTrackDto>(
        "UPDATE music_library SET title = $1, artist = $2 WHERE id = $3 RETURNING id, title, artist, file_url",
    )
    .bind(&title)
    .bind(&artist)
    .bind(id)
    .fetch_optional(&state.db)
    .await?
    .ok_or(AppError::NotFound)?;

    Ok(Json(track))
}

/// DELETE /api/admin/music/{id}
/// Hapus lagu dari library + objeknya di MinIO. Wedding yang sedang memakai
/// lagu ini di-reset ke tanpa musik (music_url = NULL) supaya tidak menunjuk
/// file yang sudah tidak ada.
pub async fn delete_music(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    require_admin_auth(&headers, &state.config)?;

    let file_url: String = sqlx::query_scalar("SELECT file_url FROM music_library WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or(AppError::NotFound)?;

    let mut tx = state.db.begin().await?;
    sqlx::query("UPDATE weddings SET music_url = NULL WHERE music_url = $1")
        .bind(&file_url)
        .execute(&mut *tx)
        .await?;
    sqlx::query("DELETE FROM music_library WHERE id = $1")
        .bind(id)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;

    let bucket_prefix = format!("{}/{}/", state.config.minio_public_url, state.config.minio_bucket);
    if let Some(key) = file_url.strip_prefix(&bucket_prefix) {
        if let Err(err) = state
            .s3_client
            .delete_object()
            .bucket(&state.config.minio_bucket)
            .key(key)
            .send()
            .await
        {
            tracing::warn!(error = ?err, key, "gagal menghapus file musik dari MinIO");
        }
    }

    Ok(StatusCode::NO_CONTENT)
}

/// PUT /api/admin/weddings/{slug}/publish
/// Gerbang rilis: undangan draft (is_published=false) TIDAK bisa diakses tamu --
/// GET /api/wedding-details mengembalikan 404 (lihat routes/wedding.rs). Admin
/// menyalakan ini setelah pesanan beres (mis. sudah dibayar).
pub async fn set_published(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(slug): Path<String>,
    Json(payload): Json<SetPublishedPayload>,
) -> Result<Json<SetPublishedResponse>, AppError> {
    require_admin_auth(&headers, &state.config)?;

    let result =
        sqlx::query("UPDATE weddings SET is_published = $1, updated_at = now() WHERE subdomain_slug = $2")
            .bind(payload.is_published)
            .bind(&slug)
            .execute(&state.db)
            .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(Json(SetPublishedResponse {
        subdomain_slug: slug,
        is_published: payload.is_published,
    }))
}

async fn fetch_contact_settings(state: &AppState) -> Result<ContactSettingsDto, AppError> {
    let settings = sqlx::query_as::<_, ContactSettingsDto>(
        "SELECT contact_instagram_url, contact_whatsapp_url, contact_handle FROM platform_settings LIMIT 1",
    )
    .fetch_optional(&state.db)
    .await?
    .unwrap_or_default();

    Ok(settings)
}

/// GET /api/admin/settings
pub async fn get_settings(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<ContactSettingsDto>, AppError> {
    require_admin_auth(&headers, &state.config)?;
    Ok(Json(fetch_contact_settings(&state).await?))
}

/// PUT /api/admin/settings
pub async fn update_settings(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<UpdateSettingsPayload>,
) -> Result<Json<ContactSettingsDto>, AppError> {
    require_admin_auth(&headers, &state.config)?;

    validate_optional_url("contact_instagram_url", &payload.contact_instagram_url)?;
    validate_optional_url("contact_whatsapp_url", &payload.contact_whatsapp_url)?;

    sqlx::query(
        r#"
        UPDATE platform_settings
        SET contact_instagram_url = $1, contact_whatsapp_url = $2, contact_handle = $3, updated_at = now()
        WHERE id = true
        "#,
    )
    .bind(&payload.contact_instagram_url)
    .bind(&payload.contact_whatsapp_url)
    .bind(&payload.contact_handle)
    .execute(&state.db)
    .await?;

    Ok(Json(fetch_contact_settings(&state).await?))
}
