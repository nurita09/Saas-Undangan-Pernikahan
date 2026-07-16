import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, GroovyDivider, RetroSun } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: makasih banyak! -- penutup ceria. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="bg-white px-6 py-20 text-center">
      <Reveal variant="blur">
        <RetroSun className="mx-auto h-16 w-auto" />
        <h2 className="mt-4 font-retro text-4xl" style={{ color: COCOA }}>
          Makasih Banyak!
        </h2>
      </Reveal>
      <Reveal variant="up" delay={150}>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">
          Kehadiran dan doa kalian bikin hari bahagia kami makin lengkap. Sampai jumpa di
          pesta — jangan lupa senyum paling lebar ya! ✌
        </p>
      </Reveal>
      <Reveal variant="up" delay={300}>
        <GroovyDivider className="mx-auto mt-8 w-48" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
          With love,
        </p>
        <p className="mt-2 font-retro text-2xl text-[var(--color-primary)]">
          {couple.groom_name} &amp; {couple.bride_name}
        </p>
      </Reveal>
    </section>
  );
}
