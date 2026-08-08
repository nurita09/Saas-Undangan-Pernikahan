import type { CSSProperties } from "react";

// Ornamen art-deco untuk Theme 3 (Modern Elegant / Dark) -- garis tipis emas,
// wajik, dan kipas deco. Semuanya SVG inline tanpa file asset.

/** Mengikuti warna primary dari pengaturan tema. */
export const GOLD = "var(--color-primary)";

/** Sapuan cahaya linear halus di belakang konten section. */
export function goldGlow(opacity = 0.12): CSSProperties {
  return {
    background: `linear-gradient(180deg, color-mix(in oklab, ${GOLD} 42%, transparent), transparent 88%)`,
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

/** Kipas art-deco (sunburst) -- mahkota cover, kesan Gatsby/ballroom malam. */
export function DecoFan({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 160 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M80 78V10" stroke={GOLD} strokeWidth="1.5" />
      <path
        d="M80 78 44 18M80 78l36-60M80 78 18 34m62 44 62-44M80 78 6 56m74 22 74-22"
        stroke={GOLD}
        strokeWidth="1"
        opacity="0.7"
      />
      <circle cx="80" cy="78" r="4" fill={GOLD} />
      <circle cx="80" cy="10" r="2" fill={GOLD} />
      <circle cx="44" cy="18" r="2" fill={GOLD} opacity="0.8" />
      <circle cx="116" cy="18" r="2" fill={GOLD} opacity="0.8" />
      <circle cx="18" cy="34" r="2" fill={GOLD} opacity="0.6" />
      <circle cx="142" cy="34" r="2" fill={GOLD} opacity="0.6" />
      <circle cx="6" cy="56" r="2" fill={GOLD} opacity="0.4" />
      <circle cx="154" cy="56" r="2" fill={GOLD} opacity="0.4" />
    </svg>
  );
}

/** Pembatas: garis tipis panjang + wajik emas di tengah, titik di sisi. */
export function GoldDivider({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 220 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 7h86M130 7h86"
        stroke={GOLD}
        strokeWidth="0.8"
        opacity="0.8"
      />
      <path
        d="M110 1.5 115.5 7 110 12.5 104.5 7 110 1.5Z"
        stroke={GOLD}
        strokeWidth="1"
      />
      <path d="M110 4.2 112.8 7 110 9.8 107.2 7l2.8-2.8Z" fill={GOLD} />
      <circle cx="96" cy="7" r="1.3" fill={GOLD} opacity="0.8" />
      <circle cx="124" cy="7" r="1.3" fill={GOLD} opacity="0.8" />
    </svg>
  );
}

/** Sudut art-deco: garis siku ganda + aksen tangga khas deco. */
export function DecoCorner({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 42V10a8 8 0 0 1 8-8h32" stroke={GOLD} strokeWidth="1.4" />
      <path
        d="M9 42V16a7 7 0 0 1 7-7h26"
        stroke={GOLD}
        strokeWidth="0.8"
        opacity="0.55"
      />
      <path d="M2 22h7M22 2v7" stroke={GOLD} strokeWidth="1" opacity="0.8" />
      <path d="M13 13 2 2" stroke={GOLD} strokeWidth="1" />
      <circle cx="15" cy="15" r="1.8" fill={GOLD} />
    </svg>
  );
}

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

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
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

export function SendIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="m21 3-8 18-3-8-8-3z" />
      <path d="M21 3 10 13" />
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

export function ExpandIcon({ className }: IconProps) {
  return (
    <svg {...iconAttrs(className)}>
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
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
