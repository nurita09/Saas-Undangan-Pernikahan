import { useState, type PointerEvent } from 'react';
import { formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo } from '../../../../types/wedding';
import cornerTopLeft from '../../../../assets/theme1/cover-cropped/th1-cover-ataskiri.png';
import cornerTopRight from '../../../../assets/theme1/cover-cropped/th1-cover-ataskanan.png';
import cornerBottomLeft from '../../../../assets/theme1/cover-cropped/th1-cover-bawahkiri.png';
import cornerBottomRight from '../../../../assets/theme1/cover-cropped/th1-cover-bawahkanan.png';

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  /** true saat animasi keluar (cover-exit) berjalan, sebelum section di-unmount. */
  isExiting: boolean;
  onOpen: () => void;
}

interface CornerDeco {
  src: string;
  position: string;
  width: string;
  /** "delay-masuk, delay-melayang" untuk pasangan animasi .corner-float. */
  animationDelay: string;
  /** Kekuatan geser parallax per sumbu (px) -- tanda menentukan arahnya. */
  depth: { x: number; y: number };
}

const CORNERS: CornerDeco[] = [
  { src: cornerTopLeft, position: 'top-0 left-0', width: 'w-[36%]', animationDelay: '100ms, 1500ms', depth: { x: -6, y: -6 } },
  { src: cornerTopRight, position: 'top-0 right-0', width: 'w-[76%]', animationDelay: '250ms, 1650ms', depth: { x: 8, y: -8 } },
  { src: cornerBottomLeft, position: 'bottom-0 left-0', width: 'w-[57%]', animationDelay: '400ms, 1800ms', depth: { x: -8, y: 8 } },
  { src: cornerBottomRight, position: 'bottom-0 right-0', width: 'w-[50%]', animationDelay: '550ms, 1950ms', depth: { x: 6, y: 6 } },
];

export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  isExiting,
  onOpen,
}: CoverSectionProps) {
  // Posisi pointer relatif ke tengah section (-0.5..0.5) untuk efek parallax:
  // dekorasi sudut & foto bergeser beberapa px mengikuti mouse, memberi kesan
  // kedalaman. Hanya untuk pointer mouse -- di layar sentuh nilai ini tetap 0
  // (interaktivitas mobile datang dari ken-burns foto + corner melayang).
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={`relative h-dvh flex flex-col items-center justify-center px-6 py-6 text-center overflow-hidden bg-[var(--color-secondary)] ${
        isExiting ? 'cover-exit' : ''
      }`}
    >
      {/* Dekorasi sudut -- 4 gambar terpisah dipin ke tiap pojok (bukan satu
          background image yang di-stretch/crop) supaya tetap pas di pojok
          berapa pun tinggi viewport-nya. Muncul dengan efek "blooming"
          (fade + scale-in) bertahap, lalu melayang pelan tanpa henti
          (.corner-float di index.css). Wrapper terpisah memegang transform
          parallax karena transform img-nya sudah dipakai animasi. */}
      {CORNERS.map((corner) => (
        <div
          key={corner.position}
          aria-hidden="true"
          className={`parallax-layer pointer-events-none absolute z-0 ${corner.position} ${corner.width}`}
          style={{ transform: `translate(${tilt.x * corner.depth.x}px, ${tilt.y * corner.depth.y}px)` }}
        >
          <img
            src={corner.src}
            alt=""
            className="corner-float select-none w-full h-auto"
            style={{ animationDelay: corner.animationDelay }}
          />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <p className="opacity-0 animate-fade-up [animation-delay:150ms] text-sm tracking-widest font-semibold text-neutral-800">
          The Wedding Of
        </p>
        <h1 className="opacity-0 animate-fade-up [animation-delay:300ms] mt-4 font-script text-4xl md:text-5xl leading-tight text-neutral-800">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>

        <div className="opacity-0 animate-fade-up [animation-delay:450ms] mt-5">
          <div
            className="parallax-layer w-40 h-40 rounded-full border-2 border-[var(--color-primary)] overflow-hidden shadow-lg"
            style={{ transform: `translate(${tilt.x * 12}px, ${tilt.y * 12}px)` }}
          >
            <img src={coverPhotoUrl} alt="Cover" className="kenburns w-full h-full object-cover" />
          </div>
        </div>

        {weddingDate && (
          <p className="opacity-0 animate-fade-up [animation-delay:600ms] mt-5 font-serif italic text-xl text-neutral-600 tracking-widest">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <div className="opacity-0 animate-fade-up [animation-delay:750ms] mt-6 text-sm text-neutral-600 space-y-1">
          <p>Kepada Yth.</p>
          <p>Bapak / Ibu / Saudara / i</p>
        </div>
        <p className="opacity-0 animate-fade-up [animation-delay:800ms] mt-2 font-bold text-lg text-neutral-800">
          {guestName || 'Tamu Undangan'}
        </p>

        <div className="opacity-0 animate-fade-up [animation-delay:950ms] mt-6">
          <button
            type="button"
            onClick={onOpen}
            className="btn-pulse inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium shadow-sm bg-[var(--color-primary)] hover:opacity-90 transition-opacity"
          >
            <span className="text-xl leading-none">✉</span> Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}
