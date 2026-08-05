import { useState } from 'react';
import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { COCOA, Daisy, MUSTARD, OLIVE, RetroSun, wavyBackground } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover retro pop: matahari 70-an, daisy, foto sticker miring, tombol chunky.
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
    }, 760);
    window.setTimeout(() => {
      setIsOpening(false);
    }, 1650);
  };

  return (
    <section className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-[var(--color-secondary)] px-6 py-10 text-center min-[380px]:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={wavyBackground(0.09)} />
      <Daisy className="pointer-events-none absolute top-10 left-6 h-12 w-12 text-[#C75B39] corner-float" />
      <Daisy className="pointer-events-none absolute bottom-16 right-8 h-16 w-16 text-[#E3B23C] corner-float" />
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-all duration-[1300ms] ease-out ${
          isOpening ? 'translate-x-0 opacity-95' : '-translate-x-full opacity-0'
        }`}
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, ${MUSTARD} 0%, var(--color-primary) 48%, ${OLIVE} 100%)`,
        }}
      >
        <div aria-hidden="true" className="absolute inset-0" style={wavyBackground(0.16)} />
        <Daisy className="absolute left-8 top-16 h-20 w-20 rotate-12 text-white/35" />
        <Daisy className="absolute bottom-20 right-8 h-24 w-24 -rotate-12 text-white/30" />
      </div>

      <div
        className={`relative z-30 flex flex-col items-center transition-all duration-[1200ms] ${
          isOpening ? 'rotate-[-1deg] scale-[0.97] opacity-80' : 'rotate-0 scale-100 opacity-100'
        }`}
      >
        <RetroSun className="opacity-0 animate-fade-in-scale h-20 w-auto" />

        <p
          className="opacity-0 animate-fade-up [animation-delay:200ms] mt-5 inline-block -rotate-2 rounded-full border-2 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em]"
          style={{ borderColor: COCOA, color: COCOA, backgroundColor: '#E3B23C' }}
        >
          We&rsquo;re Getting Married!
        </p>

        <h1
          className="opacity-0 animate-fade-up [animation-delay:350ms] mt-6 font-retro text-4xl md:text-5xl leading-tight"
          style={{ color: COCOA }}
        >
          {couple.groom_name} <span className="text-[var(--color-primary)]">&amp;</span> {couple.bride_name}
        </h1>

        {/* Foto ala sticker: border tebal + shadow offset + sedikit miring */}
        <div
          className={`opacity-0 animate-fade-up [animation-delay:500ms] mt-8 rounded-[2rem] border-4 bg-white p-2 shadow-[6px_6px_0_#5C4033] transition-transform duration-[1200ms] hover:rotate-0 ${
            isOpening ? '-rotate-3 scale-105' : 'rotate-2 scale-100'
          }`}
          style={{ borderColor: COCOA }}
        >
          <div className="h-60 w-48 overflow-hidden rounded-[1.5rem]">
            <CoverMedia src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        </div>

        {weddingDate && (
          <p
            className="opacity-0 animate-fade-up [animation-delay:650ms] mt-7 font-retro text-xl tracking-[0.15em]"
            style={{ color: '#8A8B4A' }}
          >
            ✿ {formatCoverDate(weddingDate)} ✿
          </p>
        )}

        <p className="opacity-0 animate-fade-up [animation-delay:800ms] mt-5 text-sm text-neutral-600">
          Untuk kamu yang spesial:
        </p>
        <p
          className="opacity-0 animate-fade-up [animation-delay:900ms] mt-1 font-retro text-xl"
          style={{ color: COCOA }}
        >
          {guestName || 'Tamu Undangan'}
        </p>

        {isOpened ? (
          <div
            className="opacity-0 animate-fade-up [animation-delay:1050ms] mt-8 rounded-[1.5rem] border-2 bg-white px-6 py-4 shadow-[5px_5px_0_#5C4033]"
            style={{ borderColor: COCOA }}
          >
            <p className="font-retro text-sm tracking-[0.18em]" style={{ color: COCOA }}>
              Undangan Sudah Dibuka
            </p>
            <p className="mt-1 text-sm text-neutral-600">Yuk lanjut lihat acaranya</p>
          </div>
        ) : (
          <div className="opacity-0 animate-fade-up [animation-delay:1050ms] mt-8 inline-block">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="relative inline-flex items-center gap-2 rounded-full border-2 bg-[var(--color-primary)] px-8 py-3 font-retro text-sm tracking-wider text-white shadow-[4px_4px_0_#5C4033] transition-all duration-500 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#5C4033] disabled:cursor-wait disabled:opacity-85"
              style={{ borderColor: COCOA }}
            >
              ☮ {isOpening ? 'Membuka...' : 'Buka Undangan'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
