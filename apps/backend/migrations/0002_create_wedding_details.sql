CREATE TABLE IF NOT EXISTS wedding_details (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id        UUID NOT NULL REFERENCES weddings (id) ON DELETE CASCADE,
    groom_name        VARCHAR(150) NOT NULL,
    bride_name        VARCHAR(150) NOT NULL,
    wedding_date      TIMESTAMPTZ,
    location_address  TEXT,
    maps_url          TEXT
);

-- Relasi one-to-one dengan weddings
CREATE UNIQUE INDEX IF NOT EXISTS idx_wedding_details_wedding_id ON wedding_details (wedding_id);
