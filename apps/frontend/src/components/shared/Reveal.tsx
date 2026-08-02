import type { CSSProperties, ReactNode } from 'react';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

export type RevealVariant = 'up' | 'left' | 'right' | 'zoom' | 'blur' | 'bloom';

interface RevealProps {
  children: ReactNode;
  /** Arah/gaya kemunculan -- kelas CSS-nya ada di index.css (.reveal-*). */
  variant?: RevealVariant;
  /** Delay ms sebelum transisi mulai -- untuk efek stagger antar elemen sejajar. */
  delay?: number;
  className?: string;
}

/**
 * Wrapper animasi scroll-reveal (dipakai lintas tema): anak-anaknya tersembunyi
 * sampai wrapper masuk viewport, lalu muncul sesuai varian
 * (fade-up/left/right/zoom/blur). Berulang setiap kali masuk/keluar viewport --
 * scroll turun tampil, scroll naik lalu turun lagi akan tampil ulang.
 */
export default function Reveal({ children, variant = 'up', delay = 0, className = '' }: RevealProps) {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>();

  const style: CSSProperties | undefined = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={`reveal reveal-${variant} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
