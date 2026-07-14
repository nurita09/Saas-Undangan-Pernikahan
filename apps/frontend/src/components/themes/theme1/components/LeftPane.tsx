import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop: foto cover full-screen + nama pasangan. Di mobile
 *  disembunyikan (hidden lg:flex) -- undangan tampil sebagai "mobile frame"
 *  di panel kanan saja. */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    /* sticky + h-screen -- tanpa ini, tinggi panel ikut meregang mengikuti
       tinggi TOTAL konten Right Pane (bisa ribuan px setelah semua section
       terbuka), dan object-cover jadi men-scale foto sebesar itu juga
       (efek "zoom" raksasa). Sticky mengunci panel tetap 1 layar penuh
       apa pun panjang konten di sebelahnya. */
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-end pb-24 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.3)] z-10">
      <img src={coverPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
      <div className="relative z-20 text-center text-white max-w-2xl px-8">
        <p className="text-sm tracking-[0.3em] font-semibold uppercase mb-4 opacity-90 text-white/90">
          The Wedding Of
        </p>
        <h1 className="font-script text-7xl xl:text-8xl leading-tight drop-shadow-xl text-white">
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
