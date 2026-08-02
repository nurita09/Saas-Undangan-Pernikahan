import { useCountdown } from '../../../../hooks/useCountdown';
import { buildIcsDataUrl, formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { CalendarIcon, Divider, FloralCorners } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Section 2a: Save The Date -- countdown kartu kelopak + tombol simpan .ics. */
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
        { label: 'Days', value: countdown.days },
        { label: 'Hours', value: countdown.hours },
        { label: 'Minutes', value: countdown.minutes },
        { label: 'Seconds', value: countdown.seconds },
      ]
    : [];

  return (
    <section className="relative overflow-hidden bg-[var(--fl-tint)] px-6 py-20">
      <FloralCorners spots={['tr', 'bl']} opacity="opacity-55" />
      <Reveal variant="bloom" className="relative mx-auto max-w-md text-center">
        <h2 className="font-floral-script text-5xl text-[var(--color-primary)]">Save The Date</h2>
        {event.wedding_date && (
          <p className="mt-3 font-floral-serif text-lg tracking-[0.35em] text-[var(--fl-muted)]">
            {formatCoverDate(event.wedding_date)}
          </p>
        )}
        <Divider className="mt-2" />

        {countdownItems.length > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-2.5">
            {countdownItems.map((item) => (
              <div key={item.label} className="card-petal px-1 py-5">
                <p className="font-floral-serif text-3xl tabular-nums text-[var(--color-primary)]">
                  {String(item.value).padStart(2, '0')}
                </p>
                <p className="label-caps mt-2 text-[0.55rem] text-[var(--fl-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {calendarUrl && (
          <a
            href={calendarUrl}
            download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
            className="label-caps mt-7 inline-flex items-center gap-3 border border-[var(--fl-clay)]/50 px-6 py-3 text-[var(--fl-clay)] transition-colors duration-500 hover:bg-[var(--fl-clay)] hover:text-white"
          >
            <CalendarIcon className="h-4 w-4" />
            Simpan ke Kalender
          </a>
        )}
      </Reveal>
    </section>
  );
}
