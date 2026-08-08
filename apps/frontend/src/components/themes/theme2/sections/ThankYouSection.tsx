import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { BatikBand, Divider, Gunungan } from "../components/ornaments";

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: Matur Nuwun -- penutup. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="jw-night-panel relative flex min-h-[76svh] items-center overflow-hidden px-7 py-24 text-center">
      <BatikBand className="opacity-[0.2] mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.32))]" />
      <Reveal
        variant="bloom"
        className="relative mx-auto max-w-md text-[var(--color-secondary)]"
      >
        <Gunungan className="drift-slow mx-auto h-24 w-auto text-[var(--jw-gold-soft)]" />
        <p className="mt-7 font-jawa-script text-[4.25rem] leading-none text-[var(--jw-gold-soft)]">
          Matur Nuwun
        </p>
        <p className="mt-7 text-base leading-relaxed text-[var(--color-secondary)]/78">
          Atas rawuh, doa, dan pangestu panjenengan sedaya, kami sekeluarga
          mengucapkan terima kasih ingkang sebesar-besarnya. Semoga menjadi
          kenangan ingkang endah.
        </p>
        <Divider className="mt-9" tone="light" />
        <p className="mt-8 text-sm text-[var(--color-secondary)]/65">
          Kami yang berbahagia
        </p>
        <p className="mt-2 font-jawa-script text-5xl text-white">
          {couple.groom_name} &amp; {couple.bride_name}
        </p>
      </Reveal>
    </section>
  );
}
