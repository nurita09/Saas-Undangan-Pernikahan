import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import { Gunungan, OrnamentDivider, kawungBackground } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  onOpen: () => void;
}

/** Cover adat Jawa: gunungan wayang "membuka lakon", motif kawung samar,
 *  sapaan "Sugeng Rawuh" -- selamat datang. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  onOpen,
}: CoverSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={kawungBackground(0.07)} />
      {/* Bingkai ganda ala pendopo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#C9A227]/60" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-5 border border-[#C9A227]/30" />

      <div className="relative z-10 flex flex-col items-center">
        <Gunungan className="opacity-0 animate-fade-in-scale h-28 w-auto text-[var(--color-primary)]" />

        <p className="opacity-0 animate-fade-up [animation-delay:150ms] mt-4 font-serif italic text-sm tracking-[0.25em] text-[#C9A227]">
          Sugeng Rawuh
        </p>
        <p className="opacity-0 animate-fade-up [animation-delay:250ms] mt-2 text-xs uppercase tracking-[0.35em] font-semibold text-neutral-700">
          Undangan Pernikahan
        </p>

        <h1 className="opacity-0 animate-fade-up [animation-delay:400ms] mt-6 font-script text-5xl md:text-6xl leading-tight text-[var(--color-primary)]">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>

        <div className="opacity-0 animate-fade-up [animation-delay:550ms] mt-8 rounded-full border-2 border-[#C9A227] p-1.5">
          <div className="h-52 w-52 overflow-hidden rounded-full border border-[var(--color-primary)]/40">
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        </div>

        {weddingDate && (
          <p className="opacity-0 animate-fade-up [animation-delay:700ms] mt-7 font-serif text-xl tracking-[0.3em] text-neutral-700">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <OrnamentDivider className="opacity-0 animate-fade-up [animation-delay:800ms] mt-5 w-48" />

        <div className="opacity-0 animate-fade-up [animation-delay:900ms] mt-5 text-sm text-neutral-600 space-y-1">
          <p>Katur dhumateng Bapak/Ibu/Sedherek</p>
        </div>
        <p className="opacity-0 animate-fade-up [animation-delay:950ms] mt-1 font-bold text-lg text-neutral-800">
          {guestName || 'Tamu Undangan'}
        </p>

        <div className="opacity-0 animate-fade-up [animation-delay:1100ms] relative mt-8 inline-block">
          <span className="absolute inset-0 rounded-lg bg-[var(--color-primary)] opacity-60 animate-ping" />
          <button
            type="button"
            onClick={onOpen}
            className="relative inline-flex items-center gap-2 border border-[#C9A227] px-7 py-2.5 rounded-lg text-[var(--color-secondary)] text-sm font-medium tracking-wider bg-[var(--color-primary)] hover:opacity-90 transition"
          >
            ᭼ Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}
