import { useEffect, useRef, useState } from "react";
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

type OpeningPhase = "idle" | "rising" | "exiting" | "done";

const SHUTTER_COLUMNS = Array.from({ length: 6 }, (_, index) => index);

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
  const [openingPhase, setOpeningPhase] = useState<OpeningPhase>("idle");
  const openTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const isOpening = openingPhase === "rising" || openingPhase === "exiting";

  useEffect(
    () => () => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const handleOpen = () => {
    if (isOpening || isOpened) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpeningPhase("done");
      onOpen();
      return;
    }

    setOpeningPhase("rising");
    openTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("exiting");
      onOpen();
    }, 1050);
    resetTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("done");
    }, 3000);
  };

  return (
    <section
      aria-busy={isOpening}
      data-opening-phase={openingPhase}
      className={`noir-cover invitation-cover noir-section relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center min-[380px]:py-16 is-shutter-${openingPhase}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={goldGlow(0.16)}
      />
      {/* Bingkai garis tipis ganda */}
      <div
        aria-hidden="true"
        className="noir-cover-border pointer-events-none absolute inset-4 border border-[var(--color-primary)]/40"
      />
      <div
        aria-hidden="true"
        className="noir-cover-border noir-cover-border--inner pointer-events-none absolute inset-6 border border-[var(--color-primary)]/15"
      />

      <div className="noir-cover-content relative z-10 flex flex-col items-center">
        <DecoFan className="noir-cover-fan opacity-0 animate-fade-in-scale h-16 w-auto" />

        <p className="noir-cover-kicker opacity-0 animate-fade-up [animation-delay:200ms] mt-6 text-xs uppercase tracking-[0.5em] font-medium text-[var(--color-primary)]">
          The Wedding Of
        </p>

        <h1 className="noir-cover-title opacity-0 animate-fade-up [animation-delay:350ms] mt-5 max-w-[21rem] break-words font-script text-5xl leading-tight text-[var(--dk-ivory)] md:text-6xl">
          {couple.groom_name}
          <span className="mx-1 text-[var(--color-primary)]">&amp;</span>
          {couple.bride_name}
        </h1>

        <div className="noir-cover-portrait-frame opacity-0 animate-fade-up [animation-delay:500ms] mt-9 rounded-full border border-[var(--color-primary)]/70 p-2 shadow-[0_22px_55px_-32px_rgba(0,0,0,0.9)]">
          <div className="noir-cover-portrait h-52 w-52 overflow-hidden rounded-full">
            <CoverMedia
              src={coverPhotoUrl}
              alt="Cover"
              className="noir-cover-photo h-full w-full object-cover"
            />
          </div>
        </div>

        {weddingDate && (
          <p className="noir-cover-date opacity-0 animate-fade-up [animation-delay:650ms] mt-8 font-serif text-xl tracking-[0.35em] text-[var(--color-primary)]">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <GoldDivider className="noir-cover-divider opacity-0 animate-fade-up [animation-delay:750ms] mt-5 w-52" />

        <div className="noir-cover-recipient opacity-0 animate-fade-up [animation-delay:850ms] mt-5 text-sm text-neutral-400 space-y-1">
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
          <div className="noir-cover-action opacity-0 animate-fade-up [animation-delay:1100ms] relative mt-9 inline-block">
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

      <div
        className="noir-shutter pointer-events-none absolute inset-0 z-30 grid grid-cols-6 overflow-hidden"
        aria-hidden="true"
      >
        {SHUTTER_COLUMNS.map((index) => (
          <span
            key={index}
            className="noir-shutter__slat relative h-full"
            style={{ transitionDelay: `${index * 55}ms` }}
          />
        ))}
        <div className="noir-shutter__title absolute left-1/2 top-1/2 w-64 text-center">
          <DecoFan className="mx-auto h-14 w-auto" />
          <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.46em] text-[var(--color-primary)]">
            A New Chapter
          </p>
          <GoldDivider className="mx-auto mt-5 w-48" />
          <p className="mt-4 font-serif text-sm italic tracking-[0.14em] text-[var(--dk-muted)]">
            Noir Edition / No. 03
          </p>
        </div>
      </div>
    </section>
  );
}
