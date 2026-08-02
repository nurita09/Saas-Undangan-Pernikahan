import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import { Divider, FloralCorners } from './ornaments';

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panel kiri desktop: foto cover + tirai gading (veil) + ornamen bunga di
 *  sudut. Di mobile disembunyikan -- undangan tampil sebagai "mobile frame"
 *  di panel kanan saja. sticky + h-screen supaya tinggi panel tidak ikut
 *  meregang mengikuti panjang konten panel kanan. */
export default function LeftPane({ couple, weddingDate, coverPhotoUrl }: LeftPaneProps) {
  return (
    <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen relative flex-col items-center justify-center overflow-hidden z-10">
      <img
        src={coverPhotoUrl}
        alt="Cover"
        className="absolute inset-0 w-full h-full scale-105 object-cover"
      />
      <div className="absolute inset-0 bg-[var(--fl-veil)]" />
      <div className="absolute inset-0 bg-black/25" />
      <FloralCorners spots={['tl', 'tr', 'bl', 'br']} size="w-56" opacity="opacity-80" />

      <div className="relative z-20 max-w-2xl px-8 text-center text-white">
        <p className="label-caps text-white/90">The Wedding Of</p>
        <h1 className="mt-6 font-floral-script text-6xl xl:text-7xl leading-[1.1] drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
          {couple.groom_name} <span className="font-floral-serif italic">&amp;</span>{' '}
          {couple.bride_name}
        </h1>
        <Divider className="mt-4 brightness-[1.6]" />
        {weddingDate && (
          <p className="font-floral-serif text-lg tracking-[0.5em] text-white/95">
            {formatCoverDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
