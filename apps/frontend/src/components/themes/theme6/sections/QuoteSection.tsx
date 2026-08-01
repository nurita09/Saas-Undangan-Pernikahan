import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { Monogram } from '../components/ornaments';

interface QuoteSectionProps {
  couple: CoupleInfo;
  /** Kutipan dari theme_settings.quote_text -- bisa diganti pasangan
   *  (mis. ayat Alkitab, puisi) supaya tidak terkunci ke satu agama. */
  quoteText?: string | null;
  quoteSource?: string | null;
}

const GREETING =
  'Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud ' +
  'menyelenggarakan resepsi pernikahan kami. Merupakan suatu kehormatan bagi ' +
  'kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.';

const DEFAULT_QUOTE_TEXT =
  'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup ' +
  'dari jenismu sendiri, supaya kamu merasa tenteram di sampingnya, dan Dia menjadikan ' +
  'di antaramu rasa kasih dan sayang.';
const DEFAULT_QUOTE_SOURCE = 'QS. Ar-Rum : 21';

/** Section 1: salam pembuka + kutipan dalam bingkai border-y. */
export default function QuoteSection({ couple, quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="px-7 py-20 text-center">
      <Reveal variant="up">
        <Monogram
          couple={couple}
          className="mx-auto h-20 w-20 text-3xl text-[var(--sage-deep)] opacity-80"
        />
        <p className="mt-6 text-sm leading-relaxed text-[var(--t6-muted)]">{GREETING}</p>
      </Reveal>
      <Reveal variant="up" delay={120}>
        <div className="mt-9 border-y border-[var(--color-primary)]/25 bg-[var(--t6-card)]/50 px-5 py-7">
          <p className="font-vintage text-lg leading-relaxed text-[var(--sage-deep)] italic">
            &ldquo;{text}&rdquo;
          </p>
          <p className="mt-4 text-[0.65rem] tracking-[0.3em] text-[var(--color-primary)] uppercase">
            {source}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
