import { useEffect, useState } from "react";
import { fetchRsvps, submitRsvp, type RsvpResponse } from "../../../../lib/api";
import type { AttendanceStatus } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CheckIcon,
  ClockIcon,
  SectionTitle,
  SendIcon,
  XIcon,
} from "../components/ornaments";

interface RsvpSectionProps {
  guestName?: string;
}

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "attending", label: "Hadir" },
  { value: "maybe", label: "Masih ragu" },
  { value: "not_attending", label: "Tidak hadir" },
];

function attendanceLabel(status: string): string {
  if (status === "attending") return "Hadir";
  if (status === "not_attending") return "Tidak hadir";
  return "Masih ragu";
}

function OptionIcon({
  status,
  className,
}: {
  status: AttendanceStatus;
  className?: string;
}) {
  if (status === "attending") return <CheckIcon className={className} />;
  if (status === "not_attending") return <XIcon className={className} />;
  return <ClockIcon className={className} />;
}

export default function RsvpSection({ guestName }: RsvpSectionProps) {
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [name, setName] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<AttendanceStatus>("attending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchRsvps()
      .then(setRsvps)
      .catch(() => setRsvps([]));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const newRsvp = await submitRsvp(name.trim(), attendance, message.trim());
      setRsvps((current) => [newRsvp, ...current]);
      setMessage("");
      setFeedback({
        type: "success",
        text: "Konfirmasi dan ucapan Anda sudah tercatat.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Ucapan belum terkirim. Silakan coba sekali lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-2 w-full border border-[var(--va-line)] bg-[var(--va-paper)] px-4 py-3 text-sm text-[var(--va-ink)] outline-none placeholder:text-[var(--va-muted)]/65 focus:border-[var(--va-oxblood)] focus:ring-1 focus:ring-[var(--va-oxblood)]/25";

  return (
    <section className="bg-[var(--va-vellum)] px-6 py-24">
      <Reveal variant="up">
        <SectionTitle
          kicker="Attendance Ledger"
          title="Konfirmasi Kehadiran"
          description="Mohon isi buku tamu digital agar kami dapat mempersiapkan perayaan dengan hangat."
        />
      </Reveal>

      <Reveal variant="up" delay={80} className="mt-9">
        <form onSubmit={handleSubmit} className="va-archive-card p-5">
          <label className="block text-[0.58rem] tracking-[0.2em] text-[var(--va-oxblood)] uppercase">
            Nama tamu
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={60}
              autoComplete="name"
              placeholder="Nama Anda"
              className={inputClass}
            />
          </label>

          <fieldset className="mt-5">
            <legend className="text-[0.58rem] tracking-[0.2em] text-[var(--va-oxblood)] uppercase">
              Konfirmasi
            </legend>
            <div className="mt-2 grid grid-cols-3 border border-[var(--va-line)]">
              {ATTENDANCE_OPTIONS.map((option, index) => {
                const active = attendance === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAttendance(option.value)}
                    aria-pressed={active}
                    className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1.5 text-center text-[0.57rem] leading-4 transition ${
                      index > 0 ? "border-l border-[var(--va-line)]" : ""
                    } ${
                      active
                        ? "bg-[var(--va-forest)] text-white"
                        : "bg-[var(--va-paper)] text-[var(--va-muted)] hover:bg-white"
                    }`}
                  >
                    <OptionIcon status={option.value} className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-5 block text-[0.58rem] tracking-[0.2em] text-[var(--va-oxblood)] uppercase">
            Ucapan dan doa
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              maxLength={400}
              placeholder="Tuliskan pesan untuk kedua mempelai"
              className={`${inputClass} resize-none leading-6`}
            />
          </label>

          {feedback && (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
              className={`mt-4 border-l-2 px-3 py-2 text-xs leading-5 ${
                feedback.type === "success"
                  ? "border-[var(--va-forest)] bg-[var(--va-forest)]/8 text-[var(--va-forest)]"
                  : "border-[var(--va-oxblood)] bg-[var(--va-oxblood)]/8 text-[var(--va-oxblood)]"
              }`}
            >
              {feedback.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-[var(--va-oxblood)] text-[0.62rem] tracking-[0.2em] text-white uppercase transition hover:bg-[var(--va-forest)] disabled:cursor-wait disabled:opacity-60"
          >
            <SendIcon className="h-4 w-4" />
            {isSubmitting ? "Sedang mengirim..." : "Kirim konfirmasi"}
          </button>
        </form>
      </Reveal>

      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-[var(--va-line)] pb-3">
          <p className="text-[0.58rem] tracking-[0.22em] text-[var(--va-oxblood)] uppercase">
            Guest notes
          </p>
          <span className="font-vintage text-lg text-[var(--va-forest)]">
            {rsvps.length}
          </span>
        </div>
        <div className="mt-4 max-h-[26rem] space-y-3 overflow-y-auto pr-1">
          {rsvps.length === 0 ? (
            <p className="py-8 text-center font-vintage text-lg italic text-[var(--va-muted)]">
              Jadilah yang pertama meninggalkan ucapan.
            </p>
          ) : (
            rsvps.map((rsvp) => (
              <article
                key={rsvp.id}
                className="border-l-2 border-[var(--va-brass)] bg-[var(--va-paper)] px-4 py-4"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <p className="min-w-0 font-vintage text-lg leading-5 text-[var(--va-forest)]">
                    {rsvp.guest_name}
                  </p>
                  <span className="border border-[var(--va-line)] px-2 py-1 text-[0.5rem] tracking-[0.12em] text-[var(--va-oxblood)] uppercase">
                    {attendanceLabel(rsvp.attendance_status)}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--va-muted)]">
                    {rsvp.message}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
