use axum::http::HeaderMap;
use base64::{engine::general_purpose::STANDARD, Engine as _};

use crate::{config::AppConfig, error::AppError};

/// Kredensial admin konstan (bukan tabel user) -- dibandingkan langsung ke
/// ADMIN_USERNAME/ADMIN_PASSWORD di env.
pub fn credentials_match(username: &str, password: &str, config: &AppConfig) -> bool {
    username == config.admin_username && password == config.admin_password
}

/// Validasi header `Authorization: Basic base64(username:password)` untuk
/// endpoint admin-only (mis. POST /api/weddings). Dipanggil di setiap request --
/// tidak ada sesi/token tersimpan di server, jadi kalau kredensial di env diganti,
/// semua sesi lama otomatis langsung invalid.
pub fn require_admin_auth(headers: &HeaderMap, config: &AppConfig) -> Result<(), AppError> {
    let header_value = headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .ok_or(AppError::Unauthorized)?;

    let encoded = header_value.strip_prefix("Basic ").ok_or(AppError::Unauthorized)?;
    let decoded = STANDARD.decode(encoded).map_err(|_| AppError::Unauthorized)?;
    let credentials = String::from_utf8(decoded).map_err(|_| AppError::Unauthorized)?;
    let (username, password) = credentials.split_once(':').ok_or(AppError::Unauthorized)?;

    if credentials_match(username, password, config) {
        Ok(())
    } else {
        Err(AppError::Unauthorized)
    }
}
