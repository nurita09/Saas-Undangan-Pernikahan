import { useState } from 'react';
import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import {
  CheckIcon,
  CopyIcon,
  FloralCorners,
  GiftIcon,
  SectionTitle,
} from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Wedding Gift -- kartu rekening / alamat kado + tombol salin
 *  (label berubah "Tersalin" sebentar sebagai umpan balik). */
export default function GiftSection({ gifts }: GiftSectionProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const copyText = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((prev) => (prev === idx ? null : prev)), 2000);
    } catch {
      // Clipboard bisa ditolak browser lama -- biarkan tamu menyalin manual.
    }
  };

  return (
    <section className="relative overflow-hidden px-6 py-20">
      <FloralCorners spots={['tl', 'br']} opacity="opacity-40" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="With Love" title="Wedding Gift" />
          <p className="mx-auto mt-7 max-w-sm text-center font-floral-serif text-lg leading-relaxed text-[var(--fl-muted)]">
            Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi
            kami. Namun, jika berkenan memberikan tanda kasih, dapat disampaikan melalui informasi
            berikut.
          </p>
        </Reveal>

        <div className="mt-10 space-y-6">
          {gifts.map((gift, idx) => (
            <Reveal key={idx} variant="bloom" delay={idx * 120}>
              <div className="card-petal px-7 py-7">
                {gift.gift_type === 'kado' ? (
                  <>
                    <p className="flex items-center gap-2 font-floral-serif text-2xl tracking-[0.15em] text-[var(--color-primary)]">
                      <GiftIcon className="h-5 w-5 text-[var(--fl-clay)]" /> Kado
                    </p>
                    <div className="gold-rule my-4" />
                    <p className="label-caps text-[var(--fl-muted)]">Nama Penerima</p>
                    <p className="mt-2 font-floral-serif text-lg text-[var(--fl-ink)]/85">
                      {gift.account_name}
                    </p>
                    <p className="label-caps mt-4 text-[var(--fl-muted)]">Alamat</p>
                  </>
                ) : (
                  <>
                    <p className="font-floral-serif text-2xl tracking-[0.25em] text-[var(--color-primary)]">
                      {gift.bank_name}
                    </p>
                    <div className="gold-rule my-4" />
                    <p className="label-caps text-[var(--fl-muted)]">Atas Nama</p>
                    <p className="mt-2 font-floral-serif text-lg text-[var(--fl-ink)]/85">
                      {gift.account_name}
                    </p>
                    <p className="label-caps mt-4 text-[var(--fl-muted)]">Nomor Rekening</p>
                  </>
                )}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-floral-serif text-lg tabular-nums leading-relaxed text-[var(--fl-ink)]/85">
                    {gift.account_number}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(gift.account_number || '', idx)}
                    className="label-caps inline-flex shrink-0 items-center gap-2 border border-[var(--fl-clay)]/50 px-5 py-2.5 text-[var(--fl-clay)] transition-colors duration-500 hover:bg-[var(--fl-clay)] hover:text-white"
                  >
                    {copiedIdx === idx ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <CopyIcon className="h-3.5 w-3.5" />
                    )}
                    {copiedIdx === idx ? 'Tersalin' : 'Salin'}
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
