import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { ArchDivider, Bismillah, geometricBackground } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: Jazakumullahu Khairan -- penutup dengan doa. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="relative bg-[var(--color-secondary)] px-6 py-20 text-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={geometricBackground(0.05)} />

      <div className="relative z-10">
        <Reveal variant="blur">
          <Bismillah className="text-xl text-[var(--color-primary)]" />
          <h2 className="mt-4 font-serif text-3xl font-semibold text-neutral-800">
            Jazakumullahu Khairan
          </h2>
        </Reveal>
        <Reveal variant="up" delay={150}>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir dan memberikan doa restu. Semoga Allah SWT membalas kebaikan
            panjenengan semua.
          </p>
        </Reveal>
        <Reveal variant="up" delay={300}>
          <ArchDivider className="mx-auto mt-8 w-44" />
          <p className="mt-5 text-sm text-neutral-500">Kami yang berbahagia</p>
          <p className="mt-2 font-serif text-2xl font-semibold text-[var(--color-primary)]">
            {couple.groom_name} &amp; {couple.bride_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
