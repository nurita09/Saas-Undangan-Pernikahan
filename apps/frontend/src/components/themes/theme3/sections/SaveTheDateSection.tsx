import { useCountdown } from '../../../../hooks/useCountdown';
import { formatShortDate, buildIcsDataUrl } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { GoldDivider, SURFACE, goldGlow } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex h-[70px] w-16 flex-col items-center justify-center border border-[#D4AF37]/50"
      style={{ backgroundColor: SURFACE }}
    >
      <span className="font-serif text-2xl font-semibold text-[#D4AF37] tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-neutral-400">{label}</span>
    </div>
  );
}

/** Section 2a: Save The Date -- countdown kotak emas di atas latar berpendar. */
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
    <section className="relative px-6 py-16 text-center overflow-hidden bg-[var(--color-secondary)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64" style={goldGlow(0.1)} />

      <div className="relative z-10">
        <Reveal variant="blur">
          <h2 className="font-script text-4xl text-neutral-100">Save The Date</h2>
          {event.wedding_date && (
            <p className="mt-2 font-serif tracking-[0.35em] text-[#D4AF37]">
              {formatShortDate(event.wedding_date)}
            </p>
          )}
          <GoldDivider className="mx-auto mt-4 w-48" />
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
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/70 px-6 py-2.5 text-sm font-medium tracking-wider text-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
            >
              📅 Simpan ke Kalender
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
