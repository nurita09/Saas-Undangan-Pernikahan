import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { Bismillah } from './ornaments';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop bergaya Islami: foto full-screen + bismillah & nama.
 *  Sticky + h-screen -- alasan sama dengan theme1 (lihat komentarnya). */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-end pb-24 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.3)] z-10">
      <CoverMedia src={coverPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2E3A28]/90 via-[#2E3A28]/25 to-transparent"></div>
      <div className="relative z-20 text-center text-white max-w-2xl px-8">
        <Bismillah className="text-3xl text-white/95 drop-shadow-md" />
        <p className="mt-5 text-sm tracking-[0.35em] font-semibold uppercase text-white/85">
          Undangan Walimatul &lsquo;Ursy
        </p>
        <h1 className="mt-3 font-serif text-6xl xl:text-7xl leading-tight drop-shadow-xl text-white">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>
        {weddingDate && (
          <p className="mt-6 font-serif italic text-2xl tracking-[0.2em] text-white/90 drop-shadow-md">
            {formatCoverDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
