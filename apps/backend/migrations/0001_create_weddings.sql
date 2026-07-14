-- Ekstensi untuk gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS weddings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subdomain_slug  VARCHAR(150) NOT NULL UNIQUE,
    theme_id        INTEGER NOT NULL DEFAULT 1,
    primary_color   VARCHAR(20) NOT NULL DEFAULT '#E0115F',
    secondary_color VARCHAR(20) NOT NULL DEFAULT '#FFFFFF',
    music_url       TEXT,
    access_token    VARCHAR(64) NOT NULL UNIQUE,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catatan: UNIQUE di PostgreSQL otomatis membuat index B-tree,
-- jadi tidak perlu CREATE INDEX terpisah untuk subdomain_slug / access_token.
