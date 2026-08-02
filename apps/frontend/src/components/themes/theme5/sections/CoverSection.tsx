import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { COCOA, Daisy, RetroSun, wavyBackground } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
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
  onOpen,
}: CoverSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={wavyBackground(0.09)} />
      <Daisy className="pointer-events-none absolute top-10 left-6 h-12 w-12 text-[#C75B39] corner-float" />
      <Daisy className="pointer-events-none absolute bottom-16 right-8 h-16 w-16 text-[#E3B23C] corner-float" />

      <div className="relative z-10 flex flex-col items-center">
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
          className="opacity-0 animate-fade-up [animation-delay:500ms] mt-8 rotate-2 rounded-[2rem] border-4 bg-white p-2 shadow-[6px_6px_0_#5C4033] transition-transform duration-500 hover:rotate-0"
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

        <div className="opacity-0 animate-fade-up [animation-delay:1050ms] relative mt-8 inline-block">
          <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-50 animate-ping" />
          <button
            type="button"
            onClick={onOpen}
            className="relative inline-flex items-center gap-2 rounded-full border-2 bg-[var(--color-primary)] px-8 py-3 font-retro text-sm tracking-wider text-white shadow-[4px_4px_0_#5C4033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#5C4033] transition-all"
            style={{ borderColor: COCOA }}
          >
            ☮ Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}
