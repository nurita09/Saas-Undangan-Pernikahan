-- Link toko/kanal penjualan untuk landing page (Shopee/Tokopedia/TikTok).
-- Satu set global (tabel singleton platform_settings), diatur admin dari
-- tab Pengaturan. WhatsApp & Instagram sudah ada (contact_*_url).
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS shopee_url TEXT;
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS tokopedia_url TEXT;
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
