import Reveal from '../../../shared/Reveal';
import { Divider, FloralCorners } from '../components/ornaments';

interface QuoteSectionProps {
  /** Teks kutipan dari theme_settings.quote_text -- bisa diganti pasangan
   *  (mis. ayat Alkitab, puisi) supaya tidak terkunci ke satu agama. */
  quoteText?: string | null;
  quoteSource?: string | null;
}

const DEFAULT_QUOTE_TEXT =
  'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan ' +
  'untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia ' +
  'menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar ' +
  'terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.';
const DEFAULT_QUOTE_SOURCE = 'QS. Ar-Rum : 21';

/** Section 1: salam pembuka -- kutipan dalam kartu kelopak. */
export default function QuoteSection({ quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <FloralCorners spots={['tl', 'br']} opacity="opacity-45" />
      <Reveal variant="bloom" className="relative mx-auto max-w-md">
        <div className="card-petal px-7 py-12 text-center">
          <p className="label-caps text-[var(--fl-muted)]">Undangan Pernikahan</p>
          <Divider className="mt-4" />
          <p className="font-floral-serif text-lg leading-relaxed text-[var(--fl-ink)]/85 italic">
            &ldquo;{text}&rdquo;
          </p>
          <p className="label-caps mt-8 text-[var(--fl-clay)]">{source}</p>
        </div>
      </Reveal>
    </section>
  );
}
