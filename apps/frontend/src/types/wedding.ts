// Semua interface di sini di-selaraskan manual dengan struct Rust di
// apps/backend/src/models/wedding.rs dan skema di apps/backend/migrations/*.sql.
// Kalau salah satu berubah, update juga sisi satunya.

// ---------------------------------------------------------------------------
// Baris tabel Postgres mentah (belum ada endpoint yang mengembalikan bentuk ini
// apa adanya, tapi berguna sebagai referensi tipe kalau nanti dibutuhkan --
// mis. admin table view langsung dari DB).
// ---------------------------------------------------------------------------

/** Mirror tabel `weddings` -- migrations/0001_create_weddings.sql */
export interface Wedding {
  id: string;
  subdomain_slug: string;
  theme_id: number;
  primary_color: string;
  secondary_color: string;
  music_url: string | null;
  access_token: string;
  is_published: boolean;
  created_at: string;
}

/** Mirror tabel `wedding_details` -- migrations/0002_create_wedding_details.sql */
export interface WeddingDetail {
  id: string;
  wedding_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string | null;
  location_address: string | null;
  maps_url: string | null;
}

/** Mirror tabel `rsvp` -- migrations/0003_create_rsvp.sql (belum ada endpoint API-nya) */
export type AttendanceStatus = 'attending' | 'not_attending' | 'maybe';

export interface RsvpData {
  id: string;
  wedding_id: string;
  guest_name: string;
  attendance_status: AttendanceStatus;
  message: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Bentuk JSON asli response backend (Rust: models/wedding.rs) -- INI yang
// benar-benar dikonsumsi oleh fetch() di frontend.
// ---------------------------------------------------------------------------

/** Rust: ThemeDto */
export interface ThemeInfo {
  theme_id: number;
  primary_color: string;
  secondary_color: string;
}

/** Rust: CoupleDto */
export interface CoupleInfo {
  groom_name: string;
  bride_name: string;
  groom_photo_url?: string | null;
  bride_photo_url?: string | null;
  groom_parents?: string | null;
  bride_parents?: string | null;
  groom_ig?: string | null;
  bride_ig?: string | null;
}

/** Rust: EventDto */
export interface EventInfo {
  wedding_date: string | null;
  location_address: string | null;
  maps_url: string | null;
  akad_date?: string | null;
  akad_location?: string | null;
  akad_maps_url?: string | null;
  resepsi_date?: string | null;
  resepsi_location?: string | null;
  resepsi_maps_url?: string | null;
}

export interface LoveStoryInfo {
  date: string | null;
  description: string | null;
  photo_url: string | null;
}

export interface GalleryPhotoInfo {
  photo_url: string;
}

export interface WeddingGiftInfo {
  gift_type: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
}

/**
 * Rust: ContactSettingsDto -- setting GLOBAL platform (tabel `platform_settings`,
 * satu baris untuk semua wedding, diatur lewat Admin Dashboard), bukan data per-wedding.
 */
export interface ContactSettings {
  contact_instagram_url: string | null;
  contact_whatsapp_url: string | null;
  contact_handle: string | null;
}

/** Rust: WeddingDetailsResponse -- response GET /api/wedding-details */
export interface WeddingData {
  subdomain: string;
  is_published: boolean;
  theme: ThemeInfo;
  couple: CoupleInfo;
  event: EventInfo;
  music_url: string | null;
  gallery_video_url?: string | null;
  love_stories: LoveStoryInfo[];
  gallery_photos: GalleryPhotoInfo[];
  wedding_gifts: WeddingGiftInfo[];
  theme_settings?: Record<string, any> | null;
  cover_photo_url?: string | null;
  contact: ContactSettings;
}

/** Rust: CreateWeddingRequest -- payload POST /api/weddings */
export interface CreateWeddingPayload {
  groom_name: string;
  bride_name: string;
  theme_id?: number;
}

/** Rust: CreateWeddingResponse -- response POST /api/weddings */
export interface CreateWeddingResponse {
  wedding_id: string;
  subdomain_slug: string;
  access_token: string;
  groom_name: string;
  bride_name: string;
  theme_id: number;
  is_published: boolean;
}

/** Props yang wajib diterima setiap komponen tema (Theme1, Theme2, dst). */
export interface ThemeComponentProps {
  data: WeddingData;
  guestName?: string;
}

// ---------------------------------------------------------------------------
// Editor berbasis token (Langkah 5) -- Rust: models/wedding_edit.rs
// ---------------------------------------------------------------------------

/** Rust: LoveStoryEntry -- satu baris Love Story di editor (dua arah). */
export interface LoveStoryEntry {
  date: string | null;
  description: string | null;
  photo_url: string | null;
}

/** Rust: WeddingGiftEntry -- satu baris Wedding Gift di editor (dua arah). */
export interface WeddingGiftEntry {
  /** "bank" (rekening) atau "kado" (alamat kirim kado). */
  gift_type: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
}

/** Rust: WeddingEditData -- response GET /api/wedding/edit-auth & PUT /api/wedding/update */
export interface WeddingEditData {
  wedding_id: string;
  subdomain_slug: string;
  theme_id: number;
  primary_color: string;
  secondary_color: string;
  music_url: string | null;
  groom_name: string;
  bride_name: string;
  wedding_date: string | null;
  location_address: string | null;
  maps_url: string | null;
  cover_photo_url: string | null;
  groom_photo_url: string | null;
  bride_photo_url: string | null;
  groom_parents: string | null;
  bride_parents: string | null;
  groom_ig: string | null;
  bride_ig: string | null;
  akad_date: string | null;
  akad_location: string | null;
  akad_maps_url: string | null;
  resepsi_date: string | null;
  resepsi_location: string | null;
  resepsi_maps_url: string | null;
  gallery_video_url: string | null;
  theme_settings?: Record<string, any> | null;
  /** Versi data untuk optimistic locking -- kirim balik sebagai expected_updated_at. */
  updated_at: string;
  love_stories: LoveStoryEntry[];
  gallery_photos: string[];
  wedding_gifts: WeddingGiftEntry[];
}

/** Rust: UpdateWeddingPayload -- payload PUT /api/wedding/update.
 *  Array bersifat replace-all: isi lama diganti persis dengan isi payload. */
export interface UpdateWeddingPayload {
  groom_name: string;
  bride_name: string;
  primary_color: string;
  secondary_color: string;
  wedding_date: string | null;
  location_address: string | null;
  maps_url: string | null;
  cover_photo_url: string | null;
  /** file_url salah satu baris music_library, diisi lewat picker (bukan upload bebas). */
  music_url: string | null;
  groom_photo_url: string | null;
  bride_photo_url: string | null;
  groom_parents: string | null;
  bride_parents: string | null;
  groom_ig: string | null;
  bride_ig: string | null;
  akad_date: string | null;
  akad_location: string | null;
  akad_maps_url: string | null;
  resepsi_date: string | null;
  resepsi_location: string | null;
  resepsi_maps_url: string | null;
  gallery_video_url: string | null;
  theme_settings?: Record<string, any> | null;
  /** updated_at yang diterima saat memuat form; backend menolak 409 kalau
   *  nilainya sudah tidak cocok (data diubah dari tempat lain). */
  expected_updated_at: string | null;
  love_stories: LoveStoryEntry[];
  gallery_photos: string[];
  wedding_gifts: WeddingGiftEntry[];
}

/** Rust: UploadResponse -- response POST /api/wedding/upload */
export interface UploadResponse {
  url: string;
}

// ---------------------------------------------------------------------------
// Admin login -- Rust: models/admin.rs
// ---------------------------------------------------------------------------

/** Rust: AdminLoginPayload -- payload POST /api/admin/login */
export interface AdminLoginPayload {
  username: string;
  password: string;
}

/** Rust: AdminLoginResponse -- response POST /api/admin/login */
export interface AdminLoginResponse {
  success: boolean;
}

/**
 * Rust: MusicTrackDto -- satu baris tabel `music_library`. Diupload sekali oleh
 * admin, dipakai berkali-kali oleh banyak wedding lewat picker di editor.
 */
export interface MusicTrack {
  id: string;
  title: string;
  artist: string | null;
  file_url: string;
}

/** Rust: WeddingSummaryDto -- satu baris monitoring di GET /api/admin/weddings */
export interface WeddingSummary {
  subdomain_slug: string;
  /** Ditampilkan supaya admin bisa salin ulang kalau pasangan lupa token editornya. */
  access_token: string;
  groom_name: string;
  bride_name: string;
  theme_id: number;
  is_published: boolean;
  /** Masa aktif (ISO); null = tanpa batas. Lewat tanggal ini tamu dapat 404. */
  active_until: string | null;
  created_at: string;
  rsvp_count: number;
}

/** Rust: WeddingListResponse -- response GET /api/admin/weddings (berhalaman) */
export interface WeddingListResponse {
  weddings: WeddingSummary[];
  total: number;
  page: number;
  per_page: number;
}

/** Rust: UpdateSettingsPayload -- payload PUT /api/admin/settings */
export interface UpdateSettingsPayload {
  contact_instagram_url: string | null;
  contact_whatsapp_url: string | null;
  contact_handle: string | null;
}
