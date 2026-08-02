import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { Divider, Gunungan } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: Matur Nuwun -- penutup. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="px-6 pt-20 pb-16 text-center">
      <Reveal variant="bloom" className="mx-auto max-w-md">
        <Gunungan className="drift-slow mx-auto h-20 w-auto text-[var(--jw-gold)]" />
        <p className="mt-6 font-jawa-script text-6xl leading-none text-[var(--color-primary)]">
          Matur Nuwun
        </p>
        <p className="mt-6 text-sm leading-relaxed text-[var(--jw-muted)]">
          Atas rawuh, doa, dan pangestu panjenengan sedaya, kami sekeluarga mengucapkan terima
          kasih ingkang sebesar-besarnya. Semoga menjadi kenangan ingkang endah.
        </p>
        <Divider className="mt-8" />
        <p className="mt-8 text-sm text-[var(--jw-muted)]">Kami yang berbahagia</p>
        <p className="mt-1 font-jawa-script text-5xl text-[var(--color-primary)]">
          {couple.groom_name} &amp; {couple.bride_name}
        </p>
      </Reveal>
    </section>
  );
}
