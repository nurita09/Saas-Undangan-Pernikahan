mod auth;
mod config;
mod db;
mod error;
mod middleware;
mod models;
mod routes;
mod s3;
mod state;
mod utils;

use std::net::SocketAddr;

use axum::{extract::DefaultBodyLimit, middleware as axum_middleware};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

use crate::{config::AppConfig, state::AppState};

// 20MB -- cukup untuk foto (dibatasi 10MB di handler) dan file musik
// (dibatasi 15MB di handler), plus sedikit ruang untuk overhead multipart.
const MAX_BODY_BYTES: usize = 20 * 1024 * 1024;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let config = AppConfig::from_env();
    let pool = db::create_pool(&config.database_url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

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

    let app = routes::router()
        .layer(axum_middleware::from_fn(middleware::resolve_tenant))
        .layer(cors)
        .layer(DefaultBodyLimit::max(MAX_BODY_BYTES))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.server_port));
    tracing::info!("server berjalan di http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
