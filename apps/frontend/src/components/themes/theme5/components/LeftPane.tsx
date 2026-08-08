import type { CoupleInfo } from "../../../../types/wedding";
import { formatCoverDate } from "../../../../utils/formatDate";
import CoverMedia from "../../../shared/CoverMedia";
import { Daisy, RetroSun, halftoneBackground } from "./ornaments";

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Poster foto penuh untuk panggung desktop. */
export default function LeftPane({
  couple,
  weddingDate,
  coverPhotoUrl,
}: LeftPaneProps) {
  return (
    <div className="relative z-10 hidden h-screen flex-1 flex-col items-start justify-end overflow-hidden pb-20 pl-[9%] shadow-[inset_-20px_0_40px_rgba(0,0,0,0.26)] lg:sticky lg:top-0 lg:flex">
      <CoverMedia
        src={coverPhotoUrl}
        alt="Potret pernikahan"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--rp-ink)] via-[var(--rp-ink)]/35 to-black/10" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--rp-teal)_32%,transparent),transparent_58%)]" />
      <div
        className="absolute inset-0"
        style={halftoneBackground(0.12)}
        aria-hidden="true"
      />
      <Daisy className="absolute right-12 top-10 h-16 w-16 rotate-12 text-[var(--rp-yellow)]" />

      <div className="relative z-20 max-w-3xl pr-10 text-left text-white">
        <RetroSun className="h-20 w-auto text-white" />
        <p className="mt-5 inline-block bg-[var(--rp-yellow)] px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-[var(--rp-ink)]">
          Wedding Special Edition
        </p>
        <h1 className="mt-5 break-words font-retro text-6xl leading-[1.02] text-white drop-shadow-xl xl:text-7xl">
          {couple.groom_name}{" "}
          <span className="text-[var(--rp-yellow)]">&amp;</span>{" "}
          {couple.bride_name}
        </h1>
        {weddingDate && (
          <p className="mt-6 font-retro text-xl tracking-[0.16em] text-[var(--rp-yellow)]">
            {formatCoverDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
