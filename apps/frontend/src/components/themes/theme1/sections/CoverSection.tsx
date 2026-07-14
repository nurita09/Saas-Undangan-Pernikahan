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
  onOpen: () => void;
}

export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  onOpen,
}: CoverSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      {/* Dekorasi sudut -- 4 gambar terpisah dipin ke tiap pojok (bukan satu
          background image yang di-stretch/crop) supaya tetap pas di pojok
          berapa pun tinggi section-nya (min-h-screen bervariasi per device).
          Muncul dengan efek "blooming" (fade + scale-in) bertahap, lalu
          lanjut melayang pelan tanpa henti (lihat .corner-float di index.css). */}
      <img
        src={cornerTopLeft}
        alt=""
        aria-hidden="true"
        className="corner-float pointer-events-none select-none absolute top-0 left-0 w-[36%] h-auto z-0"
        style={{ animationDelay: '100ms, 1500ms' }}
      />
      <img
        src={cornerTopRight}
        alt=""
        aria-hidden="true"
        className="corner-float pointer-events-none select-none absolute top-0 right-0 w-[76%] h-auto z-0"
        style={{ animationDelay: '250ms, 1650ms' }}
      />
      <img
        src={cornerBottomLeft}
        alt=""
        aria-hidden="true"
        className="corner-float pointer-events-none select-none absolute bottom-0 left-0 w-[57%] h-auto z-0"
        style={{ animationDelay: '400ms, 1800ms' }}
      />
      <img
        src={cornerBottomRight}
        alt=""
        aria-hidden="true"
        className="corner-float pointer-events-none select-none absolute bottom-0 right-0 w-[50%] h-auto z-0"
        style={{ animationDelay: '550ms, 1950ms' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <p className="opacity-0 animate-fade-up [animation-delay:150ms] text-sm tracking-widest font-semibold text-neutral-800">
          The Wedding Of
        </p>
        <h1 className="opacity-0 animate-fade-up [animation-delay:300ms] mt-6 font-script text-6xl md:text-7xl leading-tight text-neutral-800">
          {couple.groom_name} &amp; {couple.bride_name}
        </h1>

        <div className="opacity-0 animate-fade-up [animation-delay:450ms] mt-8 w-60 h-60 rounded-full border-2 border-[var(--color-primary)] overflow-hidden relative">
          <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
        </div>

        {weddingDate && (
          <p className="opacity-0 animate-fade-up [animation-delay:600ms] mt-8 font-serif italic text-2xl text-neutral-600 tracking-widest">
            {new Date(weddingDate)
              .toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
              .replace(/\//g, '. ')}
          </p>
        )}

        <div className="opacity-0 animate-fade-up [animation-delay:750ms] mt-10 text-sm text-neutral-600 space-y-1">
          <p>Kepada Yth.</p>
          <p>Bapak / Ibu / Saudara / i</p>
        </div>
        <p className="opacity-0 animate-fade-up [animation-delay:800ms] mt-2 font-bold text-xl text-neutral-800">
          {guestName || 'Tamu Undangan'}
        </p>

        <div className="opacity-0 animate-fade-up [animation-delay:950ms] relative mt-8 inline-block">
          <span className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-75 animate-ping" />
          <button
            type="button"
            onClick={onOpen}
            className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium shadow-sm bg-[var(--color-primary)] hover:opacity-90 transition"
          >
            ✉ Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}
