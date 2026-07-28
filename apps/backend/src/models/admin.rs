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
    /// Masa aktif undangan; NULL = tanpa batas. Lewat tanggal ini tamu dapat 404.
    pub active_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub rsvp_count: i64,
}

/// Query GET /api/admin/weddings?page=1&per_page=10
#[derive(Debug, Deserialize)]
pub struct WeddingListQuery {
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}

/// Response GET /api/admin/weddings -- berhalaman.
#[derive(Debug, Serialize)]
pub struct WeddingListResponse {
    pub weddings: Vec<WeddingSummaryDto>,
    pub total: i64,
    pub page: i64,
    pub per_page: i64,
}

/// GET /api/admin/stats -- agregat monitoring lintas SEMUA wedding (bukan cuma
/// halaman yang sedang dibuka seperti GET /api/admin/weddings).
#[derive(Debug, Serialize)]
pub struct AdminStatsResponse {
    pub total_weddings: i64,
    pub published: i64,
    pub draft: i64,
    /// Punya active_until yang sudah lewat (tamu dapat 404 walau berstatus publish).
    pub expired: i64,
    pub new_last_30d: i64,
    pub total_rsvp: i64,
    pub rsvp_attending: i64,
    pub rsvp_not_attending: i64,
    pub rsvp_maybe: i64,
    pub rsvp_last_7d: i64,
    /// 6 bulan kalender WIB terakhir (termasuk bulan berjalan), bulan kosong ikut
    /// dikirim dengan count 0 supaya sumbu chart di frontend tidak bolong.
    pub monthly_new: Vec<MonthlyCountDto>,
    pub theme_distribution: Vec<ThemeCountDto>,
    /// Masa aktif berakhir <= 14 hari ke depan -- bahan follow-up perpanjangan.
    pub expiring_soon: Vec<ExpiringWeddingDto>,
}

/// Satu titik tren bulanan; `month` = "YYYY-MM" bulan kalender WIB.
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct MonthlyCountDto {
    pub month: String,
    pub count: i64,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct ThemeCountDto {
    pub theme_id: i32,
    pub count: i64,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct ExpiringWeddingDto {
    pub subdomain_slug: String,
    pub groom_name: String,
    pub bride_name: String,
    pub active_until: DateTime<Utc>,
    pub is_published: bool,
}

/// PUT /api/admin/weddings/{slug}/active-until -- body {"active_until": "YYYY-MM-DD"}
/// (null/kosong = tanpa batas). Ditafsirkan sampai akhir hari itu WIB.
#[derive(Debug, Deserialize)]
pub struct SetActiveUntilPayload {
    pub active_until: Option<String>,
}

/// PUT /api/admin/music/{id} -- ganti judul/artis (file audionya tetap).
#[derive(Debug, Deserialize)]
pub struct UpdateMusicPayload {
    pub title: String,
    pub artist: Option<String>,
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
    #[serde(default)]
    pub shopee_url: Option<String>,
    #[serde(default)]
    pub tokopedia_url: Option<String>,
    #[serde(default)]
    pub tiktok_url: Option<String>,
}
