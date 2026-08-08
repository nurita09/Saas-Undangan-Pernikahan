import { useState } from "react";
import type { CoupleInfo } from "../../../../types/wedding";
import { formatCoverDate } from "../../../../utils/formatDate";
import CoverMedia from "../../../shared/CoverMedia";
import {
  ArchDivider,
  Bismillah,
  IslamicArch,
  KhatamStar,
  MailIcon,
} from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover foto penuh dengan framing mihrab dan salam pembuka. */
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
    window.setTimeout(onOpen, 720);
    window.setTimeout(() => setIsOpening(false), 1650);
  };

  return (
    <section className="relative flex h-[100svh] min-h-[620px] flex-col items-center justify-center overflow-hidden px-6 py-8 text-center text-white">
      <CoverMedia
        src={coverPhotoUrl}
        alt="Potret pernikahan"
        className={`absolute inset-0 size-full object-cover transition-transform duration-[1800ms] ${
          isOpening ? "scale-110" : "scale-100"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--im-deep)] via-[var(--im-deep)]/68 to-black/25" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(183,121,99,0.22),transparent_48%)]" />
      <IslamicArch
        className={`pointer-events-none absolute left-1/2 top-5 h-[94%] w-auto -translate-x-1/2 text-white/20 transition-all duration-[1500ms] ${
          isOpening ? "scale-105 text-white/30" : "scale-100"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-[var(--im-deep)] transition-all duration-[1300ms] ${
          isOpening ? "translate-y-0 opacity-90" : "translate-y-full opacity-0"
        }`}
      />

      <div
        className={`relative z-30 flex w-full max-w-sm flex-col items-center transition-all duration-[1200ms] ${
          isOpening
            ? "-translate-y-2 scale-[0.98] opacity-80"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <Bismillah className="animate-fade-in-scale text-[1.7rem] text-white/90 opacity-0" />
        <p className="mt-5 animate-fade-up text-[0.58rem] font-semibold uppercase tracking-[0.42em] text-white/70 opacity-0 [animation-delay:180ms]">
          Undangan Walimatul &lsquo;Ursy
        </p>
        <h1 className="mt-4 flex max-w-full animate-fade-up flex-wrap justify-center gap-x-2 font-serif text-[2.9rem] leading-[1.08] text-white opacity-0 [animation-delay:320ms]">
          <span className="whitespace-nowrap">{couple.groom_name}</span>
          <span className="whitespace-nowrap text-[var(--im-clay)]">&amp;</span>
          <span className="whitespace-nowrap">{couple.bride_name}</span>
        </h1>
        {weddingDate && (
          <p className="mt-6 animate-fade-up font-serif text-base tracking-[0.22em] text-white/85 opacity-0 [animation-delay:480ms]">
            {formatCoverDate(weddingDate)}
          </p>
        )}
        <ArchDivider className="mt-5 w-44 animate-fade-up text-white/60 opacity-0 [animation-delay:600ms]" />

        <div className="mt-5 animate-fade-up opacity-0 [animation-delay:720ms]">
          <p className="text-xs text-white/65">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <p className="mt-1 break-words font-serif text-lg text-white">
            {guestName || "Tamu Undangan"}
          </p>
        </div>

        {isOpened ? (
          <div className="mt-7 animate-fade-up border border-white/25 bg-black/15 px-5 py-3 opacity-0 backdrop-blur-sm [animation-delay:850ms]">
            <p className="flex items-center justify-center gap-2 text-[0.56rem] font-semibold uppercase tracking-[0.28em] text-white/80">
              <KhatamStar className="h-4 w-4 text-[var(--im-clay)]" />
              Undangan Telah Dibuka
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="mt-7 inline-flex min-h-12 animate-fade-up items-center gap-2 border border-white/35 bg-white px-6 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[var(--im-deep)] opacity-0 shadow-[0_20px_48px_-28px_rgba(0,0,0,0.7)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 [animation-delay:850ms]"
          >
            <MailIcon className="h-4 w-4" />
            {isOpening ? "Membuka..." : "Buka Undangan"}
          </button>
        )}
      </div>
    </section>
  );
}
