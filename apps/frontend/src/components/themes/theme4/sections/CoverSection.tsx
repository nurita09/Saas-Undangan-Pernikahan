import { useState } from 'react';
import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import {
  ArchDivider,
  Bismillah,
  IslamicArch,
  KhatamStar,
  geometricBackground,
} from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover Islami Modern: bismillah, foto berbingkai lengkung masjid,
 *  salam pembuka Assalamu'alaikum. Section ini permanen (tidak di-unmount)
 *  -- guest bisa scroll balik ke atas untuk melihatnya lagi. */
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
    }, 820);
    window.setTimeout(() => {
      setIsOpening(false);
    }, 1750);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={geometricBackground(0.05)} />
      {/* Lengkungan besar samar di belakang konten */}
      <IslamicArch
        className={`pointer-events-none absolute top-6 left-1/2 h-[88%] w-auto -translate-x-1/2 text-[var(--color-primary)] opacity-15 transition-all duration-[1600ms] ${
          isOpening ? 'scale-105 opacity-25' : 'scale-100'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-secondary)_96%,white)_0%,color-mix(in_oklab,var(--color-primary)_14%,var(--color-secondary))_100%)] transition-all duration-[1450ms] ease-out ${
          isOpening ? 'translate-y-0 opacity-95' : 'translate-y-full opacity-0'
        }`}
        aria-hidden="true"
      >
        <div aria-hidden="true" className="absolute inset-0" style={geometricBackground(0.08)} />
        <IslamicArch className="absolute top-10 left-1/2 h-[78%] w-auto -translate-x-1/2 text-[var(--color-primary)] opacity-18" />
      </div>

      <div
        className={`relative z-30 flex flex-col items-center transition-all duration-[1350ms] ${
          isOpening ? '-translate-y-2 scale-[0.98] opacity-80 blur-[0.5px]' : 'translate-y-0 scale-100 opacity-100 blur-0'
        }`}
      >
        <Bismillah className="opacity-0 animate-fade-in-scale text-2xl md:text-3xl text-[var(--color-primary)]" />

        <p className="opacity-0 animate-fade-up [animation-delay:200ms] mt-5 text-xs uppercase tracking-[0.35em] font-semibold text-neutral-500">
          Undangan Walimatul &lsquo;Ursy
        </p>

        <h1 className="opacity-0 animate-fade-up [animation-delay:350ms] mt-5 font-serif text-4xl md:text-5xl leading-snug text-neutral-800">
          {couple.groom_name} <span className="text-[var(--color-primary)]">&amp;</span> {couple.bride_name}
        </h1>

        {/* Foto berbingkai lengkung masjid (arch): rounded penuh di atas saja */}
        <div className="opacity-0 animate-fade-up [animation-delay:500ms] mt-8 rounded-t-full border-2 border-[var(--color-primary)]/60 p-2 bg-white shadow-sm">
          <div className="h-64 w-48 overflow-hidden rounded-t-full">
            <CoverMedia
              src={coverPhotoUrl}
              alt="Cover"
              className={`w-full h-full object-cover transition-transform duration-[1750ms] ${
                isOpening ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        </div>

        {weddingDate && (
          <p className="opacity-0 animate-fade-up [animation-delay:650ms] mt-7 font-serif text-lg tracking-[0.3em] text-neutral-600">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <ArchDivider className="opacity-0 animate-fade-up [animation-delay:750ms] mt-4 w-48" />

        <p className="opacity-0 animate-fade-up [animation-delay:850ms] mt-4 text-sm text-neutral-500">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <p className="opacity-0 animate-fade-up [animation-delay:950ms] mt-1 font-serif text-lg font-semibold text-neutral-800">
          {guestName || 'Tamu Undangan'}
        </p>

        {isOpened ? (
          <div className="opacity-0 animate-fade-up [animation-delay:1100ms] mt-8 border border-[var(--color-primary)]/35 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-[var(--color-primary)]">
              <KhatamStar className="h-4 w-4" />
              <p className="text-[0.65rem] font-semibold tracking-[0.28em] uppercase">
                Undangan Telah Dibuka
              </p>
              <KhatamStar className="h-4 w-4" />
            </div>
            <p className="mt-2 font-serif text-sm italic text-neutral-500">
              Silakan menikmati rangkaian acara
            </p>
          </div>
        ) : (
          <div className="opacity-0 animate-fade-up [animation-delay:1100ms] mt-8 inline-block">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)] px-8 py-2.5 text-sm font-medium tracking-wide text-white shadow-[0_14px_34px_-22px_color-mix(in_oklab,var(--color-primary)_80%,transparent)] transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-22px_color-mix(in_oklab,var(--color-primary)_90%,transparent)] disabled:cursor-wait disabled:opacity-85"
            >
              <span className="absolute inset-x-5 top-px h-px bg-white/35" aria-hidden="true" />
              <KhatamStar className="relative h-4 w-4" />
              <span className="relative">{isOpening ? 'Membuka...' : 'Buka Undangan'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
