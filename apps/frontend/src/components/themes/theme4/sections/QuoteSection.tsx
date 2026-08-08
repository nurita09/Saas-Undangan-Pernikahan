import Reveal from "../components/ThemeReveal";
import { ArchDivider, Bismillah, IslamicArch } from "../components/ornaments";

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

/** Pembuka ayat dengan portrait besar di dalam jendela mihrab. */
export default function QuoteSection({
  photoUrl,
  quoteText,
  quoteSource,
}: QuoteSectionProps) {
  return (
    <section className="im-section relative overflow-hidden px-6 py-24 text-center">
      <IslamicArch className="pointer-events-none absolute -right-20 top-10 h-80 w-auto text-[var(--color-primary)]/8" />
      <div className="relative mx-auto max-w-sm">
        <Reveal variant="zoom">
          <figure className="im-mihrab-photo mx-auto aspect-[4/5] w-[78%] p-1.5">
            <img
              src={photoUrl}
              alt="Potret pasangan"
              loading="lazy"
              className="size-full rounded-t-[999px] object-cover"
            />
          </figure>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <Bismillah className="mt-10 text-2xl text-[var(--color-primary)]" />
          <p
            className="mt-3 font-arabic text-[1.55rem] leading-loose text-[var(--im-clay)]"
            lang="ar"
            dir="rtl"
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
          </p>
          <blockquote className="mt-5 font-serif text-sm italic leading-loose text-[var(--im-muted)] md:text-base">
            &ldquo;{quoteText || DEFAULT_QUOTE_TEXT}&rdquo;
          </blockquote>
          <ArchDivider className="mx-auto mt-6 w-44 text-[var(--color-primary)]" />
          <cite className="mt-4 block text-[0.58rem] font-semibold uppercase not-italic tracking-[0.3em] text-[var(--color-primary)]">
            {quoteSource || DEFAULT_QUOTE_SOURCE}
          </cite>
        </Reveal>
      </div>
    </section>
  );
}
