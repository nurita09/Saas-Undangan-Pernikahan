import type { ContactSettings } from '../../../../types/wedding';
import {
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
    <footer className="bg-[var(--t6-card)] px-7 py-10 text-center">
      <p className="text-[0.65rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
        Hubungi Kami
      </p>

      {(contact.contact_instagram_url ||
        contact.contact_whatsapp_url ||
        contact.shopee_url ||
        contact.tokopedia_url ||
        contact.tiktok_url) && (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {contact.contact_instagram_url && (
            <a
              href={contact.contact_instagram_url}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-primary)]/35 text-[var(--sage-deep)] transition hover:bg-[var(--color-primary)]/10 hover:scale-105"
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
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-primary)]/35 text-[var(--sage-deep)] transition hover:bg-[var(--color-primary)]/10 hover:scale-105"
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
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-primary)]/35 text-[var(--sage-deep)] transition hover:bg-[var(--color-primary)]/10 hover:scale-105"
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
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-primary)]/35 text-[var(--sage-deep)] transition hover:bg-[var(--color-primary)]/10 hover:scale-105"
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
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-primary)]/35 text-[var(--sage-deep)] transition hover:bg-[var(--color-primary)]/10 hover:scale-105"
            >
              <TiktokIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      )}

      {contact.contact_handle && (
        <p className="mt-5 font-vintage text-lg text-[var(--sage-deep)]">
          {contact.contact_handle}
        </p>
      )}
    </footer>
  );
}
