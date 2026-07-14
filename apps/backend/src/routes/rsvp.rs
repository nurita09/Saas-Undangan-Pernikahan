use axum::{extract::State, http::StatusCode, Extension, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::TenantSlug,
    state::AppState,
};

#[derive(Debug, Deserialize)]
pub struct CreateRsvpRequest {
    pub guest_name: String,
    pub attendance_status: String,
    pub message: Option<String>,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct RsvpResponse {
    pub id: Uuid,
    pub guest_name: String,
    pub attendance_status: String,
    pub message: Option<String>,
    pub created_at: DateTime<Utc>,
}

// Batas panjang input tamu: guest_name mengikuti kolom VARCHAR(150), message
// dibatasi di aplikasi (kolomnya TEXT) supaya endpoint publik ini tidak bisa
// dipakai menimbun data raksasa.
const MAX_GUEST_NAME_CHARS: usize = 150;
const MAX_MESSAGE_CHARS: usize = 1000;

pub async fn submit_rsvp(
    Extension(tenant): Extension<TenantSlug>,
    State(state): State<AppState>,
    Json(payload): Json<CreateRsvpRequest>,
) -> Result<(StatusCode, Json<RsvpResponse>), AppError> {
    let slug = tenant.0.ok_or(AppError::MissingTenant)?;

    let wedding_id: Uuid = sqlx::query_scalar("SELECT id FROM weddings WHERE subdomain_slug = $1")
        .bind(&slug)
        .fetch_optional(&state.db)
        .await?
        .ok_or(AppError::NotFound)?;

    let guest_name = payload.guest_name.trim().to_string();
    if guest_name.is_empty() {
        return Err(AppError::InvalidInput("nama wajib diisi".to_string()));
    }
    if guest_name.chars().count() > MAX_GUEST_NAME_CHARS {
        return Err(AppError::InvalidInput(format!(
            "nama maksimal {MAX_GUEST_NAME_CHARS} karakter"
        )));
    }

    let message = payload
        .message
        .map(|m| m.trim().to_string())
        .filter(|m| !m.is_empty());
    if let Some(ref m) = message {
        if m.chars().count() > MAX_MESSAGE_CHARS {
            return Err(AppError::InvalidInput(format!(
                "ucapan maksimal {MAX_MESSAGE_CHARS} karakter"
            )));
        }
    }

    let attendance_status = match payload.attendance_status.as_str() {
        "attending" | "not_attending" | "maybe" => payload.attendance_status,
        _ => return Err(AppError::InvalidInput("Invalid attendance status".to_string())),
    };

    let row = sqlx::query_as::<_, (Uuid, DateTime<Utc>)>(
        "INSERT INTO rsvp (wedding_id, guest_name, attendance_status, message) VALUES ($1, $2, $3, $4) RETURNING id, created_at"
    )
    .bind(wedding_id)
    .bind(&guest_name)
    .bind(&attendance_status)
    .bind(&message)
    .fetch_one(&state.db)
    .await?;

    Ok((
        StatusCode::CREATED,
        Json(RsvpResponse {
            id: row.0,
            guest_name,
            attendance_status,
            message,
            created_at: row.1,
        }),
    ))
}

pub async fn get_rsvps(
    Extension(tenant): Extension<TenantSlug>,
    State(state): State<AppState>,
) -> Result<Json<Vec<RsvpResponse>>, AppError> {
    let slug = tenant.0.ok_or(AppError::MissingTenant)?;

    let wedding_id: Uuid = sqlx::query_scalar("SELECT id FROM weddings WHERE subdomain_slug = $1")
        .bind(&slug)
        .fetch_optional(&state.db)
        .await?
        .ok_or(AppError::NotFound)?;

    // query_as runtime (bukan macro query_as! compile-time) -- konsisten dengan
    // seluruh codebase, dan supaya `cargo build --release` di Docker image prod
    // tidak butuh DATABASE_URL saat compile.
    // LIMIT 200: halaman undangan menampilkan daftar scroll, tidak perlu memuat
    // ribuan ucapan sekaligus (dan mencegah response membengkak).
    let rsvps = sqlx::query_as::<_, RsvpResponse>(
        "SELECT id, guest_name, attendance_status, message, created_at FROM rsvp WHERE wedding_id = $1 ORDER BY created_at DESC LIMIT 200",
    )
    .bind(wedding_id)
    .fetch_all(&state.db)
    .await?;

    Ok(Json(rsvps))
}
