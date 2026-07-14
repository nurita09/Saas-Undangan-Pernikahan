import { useCountdown } from '../../../../hooks/useCountdown';
import { formatShortDate, buildIcsDataUrl } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../components/Reveal';
import CountdownBox from '../components/CountdownBox';
import section2TopLeft from '../../../../assets/theme1/section2/th1-section2-ataskiri.png';
import section2TopRight from '../../../../assets/theme1/section2/th1-section2-ataskanan.png';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Section 2a: Save The Date -- countdown + tombol simpan ke kalender (.ics). */
export default function SaveTheDateSection({ couple, event }: SaveTheDateSectionProps) {
  const countdown = useCountdown(event.wedding_date);

  const calendarUrl = buildIcsDataUrl({
    title: `Pernikahan ${couple.groom_name} & ${couple.bride_name}`,
    description: 'Undangan pernikahan',
    location: event.location_address || '',
    startDate: event.wedding_date,
  });

  const countdownItems = countdown
    ? [
        { value: countdown.days, label: 'Days' },
        { value: countdown.hours, label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
      ]
    : [];

  return (
    <section className="relative px-6 py-16 bg-white text-center overflow-hidden">
      <img
        src={section2TopLeft}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-0 left-0 w-[28%] h-auto z-0"
        style={{ animationDuration: '9s' }}
      />
      <img
        src={section2TopRight}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-0 right-0 w-[28%] h-auto z-0"
        style={{ animationDuration: '11s', animationDelay: '1s' }}
      />

      <div className="relative z-10">
        <Reveal variant="blur">
          <h2 className="font-script text-5xl text-neutral-800">Save The Date</h2>
          {event.wedding_date && (
            <p className="mt-2 text-neutral-600 font-serif italic">{formatShortDate(event.wedding_date)}</p>
          )}
        </Reveal>

        {countdownItems.length > 0 && (
          <div className="mt-8 flex justify-center gap-6 md:gap-10">
            {countdownItems.map((item, idx) => (
              <Reveal key={item.label} variant="up" delay={idx * 120}>
                <CountdownBox value={item.value} label={item.label} />
              </Reveal>
            ))}
          </div>
        )}

        {calendarUrl && (
          <Reveal variant="up" delay={500}>
            <a
              href={calendarUrl}
              download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-[var(--color-primary)] hover:opacity-90 transition"
            >
              📅 Save to Calendar
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
