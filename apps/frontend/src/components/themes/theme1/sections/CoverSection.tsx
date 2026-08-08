import { useEffect, useRef, useState } from "react";
import { formatCoverDate } from "../../../../utils/formatDate";
import type { CoupleInfo } from "../../../../types/wedding";
import CoverMedia from "../../../shared/CoverMedia";
import { Divider, FloralCorners, MailIcon } from "../components/ornaments";

interface CoverSectionProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
  guestName?: string;
  isOpened: boolean;
  onOpen: () => void;
}

/** Cover 1 layar penuh: foto + tirai gading + nama script, kartu "Kepada Yth."
 *  berisi nama tamu + tombol Buka Undangan. Section ini permanen (tidak
 *  di-unmount) -- guest bisa scroll balik ke atas untuk melihatnya lagi. */
export default function CoverSection({
  couple,
  weddingDate,
  coverPhotoUrl,
  guestName,
  isOpened,
  onOpen,
}: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false);
  const openTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

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

    setIsOpening(true);
    openTimerRef.current = window.setTimeout(() => {
      onOpen();
    }, 900);
    resetTimerRef.current = window.setTimeout(() => {
      setIsOpening(false);
    }, 2600);
  };

  return (
    <section
      aria-busy={isOpening}
      className={`floral-cover invitation-cover relative h-[100svh] w-full overflow-hidden ${
        isOpening ? "is-opening" : ""
      }`}
    >
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto pengantin ${couple.groom_name} dan ${couple.bride_name}`}
        className="floral-cover-media absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--fl-veil)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.26)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/18 to-transparent" />

      <div
        className="floral-cover-corners pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <FloralCorners
          spots={["tl", "tr", "bl", "br"]}
          size="w-40"
          opacity="opacity-85"
        />
      </div>

      <div
        className="floral-bloom-wipe pointer-events-none absolute inset-0 z-30"
        aria-hidden="true"
      >
        <div className="floral-bloom-wipe__wash absolute inset-0" />
        <FloralCorners spots={["tl", "br"]} size="w-44" opacity="opacity-45" />
        <div className="floral-bloom-wipe__emblem absolute left-1/2 top-1/2 w-64 text-center">
          <p className="label-caps text-[var(--fl-clay)]">Dengan penuh kasih</p>
          <Divider className="mt-2 h-14" />
          <span className="mx-auto mt-1 block h-10 w-px bg-gradient-to-b from-[var(--fl-gold)]/70 to-transparent" />
        </div>
      </div>

      <div className="floral-cover-content relative z-20 flex h-full flex-col items-center justify-center px-6 pt-10 text-center">
        <p className="label-caps text-white/90">The Wedding Of</p>
        <h1 className="mt-5 max-w-[21rem] font-floral-script text-[3.35rem] leading-[1.02] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)]">
          {couple.groom_name}{" "}
          <span className="font-floral-serif italic">&amp;</span>{" "}
          {couple.bride_name}
        </h1>
        <Divider className="mt-2 h-12 brightness-[1.7]" />
        {weddingDate && (
          <p className="font-floral-serif text-sm tracking-[0.45em] text-white/95">
            {formatCoverDate(weddingDate)}
          </p>
        )}

        <div className="floral-cover-card card-petal mt-11 w-full max-w-sm px-7 py-7 text-[var(--fl-ink)] shadow-[0_26px_70px_-35px_rgba(0,0,0,0.72)] backdrop-blur-sm">
          <p className="label-caps text-[var(--fl-muted)]">Kepada Yth.</p>
          <p className="mt-2.5 font-floral-serif text-base text-[var(--fl-muted)]">
            Bapak / Ibu / Saudara / i
          </p>
          <p className="mt-1 font-floral-serif text-[2rem] leading-tight text-[var(--color-primary)]">
            {guestName || "Tamu Undangan"}
          </p>
          {isOpened ? (
            <div
              aria-live="polite"
              className="mt-5 border border-[var(--fl-gold)]/35 bg-white/35 px-5 py-4 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fl-gold)]/45 bg-[var(--fl-card)]/80 text-[var(--color-primary)]">
                <MailIcon className="h-4 w-4" />
              </div>
              <p className="label-caps mt-3 text-[var(--color-primary)]">
                Undangan Terbuka
              </p>
              <p className="mt-2 font-floral-serif text-base italic text-[var(--fl-muted)]">
                Silakan lanjutkan menikmati rangkaian acara
              </p>
              <span
                className="mx-auto mt-3 block h-8 w-px bg-gradient-to-b from-[var(--fl-gold)]/70 to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              className="floral-cover-button label-caps relative mt-6 inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-[var(--color-primary)] px-6 py-4 text-white shadow-[0_18px_42px_-24px_rgba(74,66,56,0.85)] transition-all duration-700 hover:-translate-y-0.5 hover:bg-[var(--fl-clay)] disabled:cursor-wait disabled:hover:translate-y-0"
            >
              <span className="floral-cover-button__glint" aria-hidden="true" />
              <MailIcon className="relative h-4 w-4" />
              <span className="relative">
                {isOpening ? "Mekar..." : "Buka Undangan"}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
