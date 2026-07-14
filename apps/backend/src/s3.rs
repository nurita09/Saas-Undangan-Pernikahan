use aws_sdk_s3::config::{BehaviorVersion, Credentials, Region};
use aws_sdk_s3::Client;

use crate::config::AppConfig;

/// Bikin S3 client yang diarahkan ke MinIO (bukan AWS beneran):
/// - endpoint_url custom ke host MinIO
/// - force_path_style karena MinIO pakai "host/bucket/key", bukan "bucket.host/key"
pub fn create_s3_client(config: &AppConfig) -> Client {
    let credentials = Credentials::new(
        &config.minio_access_key,
        &config.minio_secret_key,
        None,
        None,
        "minio-static",
    );

    let s3_config = aws_sdk_s3::Config::builder()
        .behavior_version(BehaviorVersion::latest())
        .region(Region::new("us-east-1"))
        .endpoint_url(&config.minio_endpoint)
        .credentials_provider(credentials)
        .force_path_style(true)
        .build();

    Client::from_conf(s3_config)
}
