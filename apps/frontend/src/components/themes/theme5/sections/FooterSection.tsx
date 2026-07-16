import type { ContactSettings } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, wavyBackground } from '../components/ornaments';

interface FooterSectionProps {
  contact: ContactSettings;
}

/** Section 9: footer "Hubungi Kami" -- ikut setting GLOBAL platform (tabel
 *  platform_settings, diatur admin), bukan data per-wedding. */
export default function FooterSection({ contact }: FooterSectionProps) {
  return (
    <footer className="relative px-6 py-12 text-center text-white overflow-hidden" style={{ backgroundColor: COCOA }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 invert" style={wavyBackground(0.12)} />

      <div className="relative z-10">
        <Reveal variant="up">
          <p className="font-retro text-lg tracking-wide">Hubungi Kami</p>
        </Reveal>

        {(contact.contact_instagram_url || contact.contact_whatsapp_url) && (
          <div className="mt-6 flex justify-center gap-4">
            {contact.contact_instagram_url && (
              <Reveal variant="up" delay={120}>
                <a
                  href={contact.contact_instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#E3B23C] text-[#5C4033] transition hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </Reveal>
            )}
            {contact.contact_whatsapp_url && (
              <Reveal variant="up" delay={240}>
                <a
                  href={contact.contact_whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#C75B39] text-white transition hover:scale-110"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </Reveal>
            )}
          </div>
        )}

        {contact.contact_handle && (
          <Reveal variant="up" delay={360}>
            <p className="mt-6 text-sm font-bold opacity-90">{contact.contact_handle}</p>
          </Reveal>
        )}
      </div>
    </footer>
  );
}
