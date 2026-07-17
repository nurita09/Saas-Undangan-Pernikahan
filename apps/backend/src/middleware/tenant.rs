use std::sync::LazyLock;

use axum::{extract::Request, middleware::Next, response::Response};

/// Root domain eksplisit dari env APP_BASE_DOMAIN (mis. "undangan.nurita.id").
/// WAJIB di-set kalau root domain-nya lebih dari 2 label -- heuristik
/// hitung-label di bawah tidak bisa membedakan "undangan.nurita.id" (root,
/// 3 label) dari subdomain tenant. Kosong = pakai heuristik (cukup untuk dev
/// .localhost dan domain 2 label).
static BASE_DOMAIN: LazyLock<Option<String>> = LazyLock::new(|| {
    std::env::var("APP_BASE_DOMAIN")
        .ok()
        .map(|v| v.trim().trim_matches('.').to_lowercase())
        .filter(|v| !v.is_empty())
});

/// Hasil resolusi tenant dari Host header, disimpan sebagai request Extension
/// sehingga bisa diambil oleh handler manapun via `Extension<TenantSlug>`.
#[derive(Debug, Clone)]
pub struct TenantSlug(pub Option<String>);

/// Middleware yang membaca Host header (mis. "ivan-aura.domainapapun.com"),
/// mengekstrak label subdomain paling depan, lalu menaruhnya ke request extensions.
pub async fn resolve_tenant(mut req: Request, next: Next) -> Response {
    let host = req
        .headers()
        .get(axum::http::header::HOST)
        .and_then(|value| value.to_str().ok())
        .unwrap_or_default();

    let slug = extract_subdomain(host);
    req.extensions_mut().insert(TenantSlug(slug));

    next.run(req).await
}

/// Ambil label subdomain paling depan dari host dengan memecah berdasarkan titik (.),
/// TANPA bergantung pada base domain yang di-hardcode -- supaya domain production
/// bisa berganti kapan saja tanpa mengubah kode.
///
/// Root domain dianggap 2 label (mis. "domainapapun.com"), KECUALI host berakhiran
/// ".localhost" yang root-nya dianggap 1 label -- supaya dev lokal via
/// "ivan-aura.localhost" (dukungan otomatis browser modern untuk *.localhost)
/// tetap ter-resolve sebagai tenant "ivan-aura".
///
/// - "ivan-aura.domainapapun.com" (3 label) -> Some("ivan-aura")
/// - "domainapapun.com" (2 label, root domain)          -> None
/// - "www.domainapapun.com"                             -> None
/// - "ivan-aura.localhost"                              -> Some("ivan-aura")
/// - "localhost" / alamat IP                            -> None
///
/// Keterbatasan: untuk root domain dengan ccSLD (mis. "undangan.co.id", 3 label),
/// pendekatan hitung-label ini tidak bisa membedakannya dari subdomain tenant.
/// Kalau nanti dipakai domain seperti itu, kabari saya supaya extractor-nya
/// disesuaikan (mis. balik ke pencocokan APP_BASE_DOMAIN untuk domain tsb).
pub fn extract_subdomain(host: &str) -> Option<String> {
    extract_subdomain_with_base(host, BASE_DOMAIN.as_deref())
}

/// Varian testable: `base` = root domain eksplisit (APP_BASE_DOMAIN) atau None.
/// Dengan base: "slug.base" -> Some(slug), "base"/"www.base"/"admin.base" -> None.
/// Host yang tidak berakhiran base (mis. akses via localhost saat debug) jatuh
/// ke heuristik hitung-label seperti biasa.
pub fn extract_subdomain_with_base(host: &str, base: Option<&str>) -> Option<String> {
    let host_without_port = host.split(':').next().unwrap_or(host);

    if host_without_port.parse::<std::net::IpAddr>().is_ok() {
        return None;
    }

    if let Some(base) = base {
        let host_lower = host_without_port.to_lowercase();
        if host_lower == base {
            return None;
        }
        if let Some(prefix) = host_lower.strip_suffix(&format!(".{base}")) {
            // Lebih dari satu label di depan base (mis. "a.b.base") bukan tenant.
            if prefix.is_empty() || prefix.contains('.') {
                return None;
            }
            if prefix == "www" || prefix == "admin" {
                return None;
            }
            return Some(prefix.to_string());
        }
        // Host di luar base domain -> lanjut ke heuristik di bawah.
    }

    let labels: Vec<&str> = host_without_port.split('.').collect();

    let is_localhost_root = labels
        .last()
        .is_some_and(|last| last.eq_ignore_ascii_case("localhost"));
    let root_label_count = if is_localhost_root { 1 } else { 2 };

    if labels.len() <= root_label_count {
        return None;
    }

    let slug = labels[0];
    if slug.is_empty() || slug.eq_ignore_ascii_case("www") {
        return None;
    }

    Some(slug.to_lowercase())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_subdomain_slug() {
        assert_eq!(
            extract_subdomain("ivan-aura.domainapapun.com"),
            Some("ivan-aura".to_string())
        );
    }

    #[test]
    fn works_regardless_of_root_domain() {
        assert_eq!(
            extract_subdomain("farel-dysna.undangan-lain.id"),
            Some("farel-dysna".to_string())
        );
    }

    #[test]
    fn ignores_bare_root_domain() {
        assert_eq!(extract_subdomain("domainapapun.com"), None);
    }

    #[test]
    fn ignores_www() {
        assert_eq!(extract_subdomain("www.domainapapun.com"), None);
    }

    #[test]
    fn ignores_localhost_and_ip() {
        assert_eq!(extract_subdomain("localhost"), None);
        assert_eq!(extract_subdomain("127.0.0.1"), None);
    }

    #[test]
    fn resolves_subdomain_of_localhost() {
        assert_eq!(
            extract_subdomain("ivan-aura.localhost"),
            Some("ivan-aura".to_string())
        );
        assert_eq!(
            extract_subdomain("ivan-aura.localhost:5173"),
            Some("ivan-aura".to_string())
        );
        assert_eq!(extract_subdomain("www.localhost"), None);
    }

    #[test]
    fn strips_port() {
        assert_eq!(
            extract_subdomain("ivan-aura.domainapapun.com:8080"),
            Some("ivan-aura".to_string())
        );
    }

    #[test]
    fn base_domain_treats_root_as_non_tenant() {
        let base = Some("undangan.nurita.id");
        assert_eq!(extract_subdomain_with_base("undangan.nurita.id", base), None);
        assert_eq!(extract_subdomain_with_base("www.undangan.nurita.id", base), None);
        assert_eq!(extract_subdomain_with_base("admin.undangan.nurita.id", base), None);
    }

    #[test]
    fn base_domain_resolves_tenant_slug() {
        let base = Some("undangan.nurita.id");
        assert_eq!(
            extract_subdomain_with_base("ivan-aura.undangan.nurita.id", base),
            Some("ivan-aura".to_string())
        );
        assert_eq!(
            extract_subdomain_with_base("Demo-Jawa.undangan.nurita.id:443", base),
            Some("demo-jawa".to_string())
        );
    }

    #[test]
    fn base_domain_rejects_deep_subdomains_and_falls_back_for_other_hosts() {
        let base = Some("undangan.nurita.id");
        // Dua label di depan base bukan tenant.
        assert_eq!(extract_subdomain_with_base("a.b.undangan.nurita.id", base), None);
        // Host di luar base tetap pakai heuristik (mis. debug via .localhost).
        assert_eq!(
            extract_subdomain_with_base("ivan-aura.localhost", base),
            Some("ivan-aura".to_string())
        );
    }
}
