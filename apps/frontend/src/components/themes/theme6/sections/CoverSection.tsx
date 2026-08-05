import { useState } from 'react';
import { formatLongDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { ChevronDownIcon, Monogram } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh: foto + tirai sage + monogram inisial, nama script di
 *  tengah, tombol "Buka Undangan" di bawah. Section ini permanen (tidak
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
    }, 820);
    window.setTimeout(() => {
      setIsOpening(false);
    }, 1750);
  };

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[var(--sage-deep)]">
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ${
          isOpening ? 'scale-110' : 'scale-100'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--sage-deep)]/55 via-[var(--sage-deep)]/25 to-[var(--sage-deep)]/85" />
      <div
        className={`paper-grain pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-secondary)_86%,white)_0%,color-mix(in_oklab,var(--color-primary)_16%,var(--color-secondary))_100%)] transition-all duration-[1450ms] ease-out ${
          isOpening ? 'translate-y-0 opacity-95' : 'translate-y-full opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.18)_68%,rgba(255,255,255,0.34)_100%)]" />
      </div>

      <div
        className={`paper-grain absolute inset-0 z-20 flex flex-col items-center justify-between px-8 py-8 text-[var(--color-secondary)] transition-all duration-[1300ms] min-[380px]:py-10 ${
          isOpening ? '-translate-y-2 scale-[0.98] opacity-80 blur-[0.5px]' : 'translate-y-0 scale-100 opacity-100 blur-0'
        }`}
      >
        <div className="text-center">
          <p className="text-[0.6rem] tracking-[0.45em] uppercase opacity-85">The Wedding Of</p>
          <Monogram couple={couple} className="mx-auto mt-4 h-20 w-20 text-3xl" />
        </div>

        <div className="text-center">
          <h1 className="font-vintage-script text-4xl leading-snug drop-shadow-sm">
            {couple.groom_name}
            <span className="block my-1 font-vintage text-2xl opacity-80">&amp;</span>
            {couple.bride_name}
          </h1>
          <div className="mx-auto mt-5 h-px w-24 bg-current opacity-50" />
          {weddingDate && (
            <p className="mt-5 text-xs tracking-[0.3em] uppercase">{formatLongDate(weddingDate)}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          {guestName && (
            <div className="text-center">
              <p className="text-[0.6rem] tracking-[0.3em] uppercase opacity-80">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <p className="mt-1.5 font-vintage text-xl">{guestName}</p>
            </div>
          )}
          {isOpened ? (
            <div className="border border-current/35 bg-[var(--color-secondary)]/12 px-6 py-4 text-center backdrop-blur-sm">
              <p className="text-[0.62rem] tracking-[0.28em] uppercase">Undangan Terbuka</p>
              <p className="mt-1 font-vintage text-sm italic opacity-85">
                Silakan menikmati rangkaian acara
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="group flex flex-col items-center gap-2 text-[var(--color-secondary)] disabled:cursor-wait disabled:opacity-85"
            >
              <span className="rounded-full border border-current/50 bg-[var(--color-secondary)]/8 px-6 py-2 text-[0.65rem] tracking-[0.3em] uppercase shadow-[0_18px_42px_-26px_rgba(31,42,34,0.8)] backdrop-blur-sm transition-all duration-700 group-hover:-translate-y-0.5 group-hover:bg-white/15">
                {isOpening ? 'Membuka...' : 'Buka Undangan'}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 opacity-80 transition-transform duration-700 ${
                  isOpening ? 'translate-y-2 opacity-40' : 'animate-bounce'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
