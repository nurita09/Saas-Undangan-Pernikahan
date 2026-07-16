import type { CSSProperties } from 'react';

// Ornamen Theme 4 (Islami Modern): lengkungan masjid minimalis fine-line,
// bintang segi delapan (khatam), dan pola geometri islami samar. Semuanya
// SVG inline tanpa file asset, mengikuti pola theme2/theme3.

/** Sage green tua untuk garis ornamen -- lebih pekat dari warna primary. */
export const SAGE_DARK = '#5C6E52';

/** Pola geometri islami (bintang 8 + kisi) sebagai background samar. */
export function geometricBackground(opacity = 0.05): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
    <g fill='none' stroke='${SAGE_DARK}' stroke-width='1'>
      <path d='M32 8 41 23 56 32 41 41 32 56 23 41 8 32 23 23Z'/>
      <path d='M32 18 38 26 46 32 38 38 32 46 26 38 18 32 26 26Z'/>
      <path d='M0 0h8M0 0v8M64 0h-8M64 0v8M0 64h8M0 64v-8M64 64h-8M64 64v-8'/>
    </g>
  </svg>`;
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: '64px 64px',
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

/** Lengkungan masjid (pointed arch) fine-line ganda + kubah kecil di puncak. */
export function IslamicArch({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 150" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 148V64c0-20 14-36 26-44 10-7 18-12 24-18 6 6 14 11 24 18 12 8 26 24 26 44v84"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M18 148V66c0-17 12-31 23-38 8-5 14-9 19-14 5 5 11 9 19 14 11 7 23 21 23 38v82"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="60" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M60 10.5V2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Bintang segi delapan (khatam) -- penanda & aksen. */
export function KhatamStar({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2l2.6 4.7L19.8 4.2l-2.5 5.2L22 12l-4.7 2.6 2.5 5.2-5.2-2.5L12 22l-2.6-4.7-5.2 2.5 2.5-5.2L2 12l4.7-2.6L4.2 4.2l5.2 2.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** Pembatas: garis tipis + khatam kecil di tengah. */
export function ArchDivider({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 18" fill="none" aria-hidden="true" className={className}>
      <path d="M6 9h74M120 9h74" stroke={SAGE_DARK} strokeWidth="0.9" opacity="0.7" />
      <path
        d="M100 2l1.9 3.4 3.7-1.8-1.8 3.7L107.5 9l-3.7 1.9 1.8 3.7-3.7-1.8L100 16l-1.9-3.2-3.7 1.8 1.8-3.7L92.5 9l3.7-1.7-1.8-3.7 3.7 1.8L100 2Z"
        stroke={SAGE_DARK}
        strokeWidth="1"
      />
      <circle cx="100" cy="9" r="1.5" fill={SAGE_DARK} />
      <circle cx="86" cy="9" r="1.3" fill={SAGE_DARK} opacity="0.7" />
      <circle cx="114" cy="9" r="1.3" fill={SAGE_DARK} opacity="0.7" />
    </svg>
  );
}

/** Bismillah dalam khat Arab (font Amiri, lihat --font-arabic di index.css). */
export function Bismillah({ className = '' }: OrnamentProps) {
  return (
    <p className={`font-arabic ${className}`} lang="ar" dir="rtl">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </p>
  );
}
