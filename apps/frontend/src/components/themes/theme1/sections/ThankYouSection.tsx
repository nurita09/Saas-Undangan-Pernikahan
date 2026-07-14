import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../components/Reveal';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: ucapan terima kasih penutup. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 text-center">
      <div className="relative z-10">
        <Reveal variant="blur">
          <h2 className="text-2xl font-bold text-neutral-800">Thank You</h2>
        </Reveal>
        <Reveal variant="up" delay={150}>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-neutral-500">
            Terima kasih atas doa, restu, dan kehadiran Anda. Semoga kebersamaan di hari istimewa
            kami menjadi kenangan yang indah.
          </p>
        </Reveal>
        <Reveal variant="up" delay={300}>
          <p className="mt-10 text-sm text-neutral-500">Kami yang berbahagia</p>
          <p className="mt-1 text-2xl font-bold text-neutral-800">
            {couple.groom_name} &amp; {couple.bride_name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
