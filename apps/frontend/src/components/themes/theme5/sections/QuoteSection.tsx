import Reveal from '../../../shared/Reveal';
import { COCOA, GroovyDivider, RetroArches } from '../components/ornaments';

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

/** Section 1: foto dalam bingkai pelangi lengkung + kutipan. */
export default function QuoteSection({ photoUrl, quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="px-6 py-20 bg-white">
      <div className="mx-auto w-full max-w-sm text-center">
        <Reveal variant="zoom">
          <RetroArches className="mx-auto h-12 w-auto" />
          {/* Foto berbingkai lengkung pelangi */}
          <div
            className="mx-auto mt-4 w-fit -rotate-1 rounded-t-full rounded-b-[2rem] border-4 bg-[var(--color-secondary)] p-2 shadow-[6px_6px_0_#E3B23C] transition-transform duration-500 hover:rotate-0"
            style={{ borderColor: COCOA }}
          >
            <div className="h-72 w-56 overflow-hidden rounded-t-full rounded-b-[1.5rem]">
              <img
                src={photoUrl}
                alt="Couple"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <p className="mt-8 italic leading-loose text-neutral-600 text-sm md:text-base">
            &ldquo;{text}&rdquo;
          </p>
        </Reveal>
        <Reveal variant="up" delay={400}>
          <GroovyDivider className="mx-auto mt-5 w-48" />
          <p className="mt-4 font-retro text-sm tracking-[0.15em] uppercase text-[var(--color-primary)]">
            {source}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
