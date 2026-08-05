import { useState } from 'react';
import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { BatikBand, Divider, Gunungan } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh bergaya Jawa: gunungan wayang "membuka lakon", sapaan
 *  "Sugeng Rawuh", nama script, foto bundar, dan kartu tamu + tombol buka.
 *  Section ini permanen (tidak di-unmount) -- guest bisa scroll balik ke atas
 *  untuk melihatnya lagi. */
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
    }, 900);
    window.setTimeout(() => {
      setIsOpening(false);
    }, 1800);
  };

  return (
    <section className="group relative h-[100svh] w-full overflow-hidden bg-[var(--color-secondary)]">
      <div className="pointer-events-none absolute inset-3 border border-[var(--jw-gold)]/60 transition-all duration-[1400ms] group-hover:inset-4" />
      <div className="pointer-events-none absolute inset-5 border border-[var(--jw-gold)]/30 transition-all delay-150 duration-[1400ms] group-hover:inset-6" />
      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-[var(--jw-sogan-deep)] transition-all duration-[1500ms] ease-out ${
          isOpening ? 'translate-y-0 opacity-90' : 'translate-y-full opacity-0'
        }`}
        aria-hidden="true"
      >
        <BatikBand className="opacity-[0.2] mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.22)_74%)]" />
      </div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-7 py-8 text-center min-[380px]:py-10">
        <Gunungan
          className={`h-16 w-auto text-[var(--color-primary)] transition-all duration-[1200ms] min-[380px]:h-20 ${
            isOpening ? 'scale-110 opacity-80' : 'scale-100 opacity-100'
          }`}
        />

        <p className="mt-3 font-jawa-script text-3xl text-[var(--jw-gold)] min-[380px]:mt-4">
          Sugeng Rawuh
        </p>
        <p className="mt-1.5 text-[0.65rem] font-medium tracking-[0.35em] text-[var(--jw-ink)] uppercase">
          Undangan Pernikahan
        </p>

        <h1
          className={`mt-4 font-jawa-script text-5xl leading-[0.95] text-[var(--color-primary)] transition-all delay-100 duration-[1200ms] min-[380px]:mt-5 min-[380px]:text-6xl ${
            isOpening ? '-translate-y-1 opacity-90' : 'translate-y-0 opacity-100'
          }`}
        >
          {couple.groom_name} <span className="text-[var(--jw-gold)]">&amp;</span> {couple.bride_name}
        </h1>

        <div
          className={`relative mt-5 transition-all delay-150 duration-[1400ms] min-[380px]:mt-7 ${
            isOpening ? 'scale-95 opacity-85' : 'scale-100 opacity-100'
          }`}
        >
          <div className="absolute -inset-2.5 rounded-full border border-[var(--jw-gold-soft)] transition-transform duration-[1600ms] group-hover:scale-105" />
          <div className="size-36 overflow-hidden rounded-full border-2 border-[var(--jw-gold)]/70 shadow-[var(--jw-shadow)] min-[380px]:size-44">
            <CoverMedia
              src={coverPhotoUrl}
              alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
              className="size-full object-cover transition-transform duration-[1800ms] group-hover:scale-105"
            />
          </div>
        </div>

        {weddingDate && (
          <p className="mt-4 font-jawa-serif text-lg tracking-[0.25em] text-[var(--jw-ink)] min-[380px]:mt-6">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <Divider className="mt-4 min-[380px]:mt-5" />

        <p className="mt-4 text-sm text-[var(--jw-muted)] min-[380px]:mt-5">
          Katur dhumateng Bapak/Ibu/Sedherek
        </p>
        <p className="mt-1 font-jawa-serif text-xl font-semibold text-[var(--color-primary)]">
          {guestName || 'Tamu Undangan'}
        </p>

        {isOpened ? (
          <div
            aria-live="polite"
            className="mt-6 w-full max-w-xs border border-[var(--jw-gold)]/45 bg-[var(--jw-card)]/70 px-5 py-4 shadow-[var(--jw-shadow)]"
          >
            <div className="mx-auto flex items-center justify-center gap-2 text-[var(--color-primary)]">
              <span className="size-2 rotate-45 border border-[var(--jw-gold)] bg-[var(--jw-gold-soft)]/40" />
              <p className="text-[0.62rem] font-medium tracking-[0.28em] uppercase">
                Undangan Telah Dibuka
              </p>
              <span className="size-2 rotate-45 border border-[var(--jw-gold)] bg-[var(--jw-gold-soft)]/40" />
            </div>
            <p className="mt-2 font-jawa-serif text-base italic text-[var(--jw-muted)]">
              Matur nuwun, silakan menikmati rangkaian acara
            </p>
          </div>
        ) : (
          <div className="mt-6 w-full max-w-xs border border-[var(--jw-gold)]/35 bg-[var(--jw-sogan-deep)] p-1.5 shadow-[var(--jw-shadow)] min-[380px]:mt-7">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="inline-flex w-full items-center justify-center gap-3 border border-[var(--jw-gold-soft)]/30 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--jw-sogan-deep)_82%,#3b1a08)_0%,var(--jw-sogan-deep)_100%)] px-8 py-3.5 text-[0.6rem] font-semibold tracking-[0.32em] text-[var(--color-secondary)] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all delay-100 duration-[900ms] hover:-translate-y-0.5 hover:bg-[var(--jw-sogan-gradient)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-95 disabled:cursor-wait disabled:opacity-85"
            >
              <span
                className={`size-1.5 rotate-45 bg-[var(--jw-gold-soft)] transition-transform duration-[900ms] ${
                  isOpening ? 'scale-[1.9]' : 'scale-100'
                }`}
              />
              {isOpening ? 'Membuka...' : 'Buka Undangan'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
