-- Setting GLOBAL untuk seluruh platform (bukan per-wedding) -- mis. kontak
-- Instagram/WhatsApp yang tampil di footer "Hubungi Kami" tiap undangan.
-- id BOOLEAN + CHECK (id) adalah pola umum Postgres untuk memaksa tabel ini
-- hanya boleh punya TEPAT SATU baris (singleton) -- tidak mungkin ada baris
-- kedua karena primary key cuma bisa bernilai true.
CREATE TABLE IF NOT EXISTS platform_settings (
    id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
    contact_instagram_url TEXT,
    contact_whatsapp_url TEXT,
    contact_handle VARCHAR(100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed satu baris kosong supaya query SELECT selalu punya baris untuk dibaca
-- (belum diisi admin -> semua kolom NULL, frontend akan sembunyikan bagian
-- yang belum dikonfigurasi alih-alih menampilkan data palsu).
INSERT INTO platform_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;
