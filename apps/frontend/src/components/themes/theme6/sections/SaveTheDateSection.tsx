import { useCountdown } from '../../../../hooks/useCountdown';
import { buildIcsDataUrl } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { CalendarIcon, SectionTitle } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

/** Section 2a: hitung mundur (kartu ber-border) + tombol simpan .ics. */
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
        { label: 'Hari', value: countdown.days },
        { label: 'Jam', value: countdown.hours },
        { label: 'Menit', value: countdown.minutes },
        { label: 'Detik', value: countdown.seconds },
      ]
    : [];

  if (countdownItems.length === 0 && !calendarUrl) return null;

  return (
    <section className="bg-[var(--sage-soft)] px-7 pt-20 pb-4">
      <Reveal variant="up">
        <SectionTitle kicker="Menuju Hari Bahagia" title="Hitung Mundur" />

        {countdownItems.length > 0 && (
          <div className="mt-7 grid grid-cols-4 gap-2">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="rounded-sm border border-[var(--color-primary)]/30 bg-[var(--t6-card)]/70 px-1 py-3 text-center"
              >
                <div className="font-vintage text-2xl leading-none text-[var(--sage-deep)] tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[0.6rem] tracking-[0.22em] text-[var(--t6-muted)] uppercase">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {calendarUrl && (
          <a
            href={calendarUrl}
            download={`undangan-${couple.groom_name}-${couple.bride_name}.ics`}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--color-primary)]/40 bg-[var(--t6-card)] py-2.5 text-sm text-[var(--sage-deep)] transition-colors hover:bg-[var(--t6-card)]/60"
          >
            <CalendarIcon className="h-4 w-4" />
            Simpan ke Kalender
          </a>
        )}
      </Reveal>
    </section>
  );
}
