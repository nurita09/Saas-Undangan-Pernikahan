import type { ContactSettings } from "../../../../types/wedding";
import {
  InstagramIcon,
  ShoppingBagIcon,
  StorefrontIcon,
  TiktokIcon,
  WhatsAppIcon,
} from "../components/ornaments";

interface FooterSectionProps {
  contact: ContactSettings;
}

export default function FooterSection({ contact }: FooterSectionProps) {
  const links = [
    {
      href: contact.contact_instagram_url,
      label: "Instagram",
      icon: InstagramIcon,
    },
    {
      href: contact.contact_whatsapp_url,
      label: "WhatsApp",
      icon: WhatsAppIcon,
    },
    { href: contact.shopee_url, label: "Shopee", icon: ShoppingBagIcon },
    { href: contact.tokopedia_url, label: "Tokopedia", icon: StorefrontIcon },
    { href: contact.tiktok_url, label: "TikTok", icon: TiktokIcon },
  ].filter((link): link is typeof link & { href: string } =>
    Boolean(link.href),
  );

  return (
    <footer className="border-t border-[var(--va-line)] bg-[var(--va-paper)] px-7 py-10 text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[var(--va-line)]" />
        <p className="text-[0.56rem] tracking-[0.26em] text-[var(--va-oxblood)] uppercase">
          Wedding archive
        </p>
        <span className="h-px w-10 bg-[var(--va-line)]" />
      </div>

      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--va-line)] text-[var(--va-forest)] transition hover:border-[var(--va-oxblood)] hover:bg-[var(--va-oxblood)] hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}

      {contact.contact_handle && (
        <p className="mt-5 font-vintage text-lg text-[var(--va-forest)]">
          {contact.contact_handle}
        </p>
      )}
      <p className="mt-4 text-[0.52rem] tracking-[0.2em] text-[var(--va-muted)] uppercase">
        Made for a day worth remembering
      </p>
    </footer>
  );
}
