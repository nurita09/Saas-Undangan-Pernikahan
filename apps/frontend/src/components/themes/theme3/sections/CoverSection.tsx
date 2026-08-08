import { useState } from "react";
import { formatCoverDate } from "../../../../utils/formatDate";
import type { CoupleInfo } from "../../../../types/wedding";
import CoverMedia from "../../../shared/CoverMedia";
import {
  DecoFan,
  GoldDivider,
  MailIcon,
  goldGlow,
} from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover dark premium: pendar emas, kipas art-deco, tipografi renggang.
 *  Section ini permanen (tidak di-unmount) -- guest bisa scroll balik ke atas
 *  untuk melihatnya lagi. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  isOpened,
  onOpen,
}: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    window.setTimeout(() => {
      onOpen();
    }, 900);
    window.setTimeout(() => {
      setIsOpening(false);
    }, 1900);
  };

  return (
    <section className="noir-section relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center min-[380px]:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={goldGlow(0.16)}
      />
      {/* Bingkai garis tipis ganda */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-4 border border-[var(--color-primary)]/40 transition-all duration-[1600ms] ${
          isOpening ? "inset-6 opacity-25" : "opacity-100"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-6 border border-[var(--color-primary)]/15 transition-all delay-150 duration-[1600ms] ${
          isOpening ? "inset-9 opacity-20" : "opacity-100"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_18%,var(--dk-wine))_0%,color-mix(in_oklab,var(--color-secondary)_94%,black)_72%)] transition-all duration-[1600ms] ease-out ${
          isOpening ? "scale-100 opacity-95" : "scale-110 opacity-0"
        }`}
      />

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-[1500ms] ${
          isOpening
            ? "-translate-y-3 scale-[0.97] opacity-70 blur-[1px]"
            : "translate-y-0 scale-100 opacity-100 blur-0"
        }`}
      >
        <DecoFan className="opacity-0 animate-fade-in-scale h-16 w-auto" />

        <p className="opacity-0 animate-fade-up [animation-delay:200ms] mt-6 text-xs uppercase tracking-[0.5em] font-medium text-[var(--color-primary)]">
          The Wedding Of
        </p>

        <h1 className="opacity-0 animate-fade-up [animation-delay:350ms] mt-5 max-w-[21rem] break-words font-script text-5xl leading-tight text-[var(--dk-ivory)] md:text-6xl">
          {couple.groom_name}
          <span className="mx-1 text-[var(--color-primary)]">&amp;</span>
          {couple.bride_name}
        </h1>

        <div className="opacity-0 animate-fade-up [animation-delay:500ms] mt-9 rounded-full border border-[var(--color-primary)]/70 p-2 shadow-[0_22px_55px_-32px_rgba(0,0,0,0.9)]">
          <div className="h-52 w-52 overflow-hidden rounded-full">
            <CoverMedia
              src={coverPhotoUrl}
              alt="Cover"
              className={`w-full h-full object-cover transition-transform duration-[1900ms] ${
                isOpening ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        </div>

        {weddingDate && (
          <p className="opacity-0 animate-fade-up [animation-delay:650ms] mt-8 font-serif text-xl tracking-[0.35em] text-[var(--color-primary)]">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <GoldDivider className="opacity-0 animate-fade-up [animation-delay:750ms] mt-5 w-52" />

        <div className="opacity-0 animate-fade-up [animation-delay:850ms] mt-5 text-sm text-neutral-400 space-y-1">
          <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
        </div>
        <p className="opacity-0 animate-fade-up [animation-delay:950ms] mt-1 font-serif text-lg font-semibold text-neutral-100">
          {guestName || "Tamu Undangan"}
        </p>

        {isOpened ? (
          <div className="noir-card opacity-0 animate-fade-up [animation-delay:1100ms] mt-9 px-6 py-4 backdrop-blur-sm">
            <p className="text-[0.65rem] font-semibold tracking-[0.36em] text-[var(--color-primary)] uppercase">
              Undangan Terbuka
            </p>
            <p className="mt-2 font-serif text-sm italic text-neutral-300">
              Silakan menikmati rangkaian acara
            </p>
          </div>
        ) : (
          <div className="opacity-0 animate-fade-up [animation-delay:1100ms] relative mt-9 inline-block">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="relative inline-flex items-center gap-3 overflow-hidden rounded-[4px] border border-[var(--color-primary)]/70 bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold tracking-widest text-[var(--color-secondary)] shadow-[0_18px_42px_-24px_rgba(0,0,0,0.9)] transition-all duration-700 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
            >
              <span
                className="absolute inset-x-5 top-px h-px bg-white/35"
                aria-hidden="true"
              />
              <MailIcon className="relative h-4 w-4" />
              <span className="relative">
                {isOpening ? "Membuka..." : "Buka Undangan"}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
