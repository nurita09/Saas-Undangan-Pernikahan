import Reveal from "../components/ThemeReveal";
import { Divider, FloralCorners } from "../components/ornaments";

interface QuoteSectionProps {
  /** Teks kutipan dari theme_settings.quote_text -- bisa diganti pasangan
   *  (mis. ayat Alkitab, puisi) supaya tidak terkunci ke satu agama. */
  quoteText?: string | null;
  quoteSource?: string | null;
}

const DEFAULT_QUOTE_TEXT =
  "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan " +
  "untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia " +
  "menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar " +
  "terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
const DEFAULT_QUOTE_SOURCE = "QS. Ar-Rum : 21";

/** Section 1: salam pembuka bergaya halaman editorial. */
export default function QuoteSection({
  quoteText,
  quoteSource,
}: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="floral-section relative overflow-hidden px-7 py-28">
      <FloralCorners spots={["tr", "bl"]} size="w-28" opacity="opacity-25" />
      <Reveal variant="bloom" className="relative mx-auto max-w-md text-center">
        <p className="label-caps text-[var(--fl-clay)]">Undangan Pernikahan</p>
        <Divider className="mt-3 h-12" />
        <div className="relative mx-auto mt-3 border-y border-[var(--fl-gold)]/30 px-3 py-11">
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-secondary)] px-4 font-floral-serif text-5xl leading-none text-[var(--fl-blush)]"
          >
            &ldquo;
          </span>
          <p className="font-floral-serif text-[1.35rem] leading-[1.75] text-[var(--fl-ink)]/85 italic">
            {text}
          </p>
          <p className="label-caps mt-8 text-[var(--fl-clay)]">{source}</p>
        </div>
      </Reveal>
    </section>
  );
}
