import { useCountdown } from "../../../../hooks/useCountdown";
import type { CoupleInfo, EventInfo } from "../../../../types/wedding";
import { buildIcsDataUrl, formatShortDate } from "../../../../utils/formatDate";
import Reveal from "../components/ThemeReveal";
import {
  CalendarIcon,
  SectionHeading,
  geometricBackground,
} from "../components/ornaments";

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Countdown sebagai satu panel ritmis di atas hijau mineral. */
export default function SaveTheDateSection({
  couple,
  event,
}: SaveTheDateSectionProps) {
  const countdown = useCountdown(event.wedding_date);
  const calendarUrl = buildIcsDataUrl({
    title: `Pernikahan ${couple.groom_name} & ${couple.bride_name}`,
    description: "Undangan pernikahan",
    location: event.location_address || "",
    startDate: event.wedding_date,
  });
  const items = countdown
    ? [
        { value: countdown.days, label: "Hari" },
        { value: countdown.hours, label: "Jam" },
        { value: countdown.minutes, label: "Menit" },
        { value: countdown.seconds, label: "Detik" },
      ]
    : [];

  return (
    <section
      id="save-the-date"
      className="im-section-deep relative overflow-hidden px-6 py-24 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={geometricBackground(0.07)}
      />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            arabic="بَارَكَ اللَّهُ لَكُمَا"
            eyebrow="Mark The Day"
            title="Menuju Hari Bahagia"
            inverse
          />
          {event.wedding_date && (
            <p className="mt-6 font-serif text-lg tracking-[0.2em] text-[var(--im-clay)]">
              {formatShortDate(event.wedding_date)}
            </p>
          )}
        </Reveal>

        {items.length > 0 && (
          <Reveal
            variant="up"
            className="mt-9 grid grid-cols-4 border-y border-white/20 py-5"
          >
            {items.map((item, index) => (
              <div
                key={item.label}
                className={index > 0 ? "border-l border-white/20" : ""}
              >
                <span className="block font-serif text-2xl tabular-nums text-white">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-[0.5rem] uppercase tracking-[0.22em] text-white/55">
                  {item.label}
                </span>
              </div>
            ))}
          </Reveal>
        )}

        {calendarUrl && (
          <Reveal variant="up" delay={120}>
            <a
              href={calendarUrl}
              download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
              className="mt-9 inline-flex min-h-12 items-center gap-2 border border-white/35 bg-white px-5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--im-deep)] transition hover:-translate-y-0.5"
            >
              <CalendarIcon className="h-4 w-4" />
              Simpan ke Kalender
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
