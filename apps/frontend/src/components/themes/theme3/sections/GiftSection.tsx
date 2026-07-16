import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { DecoCorner, GoldDivider, SURFACE, goldGlow } from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Wedding Gift -- kartu gelap ber-glow emas. */
export default function GiftSection({ gifts }: GiftSectionProps) {
  if (!gifts || gifts.length === 0) return null;

  return (
    <section className="relative px-6 py-16 overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64" style={goldGlow(0.1)} />

      <Reveal variant="up" className="relative z-10">
        <div
          className="relative mx-auto max-w-md border border-[#D4AF37]/40 p-7 shadow-2xl"
          style={{ backgroundColor: SURFACE }}
        >
          <DecoCorner className="absolute top-1.5 left-1.5 h-8 w-8" />
          <DecoCorner className="absolute top-1.5 right-1.5 h-8 w-8 rotate-90" />
          <DecoCorner className="absolute bottom-1.5 right-1.5 h-8 w-8 rotate-180" />
          <DecoCorner className="absolute bottom-1.5 left-1.5 h-8 w-8 -rotate-90" />

          <h2 className="text-center text-lg font-semibold uppercase tracking-[0.35em] text-neutral-100">
            Wedding Gift
          </h2>
          <GoldDivider className="mx-auto mt-3 w-44" />
          <p className="mt-5 text-center text-sm text-neutral-400 leading-relaxed">
            Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi
            kami. Namun jika berkenan memberikan tanda kasih, dapat disampaikan melalui:
          </p>

          <div className="mt-7 space-y-4">
            {gifts.map((gift, idx) => (
              <Reveal key={idx} variant="up" delay={idx * 150}>
                <div className="border border-[#D4AF37]/25 p-5 text-left">
                  <span className="float-right text-xl">{gift.gift_type === 'kado' ? '🎁' : '💳'}</span>

                  {gift.gift_type === 'kado' ? (
                    <>
                      <h3 className="font-serif text-lg font-bold text-neutral-100">Kado</h3>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
                        Nama Penerima
                      </p>
                      <p className="text-sm text-neutral-300">{gift.account_name}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
                        Alamat
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-serif text-lg font-bold text-neutral-100">{gift.bank_name}</h3>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
                        Atas Nama
                      </p>
                      <p className="text-sm text-neutral-300">{gift.account_name}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
                        Nomor Rekening
                      </p>
                    </>
                  )}

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-neutral-300">{gift.account_number}</p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(gift.account_number || '')}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-[#10131C] hover:opacity-90 transition"
                    >
                      📋 Salin
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
