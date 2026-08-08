import { useState } from "react";
import type { WeddingGiftInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  CopyIcon,
  GiftIcon,
  SectionHeading,
  geometricBackground,
} from "../components/ornaments";

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

/** Pilihan tanda kasih dalam kartu mandiri di atas bidang hijau mineral. */
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
    <section className="im-section-deep relative overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={geometricBackground(0.06)}
      />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="blur">
          <GiftIcon className="mx-auto mb-5 h-7 w-7 text-[var(--im-clay)]" />
          <SectionHeading
            arabic="جَزَاكُمُ اللَّهُ خَيْرًا"
            eyebrow="A Token Of Love"
            title="Tanda Kasih"
            description="Kehadiran dan doa restu Anda adalah hadiah terindah. Bagi yang berkenan, tanda kasih dapat disampaikan melalui pilihan berikut."
            inverse
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
                <article className="im-card p-6 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                        {isDelivery ? "Kirim Hadiah" : "Bank Transfer"}
                      </p>
                      <h3 className="mt-2 font-serif text-xl text-[var(--im-ink)]">
                        {isDelivery
                          ? "Alamat Penerima"
                          : gift.bank_name || "Rekening"}
                      </h3>
                    </div>
                    <GiftIcon className="h-6 w-6 shrink-0 text-[var(--im-clay)]" />
                  </div>
                  <dl className="mt-5 space-y-4 border-t border-[var(--im-line)] pt-5">
                    <div>
                      <dt className="text-[0.52rem] uppercase tracking-[0.26em] text-[var(--color-primary)]">
                        {isDelivery ? "Nama Penerima" : "Atas Nama"}
                      </dt>
                      <dd className="mt-1 text-sm text-[var(--im-muted)]">
                        {gift.account_name || "Belum ditentukan"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.52rem] uppercase tracking-[0.26em] text-[var(--color-primary)]">
                        {isDelivery ? "Alamat" : "Nomor Rekening"}
                      </dt>
                      <dd className="mt-1 break-words text-sm leading-relaxed text-[var(--im-muted)]">
                        {value || "Belum ditentukan"}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => copyText(value, index)}
                    disabled={!value.trim()}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[var(--color-primary)] px-4 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
