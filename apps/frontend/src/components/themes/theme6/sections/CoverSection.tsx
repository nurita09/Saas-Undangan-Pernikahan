import { useEffect, useRef, useState } from "react";
import { formatLongDate } from "../../../../utils/formatDate";
import type { CoupleInfo } from "../../../../types/wedding";
import CoverMedia from "../../../shared/CoverMedia";
import { ChevronDownIcon, MailIcon, Monogram } from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

type OpeningPhase = "idle" | "filing" | "turning" | "done";

const ARCHIVE_HOLES = Array.from({ length: 5 }, (_, index) => index);

/** Sampul album arsip: foto penuh, nomor edisi, monogram stempel, dan alamat tamu. */
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
  const isOpening = openingPhase === "filing" || openingPhase === "turning";

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

    setOpeningPhase("filing");
    openTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("turning");
      onOpen();
    }, 1050);
    resetTimerRef.current = window.setTimeout(() => {
      setOpeningPhase("done");
    }, 2850);
  };

  return (
    <section
      aria-busy={isOpening}
      data-opening-phase={openingPhase}
      className={`archive-cover invitation-cover va-grain relative h-[100svh] w-full overflow-hidden bg-[var(--va-forest)] text-[var(--va-vellum)] is-file-${openingPhase}`}
    >
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className="archive-cover-photo absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.62)_0%,rgba(20,38,31,0.18)_38%,rgba(25,34,30,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(116,63,69,0.38),transparent_38%,rgba(20,38,31,0.28))] mix-blend-multiply" />

      <div className="archive-cover-border pointer-events-none absolute inset-4 z-10 border border-[var(--va-brass-soft)]/45" />
      <div className="pointer-events-none absolute inset-x-7 top-7 z-10 flex items-center justify-between text-[0.56rem] tracking-[0.22em] uppercase">
        <span>Archive No. 06</span>
        <span>Est. Forever</span>
      </div>

      <div className="archive-cover-copy relative z-30 flex h-full flex-col px-8 pb-9 pt-16">
        <div className="flex items-start justify-between">
          <p className="max-w-[9rem] text-[0.6rem] leading-5 tracking-[0.28em] uppercase">
            The Wedding Archive
            <span className="mt-1 block text-[var(--va-brass-soft)]">
              A private celebration
            </span>
          </p>
          <Monogram
            couple={couple}
            className="h-[4.5rem] w-[4.5rem] text-[1.65rem]"
          />
        </div>

        <div className="my-auto pt-8">
          <p className="text-[0.6rem] tracking-[0.3em] text-[var(--va-brass-soft)] uppercase">
            Volume One
          </p>
          <h1 className="mt-3 font-vintage-script leading-[0.92] drop-shadow-md">
            <span className="block text-[3.2rem]">{couple.groom_name}</span>
            <span className="my-2 block pl-1 font-vintage text-xl text-[var(--va-brass-soft)]">
              &amp;
            </span>
            <span className="block text-[3.2rem]">{couple.bride_name}</span>
          </h1>
          {weddingDate && (
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--va-brass-soft)]/70" />
              <p className="text-[0.62rem] leading-5 tracking-[0.18em] uppercase">
                {formatLongDate(weddingDate)}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--va-brass-soft)]/40 pt-5">
          {guestName && (
            <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <MailIcon className="h-5 w-5 text-[var(--va-brass-soft)]" />
              <div className="min-w-0">
                <p className="text-[0.55rem] tracking-[0.22em] uppercase opacity-70">
                  Disampaikan kepada
                </p>
                <p className="mt-1 truncate font-vintage text-lg">
                  {guestName}
                </p>
              </div>
            </div>
          )}

          {isOpened ? (
            <div className="flex items-center justify-between border border-[var(--va-brass-soft)]/35 bg-black/15 px-4 py-3">
              <span className="text-[0.62rem] tracking-[0.22em] uppercase">
                Undangan Terbuka
              </span>
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="group flex h-12 w-full items-center justify-between border border-[var(--va-brass-soft)]/55 bg-[var(--va-vellum)] px-4 text-[var(--va-forest)] transition hover:bg-white disabled:cursor-wait disabled:opacity-80"
            >
              <span className="flex items-center gap-2.5 text-[0.65rem] tracking-[0.22em] uppercase">
                <MailIcon className="h-4 w-4" />
                {isOpening ? "Membuka arsip..." : "Buka undangan"}
              </span>
              <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </button>
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="archive-file-transition pointer-events-none absolute inset-0 z-40"
      >
        <div className="archive-file-sheet absolute inset-0 overflow-hidden bg-[var(--va-vellum)] text-[var(--va-ink)]">
          <div className="archive-file-tab absolute right-5 top-0 px-5 py-2 text-[0.52rem] font-semibold uppercase tracking-[0.24em] text-[var(--va-vellum)]">
            Private File
          </div>

          <div className="archive-file-spine absolute inset-y-0 left-0 w-10 border-r border-[var(--va-line)]">
            {ARCHIVE_HOLES.map((index) => (
              <span
                key={index}
                className="archive-file-hole absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
                style={{ top: `${12 + index * 19}%` }}
              />
            ))}
          </div>

          <div className="archive-file-content relative z-10 flex h-full flex-col px-7 pb-8 pl-16 pt-16">
            <div className="flex items-start justify-between border-b border-[var(--va-line)] pb-5">
              <div>
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--va-oxblood)]">
                  Nurita Private Archive
                </p>
                <p className="mt-2 font-vintage text-xl text-[var(--va-forest)]">
                  Wedding Collection
                </p>
              </div>
              <span className="font-vintage text-3xl text-[var(--va-brass)]">
                06
              </span>
            </div>

            <div className="my-auto">
              <Monogram
                couple={couple}
                className="mx-auto h-28 w-28 text-4xl text-[var(--va-oxblood)]"
              />
              <p className="mt-7 text-center text-[0.55rem] uppercase tracking-[0.32em] text-[var(--va-muted)]">
                Catalogued with love
              </p>
              <p className="mt-3 text-center font-vintage-script text-[2.65rem] leading-none text-[var(--va-forest)]">
                {couple.groom_name} &amp; {couple.bride_name}
              </p>
              {weddingDate && (
                <p className="mt-5 text-center text-[0.58rem] uppercase tracking-[0.18em] text-[var(--va-oxblood)]">
                  {formatLongDate(weddingDate)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-end gap-5 border-t border-[var(--va-line)] pt-5">
              <div>
                <p className="text-[0.5rem] uppercase tracking-[0.24em] text-[var(--va-muted)]">
                  Recorded for
                </p>
                <p className="mt-1 truncate font-vintage text-base text-[var(--va-forest)]">
                  {guestName || "Tamu Undangan"}
                </p>
              </div>
              <div className="archive-file-barcode h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
