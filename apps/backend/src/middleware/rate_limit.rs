use std::{
    collections::HashMap,
    net::{IpAddr, SocketAddr},
    sync::{LazyLock, Mutex},
    time::{Duration, Instant},
};

use axum::{
    body::Body,
    extract::ConnectInfo,
    http::{Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Json, Response},
};
use serde_json::json;

/// Maksimal percobaan auth admin GAGAL per IP dalam satu jendela waktu.
/// Setelah lewat batas, semua request /api/admin dari IP itu ditolak 429
/// sampai jendelanya bergeser -- rem darurat terhadap brute force password.
const MAX_FAILURES: usize = 5;
const WINDOW: Duration = Duration::from_secs(15 * 60);

/// Maksimal kiriman RSVP per IP per jendela -- endpoint-nya publik tanpa auth,
/// jadi ini satu-satunya rem terhadap spam ucapan. Dihitung SEMUA kiriman
/// (bukan cuma yang gagal): tamu wajar paling mengirim 1-2 ucapan.
const MAX_RSVP_PER_WINDOW: usize = 5;
const RSVP_WINDOW: Duration = Duration::from_secs(10 * 60);

/// Timestamp kegagalan per IP. In-memory (hilang saat restart) -- cukup untuk
/// memperlambat brute force; bukan pengganti password yang kuat.
static FAILURES: LazyLock<Mutex<HashMap<IpAddr, Vec<Instant>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

/// Timestamp kiriman RSVP per IP -- map terpisah dari FAILURES karena
/// kebijakannya beda (hitung semua request, jendela lebih pendek).
static RSVP_SUBMISSIONS: LazyLock<Mutex<HashMap<IpAddr, Vec<Instant>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));

/// IP klien: pakai hop pertama X-Forwarded-For kalau ada (diisi reverse proxy
/// seperti nginx di production -- HANYA bisa dipercaya kalau proxy itu milik
/// kita), fallback ke alamat koneksi langsung (di dev = IP container frontend,
/// karena request lewat Vite proxy).
fn client_ip(request: &Request<Body>, connect_addr: SocketAddr) -> IpAddr {
    request
        .headers()
        .get("x-forwarded-for")
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.split(',').next())
        .and_then(|first| first.trim().parse::<IpAddr>().ok())
        .unwrap_or_else(|| connect_addr.ip())
}

fn is_blocked(ip: IpAddr) -> bool {
    let mut failures = FAILURES.lock().expect("rate limit mutex poisoned");
    let now = Instant::now();

    match failures.get_mut(&ip) {
        None => false,
        Some(timestamps) => {
            timestamps.retain(|t| now.duration_since(*t) < WINDOW);
            if timestamps.is_empty() {
                failures.remove(&ip);
                return false;
            }
            timestamps.len() >= MAX_FAILURES
        }
    }
}

fn record_failure(ip: IpAddr) {
    let mut failures = FAILURES.lock().expect("rate limit mutex poisoned");
    failures.entry(ip).or_default().push(Instant::now());
}

/// Middleware rate limit khusus path /api/admin/*: hitung response 401 sebagai
/// percobaan gagal, dan tolak lebih awal (429) begitu sebuah IP melewati batas.
/// Path non-admin tidak tersentuh sama sekali.
pub async fn limit_admin_auth(
    ConnectInfo(connect_addr): ConnectInfo<SocketAddr>,
    request: Request<Body>,
    next: Next,
) -> Response {
    if !request.uri().path().starts_with("/api/admin") {
        return next.run(request).await;
    }

    let ip = client_ip(&request, connect_addr);

    if is_blocked(ip) {
        return (
            StatusCode::TOO_MANY_REQUESTS,
            Json(json!({ "error": "terlalu banyak percobaan gagal, coba lagi dalam 15 menit" })),
        )
            .into_response();
    }

    let response = next.run(request).await;

    if response.status() == StatusCode::UNAUTHORIZED {
        record_failure(ip);
    }

    response
}

/// Catat satu kiriman dan laporkan apakah IP ini sudah melewati kuota.
/// Sliding window sederhana: timestamp kedaluwarsa dibuang setiap dicek.
fn rsvp_over_quota(ip: IpAddr) -> bool {
    let mut submissions = RSVP_SUBMISSIONS.lock().expect("rate limit mutex poisoned");
    let now = Instant::now();
    let timestamps = submissions.entry(ip).or_default();

    timestamps.retain(|t| now.duration_since(*t) < RSVP_WINDOW);
    if timestamps.len() >= MAX_RSVP_PER_WINDOW {
        return true;
    }

    timestamps.push(now);
    false
}

/// Middleware anti-spam kiriman RSVP: hanya menyentuh POST /api/rsvp.
/// GET /api/rsvp (baca daftar ucapan) tidak dibatasi.
pub async fn limit_rsvp_submissions(
    ConnectInfo(connect_addr): ConnectInfo<SocketAddr>,
    request: Request<Body>,
    next: Next,
) -> Response {
    let is_rsvp_post =
        request.method() == axum::http::Method::POST && request.uri().path() == "/api/rsvp";

    if !is_rsvp_post {
        return next.run(request).await;
    }

    let ip = client_ip(&request, connect_addr);

    if rsvp_over_quota(ip) {
        return (
            StatusCode::TOO_MANY_REQUESTS,
            Json(json!({ "error": "terlalu banyak kiriman, coba lagi beberapa menit lagi" })),
        )
            .into_response();
    }

    next.run(request).await
}
