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
  const displayDate = formatCoverDate(event.wedding_date)?.replace(/\.\s*/g, '  ·  ');

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
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[var(--jw-sogan-deep)] px-6 py-20 text-center text-[var(--color-secondary)]">
      <BatikBand className="opacity-[0.18] mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.24)_72%)]" />
      <div className="relative mx-auto w-full max-w-md">
        <Reveal variant="bloom">
          <p className="font-jawa-script text-6xl leading-none text-[var(--jw-gold-soft)]">
            Save The Date
          </p>
          <Divider className="mt-8" tone="light" />
          {displayDate && (
            <p className="mt-9 font-jawa-serif text-lg font-semibold tracking-[0.48em] text-[var(--color-secondary)] uppercase">
              {displayDate}
            </p>
          )}
        </Reveal>

        {countdownItems.length > 0 && (
          <Reveal variant="bloom" delay={180} className="mt-12">
            <div className="grid grid-cols-4 gap-3">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="relative aspect-square border border-[var(--jw-gold-soft)]/30 bg-[var(--color-secondary)]/[0.04] px-1 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                >
                  <span className="absolute inset-x-3 top-3 block h-px bg-[var(--jw-gold-soft)]/30" />
                  <div className="flex h-full flex-col items-center justify-center">
                    <span className="block font-jawa-serif text-3xl font-semibold tabular-nums leading-none text-[var(--color-secondary)] min-[380px]:text-4xl">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="mt-4 block text-[0.48rem] font-semibold tracking-[0.42em] text-[var(--jw-gold-soft)]/85 uppercase">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Divider className="mt-11" tone="light" />
          </Reveal>
        )}

        {calendarUrl && (
          <Reveal variant="bloom" delay={360}>
            <a
              href={calendarUrl}
              download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
              className="mt-9 inline-flex items-center gap-3 border border-[var(--jw-gold-soft)]/45 bg-[var(--color-secondary)]/[0.04] px-6 py-3 text-[0.58rem] font-medium tracking-[0.24em] text-[var(--color-secondary)] uppercase transition-all duration-500 hover:-translate-y-0.5 hover:bg-[var(--color-secondary)]/10"
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
