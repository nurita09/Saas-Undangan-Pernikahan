import Reveal from '../../../shared/Reveal';
import { CornerCarving, OrnamentDivider } from '../components/ornaments';

interface QuoteSectionProps {
  photoUrl: string;
  quoteText?: string | null;
  quoteSource?: string | null;
}

const DEFAULT_QUOTE_TEXT =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan ' +
  'untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia ' +
  'menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar ' +
  'terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.';
const DEFAULT_QUOTE_SOURCE = 'Qs. Ar-Rum: 21';

/** Section 1: foto + kutipan dalam card berbingkai ukiran sudut. */
export default function QuoteSection({ photoUrl, quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="relative px-6 py-20 bg-[var(--color-secondary)]">
      <Reveal variant="zoom" className="relative z-10 mx-auto w-full max-w-sm">
        <div className="relative border border-[#C9A227]/50 bg-white p-3 shadow-lg">
          <CornerCarving className="absolute top-2 left-2 h-9 w-9" />
          <CornerCarving className="absolute top-2 right-2 h-9 w-9 rotate-90" />
          <CornerCarving className="absolute bottom-2 right-2 h-9 w-9 rotate-180" />
          <CornerCarving className="absolute bottom-2 left-2 h-9 w-9 -rotate-90" />

          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={photoUrl}
              alt="Couple"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="px-5 py-8 text-center">
            <Reveal variant="up" delay={200}>
              <p className="italic text-neutral-600 leading-loose font-serif text-sm md:text-base">
                &ldquo;{text}&rdquo;
              </p>
            </Reveal>
            <Reveal variant="up" delay={400}>
              <OrnamentDivider className="mx-auto mt-5 w-40" />
              <p className="mt-4 text-sm font-bold tracking-widest uppercase text-[var(--color-primary)]">
                {source}
              </p>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
