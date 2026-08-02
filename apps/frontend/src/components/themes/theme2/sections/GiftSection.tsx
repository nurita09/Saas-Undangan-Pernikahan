import { useState } from 'react';
import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { BatikBand, CheckIcon, CopyIcon, GiftIcon, SectionTitle } from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Tanda Katresnan (Wedding Gift) -- kartu gradasi sogan per
 *  rekening/alamat kado, tombol salin dengan label "Sampun Kasalin". */
export default function GiftSection({ gifts }: GiftSectionProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const copyText = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((prev) => (prev === idx ? null : prev)), 1800);
    } catch {
      // Clipboard bisa ditolak browser lama -- biarkan tamu menyalin manual.
    }
  };

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Tanda Katresnan" title="Hadiah Pernikahan" />
          <p className="mx-auto mt-6 max-w-sm text-center text-sm leading-relaxed text-[var(--jw-muted)]">
            Doa restu panjenengan sampun cekap kagem kula sekaliyan. Nanging menawi kepareng paring
            tanda katresnan, saged lumantar:
          </p>
        </Reveal>

        <div className="mt-10 space-y-5">
          {gifts.map((gift, idx) => (
            <Reveal key={idx} variant="bloom" delay={idx * 120}>
              <div className="relative overflow-hidden bg-[var(--jw-sogan-gradient)] p-6 text-[var(--color-secondary)]">
                <BatikBand className="opacity-[0.14]" />
                <div className="relative">
                  {gift.gift_type === 'kado' ? (
                    <>
                      <p className="flex items-center gap-2 text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold-soft)] uppercase">
                        <GiftIcon className="h-3.5 w-3.5" /> Kirim Kado
                      </p>
                      {gift.account_name && (
                        <p className="mt-3 font-jawa-serif text-xl">{gift.account_name}</p>
                      )}
                      <p className="mt-1 text-sm text-[var(--color-secondary)]/70">
                        {gift.account_number}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold-soft)] uppercase">
                        {gift.bank_name}
                      </p>
                      <p className="mt-3 font-jawa-serif text-2xl tracking-[0.14em]">
                        {gift.account_number}
                      </p>
                      {gift.account_name && (
                        <p className="mt-1 text-sm text-[var(--color-secondary)]/70">
                          a.n. {gift.account_name}
                        </p>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => copyText(gift.account_number || '', idx)}
                    className="mt-5 inline-flex items-center gap-2 border border-[var(--jw-gold-soft)]/60 px-5 py-2.5 text-[0.55rem] font-medium tracking-[0.2em] text-[var(--jw-gold-soft)] uppercase transition-colors hover:bg-[var(--jw-gold-soft)]/15"
                  >
                    {copiedIdx === idx ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <CopyIcon className="h-3.5 w-3.5" />
                    )}
                    {copiedIdx === idx ? 'Sampun Kasalin' : 'Salin Nomer'}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
