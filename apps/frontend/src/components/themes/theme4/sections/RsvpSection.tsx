import { useEffect, useState } from "react";
import { fetchRsvps, submitRsvp, type RsvpResponse } from "../../../../lib/api";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  SectionHeading,
  SendIcon,
  XIcon,
} from "../components/ornaments";

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  "mt-2 w-full border border-[var(--im-line)] bg-[var(--im-card)] px-4 py-3.5 text-sm text-[var(--im-ink)] outline-none transition-colors placeholder:text-[var(--im-muted)]/60 focus:border-[var(--color-primary)]";

/** Form RSVP dengan feedback inline dan daftar doa. */
export default function RsvpSection({ guestName }: RsvpSectionProps) {
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [name, setName] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"attending" | "not_attending">(
    "attending",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchRsvps().then(setRsvps).catch(console.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const newRsvp = await submitRsvp(name, status, message);
      setRsvps((current) => [newRsvp, ...current]);
      setMessage("");
      setFeedback({
        type: "success",
        text: "Konfirmasi dan doa Anda sudah terkirim.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Ucapan belum berhasil dikirim. Silakan coba kembali.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="im-section-tint px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            arabic="بَارَكَ اللَّهُ فِيكُمْ"
            eyebrow="Konfirmasi Kehadiran"
            title="Doa & Ucapan"
            description="Kehadiran, doa, dan ucapan terbaik Anda akan menjadi kenangan yang berarti bagi kami."
          />
        </Reveal>

        <Reveal variant="up" delay={100}>
          <form onSubmit={handleSubmit} className="im-card mt-10 space-y-5 p-6">
            <div>
              <label className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
                className={INPUT_CLASS}
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Doa / Ucapan
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                maxLength={400}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Barakallahu lakuma..."
              />
            </div>
            <div>
              <span className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Kehadiran
              </span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "attending",
                      label: "InsyaAllah Hadir",
                      Icon: CheckIcon,
                    },
                    {
                      value: "not_attending",
                      label: "Berhalangan",
                      Icon: XIcon,
                    },
                  ] as const
                ).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    aria-pressed={status === value}
                    className={`flex min-h-14 items-center justify-center gap-2 border px-2 text-xs transition-colors ${
                      status === value
                        ? "border-[var(--color-primary)] bg-[var(--im-deep)] text-white"
                        : "border-[var(--im-line)] bg-[var(--im-card)] text-[var(--im-muted)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--im-deep)] px-4 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
              {isSubmitting ? "Mengirim..." : "Kirim Doa"}
            </button>
            {feedback && (
              <p
                aria-live="polite"
                className={`text-center text-sm ${feedback.type === "success" ? "text-[var(--color-primary)]" : "text-red-700"}`}
              >
                {feedback.text}
              </p>
            )}
          </form>
        </Reveal>

        {rsvps.length > 0 && (
          <ul className="mt-10 max-h-[500px] space-y-3 overflow-y-auto pr-1">
            {rsvps.map((rsvp) => (
              <li
                key={rsvp.id}
                className="border-l-2 border-[var(--im-clay)] bg-[var(--im-card)] px-5 py-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-serif text-base text-[var(--im-ink)]">
                    {rsvp.guest_name}
                  </p>
                  <span className="shrink-0 text-[0.48rem] uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    {rsvp.attendance_status === "attending"
                      ? "InsyaAllah Hadir"
                      : rsvp.attendance_status === "not_attending"
                        ? "Berhalangan"
                        : "Belum Pasti"}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--im-muted)]">
                    {rsvp.message}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
