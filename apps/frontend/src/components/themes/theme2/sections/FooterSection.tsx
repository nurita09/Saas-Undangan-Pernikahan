import type { ContactSettings } from '../../../../types/wedding';
import { BatikBand, Divider, InstagramIcon, WhatsAppIcon } from '../components/ornaments';

interface FooterSectionProps {
  contact: ContactSettings;
}

/** Section 9: footer "Hubungi Kami". Ikon & handle ikut setting GLOBAL platform
 *  (tabel platform_settings, diatur admin) -- bukan data per-wedding. Kalau belum
 *  dikonfigurasi admin, ikon/handle terkait disembunyikan (bukan link mati "#"). */
export default function FooterSection({ contact }: FooterSectionProps) {
  return (
    <footer className="relative overflow-hidden bg-[var(--jw-sogan-gradient)] px-6 py-14 text-center">
      <BatikBand className="opacity-[0.16]" />
      <div className="relative">
        <Divider tone="light" />

        {(contact.contact_instagram_url || contact.contact_whatsapp_url) && (
          <div className="mt-6 flex justify-center gap-3">
            {contact.contact_instagram_url && (
              <a
                href={contact.contact_instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/70 text-[var(--color-secondary)] transition hover:scale-110 hover:bg-white/10"
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
                className="grid size-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/70 text-[var(--color-secondary)] transition hover:scale-110 hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5" />
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
