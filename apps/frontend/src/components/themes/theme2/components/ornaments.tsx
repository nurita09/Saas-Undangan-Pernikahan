import type { ReactNode } from "react";
import batikPattern from "../../../../assets/theme2/batik-pattern.jpg";

/**
 * Ornamen & ikon Theme 2 - Adat Jawa (redesain "javanese elegance revival"
 * dari Lovable). Motif digambar sebagai SVG stroke, kecuali tekstur batik yang
 * memakai aset foto asli (ditampilkan sangat transparan sebagai overlay).
 */

/** Siluet gunungan wayang (kayon) -- simbol pembuka lakon, dipakai di cover
 *  dan penutup undangan. */
export function Gunungan({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 130"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M40 2C40 2 74 40 74 74c0 30-16 54-34 54S6 104 6 74C6 40 40 2 40 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M40 12C40 12 66 44 66 74c0 26-13 46-26 46S14 100 14 74c0-30 26-62 26-62Z"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />
      <path
        d="M40 30v70"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <circle cx="40" cy="62" r="11" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="40" cy="62" r="4" stroke="currentColor" strokeWidth="0.8" />
      <path
        d="M40 41c-7 5-11 12-11 21s4 16 11 21c7-5 11-12 11-21s-4-16-11-21Z"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <path
        d="M26 88c8 6 20 6 28 0M28 40c6-5 18-5 24 0"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.5"
      />
    </svg>
  );
}

/** Pembatas: garis tipis emas bertemu rangkaian wajik (belah ketupat) di tengah. */
export function Divider({
  className = "",
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "light";
}) {
  const color =
    tone === "gold" ? "text-[var(--jw-gold)]" : "text-[var(--jw-gold-soft)]";
  return (
    <div
      className={`flex items-center justify-center gap-3 ${color} ${className}`.trim()}
      aria-hidden="true"
    >
      <span className="h-px w-14 bg-current opacity-45 sm:w-20" />
      <span className="size-1 rotate-45 bg-current opacity-70" />
      <span className="size-2.5 rotate-45 border border-current" />
      <span className="size-2 rotate-45 bg-current opacity-80" />
      <span className="size-2.5 rotate-45 border border-current" />
      <span className="size-1 rotate-45 bg-current opacity-70" />
      <span className="h-px w-14 bg-current opacity-45 sm:w-20" />
    </div>
  );
}

/** Bingkai sudut ukiran sulur -- taruh di pojok kartu (absolute + rotate). */
export function CornerFlourish({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M2 30V6a4 4 0 0 1 4-4h24"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M9 30V13a4 4 0 0 1 4-4h17"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.7"
      />
      <path
        d="M14 22c6 0 10-4 10-10M24 16c4 0 7 2 7 6"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.65"
      />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

/** Kartu berbingkai dengan 4 sudut ukiran (dipakai untuk foto, acara, dsb). */
export function FramedCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[4px] border border-[var(--jw-gold-soft)] bg-[var(--jw-card)] p-6 shadow-[var(--jw-shadow)] sm:p-7">
      <CornerFlourish className="absolute top-2 left-2 size-8 text-[var(--jw-gold)]/70" />
      <CornerFlourish
        className="absolute right-2 bottom-2 size-8 text-[var(--jw-gold)]/70"
        rotate={180}
      />
      {children}
    </div>
  );
}

/** Kicker (opsional) + judul (script atau serif kapital) + divider. */
export function SectionTitle({
  kicker,
  title,
  script = true,
}: {
  kicker?: string;
  title: string;
  script?: boolean;
}) {
  return (
    <div className="text-center">
      {kicker && (
        <p className="mb-4 text-[0.62rem] font-medium tracking-[0.42em] text-[var(--jw-gold)] uppercase">
          {kicker}
        </p>
      )}
      {script ? (
        <h2 className="font-jawa-script text-[3.35rem] leading-none text-[var(--color-primary)]">
          {title}
        </h2>
      ) : (
        <h2 className="font-jawa-serif text-3xl font-semibold tracking-[0.22em] text-[var(--color-primary)] uppercase">
          {title}
        </h2>
      )}
      <Divider className="mt-5" />
    </div>
  );
}

/** Tekstur batik samar sebagai overlay latar -- pakai aset foto asli, bukan
 *  pola CSS, supaya seratnya terasa autentik. */
export function BatikBand({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 opacity-[0.07] ${className}`.trim()}
      style={{
        backgroundImage: `url(${batikPattern})`,
        backgroundSize: "260px",
      }}
      aria-hidden="true"
    />
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

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
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

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M7 4.5v15l13-7.5z" />
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
