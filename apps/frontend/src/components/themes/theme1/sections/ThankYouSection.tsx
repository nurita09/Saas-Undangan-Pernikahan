import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { Divider, FloralCorners } from "../components/ornaments";

interface ThankYouSectionProps {
  couple: CoupleInfo;
  photoUrl: string;
}

/** Section 8: ucapan terima kasih sebagai finale foto penuh. */
export default function ThankYouSection({
  couple,
  photoUrl,
}: ThankYouSectionProps) {
  return (
    <section className="relative flex min-h-[76svh] items-center overflow-hidden px-7 py-28 text-center">
      <img
        src={photoUrl}
        alt="Momen pernikahan"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,20,17,0.38),rgba(24,20,17,0.66))]" />
      <FloralCorners
        spots={["tl", "tr", "bl", "br"]}
        size="w-32"
        opacity="opacity-75"
      />
      <Reveal variant="bloom" className="relative mx-auto max-w-md text-white">
        <p className="label-caps text-white/75">Dengan penuh rasa syukur</p>
        <h2 className="mt-4 font-floral-script text-[4.5rem] leading-none text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.32)]">
          Thank You
        </h2>
        <Divider className="mt-2 h-12 brightness-[1.7]" />
        <p className="font-floral-serif text-xl leading-relaxed text-white/88">
          Terima kasih atas doa, restu, dan kehadiran Anda. Semoga kebersamaan
          di hari istimewa kami menjadi kenangan yang indah.
        </p>
        <p className="mt-10 font-floral-script text-5xl leading-none text-white">
          {couple.groom_name} &amp; {couple.bride_name}
        </p>
      </Reveal>
    </section>
  );
}
