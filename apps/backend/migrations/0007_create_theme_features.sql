CREATE TABLE IF NOT EXISTS love_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES weddings (id) ON DELETE CASCADE,
    date VARCHAR(50),
    description TEXT,
    photo_url TEXT,
    order_seq INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_love_stories_wedding_id ON love_stories (wedding_id);

CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES weddings (id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    order_seq INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_wedding_id ON gallery_photos (wedding_id);

CREATE TABLE IF NOT EXISTS wedding_gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES weddings (id) ON DELETE CASCADE,
    gift_type VARCHAR(20) NOT NULL, -- 'bank' atau 'kado'
    bank_name VARCHAR(100),
    account_name VARCHAR(150),
    account_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wedding_gifts_wedding_id ON wedding_gifts (wedding_id);

ALTER TABLE weddings ADD COLUMN IF NOT EXISTS theme_settings JSONB;
