import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { Gunungan, OrnamentDivider } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: Matur Nuwun -- penutup. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="bg-white px-6 py-20 text-center">
      <Reveal variant="blur">
        <Gunungan className="mx-auto h-20 w-auto text-[#C9A227]" />
        <h2 className="mt-4 font-script text-5xl text-[var(--color-primary)]">Matur Nuwun</h2>
      </Reveal>
      <Reveal variant="up" delay={150}>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">
          Atas rawuh, doa, dan pangestu panjenengan sedaya, kami sekeluarga mengucapkan terima
          kasih yang sebesar-besarnya. Semoga menjadi kenangan yang indah.
        </p>
      </Reveal>
      <Reveal variant="up" delay={300}>
        <OrnamentDivider className="mx-auto mt-8 w-44" />
        <p className="mt-5 text-sm text-neutral-500">Kami yang berbahagia</p>
        <p className="mt-1 font-script text-3xl text-[var(--color-primary)]">
          {couple.groom_name} &amp; {couple.bride_name}
        </p>
      </Reveal>
    </section>
  );
}
