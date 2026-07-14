CREATE TABLE IF NOT EXISTS rsvp (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id         UUID NOT NULL REFERENCES weddings (id) ON DELETE CASCADE,
    guest_name         VARCHAR(150) NOT NULL,
    attendance_status  VARCHAR(20) NOT NULL CHECK (attendance_status IN ('attending', 'not_attending', 'maybe')),
    message            TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_wedding_id ON rsvp (wedding_id);
