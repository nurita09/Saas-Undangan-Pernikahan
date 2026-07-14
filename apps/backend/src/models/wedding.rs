use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ---------- POST /api/weddings ----------

#[derive(Debug, Deserialize)]
pub struct CreateWeddingRequest {
    pub groom_name: String,
    pub bride_name: String,
    pub theme_id: Option<i32>,
}

#[derive(Debug, Serialize)]
pub struct CreateWeddingResponse {
    pub wedding_id: Uuid,
    pub subdomain_slug: String,
    pub access_token: String,
    pub groom_name: String,
    pub bride_name: String,
    pub theme_id: i32,
    pub is_published: bool,
}

// ---------- GET /api/wedding-details ----------

/// Hasil JOIN mentah dari tabel `weddings` + `wedding_details`.
#[derive(Debug, sqlx::FromRow)]
pub struct WeddingDetailsRow {
    pub subdomain_slug: String,
    pub theme_id: i32,
    pub primary_color: String,
    pub secondary_color: String,
    pub music_url: Option<String>,
    pub is_published: bool,
    /// Masa aktif; NULL = tanpa batas. Lewat tanggal ini undangan diperlakukan
    /// seperti draft (tamu 404, pemilik ber-token tetap bisa lihat).
    pub active_until: Option<DateTime<Utc>>,
    /// Dipakai handler untuk mengizinkan pasangan melihat draft-nya sendiri
    /// (header X-Access-Token) -- TIDAK ikut diserialisasi ke response publik.
    pub access_token: String,
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
}

#[derive(Debug, Serialize)]
pub struct WeddingDetailsResponse {
    pub subdomain: String,
    pub is_published: bool,
    pub theme: ThemeDto,
    pub couple: CoupleDto,
    pub event: EventDto,
    pub music_url: Option<String>,
    pub gallery_video_url: Option<String>,
    pub love_stories: Vec<LoveStoryDto>,
    pub gallery_photos: Vec<GalleryPhotoDto>,
    pub wedding_gifts: Vec<WeddingGiftDto>,
    pub theme_settings: Option<serde_json::Value>,
    pub cover_photo_url: Option<String>,
    pub contact: ContactSettingsDto,
}

/// Setting GLOBAL platform (tabel `platform_settings`, satu baris untuk semua
/// wedding) -- dipakai footer "Hubungi Kami", diatur lewat Admin Dashboard.
#[derive(Debug, Default, Serialize, sqlx::FromRow)]
pub struct ContactSettingsDto {
    pub contact_instagram_url: Option<String>,
    pub contact_whatsapp_url: Option<String>,
    pub contact_handle: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ThemeDto {
    pub theme_id: i32,
    pub primary_color: String,
    pub secondary_color: String,
}

#[derive(Debug, Serialize)]
pub struct CoupleDto {
    pub groom_name: String,
    pub bride_name: String,
    pub groom_photo_url: Option<String>,
    pub bride_photo_url: Option<String>,
    pub groom_parents: Option<String>,
    pub bride_parents: Option<String>,
    pub groom_ig: Option<String>,
    pub bride_ig: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct EventDto {
    pub wedding_date: Option<DateTime<Utc>>,
    pub location_address: Option<String>,
    pub maps_url: Option<String>,
    pub akad_date: Option<DateTime<Utc>>,
    pub akad_location: Option<String>,
    pub akad_maps_url: Option<String>,
    pub resepsi_date: Option<DateTime<Utc>>,
    pub resepsi_location: Option<String>,
    pub resepsi_maps_url: Option<String>,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct LoveStoryDto {
    pub date: Option<String>,
    pub description: Option<String>,
    pub photo_url: Option<String>,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct GalleryPhotoDto {
    pub photo_url: String,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct WeddingGiftDto {
    pub gift_type: String,
    pub bank_name: Option<String>,
    pub account_name: Option<String>,
    pub account_number: Option<String>,
}

impl From<WeddingDetailsRow> for WeddingDetailsResponse {
    fn from(row: WeddingDetailsRow) -> Self {
        Self {
            subdomain: row.subdomain_slug,
            is_published: row.is_published,
            theme: ThemeDto {
                theme_id: row.theme_id,
                primary_color: row.primary_color,
                secondary_color: row.secondary_color,
            },
            couple: CoupleDto {
                groom_name: row.groom_name,
                bride_name: row.bride_name,
                groom_photo_url: row.groom_photo_url,
                bride_photo_url: row.bride_photo_url,
                groom_parents: row.groom_parents,
                bride_parents: row.bride_parents,
                groom_ig: row.groom_ig,
                bride_ig: row.bride_ig,
            },
            event: EventDto {
                wedding_date: row.wedding_date,
                location_address: row.location_address,
                maps_url: row.maps_url,
                akad_date: row.akad_date,
                akad_location: row.akad_location,
                akad_maps_url: row.akad_maps_url,
                resepsi_date: row.resepsi_date,
                resepsi_location: row.resepsi_location,
                resepsi_maps_url: row.resepsi_maps_url,
            },
            music_url: row.music_url,
            gallery_video_url: row.gallery_video_url,
            love_stories: vec![],
            gallery_photos: vec![],
            wedding_gifts: vec![],
            theme_settings: row.theme_settings,
            cover_photo_url: row.cover_photo_url,
            contact: ContactSettingsDto::default(),
        }
    }
}
