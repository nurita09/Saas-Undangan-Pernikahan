import { useState } from 'react';
import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { Divider, FloralCorners, MailIcon } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh: foto + tirai gading + nama script, kartu "Kepada Yth."
 *  berisi nama tamu + tombol Buka Undangan. Section ini permanen (tidak
 *  di-unmount) -- guest bisa scroll balik ke atas untuk melihatnya lagi. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  isOpened,
  onOpen,
}: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    window.setTimeout(() => {
      onOpen();
    }, 780);
    window.setTimeout(() => {
      setIsOpening(false);
    }, 1700);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ${
          isOpening ? 'scale-110' : 'scale-105'
        }`}
      />
      <div className="absolute inset-0 bg-[var(--fl-veil)]" />
      <div className="absolute inset-0 bg-black/25" />
      <FloralCorners spots={['tl', 'tr', 'bl', 'br']} size="w-36" opacity="opacity-80" />
      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-secondary)_88%,white)_0%,color-mix(in_oklab,var(--color-primary)_18%,var(--color-secondary))_100%)] transition-all duration-[1450ms] ease-out ${
          isOpening ? 'translate-y-0 opacity-95' : 'translate-y-full opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.18)_62%,rgba(255,255,255,0.35)_100%)]" />
        <FloralCorners spots={['tl', 'br']} size="w-44" opacity="opacity-35" />
      </div>

      <div
        className={`relative z-20 flex h-full flex-col items-center justify-center px-6 text-center transition-all duration-[1300ms] ${
          isOpening ? '-translate-y-2 scale-[0.98] opacity-80 blur-[0.5px]' : 'translate-y-0 scale-100 opacity-100 blur-0'
        }`}
      >
        <p className="label-caps text-white/90">The Wedding Of</p>
        <h1 className="mt-5 font-floral-script text-[2.75rem] leading-[1.1] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
          {couple.groom_name} <span className="font-floral-serif italic">&amp;</span>{' '}
          {couple.bride_name}
        </h1>
        <Divider className="mt-3 brightness-[1.6]" />
        {weddingDate && (
          <p className="font-floral-serif text-base tracking-[0.5em] text-white/95">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <div className="mt-10 w-full max-w-sm rounded-sm border border-[var(--fl-gold)]/40 bg-[var(--color-secondary)]/90 px-7 py-6 backdrop-blur-sm">
          <p className="label-caps text-[var(--fl-muted)]">Kepada Yth.</p>
          <p className="mt-2.5 font-floral-serif text-base text-[var(--fl-muted)]">
            Bapak / Ibu / Saudara / i
          </p>
          <p className="mt-1 font-floral-serif text-2xl text-[var(--color-primary)]">
            {guestName || 'Tamu Undangan'}
          </p>
          {isOpened ? (
            <div
              aria-live="polite"
              className="mt-5 border border-[var(--fl-gold)]/35 bg-white/35 px-5 py-4 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fl-gold)]/45 bg-[var(--fl-card)]/80 text-[var(--color-primary)]">
                <MailIcon className="h-4 w-4" />
              </div>
              <p className="label-caps mt-3 text-[var(--color-primary)]">Undangan Terbuka</p>
              <p className="mt-2 font-floral-serif text-base italic text-[var(--fl-muted)]">
                Silakan lanjutkan menikmati rangkaian acara
              </p>
              <span
                className="mx-auto mt-3 block h-8 w-px bg-gradient-to-b from-[var(--fl-gold)]/70 to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="label-caps mt-5 inline-flex w-full items-center justify-center gap-3 bg-[var(--color-primary)] px-6 py-3.5 text-white shadow-[0_18px_42px_-24px_rgba(74,66,56,0.85)] transition-all duration-700 hover:-translate-y-0.5 hover:bg-[var(--fl-clay)] disabled:cursor-wait disabled:opacity-85 disabled:hover:translate-y-0"
            >
              <MailIcon className="h-4 w-4" />
              {isOpening ? 'Membuka...' : 'Buka Undangan'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
