import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { DecoFan, GoldDivider, goldGlow } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: Thank You -- penutup ber-glow. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="relative px-6 py-20 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-72 rotate-180" style={goldGlow(0.12)} />

      <div className="relative z-10">
        <Reveal variant="blur">
          <DecoFan className="mx-auto h-14 w-auto" />
          <h2 className="mt-4 font-script text-5xl text-neutral-100">Thank You</h2>
        </Reveal>
        <Reveal variant="up" delay={150}>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-400">
            Terima kasih atas doa, restu, dan kehadiran Anda. Sebuah kehormatan bagi kami dapat
            berbagi momen bahagia ini bersama orang-orang terkasih.
          </p>
        </Reveal>
        <Reveal variant="up" delay={300}>
          <GoldDivider className="mx-auto mt-8 w-48" />
          <p className="mt-5 text-xs uppercase tracking-[0.35em] text-neutral-500">Kami yang berbahagia</p>
          <p className="mt-2 font-script text-3xl text-[#D4AF37]">
            {couple.groom_name} &amp; {couple.bride_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
