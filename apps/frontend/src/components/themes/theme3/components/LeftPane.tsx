import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import CoverMedia from '../../../shared/CoverMedia';
import { DecoFan } from './ornaments';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop dark premium: foto full-screen dengan overlay gelap pekat.
 *  Sticky + h-screen -- alasan sama dengan theme1 (lihat komentarnya). */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-end pb-24 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.5)] z-10">
      <CoverMedia src={coverPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C14]/95 via-[#0A0C14]/40 to-[#0A0C14]/20"></div>
      <div className="relative z-20 text-center text-white max-w-2xl px-8">
        <DecoFan className="mx-auto h-16 w-auto" />
        <p className="mt-5 text-sm tracking-[0.5em] font-medium uppercase text-[#D4AF37]">
          The Wedding Of
        </p>
        <h1 className="mt-3 font-script text-7xl xl:text-8xl leading-tight drop-shadow-xl text-white">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>
        {weddingDate && (
          <p className="mt-6 font-serif text-2xl tracking-[0.35em] text-[#D4AF37] drop-shadow-md">
            {formatCoverDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
