import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { CornerCarving, OrnamentDivider, kawungBackground } from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Tanda Asih (wedding gift) -- rekening/alamat kado. */
export default function GiftSection({ gifts }: GiftSectionProps) {
  if (!gifts || gifts.length === 0) return null;

  return (
    <section className="relative bg-[var(--color-primary)] px-6 py-16 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={kawungBackground(0.12)} />

      <Reveal variant="up" className="relative z-10">
        <div className="relative mx-auto max-w-md border border-[#C9A227]/60 bg-white p-7 shadow-lg">
          <CornerCarving className="absolute top-1.5 left-1.5 h-8 w-8" />
          <CornerCarving className="absolute top-1.5 right-1.5 h-8 w-8 rotate-90" />
          <CornerCarving className="absolute bottom-1.5 right-1.5 h-8 w-8 rotate-180" />
          <CornerCarving className="absolute bottom-1.5 left-1.5 h-8 w-8 -rotate-90" />

          <h2 className="text-center text-xl font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Tanda Asih
          </h2>
          <OrnamentDivider className="mx-auto mt-3 w-40" />
          <p className="mt-5 text-center text-sm text-neutral-600 leading-relaxed">
            Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi
            kami. Namun jika berkenan memberikan tanda kasih, dapat disampaikan melalui:
          </p>

          <div className="mt-7 space-y-4">
            {gifts.map((gift, idx) => (
              <Reveal key={idx} variant="up" delay={idx * 150}>
                <div className="border border-[#C9A227]/40 p-5 text-left">
                  <span className="float-right text-xl">{gift.gift_type === 'kado' ? '🎁' : '💳'}</span>

                  {gift.gift_type === 'kado' ? (
                    <>
                      <h3 className="font-serif text-lg font-bold text-[var(--color-primary)]">Kado</h3>
                      <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                        Nama Penerima
                      </p>
                      <p className="text-sm text-neutral-700">{gift.account_name}</p>
                      <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                        Alamat
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-serif text-lg font-bold text-[var(--color-primary)]">
                        {gift.bank_name}
                      </h3>
                      <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                        Atas Nama
                      </p>
                      <p className="text-sm text-neutral-700">{gift.account_name}</p>
                      <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                        Nomor Rekening
                      </p>
                    </>
                  )}

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-neutral-700">{gift.account_number}</p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(gift.account_number || '')}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-secondary)] hover:opacity-90 transition"
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
