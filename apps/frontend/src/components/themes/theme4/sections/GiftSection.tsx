import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { ArchDivider, geometricBackground } from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Tanda Kasih -- amplop digital / kado. */
export default function GiftSection({ gifts }: GiftSectionProps) {
  if (!gifts || gifts.length === 0) return null;

  return (
    <section className="relative bg-[var(--color-secondary)] px-6 py-16 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={geometricBackground(0.05)} />

      <Reveal variant="up" className="relative z-10">
        <div className="mx-auto max-w-md rounded-t-[3rem] rounded-b-2xl border border-[var(--color-primary)]/40 bg-white p-7 shadow-sm">
          <h2 className="text-center font-serif text-2xl font-semibold text-neutral-800">Tanda Kasih</h2>
          <ArchDivider className="mx-auto mt-3 w-40" />
          <p className="mt-5 text-center text-sm text-neutral-500 leading-relaxed">
            Doa restu Bapak/Ibu/Saudara/i adalah karunia terindah bagi kami. Namun jika berkenan
            memberikan tanda kasih, dapat disampaikan melalui:
          </p>

          <div className="mt-7 space-y-4">
            {gifts.map((gift, idx) => (
              <Reveal key={idx} variant="up" delay={idx * 150}>
                <div className="rounded-2xl border border-[var(--color-primary)]/30 p-5 text-left">
                  <span className="float-right text-xl">{gift.gift_type === 'kado' ? '🎁' : '💳'}</span>

                  {gift.gift_type === 'kado' ? (
                    <>
                      <h3 className="font-serif text-lg font-bold text-neutral-800">Kado</h3>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                        Nama Penerima
                      </p>
                      <p className="text-sm text-neutral-700">{gift.account_name}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                        Alamat
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-serif text-lg font-bold text-neutral-800">{gift.bank_name}</h3>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                        Atas Nama
                      </p>
                      <p className="text-sm text-neutral-700">{gift.account_name}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                        Nomor Rekening
                      </p>
                    </>
                  )}

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-neutral-700">{gift.account_number}</p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(gift.account_number || '')}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
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
