mod admin;
mod wedding;
mod wedding_edit;
mod rsvp;

use axum::{
    routing::{get, post, put},
    Router,
};

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/admin/login", post(admin::login))
        .route("/api/admin/weddings", get(admin::list_weddings))
        .route("/api/admin/music", post(admin::upload_music))
        .route(
            "/api/admin/settings",
            get(admin::get_settings).put(admin::update_settings),
        )
        .route("/api/music", get(admin::list_music))
        .route("/api/weddings", post(wedding::create_wedding))
        .route("/api/wedding-details", get(wedding::get_wedding_details))
        .route("/api/wedding/edit-auth", get(wedding_edit::edit_auth))
        .route("/api/wedding/update", put(wedding_edit::update_wedding))
        .route("/api/wedding/upload", post(wedding_edit::upload_photo))
        .route("/api/rsvp", post(rsvp::submit_rsvp))
        .route("/api/rsvp", get(rsvp::get_rsvps))
}
