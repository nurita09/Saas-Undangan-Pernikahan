import { useEffect, useRef, useState } from "react";
import { formatCoverDate } from "../../../../utils/formatDate";
import type { CoupleInfo } from "../../../../types/wedding";
import CoverMedia from "../../../shared/CoverMedia";
import { BatikBand, Divider, Gunungan } from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

type OpeningPhase = "idle" | "closing" | "parting";

/** Cover 1 layar penuh bergaya Jawa: gunungan wayang "membuka lakon", sapaan
 *  "Sugeng Rawuh", nama script, foto bundar, dan kartu tamu + tombol buka.
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
  const isOpening = openingPhase !== "idle";

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
      onOpen();
      return;
    }

    setOpeningPhase("closing");
    openTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("parting");
      onOpen();
    }, 760);
    resetTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("idle");
    }, 2550);
  };

  return (
    <section
      aria-busy={isOpening}
      data-opening-phase={openingPhase}
      className={`javanese-cover invitation-cover group relative h-[100svh] w-full overflow-hidden bg-[var(--color-secondary)] is-gate-${openingPhase}`}
    >
      <BatikBand className="opacity-[0.025]" />
      <div className="pointer-events-none absolute inset-3 border border-[var(--jw-gold)]/60 transition-all duration-[1400ms] group-hover:inset-4" />
      <div className="pointer-events-none absolute inset-5 border border-[var(--jw-gold)]/30 transition-all delay-150 duration-[1400ms] group-hover:inset-6" />

      <div className="javanese-cover-content relative z-20 flex h-full flex-col items-center justify-center px-7 py-8 text-center min-[380px]:py-10">
        <Gunungan className="javanese-cover-kayon h-16 w-auto text-[var(--color-primary)] min-[380px]:h-20" />

        <p className="mt-3 font-jawa-script text-3xl text-[var(--jw-gold)] min-[380px]:mt-4">
          Sugeng Rawuh
        </p>
        <p className="mt-1.5 text-[0.65rem] font-medium tracking-[0.35em] text-[var(--jw-ink)] uppercase">
          Undangan Pernikahan
        </p>

        <h1 className="mt-4 font-jawa-script text-5xl leading-[0.95] text-[var(--color-primary)] min-[380px]:mt-5 min-[380px]:text-6xl">
          {couple.groom_name}{" "}
          <span className="text-[var(--jw-gold)]">&amp;</span>{" "}
          {couple.bride_name}
        </h1>

        <div className="javanese-cover-portrait relative mt-5 min-[380px]:mt-7">
          <div className="absolute -inset-2.5 rounded-full border border-[var(--jw-gold-soft)] transition-transform duration-[1600ms] group-hover:scale-105" />
          <div className="size-36 overflow-hidden rounded-full border-2 border-[var(--jw-gold)]/70 shadow-[var(--jw-shadow)] min-[380px]:size-44">
            <CoverMedia
              src={coverPhotoUrl}
              alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
              className="size-full object-cover transition-transform duration-[1800ms] group-hover:scale-105"
            />
          </div>
        </div>

        {weddingDate && (
          <p className="mt-4 font-jawa-serif text-lg tracking-[0.25em] text-[var(--jw-ink)] min-[380px]:mt-6">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <Divider className="mt-4 min-[380px]:mt-5" />

        <p className="mt-4 text-sm text-[var(--jw-muted)] min-[380px]:mt-5">
          Katur dhumateng Bapak/Ibu/Sedherek
        </p>
        <p className="mt-1 font-jawa-serif text-xl font-semibold text-[var(--color-primary)]">
          {guestName || "Tamu Undangan"}
        </p>

        {isOpened ? (
          <div
            aria-live="polite"
            className="mt-6 w-full max-w-xs border border-[var(--jw-gold)]/45 bg-[var(--jw-card)]/70 px-5 py-4 shadow-[var(--jw-shadow)]"
          >
            <div className="mx-auto flex items-center justify-center gap-2 text-[var(--color-primary)]">
              <span className="size-2 rotate-45 border border-[var(--jw-gold)] bg-[var(--jw-gold-soft)]/40" />
              <p className="text-[0.62rem] font-medium tracking-[0.28em] uppercase">
                Undangan Telah Dibuka
              </p>
              <span className="size-2 rotate-45 border border-[var(--jw-gold)] bg-[var(--jw-gold-soft)]/40" />
            </div>
            <p className="mt-2 font-jawa-serif text-base italic text-[var(--jw-muted)]">
              Matur nuwun, silakan menikmati rangkaian acara
            </p>
          </div>
        ) : (
          <div className="mt-6 w-full max-w-xs border border-[var(--jw-gold)]/35 bg-[var(--jw-night)] p-1.5 shadow-[var(--jw-shadow)] min-[380px]:mt-7">
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="inline-flex w-full items-center justify-center gap-3 border border-[var(--jw-gold-soft)]/30 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--jw-night)_86%,#172f35)_0%,var(--jw-night)_100%)] px-8 py-3.5 text-[0.6rem] font-semibold tracking-[0.32em] text-[var(--color-secondary)] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all delay-100 duration-[900ms] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-95 disabled:cursor-wait disabled:opacity-85"
            >
              <span className="javanese-cover-button__diamond size-1.5 rotate-45 bg-[var(--jw-gold-soft)]" />
              {isOpening ? "Membuka..." : "Buka Undangan"}
            </button>
          </div>
        )}
      </div>

      <div
        className="javanese-gate pointer-events-none absolute inset-0 z-30"
        aria-hidden="true"
      >
        <div className="javanese-gate__leaf javanese-gate__leaf--left absolute inset-y-0 left-0 w-[calc(50%+1px)] overflow-hidden">
          <BatikBand className="opacity-[0.2] mix-blend-soft-light" />
          <span className="javanese-gate__frame absolute inset-3 border border-[var(--jw-gold)]/45" />
        </div>
        <div className="javanese-gate__leaf javanese-gate__leaf--right absolute inset-y-0 right-0 w-[calc(50%+1px)] overflow-hidden">
          <BatikBand className="opacity-[0.2] mix-blend-soft-light" />
          <span className="javanese-gate__frame absolute inset-3 border border-[var(--jw-gold)]/45" />
        </div>
        <div className="javanese-gate__seal absolute left-1/2 top-1/2 w-52 text-center">
          <Gunungan className="mx-auto h-24 w-auto text-[var(--jw-gold-soft)]" />
          <p className="mt-4 text-[0.58rem] font-medium tracking-[0.42em] text-[var(--jw-gold-soft)] uppercase">
            Pambuka
          </p>
          <Divider className="mt-4" tone="light" />
        </div>
      </div>
    </section>
  );
}
