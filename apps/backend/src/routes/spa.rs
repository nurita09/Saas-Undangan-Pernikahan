//! Mode production: backend menyajikan SPA hasil `vite build` sekaligus
//! meng-inject OG meta tags per wedding ke index.html -- padanan production
//! dari ogTagsPlugin di apps/frontend/vite.config.ts (yang hanya jalan di
//! Vite dev server). Crawler socmed tidak menjalankan JavaScript, jadi meta
//! HARUS sudah ada di HTML yang diserve server.
//!
//! Aktif hanya kalau env FRONTEND_DIST_DIR di-set (lihat config.rs & main.rs).

use std::path::{Component, Path, PathBuf};

use axum::{
    extract::State,
    http::{header, HeaderMap, StatusCode, Uri},
    response::{IntoResponse, Response},
    Extension,
};
use chrono::{DateTime, Datelike, Utc};

use crate::{middleware::TenantSlug, state::AppState};

const INDONESIAN_MONTHS: [&str; 12] = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/// Fallback semua route non-/api: file statis (ada ekstensi) diserve dari dist;
/// route halaman diserve index.html ber-OG sesuai tenant di Host header.
pub async fn serve_spa(
    Extension(tenant): Extension<TenantSlug>,
    headers: HeaderMap,
    State(state): State<AppState>,
    uri: Uri,
) -> Response {
    let Some(dist_dir) = state.config.frontend_dist_dir.as_deref() else {
        return StatusCode::NOT_FOUND.into_response();
    };
    let dist = PathBuf::from(dist_dir);

    let request_path = uri.path().trim_start_matches('/');

    if Path::new(request_path).extension().is_some() {
        return serve_static_file(&dist, request_path).await;
    }

    serve_index_with_og(&state, &dist, &headers, tenant.0.as_deref()).await
}

/// Tolak path yang mengandung komponen selain nama file/direktori biasa
/// ("..", root, prefix) -- proteksi path traversal keluar dari dist.
fn sanitize_relative_path(relative: &str) -> Option<PathBuf> {
    let mut safe = PathBuf::new();
    for component in Path::new(relative).components() {
        match component {
            Component::Normal(part) => safe.push(part),
            _ => return None,
        }
    }
    Some(safe)
}

fn content_type_for(path: &Path) -> &'static str {
    match path.extension().and_then(|e| e.to_str()).unwrap_or_default() {
        "html" => "text/html; charset=utf-8",
        "js" => "text/javascript",
        "css" => "text/css",
        "svg" => "image/svg+xml",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "webp" => "image/webp",
        "ico" => "image/x-icon",
        "json" | "map" | "webmanifest" => "application/json",
        "txt" => "text/plain; charset=utf-8",
        "woff2" => "font/woff2",
        "woff" => "font/woff",
        _ => "application/octet-stream",
    }
}

async fn serve_static_file(dist: &Path, relative: &str) -> Response {
    let Some(safe) = sanitize_relative_path(relative) else {
        return StatusCode::NOT_FOUND.into_response();
    };

    match tokio::fs::read(dist.join(&safe)).await {
        Ok(bytes) => {
            // Aset Vite di /assets/* punya hash konten di namanya -- aman
            // di-cache selamanya. File lain (favicon dll) cache pendek saja.
            let cache_control = if relative.starts_with("assets/") {
                "public, max-age=31536000, immutable"
            } else {
                "public, max-age=300"
            };
            (
                [
                    (header::CONTENT_TYPE, content_type_for(&safe)),
                    (header::CACHE_CONTROL, cache_control),
                ],
                bytes,
            )
                .into_response()
        }
        Err(_) => StatusCode::NOT_FOUND.into_response(),
    }
}

async fn serve_index_with_og(
    state: &AppState,
    dist: &Path,
    headers: &HeaderMap,
    slug: Option<&str>,
) -> Response {
    let index_html = match tokio::fs::read_to_string(dist.join("index.html")).await {
        Ok(html) => html,
        Err(err) => {
            tracing::error!(error = ?err, "index.html tidak terbaca dari FRONTEND_DIST_DIR");
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };

    let html = match slug {
        Some(slug) => inject_og_tags(state, headers, slug, index_html).await,
        None => index_html,
    };

    (
        [
            (header::CONTENT_TYPE, "text/html; charset=utf-8"),
            // HTML tidak boleh di-cache lama: OG & bundle reference bisa berubah.
            (header::CACHE_CONTROL, "no-cache"),
        ],
        html,
    )
        .into_response()
}

#[derive(sqlx::FromRow)]
struct OgRow {
    groom_name: String,
    bride_name: String,
    wedding_date: Option<DateTime<Utc>>,
    location_address: Option<String>,
    cover_photo_url: Option<String>,
}

/// Ambil data wedding TERPUBLIKASI untuk OG. Draft sengaja tidak diberi OG
/// (konsisten dengan gating 404 di GET /api/wedding-details).
async fn inject_og_tags(
    state: &AppState,
    headers: &HeaderMap,
    slug: &str,
    index_html: String,
) -> String {
    let row = sqlx::query_as::<_, OgRow>(
        r#"
        SELECT d.groom_name, d.bride_name, d.wedding_date, d.location_address, d.cover_photo_url
        FROM weddings w
        INNER JOIN wedding_details d ON d.wedding_id = w.id
        WHERE w.subdomain_slug = $1 AND w.is_published = true
          AND (w.active_until IS NULL OR w.active_until > now())
        "#,
    )
    .bind(slug)
    .fetch_optional(&state.db)
    .await;

    let Ok(Some(row)) = row else {
        return index_html;
    };

    let title = format!("The Wedding of {} & {}", row.groom_name, row.bride_name);

    // Timestamp DB = jam dinding WIB (konvensi platform, lihat
    // frontend/src/utils/formatDate.ts) -- komponen UTC-nya langsung dipakai.
    let date_text = row.wedding_date.map(|d| {
        format!(
            "{} {} {}",
            d.day(),
            INDONESIAN_MONTHS[d.month0() as usize],
            d.year()
        )
    });

    let description = [
        Some("Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.".to_string()),
        date_text,
        row.location_address,
    ]
    .into_iter()
    .flatten()
    .collect::<Vec<_>>()
    .join(" — ");

    let host = headers
        .get(header::HOST)
        .and_then(|v| v.to_str().ok())
        .unwrap_or(slug);

    let mut tags = vec![
        r#"<meta property="og:type" content="website" />"#.to_string(),
        format!(r#"<meta property="og:title" content="{}" />"#, escape_html(&title)),
        format!(r#"<meta property="og:description" content="{}" />"#, escape_html(&description)),
        format!(r#"<meta property="og:url" content="https://{}/" />"#, escape_html(host)),
        r#"<meta name="twitter:card" content="summary_large_image" />"#.to_string(),
    ];
    if let Some(image) = &row.cover_photo_url {
        tags.push(format!(r#"<meta property="og:image" content="{}" />"#, escape_html(image)));
        tags.push(format!(r#"<meta name="twitter:image" content="{}" />"#, escape_html(image)));
    }
    let og_block = format!("    {}\n  </head>", tags.join("\n    "));

    let mut html = index_html;
    if let (Some(start), Some(end)) = (html.find("<title>"), html.find("</title>")) {
        html.replace_range(start..end + "</title>".len(), &format!("<title>{}</title>", escape_html(&title)));
    }
    html = html.replacen("</head>", &og_block, 1);
    html
}

fn escape_html(value: &str) -> String {
    value
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sanitize_allows_normal_paths() {
        assert_eq!(
            sanitize_relative_path("assets/index-abc123.js"),
            Some(PathBuf::from("assets/index-abc123.js"))
        );
    }

    #[test]
    fn sanitize_rejects_traversal() {
        assert!(sanitize_relative_path("../etc/passwd").is_none());
        assert!(sanitize_relative_path("assets/../../etc/passwd").is_none());
        assert!(sanitize_relative_path("/etc/passwd").is_none());
    }

    #[test]
    fn content_types_cover_vite_output() {
        assert_eq!(content_type_for(Path::new("a.js")), "text/javascript");
        assert_eq!(content_type_for(Path::new("a.css")), "text/css");
        assert_eq!(content_type_for(Path::new("a.svg")), "image/svg+xml");
        assert_eq!(content_type_for(Path::new("tanpa-ekstensi")), "application/octet-stream");
    }

    #[test]
    fn escape_html_neutralizes_special_chars() {
        assert_eq!(escape_html(r#"<x> & "y"'"#), "&lt;x&gt; &amp; &quot;y&quot;&#39;");
    }
}
