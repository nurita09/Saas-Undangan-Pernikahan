import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import { RetroSun } from './ornaments';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop retro pop: foto full-screen + matahari 70-an & nama.
 *  Sticky + h-screen -- alasan sama dengan theme1 (lihat komentarnya). */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-end pb-24 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.3)] z-10">
      <img src={coverPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3D2A1E]/90 via-[#3D2A1E]/25 to-transparent"></div>
      <div className="relative z-20 text-center text-white max-w-2xl px-8">
        <RetroSun className="mx-auto h-20 w-auto" />
        <p className="mt-5 inline-block -rotate-2 rounded-full border-2 border-white bg-[#E3B23C] px-5 py-1 text-sm font-bold uppercase tracking-[0.2em] text-[#5C4033]">
          We&rsquo;re Getting Married!
        </p>
        <h1 className="mt-5 font-retro text-6xl xl:text-7xl leading-tight drop-shadow-xl text-white">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>
        {weddingDate && (
          <p className="mt-6 font-retro text-2xl tracking-[0.15em] text-[#E3B23C] drop-shadow-md">
            ✿ {formatCoverDate(weddingDate)} ✿
          </p>
        )}
      </div>
    </div>
  );
}
