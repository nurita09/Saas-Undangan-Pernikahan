import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { Divider, Gunungan } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  /** true selama animasi keluar (.cover-exit-scale) berjalan -- cover memudar
   *  sambil membesar tipis, lalu di-unmount oleh orkestrator. */
  isExiting: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh bergaya Jawa: gunungan wayang "membuka lakon", sapaan
 *  "Sugeng Rawuh", nama script, foto bundar, dan kartu tamu + tombol buka. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  isExiting,
  onOpen,
}: CoverSectionProps) {
  return (
    <section
      className={`relative h-dvh w-full overflow-hidden bg-[var(--color-secondary)] ${
        isExiting ? 'cover-exit-scale' : ''
      }`.trim()}
    >
      <div className="pointer-events-none absolute inset-3 border border-[var(--jw-gold)]/60" />
      <div className="pointer-events-none absolute inset-5 border border-[var(--jw-gold)]/30" />

      <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-7 py-8 text-center">
        <Gunungan className="h-20 w-auto text-[var(--color-primary)]" />

        <p className="mt-4 font-jawa-script text-3xl text-[var(--jw-gold)]">Sugeng Rawuh</p>
        <p className="mt-1.5 text-[0.65rem] font-medium tracking-[0.35em] text-[var(--jw-ink)] uppercase">
          Undangan Pernikahan
        </p>

        <h1 className="mt-5 font-jawa-script text-6xl leading-[0.95] text-[var(--color-primary)]">
          {couple.groom_name} <span className="text-[var(--jw-gold)]">&amp;</span> {couple.bride_name}
        </h1>

        <div className="relative mt-7">
          <div className="absolute -inset-2.5 rounded-full border border-[var(--jw-gold-soft)]" />
          <div className="size-44 overflow-hidden rounded-full border-2 border-[var(--jw-gold)]/70 shadow-[var(--jw-shadow)]">
            <CoverMedia
              src={coverPhotoUrl}
              alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
              className="size-full object-cover"
            />
          </div>
        </div>

        {weddingDate && (
          <p className="mt-6 font-jawa-serif text-lg tracking-[0.25em] text-[var(--jw-ink)]">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <Divider className="mt-5" />

        <p className="mt-5 text-sm text-[var(--jw-muted)]">Katur dhumateng Bapak/Ibu/Sedherek</p>
        <p className="mt-1 font-jawa-serif text-xl font-semibold text-[var(--color-primary)]">
          {guestName || 'Tamu Undangan'}
        </p>

        <button
          type="button"
          onClick={onOpen}
          className="mt-7 inline-flex items-center gap-3 bg-[var(--jw-sogan-gradient)] px-8 py-3.5 text-[0.6rem] font-medium tracking-[0.3em] text-[var(--color-secondary)] uppercase shadow-[var(--jw-shadow)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="size-1.5 rotate-45 bg-[var(--jw-gold-soft)]" />
          Buka Undangan
        </button>
      </div>
    </section>
  );
}
