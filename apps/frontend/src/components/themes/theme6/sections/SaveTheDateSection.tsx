import { useCountdown } from "../../../../hooks/useCountdown";
import { buildIcsDataUrl, formatLongDate } from "../../../../utils/formatDate";
import type { CoupleInfo, EventInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { CalendarIcon } from "../components/ornaments";

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

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
        { label: "Hari", value: countdown.days },
        { label: "Jam", value: countdown.hours },
        { label: "Menit", value: countdown.minutes },
        { label: "Detik", value: countdown.seconds },
      ]
    : [];

  if (items.length === 0 && !calendarUrl) return null;

  return (
    <section className="bg-[var(--va-vellum)] px-5 py-20">
      <Reveal variant="zoom">
        <div className="relative overflow-hidden border border-[var(--va-brass)]/55 bg-[var(--va-forest)] px-5 py-7 text-[var(--va-vellum)] shadow-[0_22px_48px_-34px_rgba(20,38,31,0.8)]">
          <div className="pointer-events-none absolute inset-2 border border-[var(--va-brass-soft)]/25" />
          <div className="relative text-center">
            <p className="text-[0.58rem] tracking-[0.3em] text-[var(--va-brass-soft)] uppercase">
              Save the date certificate
            </p>
            <h2 className="mt-3 font-vintage text-[2rem]">Hari Bahagia Kami</h2>
            {event.wedding_date && (
              <p className="mt-2 text-[0.62rem] tracking-[0.16em] uppercase opacity-75">
                {formatLongDate(event.wedding_date)}
              </p>
            )}

            {items.length > 0 && (
              <div className="mt-7 grid grid-cols-4 border-y border-[var(--va-brass-soft)]/35 py-4">
                {items.map((item, index) => (
                  <div
                    key={item.label}
                    className={
                      index > 0
                        ? "border-l border-[var(--va-brass-soft)]/25"
                        : ""
                    }
                  >
                    <p className="font-vintage text-2xl leading-none tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </p>
                    <p className="mt-1.5 text-[0.5rem] tracking-[0.16em] text-[var(--va-brass-soft)] uppercase">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {calendarUrl && (
              <a
                href={calendarUrl}
                download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 border border-[var(--va-brass-soft)]/55 px-5 text-[0.62rem] tracking-[0.18em] uppercase transition hover:bg-[var(--va-vellum)] hover:text-[var(--va-forest)]"
              >
                <CalendarIcon className="h-4 w-4" /> Simpan ke kalender
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
