import type { CSSProperties, ReactNode } from "react";

/** Titik halftone ala cetak offset. */
export function halftoneBackground(opacity = 0.1): CSSProperties {
  return {
    backgroundImage:
      "radial-gradient(circle, var(--rp-ink) 1px, transparent 1.2px)",
    backgroundSize: "9px 9px",
    opacity,
  };
}

/** Garis diagonal tipis untuk blok warna poster. */
export function stripeBackground(opacity = 0.1): CSSProperties {
  return {
    backgroundImage:
      "repeating-linear-gradient(135deg, var(--rp-ink) 0 2px, transparent 2px 12px)",
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

export function RetroSun({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 70"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M25 62a35 35 0 0 1 70 0" fill="var(--rp-yellow)" />
      <path d="M35 62a25 25 0 0 1 50 0" fill="var(--color-primary)" />
      <path d="M45 62a15 15 0 0 1 30 0" fill="var(--rp-teal)" />
      <path
        d="M60 14V4M32 24l-7-7M88 24l7-7M20 44H8M112 44h-12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M14 62h92"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RetroArches({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 100 52"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 50a46 46 0 0 1 92 0"
        stroke="var(--color-primary)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M18 50a32 32 0 0 1 64 0"
        stroke="var(--rp-yellow)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M32 50a18 18 0 0 1 36 0"
        stroke="var(--rp-teal)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Daisy({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {Array.from({ length: 8 }, (_, index) => index * 45).map((angle) => (
        <ellipse
          key={angle}
          cx="20"
          cy="9"
          rx="5"
          ry="9"
          fill="currentColor"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}
      <circle
        cx="20"
        cy="20"
        r="6"
        fill="var(--rp-yellow)"
        stroke="var(--rp-ink)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function GroovyDivider({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 8 Q16 0 28 8 T52 8 T76 8 T100 8 T124 8 T148 8 T172 8 T196 8"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M4 17 Q16 9 28 17 T52 17 T76 17 T100 17 T124 17 T148 17 T172 17 T196 17"
        stroke="var(--rp-yellow)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  inverse?: boolean;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <header className={centered ? "text-center" : "text-left"}>
      <p
        className={`text-[0.58rem] font-bold uppercase tracking-[0.28em] ${inverse ? "text-white/65" : "text-[var(--color-primary)]"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-retro text-[2.5rem] leading-[1.05] ${inverse ? "text-white" : "text-[var(--rp-ink)]"}`}
      >
        {title}
      </h2>
      <GroovyDivider className={`mt-5 w-44 ${centered ? "mx-auto" : ""}`} />
      {description && (
        <p
          className={`mt-5 max-w-sm text-sm leading-relaxed ${centered ? "mx-auto" : ""} ${inverse ? "text-white/70" : "text-[var(--rp-muted)]"}`}
        >
          {description}
        </p>
      )}
    </header>
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
    strokeWidth: 1.8,
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
