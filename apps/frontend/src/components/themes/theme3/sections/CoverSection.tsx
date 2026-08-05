import { useState } from 'react';
import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { DecoFan, GoldDivider, goldGlow } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover dark premium: pendar emas, kipas art-deco, tipografi renggang.
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
    }, 1900);
  };

  return (
    <section className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-[var(--color-secondary)] px-6 py-10 text-center min-[380px]:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-96" style={goldGlow(0.16)} />
      {/* Bingkai garis tipis ganda */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-4 border border-[#D4AF37]/40 transition-all duration-[1600ms] ${
          isOpening ? 'inset-6 opacity-25' : 'opacity-100'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-6 border border-[#D4AF37]/15 transition-all delay-150 duration-[1600ms] ${
          isOpening ? 'inset-9 opacity-20' : 'opacity-100'
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.22)_0%,rgba(16,19,28,0.94)_58%,#05060a_100%)] transition-all duration-[1600ms] ease-out ${
          isOpening ? 'scale-100 opacity-95' : 'scale-110 opacity-0'
        }`}
      />

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-[1500ms] ${
          isOpening ? '-translate-y-3 scale-[0.97] opacity-70 blur-[1px]' : 'translate-y-0 scale-100 opacity-100 blur-0'
        }`}
      >
        <DecoFan className="opacity-0 animate-fade-in-scale h-16 w-auto" />

        <p className="opacity-0 animate-fade-up [animation-delay:200ms] mt-6 text-xs uppercase tracking-[0.5em] font-medium text-[#D4AF37]">
          The Wedding Of
        </p>

        <h1 className="opacity-0 animate-fade-up [animation-delay:350ms] mt-5 font-script text-5xl md:text-6xl leading-tight text-neutral-100">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>

        <div className="opacity-0 animate-fade-up [animation-delay:500ms] mt-9 rounded-full border border-[#D4AF37]/70 p-2 shadow-[0_0_40px_rgba(212,175,55,0.25)]">
          <div className="h-52 w-52 overflow-hidden rounded-full">
            <CoverMedia
              src={coverPhotoUrl}
              alt="Cover"
              className={`w-full h-full object-cover transition-transform duration-[1900ms] ${
                isOpening ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        </div>

        {weddingDate && (
          <p className="opacity-0 animate-fade-up [animation-delay:650ms] mt-8 font-serif text-xl tracking-[0.35em] text-[#D4AF37]">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <GoldDivider className="opacity-0 animate-fade-up [animation-delay:750ms] mt-5 w-52" />

        <div className="opacity-0 animate-fade-up [animation-delay:850ms] mt-5 text-sm text-neutral-400 space-y-1">
          <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
        </div>
        <p className="opacity-0 animate-fade-up [animation-delay:950ms] mt-1 font-serif text-lg font-semibold text-neutral-100">
          {guestName || 'Tamu Undangan'}
        </p>

        {isOpened ? (
          <div className="opacity-0 animate-fade-up [animation-delay:1100ms] mt-9 border border-[#D4AF37]/45 bg-[#1C2030]/80 px-6 py-4 shadow-[0_0_34px_rgba(212,175,55,0.14)] backdrop-blur-sm">
            <p className="text-[0.65rem] font-semibold tracking-[0.36em] text-[#D4AF37] uppercase">
              Undangan Terbuka
            </p>
            <p className="mt-2 font-serif text-sm italic text-neutral-300">
              Silakan menikmati rangkaian acara
            </p>
          </div>
        ) : (
          <div className="opacity-0 animate-fade-up [animation-delay:1100ms] relative mt-9 inline-block">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#D4AF37]/70 bg-[linear-gradient(180deg,#D4AF37_0%,#B99224_100%)] px-8 py-2.5 text-sm font-semibold tracking-widest text-[#10131C] shadow-[0_14px_36px_-20px_rgba(212,175,55,0.75),0_0_22px_rgba(212,175,55,0.14)] transition-all duration-700 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-20px_rgba(212,175,55,0.85),0_0_28px_rgba(212,175,55,0.2)] disabled:cursor-wait disabled:opacity-80"
            >
              <span className="absolute inset-x-5 top-px h-px bg-white/35" aria-hidden="true" />
              <span className="relative">✦ {isOpening ? 'Membuka...' : 'Buka Undangan'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
