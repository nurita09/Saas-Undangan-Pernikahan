import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { Monogram } from '../components/ornaments';

interface ThankYouSectionProps {
  couple: CoupleInfo;
}

/** Section 8: penutup di atas latar sage tua -- monogram + terima kasih + nama script. */
export default function ThankYouSection({ couple }: ThankYouSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--sage-deep)] px-7 py-24 text-center text-[var(--color-secondary)]">
      <Reveal variant="up">
        <Monogram couple={couple} className="mx-auto h-20 w-20 text-3xl opacity-80" />
        <p className="mt-6 text-sm leading-relaxed opacity-85">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
          hadir dan memberikan doa restu kepada kedua mempelai.
        </p>
      </Reveal>
      <Reveal variant="up" delay={150}>
        <p className="mt-8 text-xs tracking-[0.25em] uppercase opacity-70">Kami yang berbahagia</p>
        <h2 className="mt-6 font-vintage-script text-4xl leading-snug">
          {couple.groom_name}
          <span className="mx-2 font-vintage text-2xl align-middle opacity-80">&amp;</span>
          {couple.bride_name}
        </h2>
      </Reveal>
    </section>
  );
}
