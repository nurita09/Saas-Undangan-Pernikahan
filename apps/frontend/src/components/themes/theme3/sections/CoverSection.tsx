import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { DecoFan, GoldDivider, goldGlow } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  onOpen: () => void;
}

/** Cover dark premium: pendar emas, kipas art-deco, tipografi renggang. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  onOpen,
}: CoverSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-96" style={goldGlow(0.16)} />
      {/* Bingkai garis tipis ganda */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 border border-[#D4AF37]/40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-6 border border-[#D4AF37]/15" />

      <div className="relative z-10 flex flex-col items-center">
        <DecoFan className="opacity-0 animate-fade-in-scale h-16 w-auto" />

        <p className="opacity-0 animate-fade-up [animation-delay:200ms] mt-6 text-xs uppercase tracking-[0.5em] font-medium text-[#D4AF37]">
          The Wedding Of
        </p>

        <h1 className="opacity-0 animate-fade-up [animation-delay:350ms] mt-5 font-script text-5xl md:text-6xl leading-tight text-neutral-100">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>

        <div className="opacity-0 animate-fade-up [animation-delay:500ms] mt-9 rounded-full border border-[#D4AF37]/70 p-2 shadow-[0_0_40px_rgba(212,175,55,0.25)]">
          <div className="h-52 w-52 overflow-hidden rounded-full">
            <CoverMedia src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
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

        <div className="opacity-0 animate-fade-up [animation-delay:1100ms] relative mt-9 inline-block">
          <span className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-50 animate-ping" />
          <button
            type="button"
            onClick={onOpen}
            className="relative inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-2.5 text-sm font-semibold tracking-widest text-[#10131C] hover:opacity-90 transition"
          >
            ✦ Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}
