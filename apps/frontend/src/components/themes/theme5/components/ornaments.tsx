import type { CSSProperties } from 'react';

// Ornamen Theme 5 (Retro/Vintage Pop 70-an): matahari retro, pelangi lengkung,
// bunga daisy, dan garis-garis groovy bergelombang. SVG murni tanpa asset.

// Palet bumi hangat 70-an -- terracotta jadi --color-primary dari DB,
// sisanya aksen tetap supaya komposisinya konsisten.
export const MUSTARD = '#E3B23C';
export const TERRACOTTA = '#C75B39';
export const OLIVE = '#8A8B4A';
export const COCOA = '#5C4033';

/** Garis gelombang groovy berulang sebagai background samar. */
export function wavyBackground(opacity = 0.08): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'>
    <g fill='none' stroke-width='2.5'>
      <path d='M0 10 Q10 0 20 10 T40 10 T60 10 T80 10' stroke='${TERRACOTTA}'/>
      <path d='M0 22 Q10 12 20 22 T40 22 T60 22 T80 22' stroke='${MUSTARD}'/>
      <path d='M0 34 Q10 24 20 34 T40 34 T60 34 T80 34' stroke='${OLIVE}'/>
    </g>
  </svg>`;
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: '80px 40px',
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

/** Matahari retro 70-an: setengah lingkaran bergaris + sinar. */
export function RetroSun({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 70" fill="none" aria-hidden="true" className={className}>
      <path d="M25 62a35 35 0 0 1 70 0" fill={MUSTARD} />
      <path d="M35 62a25 25 0 0 1 50 0" fill={TERRACOTTA} />
      <path d="M45 62a15 15 0 0 1 30 0" fill={OLIVE} />
      <path d="M60 14V4M32 24l-7-7M88 24l7-7M20 44H8M112 44h-12" stroke={COCOA} strokeWidth="3" strokeLinecap="round" />
      <path d="M14 62h92" stroke={COCOA} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Pelangi lengkung retro (tiga busur warna bumi). */
export function RetroArches({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 100 52" fill="none" aria-hidden="true" className={className}>
      <path d="M4 50a46 46 0 0 1 92 0" stroke={TERRACOTTA} strokeWidth="7" strokeLinecap="round" />
      <path d="M18 50a32 32 0 0 1 64 0" stroke={MUSTARD} strokeWidth="7" strokeLinecap="round" />
      <path d="M32 50a18 18 0 0 1 36 0" stroke={OLIVE} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/** Bunga daisy flower-power. */
export function Daisy({ className = '' }: OrnamentProps) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      {petals.map((angle) => (
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
      <circle cx="20" cy="20" r="6" fill={MUSTARD} stroke={COCOA} strokeWidth="1.5" />
    </svg>
  );
}

/** Pembatas gelombang groovy tiga warna. */
export function GroovyDivider({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 8 Q16 0 28 8 T52 8 T76 8 T100 8 T124 8 T148 8 T172 8 T196 8" stroke={TERRACOTTA} strokeWidth="3" strokeLinecap="round" />
      <path d="M4 17 Q16 9 28 17 T52 17 T76 17 T100 17 T124 17 T148 17 T172 17 T196 17" stroke={MUSTARD} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
