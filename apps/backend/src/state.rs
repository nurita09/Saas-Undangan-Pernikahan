use aws_sdk_s3::Client as S3Client;
use sqlx::PgPool;

use crate::config::AppConfig;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub config: AppConfig,
    pub s3_client: S3Client,
}
