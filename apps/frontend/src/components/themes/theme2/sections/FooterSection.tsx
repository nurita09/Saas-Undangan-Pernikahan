import type { ContactSettings } from '../../../../types/wedding';
import {
  BatikBand,
  Divider,
  InstagramIcon,
  ShoppingBagIcon,
  StorefrontIcon,
  TiktokIcon,
  WhatsAppIcon,
} from '../components/ornaments';

interface FooterSectionProps {
  contact: ContactSettings;
}

/** Section 9: footer "Hubungi Kami". Ikon & handle ikut setting GLOBAL platform
 *  (tabel platform_settings, diatur admin) -- bukan data per-wedding. Kalau belum
 *  dikonfigurasi admin, ikon/handle terkait disembunyikan (bukan link mati "#"). */
export default function FooterSection({ contact }: FooterSectionProps) {
  return (
    <footer className="relative overflow-hidden bg-[var(--jw-sogan-deep)] px-6 py-14 text-center">
      <BatikBand className="opacity-[0.18] mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.24))]" />
      <div className="relative">
        <p className="text-[0.6rem] font-medium tracking-[0.36em] text-[var(--color-secondary)]/80 uppercase">
          Hubungi Kami
        </p>
        <Divider tone="light" />

        {(contact.contact_instagram_url ||
          contact.contact_whatsapp_url ||
          contact.shopee_url ||
          contact.tokopedia_url ||
          contact.tiktok_url) && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {contact.contact_instagram_url && (
              <a
                href={contact.contact_instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/60 bg-[var(--color-secondary)]/[0.03] text-[var(--color-secondary)] transition hover:scale-110 hover:bg-[var(--jw-gold-soft)]/12"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {contact.contact_whatsapp_url && (
              <a
                href={contact.contact_whatsapp_url}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/60 bg-[var(--color-secondary)]/[0.03] text-[var(--color-secondary)] transition hover:scale-110 hover:bg-[var(--jw-gold-soft)]/12"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            )}
            {contact.shopee_url && (
              <a
                href={contact.shopee_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Shopee"
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/60 bg-[var(--color-secondary)]/[0.03] text-[var(--color-secondary)] transition hover:scale-110 hover:bg-[var(--jw-gold-soft)]/12"
              >
                <ShoppingBagIcon className="h-5 w-5" />
              </a>
            )}
            {contact.tokopedia_url && (
              <a
                href={contact.tokopedia_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Tokopedia"
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/60 bg-[var(--color-secondary)]/[0.03] text-[var(--color-secondary)] transition hover:scale-110 hover:bg-[var(--jw-gold-soft)]/12"
              >
                <StorefrontIcon className="h-5 w-5" />
              </a>
            )}
            {contact.tiktok_url && (
              <a
                href={contact.tiktok_url}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/60 bg-[var(--color-secondary)]/[0.03] text-[var(--color-secondary)] transition hover:scale-110 hover:bg-[var(--jw-gold-soft)]/12"
              >
                <TiktokIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        )}

        {contact.contact_handle && (
          <p className="mt-6 text-sm font-medium text-[var(--color-secondary)]/90">
            {contact.contact_handle}
          </p>
        )}
      </div>
    </footer>
  );
}
