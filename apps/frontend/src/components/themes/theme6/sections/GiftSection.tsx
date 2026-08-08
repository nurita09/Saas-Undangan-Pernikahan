import { useState } from "react";
import type { WeddingGiftInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  CopyIcon,
  GiftIcon,
  SectionTitle,
} from "../components/ornaments";

interface GiftSectionProps {
  gifts: WeddingGiftInfo[];
}

type CopyState = { index: number; status: "copied" | "failed" } | null;

async function copyToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<void>((_, reject) =>
          window.setTimeout(() => reject(new Error("Clipboard timeout")), 800),
        ),
      ]);
      return true;
    } catch {
      // Lanjut ke fallback untuk browser yang menolak atau menggantung.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export default function GiftSection({ gifts }: GiftSectionProps) {
  const [copyState, setCopyState] = useState<CopyState>(null);
  if (!gifts || gifts.length === 0) return null;

  const handleCopy = async (value: string | null, index: number) => {
    if (!value) return;
    const copied = await copyToClipboard(value);
    setCopyState({ index, status: copied ? "copied" : "failed" });
    window.setTimeout(
      () =>
        setCopyState((current) => (current?.index === index ? null : current)),
      2200,
    );
  };

  return (
    <section className="relative overflow-hidden bg-[var(--va-oxblood)] px-6 py-24 text-[var(--va-vellum)]">
      <span className="pointer-events-none absolute -right-6 top-10 font-vintage text-[8rem] leading-none text-white/[0.04]">
        GIFT
      </span>
      <Reveal variant="up">
        <SectionTitle
          kicker="A Note of Kindness"
          title="Tanda Kasih"
          inverse
          description="Kehadiran dan doa Anda adalah hadiah terindah bagi kami. Informasi berikut kami sertakan bagi yang ingin berbagi tanda kasih."
        />
      </Reveal>

      <div className="mt-9 space-y-4">
        {gifts.map((gift, index) => {
          const isDelivery = gift.gift_type === "kado";
          const isCurrent = copyState?.index === index;
          return (
            <Reveal
              key={`${gift.gift_type}-${index}`}
              variant="up"
              delay={index * 70}
            >
              <article className="relative border border-[var(--va-brass-soft)]/50 bg-[var(--va-vellum)] p-5 text-[var(--va-ink)] shadow-[0_20px_42px_-30px_rgba(31,20,22,0.8)]">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--va-line)] pb-4">
                  <div>
                    <p className="text-[0.55rem] tracking-[0.24em] text-[var(--va-oxblood)] uppercase">
                      {isDelivery ? "Parcel registry" : "Transfer registry"}
                    </p>
                    <h3 className="mt-2 font-vintage text-2xl text-[var(--va-forest)]">
                      {isDelivery
                        ? "Kirim Hadiah"
                        : gift.bank_name || "Rekening Bank"}
                    </h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--va-brass)]/50 text-[var(--va-oxblood)]">
                    <GiftIcon className="h-4 w-4" />
                  </span>
                </div>

                <p
                  className={`mt-5 text-[var(--va-forest)] ${
                    isDelivery
                      ? "text-sm leading-6"
                      : "break-all font-vintage text-[1.65rem] leading-none tabular-nums"
                  }`}
                >
                  {gift.account_number || "Informasi belum tersedia"}
                </p>
                {gift.account_name && (
                  <p className="mt-2 text-xs leading-5 text-[var(--va-muted)]">
                    {isDelivery ? "Penerima" : "Atas nama"}: {gift.account_name}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleCopy(gift.account_number, index)}
                  disabled={!gift.account_number}
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 border border-[var(--va-forest)]/35 text-[0.6rem] tracking-[0.18em] text-[var(--va-forest)] uppercase transition hover:bg-[var(--va-forest)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isCurrent && copyState.status === "copied" ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                  {isCurrent
                    ? copyState.status === "copied"
                      ? "Berhasil disalin"
                      : "Tidak dapat menyalin"
                    : isDelivery
                      ? "Salin alamat"
                      : "Salin nomor rekening"}
                </button>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
