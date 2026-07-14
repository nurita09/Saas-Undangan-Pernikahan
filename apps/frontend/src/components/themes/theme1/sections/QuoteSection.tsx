import Reveal from '../components/Reveal';
import section1TopLeft from '../../../../assets/theme1/section1/th1-section1-ataskiri.png';
import section1TopRight from '../../../../assets/theme1/section1/th1-section1-ataskanan.png';
import section1BottomLeft from '../../../../assets/theme1/section1/th1-section1-bawahkiri.png';
import section1BottomRight from '../../../../assets/theme1/section1/th1-section1-bawahkanan.png';

interface QuoteSectionProps {
  photoUrl: string;
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
const DEFAULT_QUOTE_SOURCE = 'Qs. Ar-Rum: 21';

/** Section 1: foto pasangan + kutipan (default Qs. Ar-Rum: 21, bisa diganti). */
export default function QuoteSection({ photoUrl, quoteText, quoteSource }: QuoteSectionProps) {
  const text = quoteText || DEFAULT_QUOTE_TEXT;
  const source = quoteSource || DEFAULT_QUOTE_SOURCE;

  return (
    <section className="relative px-6 py-20 overflow-hidden">
      {/* Dekorasi sudut -- di belakang card (z-0), sebagian sengaja tertutup card
          persis seperti referensi desain (rose mengintip dari balik card).
          .deco-float bikin tiap bunga melayang pelan; durasi dibedakan per
          elemen supaya gerakannya tidak serempak (lebih organik). */}
      <img
        src={section1TopLeft}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-0 left-0 w-[40%] h-auto z-0"
        style={{ animationDuration: '8s' }}
      />
      <img
        src={section1TopRight}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-0 right-0 w-[26%] h-auto z-0"
        style={{ animationDuration: '10s', animationDelay: '0.8s' }}
      />
      <img
        src={section1BottomLeft}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute bottom-0 left-0 w-[22%] h-auto z-0"
        style={{ animationDuration: '9s', animationDelay: '1.4s' }}
      />
      <img
        src={section1BottomRight}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute bottom-0 right-0 w-[18%] h-auto z-0"
        style={{ animationDuration: '11s', animationDelay: '0.4s' }}
      />

      <Reveal variant="zoom" className="relative z-10 mx-auto w-full max-w-sm">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={photoUrl}
              alt="Couple"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="px-6 py-8 text-center">
            <Reveal variant="up" delay={200}>
              <p className="italic text-neutral-600 leading-loose font-serif text-sm md:text-base">
                &ldquo;{text}&rdquo;
              </p>
            </Reveal>
            <Reveal variant="up" delay={400}>
              <p className="mt-6 text-sm font-bold tracking-widest uppercase text-neutral-500">
                {source}
              </p>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
