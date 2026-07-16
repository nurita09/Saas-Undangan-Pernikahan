import type { CSSProperties } from 'react';

// Ornamen art-deco untuk Theme 3 (Modern Elegant / Dark) -- garis tipis emas,
// wajik, dan kipas deco. Semuanya SVG inline tanpa file asset.

/** Emas murni khas undangan premium -- konsisten di semua ornamen tema ini. */
export const GOLD = '#D4AF37';

/** Permukaan kartu di atas latar gelap (sedikit lebih terang dari background). */
export const SURFACE = '#1C2030';

/** Pendar emas radial samar -- ambience mewah di belakang konten section. */
export function goldGlow(opacity = 0.12): CSSProperties {
  return {
    background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${GOLD}, transparent 70%)`,
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

/** Kipas art-deco (sunburst) -- mahkota cover, kesan Gatsby/ballroom malam. */
export function DecoFan({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 160 80" fill="none" aria-hidden="true" className={className}>
      <path d="M80 78V10" stroke={GOLD} strokeWidth="1.5" />
      <path d="M80 78 44 18M80 78l36-60M80 78 18 34m62 44 62-44M80 78 6 56m74 22 74-22" stroke={GOLD} strokeWidth="1" opacity="0.7" />
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
export function GoldDivider({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 220 14" fill="none" aria-hidden="true" className={className}>
      <path d="M4 7h86M130 7h86" stroke={GOLD} strokeWidth="0.8" opacity="0.8" />
      <path d="M110 1.5 115.5 7 110 12.5 104.5 7 110 1.5Z" stroke={GOLD} strokeWidth="1" />
      <path d="M110 4.2 112.8 7 110 9.8 107.2 7l2.8-2.8Z" fill={GOLD} />
      <circle cx="96" cy="7" r="1.3" fill={GOLD} opacity="0.8" />
      <circle cx="124" cy="7" r="1.3" fill={GOLD} opacity="0.8" />
    </svg>
  );
}

/** Sudut art-deco: garis siku ganda + aksen tangga khas deco. */
export function DecoCorner({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className={className}>
      <path d="M2 42V10a8 8 0 0 1 8-8h32" stroke={GOLD} strokeWidth="1.4" />
      <path d="M9 42V16a7 7 0 0 1 7-7h26" stroke={GOLD} strokeWidth="0.8" opacity="0.55" />
      <path d="M2 22h7M22 2v7" stroke={GOLD} strokeWidth="1" opacity="0.8" />
      <path d="M13 13 2 2" stroke={GOLD} strokeWidth="1" />
      <circle cx="15" cy="15" r="1.8" fill={GOLD} />
    </svg>
  );
}
