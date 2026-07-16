import Reveal from '../../../shared/Reveal';
import { DecoCorner, GoldDivider, SURFACE } from '../components/ornaments';

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

/** Section 1: foto + kutipan di kartu gelap bersudut art-deco. */
export default function QuoteSection({ photoUrl, quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="relative px-6 py-20 bg-[var(--color-secondary)]">
      <Reveal variant="zoom" className="relative z-10 mx-auto w-full max-w-sm">
        <div className="relative border border-[#D4AF37]/40 p-3 shadow-2xl" style={{ backgroundColor: SURFACE }}>
          <DecoCorner className="absolute top-2 left-2 h-8 w-8" />
          <DecoCorner className="absolute top-2 right-2 h-8 w-8 rotate-90" />
          <DecoCorner className="absolute bottom-2 right-2 h-8 w-8 rotate-180" />
          <DecoCorner className="absolute bottom-2 left-2 h-8 w-8 -rotate-90" />

          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={photoUrl}
              alt="Couple"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="px-5 py-8 text-center">
            <Reveal variant="up" delay={200}>
              <p className="italic text-neutral-300 leading-loose font-serif text-sm md:text-base">
                &ldquo;{text}&rdquo;
              </p>
            </Reveal>
            <Reveal variant="up" delay={400}>
              <GoldDivider className="mx-auto mt-5 w-44" />
              <p className="mt-4 text-xs font-semibold tracking-[0.3em] uppercase text-[#D4AF37]">
                {source}
              </p>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
