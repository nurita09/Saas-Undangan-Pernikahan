-- Perpustakaan lagu yang dikelola admin (upload sekali, dipakai berkali-kali oleh
-- banyak wedding) -- pasangan tinggal PILIH dari daftar ini lewat editor, bukan
-- upload file lagu sendiri per wedding.
CREATE TABLE IF NOT EXISTS music_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    artist VARCHAR(150),
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
