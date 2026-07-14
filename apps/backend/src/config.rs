use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub database_url: String,
    pub server_port: u16,
    /// Endpoint internal MinIO yang dipakai backend untuk terhubung (mis. "http://minio:9000")
    pub minio_endpoint: String,
    /// Base URL publik yang bisa diakses browser untuk menampilkan file (mis. "http://localhost:9000")
    pub minio_public_url: String,
    pub minio_access_key: String,
    pub minio_secret_key: String,
    pub minio_bucket: String,
    /// Kredensial admin konstan untuk Admin Dashboard (Authorization: Basic).
    /// WAJIB diganti dari default saat production, dan hanya aman dipakai di
    /// belakang HTTPS (TLS di-terminate Cloudflare/nginx).
    pub admin_username: String,
    pub admin_password: String,
    /// Mode production: path direktori hasil `vite build` (mis. "/app/dist").
    /// Kalau di-set, backend ikut menyajikan SPA + inject OG tags per wedding
    /// (menggantikan Vite dev server). Kosong = mode dev, API saja.
    pub frontend_dist_dir: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("DATABASE_URL").expect("DATABASE_URL harus di-set di .env"),
            server_port: env::var("SERVER_PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(8080),
            minio_endpoint: env::var("MINIO_ENDPOINT")
                .unwrap_or_else(|_| "http://minio:9000".to_string()),
            minio_public_url: env::var("MINIO_PUBLIC_URL")
                .unwrap_or_else(|_| "http://localhost:9000".to_string()),
            minio_access_key: env::var("MINIO_ACCESS_KEY").expect("MINIO_ACCESS_KEY harus di-set"),
            minio_secret_key: env::var("MINIO_SECRET_KEY").expect("MINIO_SECRET_KEY harus di-set"),
            minio_bucket: env::var("MINIO_BUCKET").unwrap_or_else(|_| "undangan-assets".to_string()),
            admin_username: env::var("ADMIN_USERNAME").unwrap_or_else(|_| "admin".to_string()),
            admin_password: env::var("ADMIN_PASSWORD")
                .expect("ADMIN_PASSWORD harus di-set di .env"),
            frontend_dist_dir: env::var("FRONTEND_DIST_DIR").ok().filter(|v| !v.is_empty()),
        }
    }
}
