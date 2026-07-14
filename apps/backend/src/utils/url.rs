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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_http_https_empty_and_none() {
        assert!(validate_optional_url("u", &None).is_ok());
        assert!(validate_optional_url("u", &Some("".to_string())).is_ok());
        assert!(validate_optional_url("u", &Some("   ".to_string())).is_ok());
        assert!(validate_optional_url("u", &Some("http://a.com/x".to_string())).is_ok());
        assert!(validate_optional_url("u", &Some("https://a.com/x?y=1".to_string())).is_ok());
    }

    #[test]
    fn rejects_dangerous_schemes() {
        for bad in ["javascript:alert(1)", "data:text/html,x", "ftp://a.com", "//evil.com", "vbscript:x"] {
            assert!(
                validate_optional_url("u", &Some(bad.to_string())).is_err(),
                "harusnya menolak: {bad}"
            );
        }
    }

    #[test]
    fn error_message_names_the_field() {
        let err = validate_optional_url("maps_url", &Some("javascript:x".to_string())).unwrap_err();
        assert!(err.to_string().contains("maps_url"));
    }
}
