use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Satu baris Love Story di editor -- dipakai dua arah (response & payload).
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct LoveStoryEntry {
    pub date: Option<String>,
    pub description: Option<String>,
    pub photo_url: Option<String>,
}

/// Satu baris Wedding Gift di editor -- dipakai dua arah (response & payload).
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WeddingGiftEntry {
    /// "bank" (rekening) atau "kado" (alamat kirim kado).
    pub gift_type: String,
    pub bank_name: Option<String>,
    pub account_name: Option<String>,
    pub account_number: Option<String>,
}

/// Dipakai sebagai response GET /api/wedding/edit-auth (data untuk prefill form)
/// dan PUT /api/wedding/update (data terbaru setelah disimpan).
///
/// Field array (love_stories dll) tidak ikut di-query lewat FromRow -- diisi
/// terpisah oleh fetch_edit_data setelah baris utamanya didapat, makanya diberi
/// #[sqlx(skip)] supaya FromRow melewatinya (diisi Default dulu).
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct WeddingEditData {
    pub wedding_id: Uuid,
    pub subdomain_slug: String,
    pub theme_id: i32,
    pub primary_color: String,
    pub secondary_color: String,
    pub music_url: Option<String>,
    pub groom_name: String,
    pub bride_name: String,
    pub wedding_date: Option<DateTime<Utc>>,
    pub location_address: Option<String>,
    pub maps_url: Option<String>,
    pub cover_photo_url: Option<String>,
    pub groom_photo_url: Option<String>,
    pub bride_photo_url: Option<String>,
    pub groom_parents: Option<String>,
    pub bride_parents: Option<String>,
    pub groom_ig: Option<String>,
    pub bride_ig: Option<String>,
    pub akad_date: Option<DateTime<Utc>>,
    pub akad_location: Option<String>,
    pub akad_maps_url: Option<String>,
    pub resepsi_date: Option<DateTime<Utc>>,
    pub resepsi_location: Option<String>,
    pub resepsi_maps_url: Option<String>,
    pub gallery_video_url: Option<String>,
    pub theme_settings: Option<serde_json::Value>,
    #[sqlx(skip)]
    pub love_stories: Vec<LoveStoryEntry>,
    #[sqlx(skip)]
    pub gallery_photos: Vec<String>,
    #[sqlx(skip)]
    pub wedding_gifts: Vec<WeddingGiftEntry>,
}

/// Query GET /api/wedding/edit-auth?token=...&slug=...
#[derive(Debug, Deserialize)]
pub struct EditAuthQuery {
    pub token: String,
    pub slug: String,
}

/// Body PUT /api/wedding/update -- form mengirim seluruh state saat ini,
/// jadi field wajib (bukan Option) untuk kolom yang NOT NULL di DB.
/// Semua field tanggal berformat "YYYY-MM-DDTHH:MM" dari <input type="datetime-local">.
///
/// Array love_stories/gallery_photos/wedding_gifts bersifat replace-all:
/// isi lama di DB dihapus lalu diganti persis dengan isi payload (urutan array
/// = order_seq). #[serde(default)] supaya klien yang tidak mengirim field itu
/// dianggap mengosongkan, bukan error 422.
#[derive(Debug, Deserialize)]
pub struct UpdateWeddingPayload {
    pub groom_name: String,
    pub bride_name: String,
    pub primary_color: String,
    pub secondary_color: String,
    pub wedding_date: Option<String>,
    pub location_address: Option<String>,
    pub maps_url: Option<String>,
    pub cover_photo_url: Option<String>,
    /// Diisi dari picker "pilih lagu" di editor -- file_url salah satu baris
    /// music_library, bukan upload bebas.
    pub music_url: Option<String>,
    pub groom_photo_url: Option<String>,
    pub bride_photo_url: Option<String>,
    pub groom_parents: Option<String>,
    pub bride_parents: Option<String>,
    pub groom_ig: Option<String>,
    pub bride_ig: Option<String>,
    pub akad_date: Option<String>,
    pub akad_location: Option<String>,
    pub akad_maps_url: Option<String>,
    pub resepsi_date: Option<String>,
    pub resepsi_location: Option<String>,
    pub resepsi_maps_url: Option<String>,
    pub gallery_video_url: Option<String>,
    pub theme_settings: Option<serde_json::Value>,
    #[serde(default)]
    pub love_stories: Vec<LoveStoryEntry>,
    #[serde(default)]
    pub gallery_photos: Vec<String>,
    #[serde(default)]
    pub wedding_gifts: Vec<WeddingGiftEntry>,
}

/// Response POST /api/wedding/upload
#[derive(Debug, Serialize)]
pub struct UploadResponse {
    pub url: String,
}
