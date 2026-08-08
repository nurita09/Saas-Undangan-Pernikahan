import { useCountdown } from "../../../../hooks/useCountdown";
import { formatShortDate, buildIcsDataUrl } from "../../../../utils/formatDate";
import type { CoupleInfo, EventInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { CalendarIcon, GoldDivider } from "../components/ornaments";

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Section 2a: countdown dalam satu panel burgundy bergaya art-deco. */
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
      className="noir-section-alt relative overflow-hidden px-6 py-24 text-center"
    >
      <div className="relative z-10 mx-auto max-w-md">
        <Reveal variant="blur">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            Mark The Day
          </p>
          <h2 className="mt-4 font-script text-[4rem] leading-none text-[var(--dk-ivory)]">
            Save The Date
          </h2>
          {event.wedding_date && (
            <p className="mt-5 font-serif text-lg tracking-[0.35em] text-[var(--color-primary)]">
              {formatShortDate(event.wedding_date)}
            </p>
          )}
          <GoldDivider className="mx-auto mt-6 w-52" />
        </Reveal>

        {items.length > 0 && (
          <Reveal variant="up" delay={160} className="mt-10">
            <div className="noir-wine-card grid grid-cols-4 overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="relative px-1 py-6 after:absolute after:inset-y-5 after:right-0 after:w-px after:bg-[var(--color-primary)]/25 last:after:hidden"
                >
                  <span className="block font-serif text-[1.9rem] leading-none tabular-nums text-[var(--dk-ivory)]">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-[0.56rem] font-medium uppercase tracking-[0.14em] text-[var(--dk-muted)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {calendarUrl && (
          <Reveal variant="up" delay={320}>
            <a
              href={calendarUrl}
              download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
              className="mt-8 inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-[4px] border border-[var(--color-primary)]/60 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
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
