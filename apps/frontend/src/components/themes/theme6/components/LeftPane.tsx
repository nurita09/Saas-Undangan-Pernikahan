import { formatLongDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { Monogram } from './ornaments';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop: foto cover + tirai gradasi sage tua + monogram inisial.
 *  Di mobile disembunyikan -- undangan tampil sebagai "mobile frame" di panel
 *  kanan saja (pola sama dengan theme1-5). sticky + h-screen supaya tinggi
 *  panel tidak ikut meregang mengikuti panjang konten panel kanan. */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-center overflow-hidden z-10">
      <CoverMedia src={coverPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--sage-deep)]/60 via-[var(--sage-deep)]/30 to-[var(--sage-deep)]/85" />

      <div className="relative z-20 text-center text-[var(--color-secondary)] max-w-2xl px-8">
        <p className="text-xs tracking-[0.45em] uppercase opacity-85">The Wedding Of</p>
        <Monogram couple={couple} className="mx-auto mt-6 h-28 w-28 text-4xl" />
        <h1 className="mt-8 font-vintage-script text-6xl xl:text-7xl leading-tight drop-shadow-sm">
          {couple.groom_name}
          <span className="block my-2 font-vintage text-3xl opacity-80">&amp;</span>
          {couple.bride_name}
        </h1>
        <div className="mx-auto mt-8 h-px w-24 bg-current opacity-50" />
        {weddingDate && (
          <p className="mt-8 text-sm tracking-[0.3em] uppercase opacity-90">
            {formatLongDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
