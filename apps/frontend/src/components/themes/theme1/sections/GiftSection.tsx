import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../components/Reveal';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Wedding Gift -- rekening / alamat kado dengan tombol salin. */
export default function GiftSection({ gifts }: GiftSectionProps) {
  if (!gifts || gifts.length === 0) return null;

  return (
    <section className="bg-[#CCBBA1] px-6 py-16">
      <Reveal variant="up">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-center text-2xl font-bold text-neutral-800">Wedding Gift</h2>
          <p className="mt-4 text-center text-sm text-neutral-500 leading-relaxed">
            Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi kami.
          </p>
          <p className="mt-3 text-center text-sm text-neutral-500 leading-relaxed">
            Namun, jika berkenan memberikan tanda kasih, dapat disampaikan melalui informasi berikut.
          </p>

          <div className="mt-8 space-y-4">
            {gifts.map((gift, idx) => (
              <Reveal key={idx} variant="up" delay={idx * 150}>
                <div className="relative rounded-2xl border border-neutral-200 p-5 text-left transition-transform duration-500 hover:-translate-y-1">
                  <span className="absolute top-5 right-5 text-xl text-neutral-800">
                    {gift.gift_type === 'kado' ? '🎁' : '💳'}
                  </span>

                  {gift.gift_type === 'kado' ? (
                    <>
                      <h3 className="text-lg font-bold text-neutral-800">Kado</h3>
                      <p className="mt-4 text-sm font-semibold text-neutral-800">Nama Penerima</p>
                      <p className="text-sm text-neutral-600">{gift.account_name}</p>
                      <p className="mt-3 text-sm font-semibold text-neutral-800">Alamat</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-neutral-800">{gift.bank_name}</h3>
                      <p className="mt-4 text-sm font-semibold text-neutral-800">Atas Nama</p>
                      <p className="text-sm text-neutral-600">{gift.account_name}</p>
                      <p className="mt-3 text-sm font-semibold text-neutral-800">Nomor Rekening</p>
                    </>
                  )}

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-neutral-600">{gift.account_number}</p>
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
