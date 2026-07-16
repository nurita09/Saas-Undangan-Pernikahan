use axum::{extract::State, http::HeaderMap, http::StatusCode, Extension, Json};
use sqlx::Acquire;
use uuid::Uuid;

use crate::{
    auth::require_admin_auth,
    error::AppError,
    middleware::TenantSlug,
    models::wedding::{
        CreateWeddingRequest, CreateWeddingResponse, LoveStoryDto, WeddingDetailsResponse,
        WeddingDetailsRow,
    },
    state::AppState,
    utils::slug,
};

const MAX_SLUG_ATTEMPTS: u32 = 25;

/// Warna default per tema saat wedding dibuat (warna dikunci, tidak bisa
/// diedit pasangan). Tema baru: tambah lengan match di sini + komponennya di
/// frontend (components/themes/registry.ts).
fn default_colors_for_theme(theme_id: i32) -> (&'static str, &'static str) {
    match theme_id {
        // Theme 2 - Adat Jawa: cokelat sogan batik + krem lawas.
        2 => ("#6B4423", "#F3EAD8"),
        // Theme 3 - Modern Elegant (Dark): emas murni + deep charcoal-navy
        // (primary = aksen/tombol, secondary = warna LATAR gelap).
        3 => ("#D4AF37", "#10131C"),
        // Theme 4 - Islami Modern: sage green + putih bersih.
        4 => ("#7C9070", "#FAFBF7"),
        // Theme 5 - Retro Pop: terracotta + krem hangat 70-an.
        5 => ("#C75B39", "#FBF3E4"),
        // Theme 1 - Floral Elegant.
        _ => ("#8D7B68", "#F9F8F4"),
    }
}

// Konten placeholder Love Story saat wedding baru dibuat (meniru contoh di desain
// Figma Section 4) -- baris ini tersimpan nyata di tabel love_stories per wedding_id,
// jadi begitu ada editor Love Story, pasangan tinggal edit/ganti isi baris yang sudah ada.
const DEFAULT_LOVE_STORY_DATE: &str = "03 Januari 2024";
const DEFAULT_LOVE_STORY_DESCRIPTION: &str = "Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London,";
const DEFAULT_LOVE_STORY_COUNT: i32 = 4;

/// POST /api/weddings
/// Dipakai Admin Panel saat ada pesanan baru: generate subdomain_slug dari nama
/// pasangan, generate access_token (UUID v4), lalu simpan weddings + wedding_details
/// dalam satu transaksi. Wajib login admin (Authorization: Basic).
pub async fn create_wedding(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreateWeddingRequest>,
) -> Result<(StatusCode, Json<CreateWeddingResponse>), AppError> {
    require_admin_auth(&headers, &state.config)?;

    let groom_name = payload.groom_name.trim().to_string();
    let bride_name = payload.bride_name.trim().to_string();

    if groom_name.is_empty() || bride_name.is_empty() {
        return Err(AppError::InvalidInput(
            "groom_name dan bride_name wajib diisi".to_string(),
        ));
    }

    let theme_id = payload.theme_id.unwrap_or(1);
    if theme_id < 1 {
        return Err(AppError::InvalidInput("theme_id tidak valid".to_string()));
    }

    let base_slug = slug::generate_couple_slug(&groom_name, &bride_name);
    let access_token = Uuid::new_v4().to_string();

    let mut tx = state.db.begin().await?;

    let (wedding_id, subdomain_slug) =
        insert_wedding_with_unique_slug(&mut tx, &base_slug, &access_token, theme_id).await?;

    sqlx::query(
        "INSERT INTO wedding_details (wedding_id, groom_name, bride_name) VALUES ($1, $2, $3)",
    )
    .bind(wedding_id)
    .bind(&groom_name)
    .bind(&bride_name)
    .execute(&mut *tx)
    .await?;

    seed_default_love_stories(&mut tx, wedding_id).await?;

    tx.commit().await?;

    Ok((
        StatusCode::CREATED,
        Json(CreateWeddingResponse {
            wedding_id,
            subdomain_slug,
            access_token,
            groom_name,
            bride_name,
            theme_id,
            is_published: false,
        }),
    ))
}

/// Isi `love_stories` dengan beberapa baris placeholder saat wedding baru dibuat,
/// supaya Section 4 (Love Story) langsung terisi contoh -- bukan kosong -- dan
/// pasangan tinggal edit/ganti lewat editor Love Story nanti (belum ada UI-nya).
async fn seed_default_love_stories(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    wedding_id: Uuid,
) -> Result<(), AppError> {
    for order_seq in 0..DEFAULT_LOVE_STORY_COUNT {
        sqlx::query(
            "INSERT INTO love_stories (wedding_id, date, description, order_seq) VALUES ($1, $2, $3, $4)",
        )
        .bind(wedding_id)
        .bind(DEFAULT_LOVE_STORY_DATE)
        .bind(DEFAULT_LOVE_STORY_DESCRIPTION)
        .bind(order_seq)
        .execute(&mut **tx)
        .await?;
    }

    Ok(())
}

/// Dipakai sebagai fallback baca (GET /api/wedding-details) untuk wedding yang
/// belum punya baris love_stories sama sekali -- termasuk wedding lama yang dibuat
/// sebelum seed_default_love_stories() ada. Kontennya sengaja sama persis dengan
/// yang di-seed saat create_wedding, supaya konsisten di mana pun ditampilkan.
fn default_love_stories() -> Vec<LoveStoryDto> {
    (0..DEFAULT_LOVE_STORY_COUNT)
        .map(|_| LoveStoryDto {
            date: Some(DEFAULT_LOVE_STORY_DATE.to_string()),
            description: Some(DEFAULT_LOVE_STORY_DESCRIPTION.to_string()),
            photo_url: None,
        })
        .collect()
}

/// Coba insert dengan `base_slug`; kalau bentrok (pasangan dengan nama sama sudah
/// pernah daftar), retry dengan akhiran -2, -3, dst sampai dapat slug unik.
async fn insert_wedding_with_unique_slug(
    tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    base_slug: &str,
    access_token: &str,
    theme_id: i32,
) -> Result<(Uuid, String), AppError> {
    for attempt in 0..MAX_SLUG_ATTEMPTS {
        let candidate_slug = if attempt == 0 {
            base_slug.to_string()
        } else {
            format!("{base_slug}-{}", attempt + 1)
        };

        // Savepoint per percobaan: kalau slug bentrok, hanya savepoint ini yang
        // di-rollback, transaksi induk (tx) tetap hidup untuk percobaan berikutnya.
        let mut savepoint = tx.begin().await?;

        let (primary_color, secondary_color) = default_colors_for_theme(theme_id);
        let result = sqlx::query_scalar::<_, Uuid>(
            "INSERT INTO weddings (subdomain_slug, access_token, theme_id, primary_color, secondary_color) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        )
        .bind(&candidate_slug)
        .bind(access_token)
        .bind(theme_id)
        .bind(primary_color)
        .bind(secondary_color)
        .fetch_one(&mut *savepoint)
        .await;

        match result {
            Ok(id) => {
                savepoint.commit().await?;
                return Ok((id, candidate_slug));
            }
            Err(sqlx::Error::Database(db_err))
                if db_err.constraint() == Some("weddings_subdomain_slug_key") =>
            {
                savepoint.rollback().await?;
                continue;
            }
            Err(err) => return Err(AppError::Database(err)),
        }
    }

    Err(AppError::SlugGenerationFailed)
}

/// GET /api/wedding-details
/// Slug tenant diambil dari middleware `resolve_tenant` (berdasarkan Host header),
/// lalu di-join ke `weddings` + `wedding_details` untuk membentuk response JSON.
pub async fn get_wedding_details(
    Extension(tenant): Extension<TenantSlug>,
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<WeddingDetailsResponse>, AppError> {
    let slug = tenant.0.ok_or(AppError::MissingTenant)?;

    let row = sqlx::query_as::<_, WeddingDetailsRow>(
        r#"
        SELECT
            w.subdomain_slug,
            w.theme_id,
            w.primary_color,
            w.secondary_color,
            w.music_url,
            w.is_published,
            w.active_until,
            w.access_token,
            w.theme_settings,
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
            d.gallery_video_url
        FROM weddings w
        INNER JOIN wedding_details d ON d.wedding_id = w.id
        WHERE w.subdomain_slug = $1
        "#,
    )
    .bind(&slug)
    .fetch_optional(&state.db)
    .await?
    .ok_or(AppError::NotFound)?;

    // Gerbang publish + masa aktif: undangan draft ATAU yang masa aktifnya
    // lewat hanya bisa dilihat pemiliknya sendiri (editor mengirim header
    // X-Access-Token untuk preview). Tamu tanpa token mendapat 404 generik --
    // sengaja tidak membocorkan bahwa undangannya ada.
    let expired = row.active_until.is_some_and(|until| until < chrono::Utc::now());
    if !row.is_published || expired {
        let token_ok = headers
            .get("X-Access-Token")
            .and_then(|value| value.to_str().ok())
            .is_some_and(|token| token == row.access_token);

        if !token_ok {
            return Err(AppError::NotFound);
        }
    }

    let wedding_id: Uuid = sqlx::query_scalar("SELECT id FROM weddings WHERE subdomain_slug = $1")
        .bind(&slug)
        .fetch_one(&state.db)
        .await?;

    use crate::models::wedding::{ContactSettingsDto, GalleryPhotoDto, WeddingGiftDto};

    let love_stories = sqlx::query_as::<_, LoveStoryDto>(
        "SELECT date, description, photo_url FROM love_stories WHERE wedding_id = $1 ORDER BY order_seq ASC"
    )
    .bind(wedding_id)
    .fetch_all(&state.db)
    .await?;

    // Wedding lama (dibuat sebelum ada seeding) atau yang baris love_stories-nya
    // sengaja dikosongkan semua -- tetap tampilkan contoh default, bukan section
    // Love Story hilang total dari halaman.
    let love_stories = if love_stories.is_empty() {
        default_love_stories()
    } else {
        love_stories
    };

    let gallery_photos = sqlx::query_as::<_, GalleryPhotoDto>(
        "SELECT photo_url FROM gallery_photos WHERE wedding_id = $1 ORDER BY order_seq ASC"
    )
    .bind(wedding_id)
    .fetch_all(&state.db)
    .await?;

    let wedding_gifts = sqlx::query_as::<_, WeddingGiftDto>(
        "SELECT gift_type, bank_name, account_name, account_number FROM wedding_gifts WHERE wedding_id = $1"
    )
    .bind(wedding_id)
    .fetch_all(&state.db)
    .await?;

    // platform_settings adalah tabel singleton (selalu tepat 1 baris, lihat
    // migrations/0008) -- fetch_optional + default sebagai jaga-jaga kalau
    // baris itu ternyata belum/tidak ada, supaya endpoint ini tidak ikut error.
    let contact = sqlx::query_as::<_, ContactSettingsDto>(
        "SELECT contact_instagram_url, contact_whatsapp_url, contact_handle FROM platform_settings LIMIT 1",
    )
    .fetch_optional(&state.db)
    .await?
    .unwrap_or_default();

    let mut response: WeddingDetailsResponse = row.into();
    response.love_stories = love_stories;
    response.gallery_photos = gallery_photos;
    response.wedding_gifts = wedding_gifts;
    response.contact = contact;

    Ok(Json(response))
}
