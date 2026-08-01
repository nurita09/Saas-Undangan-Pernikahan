import { useState } from 'react';
import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { CheckIcon, CopyIcon, GiftIcon, SectionTitle } from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: hadiah pernikahan -- kartu rekening/alamat kado + tombol salin
 *  (ikon berubah centang sebentar sebagai umpan balik berhasil disalin). */
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
    <section className="bg-[var(--sage-soft)] px-7 py-20">
      <Reveal variant="up">
        <SectionTitle kicker="Wedding Gift" title="Hadiah Pernikahan" />
        <p className="mt-4 text-center text-sm leading-relaxed text-[var(--t6-muted)]">
          Doa restu Anda adalah karunia yang sangat berarti. Namun jika memberi adalah tanda kasih,
          kami dengan senang hati menerimanya.
        </p>
      </Reveal>
      <div className="mt-7 space-y-4">
        {gifts.map((gift, idx) => (
          <Reveal key={idx} variant="up" delay={idx * 90}>
            <div className="border border-[var(--color-primary)]/25 bg-[var(--t6-card)] px-6 py-6 shadow-md">
              {gift.gift_type === 'kado' ? (
                <>
                  <p className="flex items-center gap-2 text-[0.6rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
                    <GiftIcon className="h-3.5 w-3.5" /> Kirim Hadiah
                  </p>
                  {gift.account_name && (
                    <p className="mt-2 font-vintage text-xl text-[var(--sage-deep)]">
                      {gift.account_name}
                    </p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-[var(--t6-muted)]">
                    {gift.account_number}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[0.6rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
                    {gift.bank_name}
                  </p>
                  <p className="mt-2 font-vintage text-2xl tracking-wide text-[var(--sage-deep)] tabular-nums">
                    {gift.account_number}
                  </p>
                  {gift.account_name && (
                    <p className="mt-1 text-xs text-[var(--t6-muted)]">a.n. {gift.account_name}</p>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => copyText(gift.account_number || '', idx)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--color-primary)]/40 py-2.5 text-sm text-[var(--sage-deep)] transition-colors hover:bg-[var(--color-primary)]/10"
              >
                {copiedIdx === idx ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
                {gift.gift_type === 'kado' ? 'Salin Alamat' : 'Salin Nomor Rekening'}
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
