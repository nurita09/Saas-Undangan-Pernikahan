import type { CSSProperties } from 'react';

// Ornamen khas Jawa untuk Theme 2 -- semuanya SVG inline/data-URI, tanpa file
// asset, supaya warnanya gampang diselaraskan dan tidak menambah request HTTP.

/** Warna emas aksen tema (kuningan/prada) -- dipakai konsisten di semua ornamen. */
export const GOLD = '#C9A227';

/**
 * Motif batik kawung (empat lingkaran lonjong mengelilingi titik) sebagai
 * background berulang bernuansa halus. Pakai sebagai `style` elemen overlay.
 */
export function kawungBackground(opacity = 0.08): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'>
    <g fill='none' stroke='${GOLD}' stroke-width='1.2'>
      <ellipse cx='28' cy='7' rx='9' ry='13'/>
      <ellipse cx='28' cy='49' rx='9' ry='13'/>
      <ellipse cx='7' cy='28' rx='13' ry='9'/>
      <ellipse cx='49' cy='28' rx='13' ry='9'/>
      <circle cx='28' cy='28' r='2.5' fill='${GOLD}'/>
    </g>
  </svg>`;
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundSize: '56px 56px',
    opacity,
  };
}

interface OrnamentProps {
  className?: string;
}

/**
 * Siluet gunungan wayang (kayon) -- simbol pembuka lakon, pas untuk cover
 * "membuka" undangan. Digambar sederhana: bentuk daun meruncing + sulur.
 */
export function Gunungan({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 160" fill="none" aria-hidden="true" className={className}>
      <path
        d="M60 4C70 26 92 40 98 64c6 24-6 44-14 56-7 11-16 24-24 36-8-12-17-25-24-36-8-12-20-32-14-56C28 40 50 26 60 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path
        d="M60 26c6 14 20 24 24 40 4 17-4 31-10 40-5 8-10 15-14 22-4-7-9-14-14-22-6-9-14-23-10-40 4-16 18-26 24-40Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M60 52c0 18 0 52 0 74" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M60 70c-7-5-14-3-16 3 6 3 12 1 16-3Zm0 18c7-5 14-3 16 3-6 3-12 1-16-3Zm0 18c-7-5-14-3-16 3 6 3 12 1 16-3Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** Pembatas antar-bagian: garis + belah ketupat (wajik) emas di tengah. */
export function OrnamentDivider({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 8h70M122 8h70" stroke={GOLD} strokeWidth="1" />
      <path d="M100 1 107 8l-7 7-7-7 7-7Z" stroke={GOLD} strokeWidth="1.2" />
      <path d="M100 4.5 103.5 8 100 11.5 96.5 8l3.5-3.5Z" fill={GOLD} />
      <circle cx="82" cy="8" r="1.6" fill={GOLD} />
      <circle cx="118" cy="8" r="1.6" fill={GOLD} />
    </svg>
  );
}

/** Bingkai sudut ukiran sulur -- taruh di pojok card (absolute + rotate). */
export function CornerCarving({ className = '' }: OrnamentProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2 46V14C2 7 7 2 14 2h32"
        stroke={GOLD}
        strokeWidth="1.6"
      />
      <path
        d="M10 46v-24c0-7 5-12 12-12h24"
        stroke={GOLD}
        strokeWidth="1"
        opacity="0.6"
      />
      <path d="M14 2c4 4 4 8 0 12M2 14c4 4 8 4 12 0" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="10" cy="10" r="2" fill={GOLD} />
    </svg>
  );
}
