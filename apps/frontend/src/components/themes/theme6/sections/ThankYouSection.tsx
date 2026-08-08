import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { Monogram } from "../components/ornaments";

interface ThankYouSectionProps {
  couple: CoupleInfo;
  photoUrl: string;
}

/** Halaman penutup album dengan foto terakhir dan cap monogram. */
export default function ThankYouSection({
  couple,
  photoUrl,
}: ThankYouSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--va-forest)] text-[var(--va-vellum)]">
      <Reveal variant="zoom">
        <div className="relative h-[28rem] overflow-hidden">
          <img
            src={photoUrl}
            alt={`Potret penutup ${couple.groom_name} dan ${couple.bride_name}`}
            loading="lazy"
            className="h-full w-full object-cover saturate-[0.74]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,40,32,0.08)_35%,var(--va-forest)_100%)]" />
          <div className="absolute inset-4 border border-[var(--va-brass-soft)]/35" />
          <p className="absolute left-7 top-7 text-[0.55rem] tracking-[0.25em] uppercase">
            Final frame / 06
          </p>
        </div>
      </Reveal>

      <div className="relative -mt-24 px-7 pb-24 text-center">
        <Reveal variant="up">
          <Monogram
            couple={couple}
            className="mx-auto h-20 w-20 bg-[var(--va-oxblood)] text-3xl text-[var(--va-vellum)] shadow-xl"
          />
          <p className="mt-6 text-[0.58rem] tracking-[0.28em] text-[var(--va-brass-soft)] uppercase">
            End of volume one
          </p>
          <h2 className="mt-4 font-vintage text-[2.15rem] leading-none">
            Terima Kasih
          </h2>
          <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-[var(--va-vellum)]/72">
            Kehadiran, perhatian, dan doa restu Anda akan menjadi bagian indah
            dari kenangan kami.
          </p>
          <div className="mx-auto mt-7 h-px w-16 bg-[var(--va-brass-soft)]/55" />
          <p className="mt-6 font-vintage-script text-4xl leading-tight">
            {couple.groom_name}
            <span className="mx-2 font-vintage text-xl text-[var(--va-brass-soft)]">
              &amp;
            </span>
            {couple.bride_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
