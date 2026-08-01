import { formatLongDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import { ChevronDownIcon, Monogram } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  /** true selama animasi keluar (.cover-exit-up) berjalan -- cover terangkat
   *  ke atas lalu di-unmount oleh orkestrator. */
  isExiting: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh: foto + tirai sage + monogram inisial, nama script di
 *  tengah, tombol "Buka Undangan" di bawah. */
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
      className={`relative h-dvh w-full overflow-hidden ${isExiting ? 'cover-exit-up' : ''}`.trim()}
    >
      <img
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--sage-deep)]/55 via-[var(--sage-deep)]/25 to-[var(--sage-deep)]/85" />

      <div className="paper-grain absolute inset-0 flex flex-col items-center justify-between px-8 py-10 text-[var(--color-secondary)]">
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
          <button
            type="button"
            onClick={onOpen}
            className="group flex flex-col items-center gap-2 text-[var(--color-secondary)]"
          >
            <span className="rounded-full border border-current/50 px-6 py-2 text-[0.65rem] tracking-[0.3em] uppercase backdrop-blur-sm transition-colors group-hover:bg-white/15">
              Buka Undangan
            </span>
            <ChevronDownIcon className="h-5 w-5 animate-bounce opacity-80" />
          </button>
        </div>
      </div>
    </section>
  );
}
