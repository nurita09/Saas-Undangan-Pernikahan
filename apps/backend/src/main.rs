mod auth;
mod config;
mod db;
mod error;
mod middleware;
mod models;
mod routes;
mod s3;
mod seed;
mod state;
mod utils;

use std::net::SocketAddr;

use axum::{extract::DefaultBodyLimit, middleware as axum_middleware};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

use crate::{config::AppConfig, state::AppState};

// 25MB -- cukup untuk video cover (dibatasi 20MB di handler, request terbesar
// di antara semua jenis upload), foto (10MB) dan file musik (15MB), plus
// sedikit ruang untuk overhead multipart.
const MAX_BODY_BYTES: usize = 25 * 1024 * 1024;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let config = AppConfig::from_env();
    let pool = db::create_pool(&config.database_url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    // Wedding demo per tema untuk tombol "Lihat Demo" di landing page --
    // idempotent, yang terhapus dibuat ulang saat restart berikutnya.
    seed::ensure_demo_weddings(&pool).await?;

    let s3_client = s3::create_s3_client(&config);

    let state = AppState {
        db: pool,
        config: config.clone(),
        s3_client,
    };

    // Dev-friendly: izinkan semua origin karena tiap tenant punya subdomain sendiri.
    // Perketat allow_origin ke daftar domain spesifik saat production.
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let mut app = routes::router();

    // Mode production: sajikan SPA hasil `vite build` (+ OG tags per wedding)
    // dari backend, tanpa Vite dev server. Fallback dipasang SEBELUM .layer()
    // supaya middleware tenant tetap membungkusnya.
    if config.frontend_dist_dir.is_some() {
        app = app.fallback(axum::routing::get(routes::spa::serve_spa));
        tracing::info!("mode production: menyajikan SPA dari FRONTEND_DIST_DIR");
    }

    let app = app
        .layer(axum_middleware::from_fn(middleware::resolve_tenant))
        .layer(axum_middleware::from_fn(middleware::limit_admin_auth))
        .layer(axum_middleware::from_fn(middleware::limit_rsvp_submissions))
        .layer(cors)
        .layer(DefaultBodyLimit::max(MAX_BODY_BYTES))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.server_port));
    tracing::info!("server berjalan di http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    // into_make_service_with_connect_info: supaya middleware rate limit bisa
    // membaca IP koneksi klien lewat extractor ConnectInfo<SocketAddr>.
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await?;

    Ok(())
}
