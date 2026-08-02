import { useCountdown } from '../../../../hooks/useCountdown';
import { buildIcsDataUrl, formatCoverDate } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { BatikBand, CalendarIcon, Divider } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Section 2a: Save The Date -- countdown di atas gradasi sogan + tombol kalender. */
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
        { label: 'Dinten', value: countdown.days },
        { label: 'Jam', value: countdown.hours },
        { label: 'Menit', value: countdown.minutes },
        { label: 'Detik', value: countdown.seconds },
      ]
    : [];

  return (
    <section className="relative overflow-hidden bg-[var(--jw-sogan-gradient)] px-6 py-20 text-center">
      <BatikBand className="opacity-[0.13]" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <p className="font-jawa-script text-5xl text-[var(--jw-gold-soft)]">Save The Date</p>
          <Divider className="mt-4" tone="light" />
          {event.wedding_date && (
            <p className="mt-6 font-jawa-serif text-xl tracking-[0.3em] text-[var(--color-secondary)] uppercase">
              {formatCoverDate(event.wedding_date)}
            </p>
          )}
        </Reveal>

        {countdownItems.length > 0 && (
          <Reveal variant="bloom" delay={150} className="mt-9">
            <div className="grid grid-cols-4 gap-2.5">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="relative border border-[var(--jw-gold-soft)]/35 bg-[var(--color-secondary)]/5 px-1 py-5 text-center"
                >
                  <span className="absolute inset-x-3 top-2 block h-px bg-[var(--jw-gold-soft)]/40" />
                  <span className="block font-jawa-serif text-3xl font-semibold tabular-nums text-[var(--color-secondary)]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="mt-2 block text-[0.5rem] font-medium tracking-[0.2em] text-[var(--jw-gold-soft)]/80 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Divider className="mt-7" tone="light" />
          </Reveal>
        )}

        {calendarUrl && (
          <Reveal variant="bloom" delay={300}>
            <a
              href={calendarUrl}
              download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
              className="mt-7 inline-flex items-center gap-3 border border-[var(--jw-gold-soft)]/60 px-6 py-3 text-[0.6rem] font-medium tracking-[0.25em] text-[var(--color-secondary)] uppercase transition-colors hover:bg-[var(--color-secondary)]/10"
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
