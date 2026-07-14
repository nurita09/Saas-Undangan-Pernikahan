use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct AdminLoginPayload {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AdminLoginResponse {
    pub success: bool,
}

/// GET /api/music (publik, dipakai picker lagu di WeddingEditor) dan
/// GET /api/admin/music (daftar yang sama, dilihat dari Admin Dashboard).
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct MusicTrackDto {
    pub id: Uuid,
    pub title: String,
    pub artist: Option<String>,
    pub file_url: String,
}

/// GET /api/admin/weddings -- daftar ringkas untuk monitoring, bukan detail penuh.
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct WeddingSummaryDto {
    pub subdomain_slug: String,
    /// Ditampilkan di monitoring supaya admin bisa salin ulang kalau pasangan lupa
    /// token editornya, tanpa perlu query manual ke database. Kolom `access_token` di
    /// tabel weddings bertipe VARCHAR (bukan UUID native), jadi dibaca sebagai String.
    pub access_token: String,
    pub groom_name: String,
    pub bride_name: String,
    pub theme_id: i32,
    pub is_published: bool,
    pub created_at: DateTime<Utc>,
    pub rsvp_count: i64,
}

/// PUT /api/admin/weddings/{slug}/publish -- body {"is_published": true/false}.
#[derive(Debug, Deserialize)]
pub struct SetPublishedPayload {
    pub is_published: bool,
}

#[derive(Debug, Serialize)]
pub struct SetPublishedResponse {
    pub subdomain_slug: String,
    pub is_published: bool,
}

/// PUT /api/admin/settings -- update setting global (tabel platform_settings).
#[derive(Debug, Deserialize)]
pub struct UpdateSettingsPayload {
    pub contact_instagram_url: Option<String>,
    pub contact_whatsapp_url: Option<String>,
    pub contact_handle: Option<String>,
}
