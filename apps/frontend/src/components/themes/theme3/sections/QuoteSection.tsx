import Reveal from "../components/ThemeReveal";
import { DecoCorner, GoldDivider } from "../components/ornaments";

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
const DEFAULT_QUOTE_SOURCE = "Qs. Ar-Rum: 21";

/** Pembuka editorial: portrait sinematik dan kutipan dalam satu komposisi. */
export default function QuoteSection({
  photoUrl,
  quoteText,
  quoteSource,
}: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="noir-section relative px-6 py-24">
      <Reveal variant="zoom" className="relative z-10 mx-auto w-full max-w-sm">
        <article className="noir-card relative overflow-hidden p-2">
          <DecoCorner className="absolute left-3 top-3 z-20 h-9 w-9" />
          <DecoCorner className="absolute right-3 top-3 z-20 h-9 w-9 rotate-90" />
          <figure className="relative aspect-[4/5] overflow-hidden">
            <img
              src={photoUrl}
              alt="Potret pasangan"
              loading="lazy"
              className="size-full object-cover transition-transform duration-[1200ms] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-5 px-5 text-center">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-[var(--color-primary)]">
                A Promise Of Forever
              </p>
            </figcaption>
          </figure>

          <div className="px-5 py-9 text-center">
            <blockquote className="font-serif text-sm italic leading-loose text-[var(--dk-ivory)]/80 md:text-base">
              &ldquo;{text}&rdquo;
            </blockquote>
            <GoldDivider className="mx-auto mt-6 w-44" />
            <cite className="mt-4 block text-[0.6rem] font-semibold uppercase not-italic tracking-[0.3em] text-[var(--color-primary)]">
              {source}
            </cite>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
