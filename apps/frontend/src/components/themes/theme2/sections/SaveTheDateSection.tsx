import { useCountdown } from '../../../../hooks/useCountdown';
import { formatShortDate, buildIcsDataUrl } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { OrnamentDivider, kawungBackground } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex h-16 w-16 flex-col items-center justify-center border border-[#C9A227]/60 bg-white/70">
      <span className="text-xl font-semibold text-[var(--color-primary)] tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</span>
    </div>
  );
}

/** Section 2a: Save The Date -- countdown dalam kotak wajik + tombol kalender. */
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
        { value: countdown.days, label: 'Dinten' },
        { value: countdown.hours, label: 'Jam' },
        { value: countdown.minutes, label: 'Menit' },
        { value: countdown.seconds, label: 'Detik' },
      ]
    : [];

  return (
    <section className="relative px-6 py-16 bg-[var(--color-primary)] text-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={kawungBackground(0.12)} />

      <div className="relative z-10">
        <Reveal variant="blur">
          <h2 className="font-script text-4xl text-[var(--color-secondary)]">Save The Date</h2>
          {event.wedding_date && (
            <p className="mt-2 font-serif italic tracking-[0.2em] text-[#E8D9A0]">
              {formatShortDate(event.wedding_date)}
            </p>
          )}
          <OrnamentDivider className="mx-auto mt-4 w-44" />
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
              className="mt-8 inline-flex items-center gap-2 border border-[#C9A227] px-5 py-2.5 rounded-lg text-sm font-medium text-[var(--color-secondary)] hover:bg-white/10 transition"
            >
              📅 Simpan ke Kalender
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
