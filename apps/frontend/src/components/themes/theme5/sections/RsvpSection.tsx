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
  "mt-2 w-full border-2 border-[var(--rp-ink)] bg-white px-4 py-3.5 text-sm text-[var(--rp-ink)] outline-none placeholder:text-[var(--rp-muted)]/60 focus:shadow-[3px_3px_0_var(--rp-yellow)]";

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
        text: "Sip, konfirmasi kamu sudah masuk!",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Belum berhasil terkirim. Coba sekali lagi, ya.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="rsvp" className="rp-section-cool px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            eyebrow="You In Or What?"
            title="Datang Nggak Nih?"
            description="Kasih tahu rencanamu dan tinggalkan pesan seru buat kami."
          />
        </Reveal>
        <Reveal variant="up" delay={100}>
          <form onSubmit={handleSubmit} className="rp-card mt-10 space-y-5 p-6">
            <div>
              <label className="text-[0.52rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-teal)]">
                Nama Kamu
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
                className={INPUT_CLASS}
                placeholder="Nama kamu"
              />
            </div>
            <div>
              <label className="text-[0.52rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-teal)]">
                Ucapan Seru
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                maxLength={400}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Tulis ucapan dan doa"
              />
            </div>
            <div>
              <span className="text-[0.52rem] font-bold uppercase tracking-[0.22em] text-[var(--rp-teal)]">
                Kehadiran
              </span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "attending",
                      label: "Gas, Datang!",
                      Icon: CheckIcon,
                    },
                    {
                      value: "not_attending",
                      label: "Belum Bisa",
                      Icon: XIcon,
                    },
                  ] as const
                ).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    aria-pressed={status === value}
                    className={`flex min-h-13 items-center justify-center gap-2 border-2 border-[var(--rp-ink)] px-2 text-xs font-bold ${status === value ? "bg-[var(--rp-yellow)] shadow-[3px_3px_0_var(--rp-ink)]" : "bg-white text-[var(--rp-muted)]"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rp-button flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-4 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white transition-all disabled:cursor-wait disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
              {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
            </button>
            {feedback && (
              <p
                aria-live="polite"
                className={`text-center text-sm font-bold ${feedback.type === "success" ? "text-[var(--rp-teal)]" : "text-red-700"}`}
              >
                {feedback.text}
              </p>
            )}
          </form>
        </Reveal>
        {rsvps.length > 0 && (
          <ul className="mt-10 max-h-[500px] space-y-3 overflow-y-auto pr-1">
            {rsvps.map((rsvp, index) => (
              <li
                key={rsvp.id}
                className={`border-2 border-[var(--rp-ink)] p-5 ${index % 2 === 0 ? "bg-[var(--rp-yellow)]" : "bg-white"}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-retro text-[var(--rp-ink)]">
                    {rsvp.guest_name}
                  </p>
                  <span className="shrink-0 text-[0.48rem] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
                    {rsvp.attendance_status === "attending"
                      ? "Datang"
                      : rsvp.attendance_status === "not_attending"
                        ? "Belum Bisa"
                        : "Belum Pasti"}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--rp-muted)]">
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
