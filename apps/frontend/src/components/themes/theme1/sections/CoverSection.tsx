import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { Divider, FloralCorners, MailIcon } from '../components/ornaments';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh: foto + tirai gading + nama script, kartu "Kepada Yth."
 *  berisi nama tamu + tombol Buka Undangan. Section ini permanen (tidak
 *  di-unmount) -- guest bisa scroll balik ke atas untuk melihatnya lagi. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  isOpened,
  onOpen,
}: CoverSectionProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />
      <div className="absolute inset-0 bg-[var(--fl-veil)]" />
      <div className="absolute inset-0 bg-black/25" />
      <FloralCorners spots={['tl', 'tr', 'bl', 'br']} size="w-36" opacity="opacity-80" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="label-caps text-white/90">The Wedding Of</p>
        <h1 className="mt-5 font-floral-script text-[2.75rem] leading-[1.1] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
          {couple.groom_name} <span className="font-floral-serif italic">&amp;</span>{' '}
          {couple.bride_name}
        </h1>
        <Divider className="mt-3 brightness-[1.6]" />
        {weddingDate && (
          <p className="font-floral-serif text-base tracking-[0.5em] text-white/95">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <div className="mt-10 w-full max-w-sm rounded-sm border border-[var(--fl-gold)]/40 bg-[var(--color-secondary)]/90 px-7 py-6 backdrop-blur-sm">
          <p className="label-caps text-[var(--fl-muted)]">Kepada Yth.</p>
          <p className="mt-2.5 font-floral-serif text-base text-[var(--fl-muted)]">
            Bapak / Ibu / Saudara / i
          </p>
          <p className="mt-1 font-floral-serif text-2xl text-[var(--color-primary)]">
            {guestName || 'Tamu Undangan'}
          </p>
          {isOpened ? (
            <div
              aria-live="polite"
              className="mt-5 border border-[var(--fl-gold)]/35 bg-white/35 px-5 py-4 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fl-gold)]/45 bg-[var(--fl-card)]/80 text-[var(--color-primary)]">
                <MailIcon className="h-4 w-4" />
              </div>
              <p className="label-caps mt-3 text-[var(--color-primary)]">Undangan Terbuka</p>
              <p className="mt-2 font-floral-serif text-base italic text-[var(--fl-muted)]">
                Silakan lanjutkan menikmati rangkaian acara
              </p>
              <span
                className="mx-auto mt-3 block h-8 w-px bg-gradient-to-b from-[var(--fl-gold)]/70 to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpen}
              className="label-caps mt-5 inline-flex w-full items-center justify-center gap-3 bg-[var(--color-primary)] px-6 py-3.5 text-white transition-colors duration-500 hover:bg-[var(--fl-clay)]"
            >
              <MailIcon className="h-4 w-4" />
              Buka Undangan
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
