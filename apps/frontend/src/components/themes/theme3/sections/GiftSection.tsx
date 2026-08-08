import { useState } from "react";
import type { WeddingGiftInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  CopyIcon,
  GiftIcon,
  GoldDivider,
} from "../components/ornaments";

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Opsi tanda kasih dalam kartu mandiri, tanpa panel bersarang. */
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
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!copied) throw new Error("Gagal menyalin");
  };

  const copyText = async (value: string, idx: number) => {
    if (!value.trim()) return;
    try {
      await copyWithFallback(value);
      setCopyFailedIdx(null);
      setCopiedIdx(idx);
      setTimeout(
        () => setCopiedIdx((current) => (current === idx ? null : current)),
        1800,
      );
    } catch {
      setCopiedIdx(null);
      setCopyFailedIdx(idx);
      setTimeout(
        () => setCopyFailedIdx((current) => (current === idx ? null : current)),
        2500,
      );
    }
  };

  return (
    <section className="noir-section px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur" className="text-center">
          <GiftIcon className="mx-auto h-7 w-7 text-[var(--color-primary)]" />
          <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            A Token Of Love
          </p>
          <h2 className="mt-4 font-script text-[4rem] leading-none text-[var(--dk-ivory)]">
            Wedding Gift
          </h2>
          <GoldDivider className="mx-auto mt-5 w-48" />
          <p className="mx-auto mt-7 max-w-sm text-sm leading-relaxed text-[var(--dk-muted)]">
            Kehadiran dan doa restu Anda adalah hadiah terindah. Bagi yang
            berkenan memberikan tanda kasih, dapat disampaikan melalui pilihan
            berikut.
          </p>
        </Reveal>

        <div className="mt-10 space-y-5">
          {gifts.map((gift, idx) => {
            const isDelivery = gift.gift_type === "kado";
            const value = gift.account_number || "";
            return (
              <Reveal
                key={`${gift.bank_name}-${idx}`}
                variant="up"
                delay={idx * 100}
              >
                <article className="noir-wine-card p-6 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-[var(--color-primary)]">
                        {isDelivery ? "Kirim Hadiah" : "Bank Transfer"}
                      </p>
                      <h3 className="mt-2 font-serif text-xl text-[var(--dk-ivory)]">
                        {isDelivery
                          ? "Alamat Penerima"
                          : gift.bank_name || "Rekening"}
                      </h3>
                    </div>
                    <GiftIcon className="h-6 w-6 shrink-0 text-[var(--color-primary)]" />
                  </div>

                  <dl className="mt-6 space-y-4 border-t border-[var(--dk-line)] pt-5">
                    <div>
                      <dt className="text-[0.55rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">
                        {isDelivery ? "Nama Penerima" : "Atas Nama"}
                      </dt>
                      <dd className="mt-1 text-sm text-[var(--dk-ivory)]/80">
                        {gift.account_name || "Belum ditentukan"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.55rem] uppercase tracking-[0.28em] text-[var(--color-primary)]">
                        {isDelivery ? "Alamat" : "Nomor Rekening"}
                      </dt>
                      <dd className="mt-1 break-words text-sm leading-relaxed text-[var(--dk-ivory)]/80">
                        {value || "Belum ditentukan"}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => copyText(value, idx)}
                    disabled={!value.trim()}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[var(--color-primary)] px-4 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copiedIdx === idx ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                    {copiedIdx === idx
                      ? "Tersalin"
                      : copyFailedIdx === idx
                        ? "Gagal Menyalin"
                        : "Salin Detail"}
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
