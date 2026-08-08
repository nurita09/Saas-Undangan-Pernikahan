import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { DecoFan, GoldDivider } from "../components/ornaments";

interface ThankYouSectionProps {
  couple: CoupleInfo;
  photoUrl: string;
}

/** Penutup foto penuh yang menjadi klimaks visual undangan. */
export default function ThankYouSection({
  couple,
  photoUrl,
}: ThankYouSectionProps) {
  return (
    <section className="relative flex min-h-[76svh] items-end overflow-hidden px-6 py-20 text-center">
      <img
        src={photoUrl}
        alt="Potret penutup pasangan"
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-[var(--color-secondary)]/60 to-[var(--dk-wine)]/25" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.18)_50%,transparent_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-sm pb-4">
        <Reveal variant="blur">
          <DecoFan className="mx-auto h-14 w-auto" />
          <p className="mt-4 text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            With Love And Gratitude
          </p>
          <h2 className="mt-4 font-script text-[4.6rem] leading-none text-white">
            Thank You
          </h2>
        </Reveal>
        <Reveal variant="up" delay={120}>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-white/75">
            Terima kasih atas doa, restu, dan kehadiran Anda dalam hari yang
            berarti bagi kami.
          </p>
          <GoldDivider className="mx-auto mt-8 w-48" />
          <p className="mt-5 text-[0.55rem] uppercase tracking-[0.32em] text-white/60">
            Kami yang berbahagia
          </p>
          <p className="mt-3 break-words font-script text-[2.6rem] leading-none text-[var(--color-primary)]">
            {couple.groom_name} &amp; {couple.bride_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
