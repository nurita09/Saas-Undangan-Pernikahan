import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import { Divider, Gunungan } from './ornaments';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop bergaya Jawa: foto full-screen + tirai sogan gelap +
 *  gunungan & nama script. Di mobile disembunyikan -- undangan tampil sebagai
 *  "mobile frame" di panel kanan saja. sticky + h-screen supaya tinggi panel
 *  tidak ikut meregang mengikuti panjang konten panel kanan. */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-center overflow-hidden z-10">
      <img src={coverPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--jw-sogan-deep)]/90 via-[var(--jw-sogan-deep)]/35 to-black/20" />

      <div className="relative z-20 max-w-2xl px-8 text-center text-[var(--color-secondary)]">
        <Gunungan className="mx-auto h-28 w-auto text-[var(--jw-gold)]" />
        <p className="mt-5 text-sm font-medium tracking-[0.35em] uppercase text-[var(--jw-gold-soft)]">
          Undangan Pernikahan
        </p>
        <h1 className="mt-4 font-jawa-script text-7xl xl:text-8xl leading-tight drop-shadow-xl">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>
        <Divider className="mt-6" tone="light" />
        {weddingDate && (
          <p className="mt-6 font-jawa-serif text-xl tracking-[0.3em] text-[var(--jw-gold-soft)] drop-shadow-md">
            {formatCoverDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
