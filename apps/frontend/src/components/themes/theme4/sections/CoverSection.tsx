import { useEffect, useRef, useState } from "react";
import type { CoupleInfo } from "../../../../types/wedding";
import { formatCoverDate } from "../../../../utils/formatDate";
import CoverMedia from "../../../shared/CoverMedia";
import {
  ArchDivider,
  Bismillah,
  IslamicArch,
  KhatamStar,
  MailIcon,
  geometricBackground,
} from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

type OpeningPhase = "idle" | "tracing" | "opening" | "done";

/** Cover foto penuh dengan framing mihrab dan salam pembuka. */
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
  const isOpening = openingPhase === "tracing" || openingPhase === "opening";

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

    setOpeningPhase("tracing");
    openTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("opening");
      onOpen();
    }, 820);
    resetTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("done");
    }, 2700);
  };

  return (
    <section
      aria-busy={isOpening}
      data-opening-phase={openingPhase}
      className={`islamic-cover invitation-cover relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-8 text-center text-white is-portal-${openingPhase}`}
    >
      <CoverMedia
        src={coverPhotoUrl}
        alt="Potret pernikahan"
        className="islamic-cover-photo absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--im-deep)] via-[var(--im-deep)]/68 to-black/25" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(183,121,99,0.22),transparent_48%)]" />
      <IslamicArch className="islamic-cover-arch pointer-events-none absolute left-1/2 top-5 h-[94%] w-auto -translate-x-1/2 text-white/20" />

      <div className="islamic-cover-content relative z-20 flex w-full max-w-sm flex-col items-center">
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

      <div
        className="islamic-portal pointer-events-none absolute inset-0 z-30"
        aria-hidden="true"
      >
        <div className="islamic-portal__field absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_72%,var(--im-deep)),var(--im-deep))]" />
          <div className="absolute inset-0" style={geometricBackground(0.12)} />
          <IslamicArch className="islamic-portal__arch absolute left-1/2 top-5 h-[94%] w-auto text-white/45" />
          <div className="islamic-portal__message absolute left-1/2 top-1/2 w-72 text-center">
            <KhatamStar className="mx-auto h-7 w-7 text-[var(--im-clay)]" />
            <Bismillah className="mt-5 text-[1.8rem] text-white" />
            <ArchDivider className="mx-auto mt-5 w-48 text-white/55" />
            <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-white/70">
              Menuju Hari Yang Diberkahi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
