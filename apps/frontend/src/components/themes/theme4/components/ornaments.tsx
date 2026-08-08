import type { CSSProperties, ReactNode } from "react";

/** Pola geometri tipis yang mengikuti warna primer dari editor tema. */
export function geometricBackground(opacity = 0.05): CSSProperties {
  const line = "color-mix(in oklab, var(--color-primary) 68%, transparent)";
  return {
    backgroundImage: [
      `linear-gradient(45deg, transparent 47%, ${line} 48%, ${line} 52%, transparent 53%)`,
      `linear-gradient(-45deg, transparent 47%, ${line} 48%, ${line} 52%, transparent 53%)`,
    ].join(", "),
    backgroundPosition: "0 0, 24px 0",
    backgroundSize: "48px 48px",
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

/** Lengkungan mihrab fine-line ganda. */
export function IslamicArch({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 150"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10 148V64c0-20 14-36 26-44 10-7 18-12 24-18 6 6 14 11 24 18 12 8 26 24 26 44v84"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M18 148V66c0-17 12-31 23-38 8-5 14-9 19-14 5 5 11 9 19 14 11 7 23 21 23 38v82"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.55"
      />
      <circle cx="60" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M60 10.5V2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Bintang segi delapan sebagai penanda geometri Islami. */
export function KhatamStar({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2l2.6 4.7L19.8 4.2l-2.5 5.2L22 12l-4.7 2.6 2.5 5.2-5.2-2.5L12 22l-2.6-4.7-5.2 2.5 2.5-5.2L2 12l4.7-2.6L4.2 4.2l5.2 2.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** Pembatas tipis dengan khatam kecil di tengah. */
export function ArchDivider({ className = "" }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 9h74M120 9h74"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.65"
      />
      <path
        d="M100 2l1.9 3.4 3.7-1.8-1.8 3.7L107.5 9l-3.7 1.9 1.8 3.7-3.7-1.8L100 16l-1.9-3.2-3.7 1.8 1.8-3.7L92.5 9l3.7-1.7-1.8-3.7 3.7 1.8L100 2Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="100" cy="9" r="1.4" fill="currentColor" />
      <circle cx="86" cy="9" r="1.2" fill="currentColor" opacity="0.65" />
      <circle cx="114" cy="9" r="1.2" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function Bismillah({ className = "" }: OrnamentProps) {
  return (
    <p className={`font-arabic ${className}`} lang="ar" dir="rtl">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  arabic?: string;
  description?: ReactNode;
  inverse?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  arabic,
  description,
  inverse = false,
}: SectionHeadingProps) {
  return (
    <header className="text-center">
      {arabic && (
        <p
          className={`font-arabic text-[1.35rem] ${inverse ? "text-white/80" : "text-[var(--im-clay)]"}`}
          lang="ar"
          dir="rtl"
        >
          {arabic}
        </p>
      )}
      <p
        className={`mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.36em] ${
          inverse ? "text-white/65" : "text-[var(--color-primary)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-serif text-[2.35rem] leading-tight ${inverse ? "text-white" : "text-[var(--im-ink)]"}`}
      >
        {title}
      </h2>
      <ArchDivider
        className={`mx-auto mt-5 w-44 ${inverse ? "text-white/55" : "text-[var(--color-primary)]"}`}
      />
      {description && (
        <p
          className={`mx-auto mt-5 max-w-sm text-sm leading-relaxed ${inverse ? "text-white/70" : "text-[var(--im-muted)]"}`}
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
