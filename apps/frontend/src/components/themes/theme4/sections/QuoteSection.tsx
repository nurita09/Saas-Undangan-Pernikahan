import Reveal from '../../../shared/Reveal';
import { ArchDivider, Bismillah } from '../components/ornaments';

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

/** Section 1: foto berbingkai lengkung + kutipan ayat (bisa diganti). */
export default function QuoteSection({ photoUrl, quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="px-6 py-20 bg-white">
      <div className="mx-auto w-full max-w-sm text-center">
        <Reveal variant="zoom">
          <div className="mx-auto w-fit rounded-t-full border border-[var(--color-primary)]/50 p-2 bg-[var(--color-secondary)]">
            <div className="h-72 w-56 overflow-hidden rounded-t-full">
              <img
                src={photoUrl}
                alt="Couple"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <Bismillah className="mt-8 text-xl text-[var(--color-primary)]" />
          <p className="mt-4 italic text-neutral-600 leading-loose font-serif text-sm md:text-base">
            &ldquo;{text}&rdquo;
          </p>
        </Reveal>
        <Reveal variant="up" delay={400}>
          <ArchDivider className="mx-auto mt-5 w-44" />
          <p className="mt-4 text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-primary)]">
            {source}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
