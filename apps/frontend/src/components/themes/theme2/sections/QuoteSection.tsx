import Reveal from "../components/ThemeReveal";
import { FramedCard } from "../components/ornaments";

interface QuoteSectionProps {
  photoUrl: string;
  quoteText?: string | null;
  quoteSource?: string | null;
}

const DEFAULT_QUOTE_TEXT =
  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan " +
  "untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia " +
  "menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar " +
  "terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
const DEFAULT_QUOTE_SOURCE = "QS. Ar-Rum : 21";

/** Section 1: foto pasangan + kutipan dalam kartu berbingkai ukiran sudut. */
export default function QuoteSection({
  photoUrl,
  quoteText,
  quoteSource,
}: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="jw-paper-section px-6 py-24">
      <Reveal variant="bloom" className="mx-auto max-w-md">
        <FramedCard>
          <figure className="overflow-hidden">
            <img
              src={photoUrl}
              alt="Potret pengantin adat Jawa"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
            />
          </figure>
          <blockquote className="mt-8 text-center font-jawa-serif text-xl leading-[1.65] text-[var(--jw-ink)]/85 italic">
            &ldquo;{text}&rdquo;
          </blockquote>
          <p className="mt-6 text-center text-[0.6rem] font-medium tracking-[0.35em] text-[var(--jw-gold)] uppercase">
            {source}
          </p>
        </FramedCard>
      </Reveal>
    </section>
  );
}
