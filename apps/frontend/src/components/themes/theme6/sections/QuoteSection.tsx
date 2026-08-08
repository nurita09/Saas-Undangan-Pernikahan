import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { Monogram } from "../components/ornaments";

interface QuoteSectionProps {
  couple: CoupleInfo;
  photoUrl: string;
  quoteText?: string | null;
  quoteSource?: string | null;
}

const GREETING =
  "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari hari bahagia kami.";
const DEFAULT_QUOTE_TEXT =
  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup, supaya kamu merasa tenteram di sampingnya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
const DEFAULT_QUOTE_SOURCE = "QS. Ar-Rum : 21";

/** Lembar pembuka yang terasa seperti surat pribadi di dalam album. */
export default function QuoteSection({
  couple,
  photoUrl,
  quoteText,
  quoteSource,
}: QuoteSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--va-paper)] px-6 py-20">
      <div className="mx-auto max-w-sm">
        <Reveal variant="up">
          <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-start gap-5 border-b border-[var(--va-line)] pb-5">
            <div>
              <p className="text-[0.58rem] tracking-[0.28em] text-[var(--va-oxblood)] uppercase">
                A letter to our guests
              </p>
              <h2 className="mt-3 font-vintage text-[2rem] leading-none text-[var(--va-forest)]">
                Dengan penuh kasih,
              </h2>
            </div>
            <Monogram
              couple={couple}
              className="h-[4.5rem] w-[4.5rem] text-2xl text-[var(--va-oxblood)]"
            />
          </div>
        </Reveal>

        <Reveal variant="up" delay={80}>
          <div className="va-photo-frame mt-7 rotate-[-1.1deg]">
            <img
              src={photoUrl}
              alt={`Potret ${couple.groom_name} dan ${couple.bride_name}`}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover saturate-[0.8]"
            />
            <div className="flex items-center justify-between px-1 pb-1 pt-2 text-[0.52rem] tracking-[0.18em] text-[var(--va-muted)] uppercase">
              <span>Private collection</span>
              <span>Frame 01</span>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={130}>
          <div className="va-ledger-lines mt-9 pl-5">
            <p className="font-vintage text-lg leading-8 text-[var(--va-forest)]">
              Dear family & friends,
            </p>
            <p className="mt-3 text-sm leading-[1.9] text-[var(--va-muted)]">
              {GREETING}
            </p>
          </div>
          <blockquote className="mt-8 border-l-2 border-[var(--va-oxblood)] pl-5">
            <p className="font-vintage text-lg leading-7 italic text-[var(--va-ink)]">
              &ldquo;{quoteText || DEFAULT_QUOTE_TEXT}&rdquo;
            </p>
            <footer className="mt-4 text-[0.58rem] tracking-[0.24em] text-[var(--va-oxblood)] uppercase">
              {quoteSource || DEFAULT_QUOTE_SOURCE}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
