import { useState } from "react";
import type { WeddingGiftInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  CopyIcon,
  FloralCorners,
  GiftIcon,
  SectionTitle,
} from "../components/ornaments";

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Section 6: Wedding Gift -- kartu rekening / alamat kado + tombol salin
 *  (label berubah "Tersalin" sebentar sebagai umpan balik). */
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
        2000,
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
    <section className="floral-section relative overflow-hidden px-6 py-24">
      <FloralCorners spots={["bl"]} size="w-28" opacity="opacity-25" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="With Love" title="Wedding Gift" />
          <p className="mx-auto mt-7 max-w-sm text-center font-floral-serif text-lg leading-relaxed text-[var(--fl-muted)]">
            Doa restu dan kehadiran Bapak/Ibu/Saudara/i merupakan karunia yang
            sangat berarti bagi kami. Namun, jika berkenan memberikan tanda
            kasih, dapat disampaikan melalui informasi berikut.
          </p>
        </Reveal>

        <div className="mt-10 space-y-6">
          {gifts.map((gift, idx) => (
            <Reveal key={idx} variant="bloom" delay={idx * 120}>
              <div className="gift-card relative overflow-hidden px-7 py-8 text-white">
                {gift.gift_type === "kado" ? (
                  <>
                    <p className="relative flex items-center gap-2 font-floral-serif text-2xl tracking-[0.15em] text-white">
                      <GiftIcon className="h-5 w-5 text-[var(--fl-blush)]" />{" "}
                      Kado
                    </p>
                    <div className="gold-rule my-4" />
                    <p className="label-caps relative text-white/65">
                      Nama Penerima
                    </p>
                    <p className="relative mt-2 font-floral-serif text-xl text-white/90">
                      {gift.account_name}
                    </p>
                    <p className="label-caps relative mt-5 text-white/65">
                      Alamat
                    </p>
                  </>
                ) : (
                  <>
                    <p className="relative font-floral-serif text-2xl tracking-[0.25em] text-white">
                      {gift.bank_name}
                    </p>
                    <div className="gold-rule my-4" />
                    <p className="label-caps relative text-white/65">
                      Atas Nama
                    </p>
                    <p className="relative mt-2 font-floral-serif text-xl text-white/90">
                      {gift.account_name}
                    </p>
                    <p className="label-caps relative mt-5 text-white/65">
                      Nomor Rekening
                    </p>
                  </>
                )}
                <div className="relative mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-floral-serif text-xl tabular-nums leading-relaxed text-white/90">
                    {gift.account_number}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(gift.account_number || "", idx)}
                    disabled={!gift.account_number?.trim()}
                    className="label-caps inline-flex shrink-0 items-center gap-2 border border-white/40 bg-white/10 px-5 py-2.5 text-white transition-colors duration-500 hover:bg-white hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-white"
                  >
                    {copiedIdx === idx ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <CopyIcon className="h-3.5 w-3.5" />
                    )}
                    {copiedIdx === idx
                      ? "Tersalin"
                      : copyFailedIdx === idx
                        ? "Gagal"
                        : "Salin"}
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
