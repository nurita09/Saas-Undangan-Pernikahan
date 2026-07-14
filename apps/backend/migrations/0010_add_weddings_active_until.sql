-- Masa aktif undangan: melewati tanggal ini, undangan diperlakukan seperti
-- draft (404 untuk tamu; pemilik dengan token masih bisa melihat & mengedit).
-- NULL = tanpa batas waktu. Di-set admin dari tab monitoring (belum ada
-- billing gateway -- konfirmasi pembayaran masih manual).
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS active_until TIMESTAMPTZ;
