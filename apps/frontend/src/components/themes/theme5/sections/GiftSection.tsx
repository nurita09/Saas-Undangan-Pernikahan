import { useState } from 'react';
import type { WeddingGiftInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, GroovyDivider, wavyBackground } from '../components/ornaments';

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: kado & amplop digital. */
export default function GiftSection({ gifts }: GiftSectionProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copyFailedIdx, setCopyFailedIdx] = useState<number | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const copyWithFallback = async (value: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!copied) {
      throw new Error('Gagal menyalin');
    }
  };

  const copyText = async (value: string, idx: number) => {
    if (!value.trim()) return;

    try {
      await copyWithFallback(value);
      setCopyFailedIdx(null);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((prev) => (prev === idx ? null : prev)), 1800);
    } catch {
      setCopiedIdx(null);
      setCopyFailedIdx(idx);
      setTimeout(() => setCopyFailedIdx((prev) => (prev === idx ? null : prev)), 2500);
    }
  };

  return (
    <section className="relative px-6 py-16 overflow-hidden" style={{ backgroundColor: '#C75B39' }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 invert" style={wavyBackground(0.1)} />

      <Reveal variant="up" className="relative z-10">
        <div
          className="mx-auto max-w-md rounded-[2rem] border-4 bg-white p-7 shadow-[8px_8px_0_#5C4033]"
          style={{ borderColor: COCOA }}
        >
          <h2 className="text-center font-retro text-2xl" style={{ color: COCOA }}>
            Kirim Hadiah 🎉
          </h2>
          <GroovyDivider className="mx-auto mt-3 w-44" />
          <p className="mt-5 text-center text-sm text-neutral-600 leading-relaxed">
            Kehadiranmu udah jadi hadiah terbaik buat kami! Tapi kalau mau menambah kebahagiaan,
            boleh banget lewat sini:
          </p>

          <div className="mt-7 space-y-4">
            {gifts.map((gift, idx) => (
              <Reveal key={idx} variant="up" delay={idx * 150}>
                <div
                  className={`rounded-[1.5rem] border-2 p-5 text-left ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'} transition-transform duration-500 hover:rotate-0`}
                  style={{ borderColor: COCOA, backgroundColor: idx % 2 === 0 ? '#FBF3E4' : '#F6E7C6' }}
                >
                  <span className="float-right text-xl">{gift.gift_type === 'kado' ? '🎁' : '💳'}</span>

                  {gift.gift_type === 'kado' ? (
                    <>
                      <h3 className="font-retro text-lg" style={{ color: COCOA }}>Kado</h3>
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                        Nama Penerima
                      </p>
                      <p className="text-sm text-neutral-700">{gift.account_name}</p>
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                        Alamat
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-retro text-lg" style={{ color: COCOA }}>{gift.bank_name}</h3>
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                        Atas Nama
                      </p>
                      <p className="text-sm text-neutral-700">{gift.account_name}</p>
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                        Nomor Rekening
                      </p>
                    </>
                  )}

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-neutral-700">{gift.account_number}</p>
                    <button
                      type="button"
                      onClick={() => copyText(gift.account_number || '', idx)}
                      disabled={!gift.account_number?.trim()}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0_#5C4033] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_#5C4033] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_#5C4033]"
                      style={{ borderColor: COCOA }}
                    >
                      {copiedIdx === idx ? '✓ Tersalin' : copyFailedIdx === idx ? 'Gagal' : '📋 Salin'}
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
