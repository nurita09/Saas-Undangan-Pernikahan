import { useCountdown } from '../../../../hooks/useCountdown';
import { formatShortDate, buildIcsDataUrl } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { ArchDivider, geometricBackground } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex h-[68px] w-16 flex-col items-center justify-center rounded-t-full border border-white/50 bg-white/15">
      <span className="text-xl font-semibold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-white/80">{label}</span>
    </div>
  );
}

/** Section 2a: Menuju Hari Bahagia -- countdown kotak berlengkung. */
export default function SaveTheDateSection({ couple, event }: SaveTheDateSectionProps) {
  const countdown = useCountdown(event.wedding_date);

  const calendarUrl = buildIcsDataUrl({
    title: `Pernikahan ${couple.groom_name} & ${couple.bride_name}`,
    description: 'Undangan pernikahan',
    location: event.location_address || '',
    startDate: event.wedding_date,
  });

  const items = countdown
    ? [
        { value: countdown.days, label: 'Hari' },
        { value: countdown.hours, label: 'Jam' },
        { value: countdown.minutes, label: 'Menit' },
        { value: countdown.seconds, label: 'Detik' },
      ]
    : [];

  return (
    <section className="relative px-6 py-16 text-center overflow-hidden bg-[var(--color-primary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 invert" style={geometricBackground(0.08)} />

      <div className="relative z-10">
        <Reveal variant="blur">
          <h2 className="font-serif text-3xl text-white">Menuju Hari Bahagia</h2>
          {event.wedding_date && (
            <p className="mt-2 tracking-[0.3em] text-white/85">{formatShortDate(event.wedding_date)}</p>
          )}
          <ArchDivider className="mx-auto mt-4 w-44 invert brightness-0" />
        </Reveal>

        {items.length > 0 && (
          <div className="mt-8 flex justify-center gap-3 md:gap-5">
            {items.map((item, idx) => (
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
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[var(--color-primary)] hover:opacity-90 transition"
            >
              📅 Simpan ke Kalender
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
