import { formatLongDate } from "../../../../utils/formatDate";
import type { CoupleInfo } from "../../../../types/wedding";
import CoverMedia from "../../../shared/CoverMedia";
import { Monogram } from "./ornaments";

interface LeftPaneProps {
  couple: CoupleInfo;
  weddingDate: string | null;
  coverPhotoUrl: string;
}

/** Sampul album skala besar untuk desktop, diperlakukan seperti spread editorial. */
export default function LeftPane({
  couple,
  weddingDate,
  coverPhotoUrl,
}: LeftPaneProps) {
  return (
    <div className="relative z-10 hidden overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-1">
      <CoverMedia
        src={coverPhotoUrl}
        alt={`Foto ${couple.groom_name} dan ${couple.bride_name}`}
        className="absolute inset-0 h-full w-full object-cover saturate-[0.82]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,39,33,0.3),rgba(22,39,33,0.08)_45%,rgba(22,39,33,0.74))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,39,33,0.28),transparent_42%,rgba(22,39,33,0.76))]" />
      <div className="pointer-events-none absolute inset-7 border border-[var(--va-brass-soft)]/35" />

      <div className="relative z-20 flex w-full flex-col justify-between p-12 text-[var(--va-vellum)] xl:p-16">
        <div className="flex items-start justify-between">
          <p className="text-[0.65rem] leading-5 tracking-[0.28em] uppercase">
            The Wedding Archive
            <span className="block text-[var(--va-brass-soft)]">
              Issue No. 06
            </span>
          </p>
          <Monogram couple={couple} className="h-24 w-24 text-3xl" />
        </div>

        <div className="max-w-3xl pb-4">
          <div className="mb-8 flex items-center gap-4 text-[0.65rem] tracking-[0.28em] text-[var(--va-brass-soft)] uppercase">
            <span>Volume One</span>
            <span className="h-px w-20 bg-current" />
            <span>A private celebration</span>
          </div>
          <h1 className="font-vintage-script text-7xl leading-[0.86] drop-shadow-md xl:text-[6rem]">
            <span className="block">{couple.groom_name}</span>
            <span className="my-3 block font-vintage text-3xl text-[var(--va-brass-soft)]">
              &amp;
            </span>
            <span className="block">{couple.bride_name}</span>
          </h1>
          {weddingDate && (
            <p className="mt-9 max-w-md border-l border-[var(--va-brass-soft)]/70 pl-5 text-xs tracking-[0.22em] uppercase">
              {formatLongDate(weddingDate)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
