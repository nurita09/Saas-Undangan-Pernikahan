import { useState } from "react";
import type { WeddingGiftInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  CopyIcon,
  GiftIcon,
  SectionHeading,
  stripeBackground,
} from "../components/ornaments";

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

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
  const copyText = async (value: string, index: number) => {
    if (!value.trim()) return;
    try {
      await copyWithFallback(value);
      setCopyFailedIdx(null);
      setCopiedIdx(index);
      setTimeout(
        () => setCopiedIdx((current) => (current === index ? null : current)),
        1800,
      );
    } catch {
      setCopiedIdx(null);
      setCopyFailedIdx(index);
      setTimeout(
        () =>
          setCopyFailedIdx((current) => (current === index ? null : current)),
        2500,
      );
    }
  };
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={stripeBackground(0.1)}
      />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="blur">
          <GiftIcon className="mb-5 h-8 w-8 text-[var(--rp-yellow)]" />
          <SectionHeading
            eyebrow="A Little Something"
            title="Gift Corner"
            description="Kehadiranmu sudah jadi hadiah terbaik. Kalau ingin berbagi tanda kasih, detailnya ada di sini."
            inverse
            align="left"
          />
        </Reveal>
        <div className="mt-10 space-y-5">
          {gifts.map((gift, index) => {
            const isDelivery = gift.gift_type === "kado";
            const value = gift.account_number || "";
            return (
              <Reveal
                key={`${gift.bank_name}-${index}`}
                variant="up"
                delay={index * 90}
              >
                <article className="rp-card p-6 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.52rem] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                        {isDelivery ? "Send A Present" : "Bank Transfer"}
                      </p>
                      <h3 className="mt-2 font-retro text-xl text-[var(--rp-ink)]">
                        {isDelivery
                          ? "Alamat Penerima"
                          : gift.bank_name || "Rekening"}
                      </h3>
                    </div>
                    <GiftIcon className="h-6 w-6 text-[var(--rp-teal)]" />
                  </div>
                  <dl className="mt-5 space-y-4 border-t-2 border-dashed border-[var(--rp-line)] pt-5">
                    <div>
                      <dt className="text-[0.52rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-teal)]">
                        {isDelivery ? "Nama Penerima" : "Atas Nama"}
                      </dt>
                      <dd className="mt-1 text-sm text-[var(--rp-muted)]">
                        {gift.account_name || "Belum ditentukan"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.52rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-teal)]">
                        {isDelivery ? "Alamat" : "Nomor Rekening"}
                      </dt>
                      <dd className="mt-1 break-words text-sm text-[var(--rp-muted)]">
                        {value || "Belum ditentukan"}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => copyText(value, index)}
                    disabled={!value.trim()}
                    className="rp-button mt-6 inline-flex min-h-11 items-center gap-2 bg-[var(--rp-yellow)] px-4 text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[var(--rp-ink)] transition-all disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copiedIdx === index ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                    {copiedIdx === index
                      ? "Tersalin"
                      : copyFailedIdx === index
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
