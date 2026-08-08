import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { Daisy, RetroSun, halftoneBackground } from "../components/ornaments";

interface ThankYouSectionProps {
  couple: CoupleInfo;
  photoUrl: string;
}

/** Back cover majalah dengan foto, headline besar, dan tanda tangan pasangan. */
export default function ThankYouSection({
  couple,
  photoUrl,
}: ThankYouSectionProps) {
  return (
    <section className="rp-section-yellow relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={halftoneBackground(0.07)}
      />
      <Daisy className="absolute -right-6 top-12 h-24 w-24 rotate-12 text-[var(--rp-pink)]" />
      <div className="relative mx-auto max-w-sm">
        <Reveal variant="zoom">
          <figure className="rp-card relative aspect-[4/3] overflow-hidden p-1.5">
            <img
              src={photoUrl}
              alt="Potret penutup pasangan"
              loading="lazy"
              className="size-full object-cover"
            />
            <RetroSun className="absolute bottom-3 right-3 h-12 w-auto bg-[var(--rp-yellow)] px-2 text-[var(--rp-ink)]" />
          </figure>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <p className="mt-10 text-[0.58rem] font-bold uppercase tracking-[0.26em] text-[var(--color-primary)]">
            That&rsquo;s A Wrap
          </p>
          <h2 className="mt-3 font-retro text-[3.2rem] leading-[0.95] text-[var(--rp-ink)]">
            Makasih Banyak!
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--rp-ink)]/70">
            Kehadiran dan doa kalian bikin hari bahagia kami makin lengkap.
            Sampai jumpa di pesta dengan senyum paling lebar.
          </p>
          <div className="mt-7 border-t-2 border-[var(--rp-ink)] pt-5">
            <p className="text-[0.52rem] font-bold uppercase tracking-[0.24em] text-[var(--rp-teal)]">
              With Love
            </p>
            <p className="mt-2 break-words font-retro text-2xl text-[var(--color-primary)]">
              {couple.groom_name} &amp; {couple.bride_name}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
