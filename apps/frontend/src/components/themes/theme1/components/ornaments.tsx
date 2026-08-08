import divider from "../../../../assets/theme1/divider.png";
import corner from "../../../../assets/theme1/floral-corner.png";

/**
 * Ornamen & ikon Theme 1 - Floral Elegant (redesain "floral dreams" dari
 * Lovable). Ikon lucide-react di desain asal digambar ulang sebagai SVG stroke
 * ringan; ornamen bunga memakai asset PNG (divider + sudut bunga).
 */

/** Garis pembatas bunga (asset PNG) -- dipakai di bawah judul & pemisah. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <img
      src={divider}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`mx-auto h-14 w-auto max-w-[280px] object-contain opacity-90 ${className}`.trim()}
    />
  );
}

type CornerSpot = "tl" | "tr" | "bl" | "br";

/* Satu asset sudut yang sama dicerminkan ke 4 arah lewat scale negatif. */
const SPOT_CLASS: Record<CornerSpot, string> = {
  tl: "left-0 top-0",
  tr: "right-0 top-0 -scale-x-100",
  bl: "left-0 bottom-0 -scale-y-100",
  br: "right-0 bottom-0 -scale-100",
};

/** Ornamen bunga di sudut-sudut section, melayang pelan (drift-slow). */
export function FloralCorners({
  spots = ["tl", "br"],
  size = "w-32",
  opacity = "opacity-50",
}: {
  spots?: CornerSpot[];
  size?: string;
  opacity?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {spots.map((spot) => (
        <img
          key={spot}
          src={corner}
          alt=""
          loading="lazy"
          className={`drift-slow absolute select-none ${SPOT_CLASS[spot]} ${size} ${opacity}`}
        />
      ))}
    </div>
  );
}

/** Kicker + judul (script atau serif kapital) + divider bunga. */
export function SectionTitle({
  eyebrow,
  title,
  script = true,
}: {
  eyebrow?: string;
  title: string;
  script?: boolean;
}) {
  return (
    <div className="text-center">
      {eyebrow && <p className="label-caps text-[var(--fl-clay)]">{eyebrow}</p>}
      <h2
        className={
          script
            ? "mt-3 font-floral-script text-[3.5rem] leading-none text-[var(--color-primary)]"
            : "mt-4 font-floral-serif text-[2.15rem] font-light uppercase tracking-[0.16em] text-[var(--color-primary)]"
        }
      >
        {title}
      </h2>
      <Divider className="mt-1 h-12" />
    </div>
  );
}

/** Kelopak bunga berjatuhan di atas undangan yang sudah terbuka. Posisi/ukuran/
 *  durasi dihitung deterministik dari indeks supaya tidak serempak. */
export function Petals({ count = 14 }: { count?: number }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 97) % 100}%`,
    size: 7 + ((i * 5) % 10),
    duration: 13 + ((i * 3) % 11),
    delay: (i * 1.7) % 14,
  }));

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 1.4,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ikon stroke ringan (pengganti lucide-react -- proyek ini tanpa dependensi ikon)
// ---------------------------------------------------------------------------

interface IconProps {
  className?: string;
}

function iconAttrs(className: string | undefined) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className,
  } as const;
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M12 20s-7-4.5-9-9c-1.2-2.8.6-6 3.8-6 2 0 3.5 1.2 5.2 3.2C13.7 6.2 15.2 5 17.2 5c3.2 0 5 3.2 3.8 6-2 4.5-9 9-9 9z" />
    </svg>
  );
}

export function MusicIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 5v14M16 5v14" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="m21 3-8 18-3-8-8-3z" />
      <path d="M21 3 10 13" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ExpandIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="3" y="8" width="18" height="4" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8c-2 0-4.5-.7-4.5-2.7C7.5 3.6 10 3.4 12 8zm0 0c2 0 4.5-.7 4.5-2.7C16.5 3.6 14 3.4 12 8z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function ShoppingBagIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function StorefrontIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M4.5 10 5.5 4h13l1 6" />
      <path d="M4.5 10a2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.6 0" />
      <path d="M5.5 10v10h13V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function TiktokIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M14 4v10.8a3.3 3.3 0 1 1-2.8-3.26" />
      <path d="M14 4c0 2.4 1.8 4.3 4 4.3" />
    </svg>
  );
}
