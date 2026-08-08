import { useState } from "react";
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

/** Sampul album arsip: foto penuh, nomor edisi, monogram stempel, dan alamat tamu. */
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
    window.setTimeout(() => setIsOpening(false), 1600);
  };

  return (
    <section className="va-grain relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-[var(--va-forest)] text-[var(--va-vellum)]">
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className={`absolute inset-0 h-full w-full object-cover transition duration-[1600ms] ${
          isOpening
            ? "scale-[1.07] saturate-[0.75]"
            : "scale-100 saturate-[0.86]"
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,31,0.62)_0%,rgba(20,38,31,0.18)_38%,rgba(25,34,30,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(116,63,69,0.38),transparent_38%,rgba(20,38,31,0.28))] mix-blend-multiply" />

      <div className="pointer-events-none absolute inset-4 z-10 border border-[var(--va-brass-soft)]/45" />
      <div className="pointer-events-none absolute inset-x-7 top-7 z-10 flex items-center justify-between text-[0.56rem] tracking-[0.22em] uppercase">
        <span>Archive No. 06</span>
        <span>Est. Forever</span>
      </div>

      <div
        className={`relative z-30 flex h-full flex-col px-8 pb-9 pt-16 transition duration-[1000ms] ${
          isOpening ? "-translate-y-2 opacity-70" : "translate-y-0 opacity-100"
        }`}
      >
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
        className={`pointer-events-none absolute inset-0 z-40 origin-top bg-[var(--va-vellum)] transition-transform duration-[1350ms] ease-[cubic-bezier(.76,0,.24,1)] ${
          isOpening ? "translate-y-0" : "-translate-y-full"
        }`}
      />
    </section>
  );
}
