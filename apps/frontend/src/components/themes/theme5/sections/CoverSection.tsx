import { useState } from "react";
import type { CoupleInfo } from "../../../../types/wedding";
import { formatCoverDate } from "../../../../utils/formatDate";
import CoverMedia from "../../../shared/CoverMedia";
import {
  Daisy,
  MailIcon,
  RetroSun,
  halftoneBackground,
  stripeBackground,
} from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover poster foto penuh dengan blok warna dan detail cetak. */
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
    window.setTimeout(onOpen, 700);
    window.setTimeout(() => setIsOpening(false), 1550);
  };

  return (
    <section className="relative flex h-[100svh] min-h-[620px] flex-col justify-between overflow-hidden px-6 py-7 text-white">
      <CoverMedia
        src={coverPhotoUrl}
        alt="Potret pernikahan"
        className={`absolute inset-0 size-full object-cover transition-transform duration-[1700ms] ${isOpening ? "scale-110" : "scale-100"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--rp-ink)] via-[var(--rp-ink)]/55 to-black/15" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={halftoneBackground(0.1)}
      />
      <div
        className="absolute right-0 top-0 h-40 w-24 bg-[var(--rp-yellow)]/90"
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={stripeBackground(0.18)} />
      </div>
      <Daisy className="absolute right-5 top-8 h-14 w-14 rotate-12 text-[var(--color-primary)]" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-[var(--rp-teal)] transition-all duration-[1200ms] ${
          isOpening ? "translate-x-0 opacity-95" : "-translate-x-full opacity-0"
        }`}
      />

      <div className="relative z-30 flex items-start justify-between">
        <div>
          <p className="animate-fade-up text-[0.55rem] font-bold uppercase tracking-[0.26em] text-white/70 opacity-0">
            Wedding Invitation
          </p>
          <p className="mt-1 animate-fade-up font-retro text-sm text-[var(--rp-yellow)] opacity-0 [animation-delay:100ms]">
            No. 05 / Special Edition
          </p>
        </div>
        <RetroSun className="mr-1 h-14 w-auto animate-fade-in-scale text-[var(--rp-ink)] opacity-0" />
      </div>

      <div
        className={`relative z-30 transition-all duration-[1100ms] ${
          isOpening
            ? "-translate-y-2 scale-[0.98] opacity-80"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <p className="animate-fade-up text-[0.58rem] font-bold uppercase tracking-[0.28em] text-[var(--rp-yellow)] opacity-0 [animation-delay:200ms]">
          We&rsquo;re Getting Married
        </p>
        <h1 className="mt-3 flex max-w-full animate-fade-up flex-wrap gap-x-2 font-retro text-[3.25rem] leading-[0.98] text-white opacity-0 [animation-delay:320ms]">
          <span className="whitespace-nowrap">{couple.groom_name}</span>
          <span className="whitespace-nowrap text-[var(--rp-yellow)]">
            &amp;
          </span>
          <span className="whitespace-nowrap">{couple.bride_name}</span>
        </h1>
        {weddingDate && (
          <p className="mt-5 animate-fade-up font-retro text-base tracking-[0.16em] text-white/85 opacity-0 [animation-delay:450ms]">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <div className="mt-6 animate-fade-up border-l-4 border-[var(--rp-yellow)] pl-4 opacity-0 [animation-delay:580ms]">
          <p className="text-xs text-white/65">Khusus untuk</p>
          <p className="mt-1 break-words font-retro text-lg text-white">
            {guestName || "Tamu Undangan"}
          </p>
        </div>

        {isOpened ? (
          <p className="mt-7 inline-block animate-fade-up bg-[var(--rp-yellow)] px-4 py-3 text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-ink)] opacity-0 [animation-delay:720ms]">
            Undangan Sudah Dibuka
          </p>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="rp-button mt-7 inline-flex min-h-12 animate-fade-up items-center gap-2 bg-[var(--color-primary)] px-5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white opacity-0 transition-all disabled:cursor-wait disabled:opacity-70 [animation-delay:720ms]"
          >
            <MailIcon className="h-4 w-4" />
            {isOpening ? "Membuka..." : "Buka Undangan"}
          </button>
        )}
      </div>
    </section>
  );
}
