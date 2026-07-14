use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("tenant tidak dapat diresolusi dari Host header")]
    MissingTenant,
    #[error("data wedding tidak ditemukan")]
    NotFound,
    #[error("input tidak valid: {0}")]
    InvalidInput(String),
    #[error("gagal membuat subdomain slug yang unik")]
    SlugGenerationFailed,
    #[error("akses ditolak: kredensial tidak valid")]
    Unauthorized,
    #[error("gagal mengunggah file")]
    UploadFailed,
    #[error("kesalahan database: {0}")]
    Database(#[from] sqlx::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::MissingTenant => (StatusCode::BAD_REQUEST, self.to_string()),
            AppError::NotFound => (StatusCode::NOT_FOUND, self.to_string()),
            AppError::InvalidInput(_) => (StatusCode::BAD_REQUEST, self.to_string()),
            AppError::SlugGenerationFailed => {
                tracing::error!("gagal generate subdomain slug unik setelah beberapa percobaan");
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string())
            }
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, self.to_string()),
            AppError::UploadFailed => {
                tracing::error!("gagal upload file ke MinIO");
                (StatusCode::BAD_GATEWAY, self.to_string())
            }
            AppError::Database(err) => {
                tracing::error!(error = %err, "database error");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "terjadi kesalahan internal".to_string(),
                )
            }
        };

        (status, Json(json!({ "error": message }))).into_response()
    }
}
