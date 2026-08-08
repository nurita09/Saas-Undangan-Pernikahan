import type { CoupleInfo } from "../../../../types/wedding";
import { formatCoverDate } from "../../../../utils/formatDate";
import CoverMedia from "../../../shared/CoverMedia";
import { Bismillah, IslamicArch, KhatamStar } from "./ornaments";

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Panggung desktop foto penuh dengan mihrab fine-line. */
export default function LeftPane({
  couple,
  weddingDate,
  coverPhotoUrl,
}: LeftPaneProps) {
  return (
    <div className="relative z-10 hidden h-screen flex-1 flex-col items-center justify-end overflow-hidden pb-20 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.28)] lg:sticky lg:top-0 lg:flex">
      <CoverMedia
        src={coverPhotoUrl}
        alt="Potret pernikahan"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--im-deep)] via-[var(--im-deep)]/45 to-black/10" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(183,121,99,0.12)_65%,transparent_100%)]" />
      <IslamicArch className="pointer-events-none absolute left-1/2 top-7 h-[92%] w-auto -translate-x-1/2 text-white/16" />

      <div className="relative z-20 max-w-3xl px-8 text-center text-white">
        <Bismillah className="text-3xl text-white/90 drop-shadow-md" />
        <div className="mt-5 flex items-center justify-center gap-3 text-white/65">
          <span className="h-px w-12 bg-current" />
          <KhatamStar className="h-4 w-4" />
          <span className="h-px w-12 bg-current" />
        </div>
        <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-white/75">
          Walimatul &lsquo;Ursy
        </p>
        <h1 className="mt-4 break-words font-serif text-6xl leading-tight text-white drop-shadow-xl xl:text-7xl">
          {couple.groom_name}{" "}
          <span className="text-[var(--im-clay)]">&amp;</span>{" "}
          {couple.bride_name}
        </h1>
        {weddingDate && (
          <p className="mt-6 font-serif text-xl tracking-[0.22em] text-white/85">
            {formatCoverDate(weddingDate)}
          </p>
        )}
      </div>
    </div>
  );
}
