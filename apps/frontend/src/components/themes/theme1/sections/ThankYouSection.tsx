import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { Divider, FloralCorners } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: ucapan terima kasih penutup, dikelilingi ornamen bunga 4 sudut. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-24 text-center">
      <FloralCorners spots={['tl', 'tr', 'bl', 'br']} opacity="opacity-55" />
      <Reveal variant="bloom" className="relative mx-auto max-w-md">
        <h2 className="font-floral-script text-5xl text-[var(--color-primary)]">Thank You</h2>
        <Divider className="mt-2" />
        <p className="font-floral-serif text-lg leading-relaxed text-[var(--fl-muted)]">
          Terima kasih atas doa, restu, dan kehadiran Anda. Semoga kebersamaan di hari istimewa
          kami menjadi kenangan yang indah.
        </p>
        <p className="mt-10 font-floral-script text-4xl text-[var(--fl-clay)]">
          {couple.groom_name} &amp; {couple.bride_name}
        </p>
      </Reveal>
    </section>
  );
}
