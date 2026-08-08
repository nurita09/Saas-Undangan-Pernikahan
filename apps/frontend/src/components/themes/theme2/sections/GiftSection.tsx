import { useState } from "react";
import type { WeddingGiftInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  BatikBand,
  CheckIcon,
  CopyIcon,
  GiftIcon,
  SectionTitle,
} from "../components/ornaments";

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Tanda Katresnan (Wedding Gift) -- kartu gradasi sogan per
 *  rekening/alamat kado, tombol salin dengan label "Sampun Kasalin". */
export default function GiftSection({ gifts }: GiftSectionProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copyFailedIdx, setCopyFailedIdx] = useState<number | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const copyWithFallback = async (value: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!copied) {
      throw new Error("Gagal menyalin");
    }
  };

  const copyText = async (value: string, idx: number) => {
    if (!value.trim()) return;

    try {
      await copyWithFallback(value);
      setCopyFailedIdx(null);
      setCopiedIdx(idx);
      setTimeout(
        () => setCopiedIdx((prev) => (prev === idx ? null : prev)),
        1800,
      );
    } catch {
      setCopiedIdx(null);
      setCopyFailedIdx(idx);
      setTimeout(
        () => setCopyFailedIdx((prev) => (prev === idx ? null : prev)),
        2500,
      );
    }
  };

  return (
    <section className="jw-paper-section px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Tanda Katresnan" title="Hadiah Pernikahan" />
          <p className="mx-auto mt-6 max-w-sm text-center text-sm leading-relaxed text-[var(--jw-muted)]">
            Doa restu panjenengan sampun cekap kagem kula sekaliyan. Nanging
            menawi kepareng paring tanda katresnan, saged lumantar:
          </p>
        </Reveal>

        <div className="mt-10 space-y-7">
          {gifts.map((gift, idx) => (
            <Reveal key={idx} variant="bloom" delay={idx * 120}>
              <div className="jw-night-panel relative min-h-64 overflow-hidden rounded-[4px] border border-[var(--jw-gold)]/45 px-7 py-8 text-left text-[var(--color-secondary)] shadow-[var(--jw-shadow)]">
                <BatikBand className="opacity-[0.18] mix-blend-soft-light" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.12),transparent_62%)]" />
                <div className="relative flex min-h-48 flex-col items-start justify-center">
                  {gift.gift_type === "kado" ? (
                    <>
                      <p className="flex items-center gap-2 text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold-soft)] uppercase">
                        <GiftIcon className="h-3.5 w-3.5" /> Kirim Kado
                      </p>
                      {gift.account_name && (
                        <p className="mt-5 font-jawa-serif text-3xl tracking-[0.16em]">
                          {gift.account_name}
                        </p>
                      )}
                      <p className="mt-3 text-base leading-relaxed text-[var(--color-secondary)]/78">
                        {gift.account_number}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[0.6rem] font-semibold tracking-[0.46em] text-[var(--jw-gold-soft)] uppercase">
                        {gift.bank_name}
                      </p>
                      <p className="mt-7 font-jawa-serif text-3xl leading-none tracking-[0.22em] tabular-nums text-white min-[380px]:text-4xl">
                        {gift.account_number}
                      </p>
                      {gift.account_name && (
                        <p className="mt-4 text-base font-medium text-[var(--color-secondary)]/75">
                          a.n. {gift.account_name}
                        </p>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => copyText(gift.account_number || "", idx)}
                    disabled={!gift.account_number?.trim()}
                    className="mt-8 inline-flex min-w-52 items-center justify-center gap-2 border border-[var(--jw-gold-soft)]/45 px-7 py-4 text-[0.58rem] font-semibold tracking-[0.42em] text-[var(--jw-gold-soft)] uppercase transition-all duration-500 hover:-translate-y-0.5 hover:bg-[var(--jw-gold-soft)]/12 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:bg-transparent"
                  >
                    {copiedIdx === idx ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <CopyIcon className="h-3.5 w-3.5" />
                    )}
                    {copiedIdx === idx
                      ? "Sampun Kasalin"
                      : copyFailedIdx === idx
                        ? "Gagal"
                        : gift.gift_type === "kado"
                          ? "Salin Alamat"
                          : "Salin Nomer"}
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
