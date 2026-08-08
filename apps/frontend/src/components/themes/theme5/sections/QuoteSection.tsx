import Reveal from "../components/ThemeReveal";
import {
  GroovyDivider,
  RetroArches,
  halftoneBackground,
} from "../components/ornaments";

interface QuoteSectionProps {
  photoUrl: string;
  quoteText?: string | null;
  quoteSource?: string | null;
}

const DEFAULT_QUOTE_TEXT =
  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
const DEFAULT_QUOTE_SOURCE = "Qs. Ar-Rum: 21";

/** Spread pembuka ala majalah: foto lebar dan love note. */
export default function QuoteSection({
  photoUrl,
  quoteText,
  quoteSource,
}: QuoteSectionProps) {
  return (
    <section className="rp-section-paper relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={halftoneBackground(0.04)}
      />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="left">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Love Note
              </p>
              <h2 className="mt-2 font-retro text-[2.65rem] leading-none text-[var(--rp-ink)]">
                A Little Note
                <br />
                About Love
              </h2>
            </div>
            <RetroArches className="h-12 w-20 shrink-0" />
          </div>
        </Reveal>
        <Reveal variant="zoom" className="mt-9">
          <figure className="rp-card-soft relative aspect-[16/11] overflow-hidden p-1.5">
            <img
              src={photoUrl}
              alt="Potret pasangan"
              loading="lazy"
              className="size-full object-cover"
            />
            <figcaption className="absolute bottom-5 left-5 bg-[var(--rp-yellow)] px-3 py-2 text-[0.52rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-ink)]">
              The Two Of Us
            </figcaption>
          </figure>
        </Reveal>
        <Reveal variant="up" delay={100}>
          <blockquote className="relative mt-10 border-l-4 border-[var(--rp-teal)] pl-6 text-left text-sm italic leading-loose text-[var(--rp-muted)]">
            <span
              aria-hidden="true"
              className="absolute -left-1 -top-8 font-retro text-7xl leading-none text-[var(--rp-yellow)]"
            >
              &ldquo;
            </span>
            {quoteText || DEFAULT_QUOTE_TEXT}
          </blockquote>
          <GroovyDivider className="mt-7 w-44" />
          <cite className="mt-4 block text-[0.58rem] font-bold uppercase not-italic tracking-[0.24em] text-[var(--color-primary)]">
            {quoteSource || DEFAULT_QUOTE_SOURCE}
          </cite>
        </Reveal>
      </div>
    </section>
  );
}
