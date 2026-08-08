import { useEffect, useState } from "react";
import { submitRsvp, fetchRsvps, type RsvpResponse } from "../../../../lib/api";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  FloralCorners,
  SectionTitle,
  SendIcon,
  XIcon,
} from "../components/ornaments";

interface RsvpSectionProps {
  guestName?: string;
}

/** Section 7: form RSVP + daftar ucapan. Section ini baru di-mount setelah
 *  undangan dibuka, jadi fetch daftar ucapan cukup sekali di mount. */
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const newRsvp = await submitRsvp(name, status, message);
      setRsvps((prev) => [newRsvp, ...prev]);
      setMessage("");
      setFeedback({
        type: "success",
        text: "Konfirmasi dan ucapan Anda sudah terkirim.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Ucapan belum berhasil dikirim. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-[4px] border border-[var(--fl-gold)]/30 bg-white/55 px-4 py-3 font-floral-serif text-lg normal-case tracking-normal text-[var(--fl-ink)] outline-none transition-colors placeholder:text-[var(--fl-muted)]/60 focus:border-[var(--fl-clay)] focus:bg-white/75";

  return (
    <section
      id="rsvp"
      className="floral-section-tint relative overflow-hidden px-6 py-24"
    >
      <FloralCorners spots={["tr"]} size="w-28" opacity="opacity-30" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="RSVP" title="Send Your Wishes" />
          <p className="mx-auto mt-7 max-w-sm text-center font-floral-serif text-lg leading-relaxed text-[var(--fl-muted)]">
            Doa, harapan, dan ucapan terbaik dari Anda akan menjadi kenangan
            indah yang selalu kami hargai.
          </p>
        </Reveal>

        <Reveal variant="bloom" delay={120}>
          <form onSubmit={handleSubmit} className="card-petal mt-10 px-7 py-9">
            <label className="label-caps block text-[var(--fl-muted)]">
              Nama Anda
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={60}
                placeholder="Nama anda"
                className={inputClass}
              />
            </label>
            <label className="label-caps mt-6 block text-[var(--fl-muted)]">
              Ucapan
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={400}
                placeholder="Ucapan"
                className={`${inputClass} resize-none`}
              />
            </label>
            <p className="label-caps mt-6 text-[var(--fl-muted)]">
              Konfirmasi Kehadiran
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  { value: "attending", label: "Hadir", Icon: CheckIcon },
                  { value: "not_attending", label: "Tidak Hadir", Icon: XIcon },
                ] as const
              ).map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  aria-pressed={status === value}
                  className={`label-caps flex items-center justify-center gap-2 border px-3 py-3.5 transition-colors duration-500 ${
                    status === value
                      ? "border-[var(--fl-clay)] bg-[var(--fl-clay)] text-white"
                      : "border-[var(--fl-gold)]/30 bg-white/45 text-[var(--fl-muted)] hover:border-[var(--fl-clay)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="label-caps mt-7 flex w-full items-center justify-center gap-3 bg-[var(--color-primary)] px-6 py-4 text-white transition-colors duration-500 hover:bg-[var(--fl-clay)] disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
              {isSubmitting ? "Mengirim..." : "Kirim"}
            </button>
            {feedback && (
              <p
                aria-live="polite"
                className={`mt-4 text-center font-floral-serif text-base ${
                  feedback.type === "success"
                    ? "text-[var(--fl-leaf)]"
                    : "text-red-700"
                }`}
              >
                {feedback.text}
              </p>
            )}
          </form>
        </Reveal>

        {rsvps.length > 0 && (
          <div className="mt-10">
            <p className="label-caps text-center text-[var(--fl-clay)]">
              Ucapan Para Tamu
            </p>
            <div className="mt-5 max-h-[500px] overflow-y-auto border-y border-[var(--fl-gold)]/25 pr-1">
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="border-b border-[var(--fl-gold)]/20 px-2 py-5 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="truncate font-floral-serif text-xl text-[var(--color-primary)]">
                      {rsvp.guest_name}
                    </p>
                    <p className="label-caps shrink-0 text-[0.55rem] text-[var(--fl-clay)]">
                      {rsvp.attendance_status === "attending"
                        ? "Hadir"
                        : rsvp.attendance_status === "not_attending"
                          ? "Tidak Hadir"
                          : "Ragu"}
                    </p>
                  </div>
                  {rsvp.message && (
                    <p className="mt-2 font-floral-serif text-lg leading-relaxed whitespace-pre-wrap text-[var(--fl-muted)]">
                      {rsvp.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
