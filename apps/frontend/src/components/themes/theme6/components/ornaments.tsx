import type { CoupleInfo } from '../../../../types/wedding';

/**
 * Ornamen & ikon Theme 6 - Vintage Monogram. Semuanya SVG/markup murni tanpa
 * file asset: desain asal (Lovable) memakai monogram.png statis "A & R" dan
 * ikon lucide-react -- di sini monogram dibangun dinamis dari inisial nama
 * pasangan, dan ikon digambar ulang sebagai SVG stroke ringan.
 */

/** Inisial satu huruf dari nama ("Arka Pradipta" -> "A"). */
function initialOf(name: string): string {
  return (name.trim().charAt(0) || '?').toUpperCase();
}

interface MonogramProps {
  couple: CoupleInfo;
  /** Kelas untuk lingkarannya (ukuran + warna border/teks ikut text-*). */
  className?: string;
}

/** Monogram lingkaran ganda berisi inisial pasangan dalam font script. */
export function Monogram({ couple, className = '' }: MonogramProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative grid shrink-0 place-items-center rounded-full border border-current/40 ${className}`.trim()}
    >
      <span className="absolute inset-1 rounded-full border border-current/25" />
      <span className="font-vintage-script leading-none">
        {initialOf(couple.groom_name)}
        <span className="mx-0.5 font-vintage text-[0.6em] align-middle opacity-80">&amp;</span>
        {initialOf(couple.bride_name)}
      </span>
    </div>
  );
}

/** Label kicker diapit garis memudar (.deco-rule di index.css). */
export function Ornament({ label }: { label: string }) {
  return (
    <div className="deco-rule text-[0.62rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
      {label}
    </div>
  );
}

/** Kicker + judul display -- dipakai hampir semua section. */
export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center">
      <Ornament label={kicker} />
      <h2 className="mt-3 font-vintage text-3xl text-[var(--sage-deep)]">{title}</h2>
    </div>
  );
}

/** Ilustrasi garis venue (pengganti venue-line.png): gerbang lengkung + juntai daun. */
export function VenueArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      {/* gerbang */}
      <path d="M40 112 V54 C40 22 70 10 120 10 C170 10 200 22 200 54 V112" />
      <path d="M52 112 V56 C52 30 78 20 120 20 C162 20 188 30 188 56 V112" />
      {/* lantai */}
      <path d="M20 112 H220" />
      {/* juntai daun kiri-kanan */}
      <path d="M56 34 C60 48 58 62 50 74 M56 34 C50 42 48 52 50 62 M56 34 C62 40 66 50 64 60" />
      <path d="M184 34 C180 48 182 62 190 74 M184 34 C190 42 192 52 190 62 M184 34 C178 40 174 50 176 60" />
      {/* hati kecil di puncak */}
      <path d="M120 40 C117 35 111 35 111 40 C111 44 116 46 120 50 C124 46 129 44 129 40 C129 35 123 35 120 40 Z" />
      {/* lampion gantung */}
      <path d="M86 22 V34 M86 34 a4 5 0 1 0 0.01 0 M154 22 V34 M154 34 a4 5 0 1 0 0.01 0" />
    </svg>
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
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    className,
  } as const;
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

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="3" y="8" width="18" height="4" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8c-2 0-4.5-.7-4.5-2.7C7.5 3.6 10 3.4 12 8zm0 0c2 0 4.5-.7 4.5-2.7C16.5 3.6 14 3.4 12 8z" />
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

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M4 12.5 9.5 18 20 6.5" />
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

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M7 4.5v15l13-7.5z" />
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

/** Piringan hitam -- tombol musik (berputar pelan saat lagu berbunyi). */
export function DiscIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5" />
    </svg>
  );
}
