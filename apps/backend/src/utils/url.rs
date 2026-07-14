use crate::error::AppError;

/// Validasi field URL opsional dari input user: kalau terisi, WAJIB berskema
/// http:// atau https://. Tanpa ini, nilai seperti "javascript:alert(1)" akan
/// dirender frontend sebagai href dan jadi vektor XSS saat diklik.
pub fn validate_optional_url(field: &str, value: &Option<String>) -> Result<(), AppError> {
    if let Some(raw) = value {
        let trimmed = raw.trim();
        if !trimmed.is_empty()
            && !trimmed.starts_with("http://")
            && !trimmed.starts_with("https://")
        {
            return Err(AppError::InvalidInput(format!(
                "{field} harus diawali http:// atau https://"
            )));
        }
    }
    Ok(())
}
