import { useCountdown } from "../../../../hooks/useCountdown";
import { buildIcsDataUrl, formatCoverDate } from "../../../../utils/formatDate";
import type { CoupleInfo, EventInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { CalendarIcon, Divider, FloralCorners } from "../components/ornaments";

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Section 2a: Save The Date -- countdown kartu kelopak + tombol simpan .ics. */
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

  const countdownItems = countdown
    ? [
        { label: "Days", value: countdown.days },
        { label: "Hours", value: countdown.hours },
        { label: "Minutes", value: countdown.minutes },
        { label: "Seconds", value: countdown.seconds },
      ]
    : [];

  return (
    <section
      id="save-the-date"
      className="floral-section-tint relative overflow-hidden px-6 py-24"
    >
      <FloralCorners spots={["tr"]} size="w-32" opacity="opacity-35" />
      <Reveal variant="bloom" className="relative mx-auto max-w-md text-center">
        <p className="label-caps text-[var(--fl-muted)]">Mark Your Calendar</p>
        <h2 className="mt-3 font-floral-script text-6xl leading-none text-[var(--color-primary)]">
          Save The Date
        </h2>
        {event.wedding_date && (
          <div className="mx-auto mt-6 w-fit border-y border-[var(--fl-gold)]/45 px-6 py-3">
            <p className="font-floral-serif text-3xl leading-none tracking-[0.22em] text-[var(--color-primary)]">
              {formatCoverDate(event.wedding_date)}
            </p>
          </div>
        )}
        <Divider className="mt-2" />

        {countdownItems.length > 0 && (
          <div className="countdown-panel mt-8 grid grid-cols-4 overflow-hidden">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="relative px-1 py-6 after:absolute after:inset-y-5 after:right-0 after:w-px after:bg-[var(--fl-gold)]/25 last:after:hidden"
              >
                <p className="font-floral-serif text-[2rem] leading-none tabular-nums text-[var(--color-primary)]">
                  {String(item.value).padStart(2, "0")}
                </p>
                <p className="mt-2 font-floral-sans text-[0.58rem] font-medium uppercase text-[var(--fl-muted)]">
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
            className="label-caps mx-auto mt-8 inline-flex w-full max-w-xs items-center justify-center gap-3 bg-[var(--color-primary)] px-6 py-4 text-white shadow-[0_18px_40px_-24px_rgba(74,66,56,0.75)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[var(--fl-clay)] hover:shadow-[0_22px_48px_-24px_rgba(74,66,56,0.85)]"
          >
            <CalendarIcon className="h-5 w-5 shrink-0" />
            Simpan ke Kalender
          </a>
        )}
      </Reveal>
    </section>
  );
}
