import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  ArchDivider,
  IslamicArch,
  geometricBackground,
} from "../components/ornaments";

interface ThankYouSectionProps {
  couple: CoupleInfo;
  photoUrl: string;
}

/** Penutup hijau mineral dengan jendela foto mihrab dan hamdalah. */
export default function ThankYouSection({
  couple,
  photoUrl,
}: ThankYouSectionProps) {
  return (
    <section className="im-section-deep relative overflow-hidden px-6 py-24 text-center text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={geometricBackground(0.06)}
      />
      <IslamicArch className="pointer-events-none absolute left-1/2 top-8 h-[88%] w-auto -translate-x-1/2 text-white/8" />
      <div className="relative mx-auto max-w-sm">
        <Reveal variant="zoom">
          <figure className="mx-auto aspect-[4/5] w-[72%] overflow-hidden rounded-t-[999px] border border-white/25 p-1.5">
            <img
              src={photoUrl}
              alt="Potret penutup pasangan"
              loading="lazy"
              className="size-full rounded-t-[999px] object-cover"
            />
          </figure>
        </Reveal>
        <Reveal variant="blur" delay={100}>
          <p
            className="mt-9 font-arabic text-4xl text-[var(--im-clay)]"
            lang="ar"
            dir="rtl"
          >
            الْحَمْدُ لِلَّهِ
          </p>
          <p className="mt-3 text-[0.56rem] font-semibold uppercase tracking-[0.36em] text-white/55">
            Alhamdulillahi Rabbil &lsquo;Alamin
          </p>
          <h2 className="mt-4 font-serif text-[2.45rem] leading-tight text-white">
            Jazakumullahu Khairan
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-white/68">
            Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
            hadir dan memberikan doa restu.
          </p>
          <ArchDivider className="mx-auto mt-7 w-44 text-white/50" />
          <p className="mt-5 text-xs text-white/55">Kami yang berbahagia</p>
          <p className="mt-2 break-words font-serif text-2xl text-[var(--im-clay)]">
            {couple.groom_name} &amp; {couple.bride_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
