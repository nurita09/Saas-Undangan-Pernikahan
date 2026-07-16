import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import { ArchDivider, Bismillah, IslamicArch, geometricBackground } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  onOpen: () => void;
}

/** Cover Islami Modern: bismillah, foto berbingkai lengkung masjid,
 *  salam pembuka Assalamu'alaikum. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  onOpen,
}: CoverSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={geometricBackground(0.05)} />
      {/* Lengkungan besar samar di belakang konten */}
      <IslamicArch className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 h-[88%] w-auto text-[var(--color-primary)] opacity-15" />

      <div className="relative z-10 flex flex-col items-center">
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
            <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
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

        <div className="opacity-0 animate-fade-up [animation-delay:1100ms] relative mt-8 inline-block">
          <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-60 animate-ping" />
          <button
            type="button"
            onClick={onOpen}
            className="relative inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-2.5 text-sm font-medium tracking-wide text-white hover:opacity-90 transition"
          >
            ☪ Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}
