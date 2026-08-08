import { useCountdown } from "../../../../hooks/useCountdown";
import type { CoupleInfo, EventInfo } from "../../../../types/wedding";
import { buildIcsDataUrl, formatShortDate } from "../../../../utils/formatDate";
import Reveal from "../components/ThemeReveal";
import {
  CalendarIcon,
  SectionHeading,
  stripeBackground,
} from "../components/ornaments";

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
        { value: countdown.days, label: "Hari" },
        { value: countdown.hours, label: "Jam" },
        { value: countdown.minutes, label: "Menit" },
        { value: countdown.seconds, label: "Detik" },
      ]
    : [];

  return (
    <section
      id="save-the-date"
      className="rp-section-yellow relative overflow-hidden px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={stripeBackground(0.07)}
      />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            eyebrow="Put It On Your Calendar"
            title="Save The Date!"
            align="left"
          />
          {event.wedding_date && (
            <p className="mt-5 font-retro text-xl tracking-[0.14em] text-[var(--color-primary)]">
              {formatShortDate(event.wedding_date)}
            </p>
          )}
        </Reveal>
        {items.length > 0 && (
          <Reveal
            variant="up"
            className="mt-9 grid grid-cols-4 bg-[var(--rp-ink)] py-5 text-white"
          >
            {items.map((item, index) => (
              <div
                key={item.label}
                className={
                  index > 0
                    ? "border-l border-white/20 text-center"
                    : "text-center"
                }
              >
                <span className="block font-retro text-2xl tabular-nums text-[var(--rp-yellow)]">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-[0.5rem] font-bold uppercase tracking-[0.18em] text-white/60">
                  {item.label}
                </span>
              </div>
            ))}
          </Reveal>
        )}
        {calendarUrl && (
          <Reveal variant="up" delay={100}>
            <a
              href={calendarUrl}
              download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
              className="rp-button mt-8 inline-flex min-h-12 items-center gap-2 bg-white px-5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--rp-ink)] transition-all"
            >
              <CalendarIcon className="h-4 w-4" /> Catat Tanggalnya
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
