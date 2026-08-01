//! Seeder wedding DEMO untuk landing page: satu undangan contoh per tema,
//! terisi data lengkap (foto Unsplash, love story, galeri, gift, kutipan)
//! dan langsung published. Dijalankan setiap startup SETELAH migrasi --
//! idempotent per slug: yang sudah ada dilewati, yang terhapus dibuat ulang.
//! Tombol "Lihat Demo" di landing page menunjuk ke slug-slug ini.

use chrono::{DateTime, Utc};
use sqlx::PgPool;
use uuid::Uuid;

use crate::routes::wedding::default_colors_for_theme;

struct DemoSpec {
    slug: &'static str,
    theme_id: i32,
    groom: &'static str,
    bride: &'static str,
    groom_parents: &'static str,
    bride_parents: &'static str,
    quote_text: Option<&'static str>,
    quote_source: Option<&'static str>,
}

// Foto contoh dari Unsplash (lisensi bebas pakai) -- dipakai bergiliran.
const COVER: &str = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const GROOM_PHOTO: &str = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
const BRIDE_PHOTO: &str = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80";
const GALLERY: [&str; 4] = [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80",
    "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
];

const DEMOS: [DemoSpec; 6] = [
    DemoSpec {
        slug: "demo-floral",
        theme_id: 1,
        groom: "Ivan",
        bride: "Aura",
        groom_parents: "Putra dari Bapak Hartono & Ibu Sri Rahayu",
        bride_parents: "Putri dari Bapak Bambang & Ibu Dewi Lestari",
        quote_text: None,
        quote_source: None,
    },
    DemoSpec {
        slug: "demo-jawa",
        theme_id: 2,
        groom: "Bagus",
        bride: "Sekar",
        groom_parents: "Putra dari Bapak Widodo & Ibu Sulastri",
        bride_parents: "Putri dari Bapak Prasetyo & Ibu Endang",
        quote_text: Some(
            "Witing tresna jalaran saka kulina — cinta tumbuh karena terbiasa bersama, dan kami memilih untuk terbiasa selamanya.",
        ),
        quote_source: Some("Pepatah Jawa"),
    },
    DemoSpec {
        slug: "demo-dark",
        theme_id: 3,
        groom: "Devan",
        bride: "Alicia",
        groom_parents: "Putra dari Bapak Surya & Ibu Maya",
        bride_parents: "Putri dari Bapak Antonius & Ibu Clara",
        quote_text: Some(
            "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong.",
        ),
        quote_source: Some("1 Korintus 13:4"),
    },
    DemoSpec {
        slug: "demo-islami",
        theme_id: 4,
        groom: "Fauzan",
        bride: "Aisyah",
        groom_parents: "Putra dari Bapak H. Abdullah & Ibu Hj. Khadijah",
        bride_parents: "Putri dari Bapak H. Rahmat & Ibu Hj. Salma",
        quote_text: None, // pakai default Qs. Ar-Rum: 21
        quote_source: None,
    },
    DemoSpec {
        slug: "demo-retro",
        theme_id: 5,
        groom: "Dika",
        bride: "Nala",
        groom_parents: "Anaknya Pak Agus & Bu Rina",
        bride_parents: "Anaknya Pak Yusuf & Bu Tanti",
        quote_text: Some(
            "Kata orang jodoh itu di tangan Tuhan — untung banget Tuhan nulis nama kita bersebelahan.",
        ),
        quote_source: Some("Kata Kami Berdua"),
    },
    DemoSpec {
        slug: "demo-vintage",
        theme_id: 6,
        groom: "Arka",
        bride: "Renata",
        groom_parents: "Putra dari Bapak Sutrisno Wijaya & Ibu Sri Wahyuni",
        bride_parents: "Putri dari Bapak Bambang Hartono & Ibu Endah Kusumawati",
        quote_text: None, // pakai default Qs. Ar-Rum: 21
        quote_source: None,
    },
];

fn demo_date(rfc3339: &str) -> DateTime<Utc> {
    DateTime::parse_from_rfc3339(rfc3339)
        .expect("tanggal demo valid")
        .with_timezone(&Utc)
}

pub async fn ensure_demo_weddings(pool: &PgPool) -> Result<(), sqlx::Error> {
    for spec in &DEMOS {
        let exists: Option<Uuid> = sqlx::query_scalar("SELECT id FROM weddings WHERE subdomain_slug = $1")
            .bind(spec.slug)
            .fetch_optional(pool)
            .await?;
        if exists.is_some() {
            continue;
        }

        let mut tx = pool.begin().await?;
        let (primary, secondary) = default_colors_for_theme(spec.theme_id);
        // Konvensi platform: jam dinding WIB (lihat frontend/src/utils/formatDate.ts).
        let wedding_date = demo_date("2027-06-12T10:00:00Z");
        let akad_date = demo_date("2027-06-12T08:00:00Z");
        let resepsi_date = demo_date("2027-06-12T11:00:00Z");

        let theme_settings = serde_json::json!({
            "quote_text": spec.quote_text,
            "quote_source": spec.quote_source,
            "section1_photo_url": null,
            "section2_photo_url": null,
        });

        let wedding_id: Uuid = sqlx::query_scalar(
            r#"
            INSERT INTO weddings (subdomain_slug, access_token, theme_id, primary_color, secondary_color, is_published, theme_settings)
            VALUES ($1, $2, $3, $4, $5, true, $6)
            RETURNING id
            "#,
        )
        .bind(spec.slug)
        .bind(Uuid::new_v4().to_string())
        .bind(spec.theme_id)
        .bind(primary)
        .bind(secondary)
        .bind(&theme_settings)
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO wedding_details (
                wedding_id, groom_name, bride_name, wedding_date, location_address, maps_url,
                cover_photo_url, groom_photo_url, bride_photo_url, groom_parents, bride_parents,
                groom_ig, bride_ig, akad_date, akad_location, resepsi_date, resepsi_location
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            "#,
        )
        .bind(wedding_id)
        .bind(spec.groom)
        .bind(spec.bride)
        .bind(wedding_date)
        .bind("Gedung Serbaguna Nurita, Jl. Melati No. 12, Yogyakarta")
        .bind("https://maps.google.com/?q=Yogyakarta")
        .bind(COVER)
        .bind(GROOM_PHOTO)
        .bind(BRIDE_PHOTO)
        .bind(spec.groom_parents)
        .bind(spec.bride_parents)
        .bind("@nurita.undangan")
        .bind("@nurita.undangan")
        .bind(akad_date)
        .bind("Masjid Agung / Gereja / Balai Adat (contoh lokasi akad)")
        .bind(resepsi_date)
        .bind("Gedung Serbaguna Nurita (contoh lokasi resepsi)")
        .execute(&mut *tx)
        .await?;

        let stories: [(&str, &str); 3] = [
            ("Januari 2023 — Pertama Bertemu", "Berawal dari acara kampus, obrolan lima menit yang ternyata tidak pernah selesai sampai sekarang."),
            ("Agustus 2025 — Lamaran", "Di depan kedua keluarga, kami mengikat janji untuk melangkah ke jenjang yang lebih serius."),
            ("Juni 2027 — Menikah", "Dan sampailah kami di halaman ini — mengundang Anda menjadi saksi hari bahagia kami."),
        ];
        for (order_seq, (date, description)) in stories.iter().enumerate() {
            sqlx::query(
                "INSERT INTO love_stories (wedding_id, date, description, photo_url, order_seq) VALUES ($1, $2, $3, $4, $5)",
            )
            .bind(wedding_id)
            .bind(date)
            .bind(description)
            .bind(GALLERY[order_seq % GALLERY.len()])
            .bind(order_seq as i32)
            .execute(&mut *tx)
            .await?;
        }

        for (order_seq, url) in GALLERY.iter().enumerate() {
            sqlx::query("INSERT INTO gallery_photos (wedding_id, photo_url, order_seq) VALUES ($1, $2, $3)")
                .bind(wedding_id)
                .bind(url)
                .bind(order_seq as i32)
                .execute(&mut *tx)
                .await?;
        }

        sqlx::query(
            "INSERT INTO wedding_gifts (wedding_id, gift_type, bank_name, account_name, account_number) VALUES ($1, 'bank', 'BCA', $2, '1234567890')",
        )
        .bind(wedding_id)
        .bind(format!("{} & {}", spec.groom, spec.bride))
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        tracing::info!(slug = spec.slug, theme = spec.theme_id, "wedding demo dibuat");
    }

    Ok(())
}
