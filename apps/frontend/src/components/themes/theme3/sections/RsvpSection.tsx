import { useEffect, useState } from "react";
import { fetchRsvps, submitRsvp, type RsvpResponse } from "../../../../lib/api";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  GoldDivider,
  SendIcon,
  XIcon,
} from "../components/ornaments";

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  "mt-2 w-full border border-[var(--dk-line)] bg-[var(--dk-surface)] px-4 py-3.5 text-sm text-[var(--dk-ivory)] outline-none transition-colors placeholder:text-[var(--dk-muted)]/60 focus:border-[var(--color-primary)]";

/** Form RSVP dan daftar ucapan dalam panel noir yang ringkas. */
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
        text: "Konfirmasi dan ucapan Anda sudah terkirim.",
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
    <section id="rsvp" className="noir-section-alt px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur" className="text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            Be Part Of Our Day
          </p>
          <h2 className="mt-4 font-script text-[3.8rem] leading-none text-[var(--dk-ivory)]">
            Send Your Wishes
          </h2>
          <GoldDivider className="mx-auto mt-5 w-48" />
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-[var(--dk-muted)]">
            Konfirmasikan kehadiran dan tinggalkan doa terbaik untuk perjalanan
            baru kami.
          </p>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <form
            onSubmit={handleSubmit}
            className="noir-card mt-10 space-y-5 p-6"
          >
            <div>
              <label className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
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
              <label className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Ucapan
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                maxLength={400}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Ucapan dan doa"
              />
            </div>
            <div>
              <span className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                Konfirmasi Kehadiran
              </span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(
                  [
                    { value: "attending", label: "Hadir", Icon: CheckIcon },
                    {
                      value: "not_attending",
                      label: "Tidak Hadir",
                      Icon: XIcon,
                    },
                  ] as const
                ).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    aria-pressed={status === value}
                    className={`flex min-h-12 items-center justify-center gap-2 border px-3 text-sm transition-colors ${
                      status === value
                        ? "border-[var(--color-primary)] bg-[var(--dk-surface-alt)] text-[var(--dk-ivory)]"
                        : "border-[var(--dk-line)] bg-[var(--dk-surface)] text-[var(--dk-muted)]"
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
              className="flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-4 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-secondary)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
              {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
            </button>
            {feedback && (
              <p
                aria-live="polite"
                className={`text-center text-sm ${
                  feedback.type === "success"
                    ? "text-[var(--color-primary)]"
                    : "text-red-300"
                }`}
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
                className="border-l border-[var(--color-primary)] bg-[var(--dk-surface)] px-5 py-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-serif text-base text-[var(--dk-ivory)]">
                    {rsvp.guest_name}
                  </p>
                  <span className="shrink-0 text-[0.5rem] uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    {rsvp.attendance_status === "attending"
                      ? "Hadir"
                      : rsvp.attendance_status === "not_attending"
                        ? "Tidak Hadir"
                        : "Mungkin"}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--dk-muted)]">
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
