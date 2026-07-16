import { useCountdown } from '../../../../hooks/useCountdown';
import { formatShortDate, buildIcsDataUrl } from '../../../../utils/formatDate';
import type { CoupleInfo, EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, GroovyDivider, MUSTARD } from '../components/ornaments';

interface SaveTheDateSectionProps {
  couple: CoupleInfo;
  event: EventInfo;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex h-[72px] w-16 flex-col items-center justify-center rounded-2xl border-2 bg-white shadow-[3px_3px_0_#5C4033]"
      style={{ borderColor: COCOA }}
    >
      <span className="font-retro text-2xl tabular-nums" style={{ color: COCOA }}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{label}</span>
    </div>
  );
}

/** Section 2a: hitung mundur pesta -- kotak sticker chunky. */
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
    <section className="relative px-6 py-16 text-center overflow-hidden" style={{ backgroundColor: MUSTARD }}>
      <div className="relative z-10">
        <Reveal variant="blur">
          <h2 className="font-retro text-3xl" style={{ color: COCOA }}>
            Save The Date!
          </h2>
          {event.wedding_date && (
            <p className="mt-2 font-bold tracking-[0.2em]" style={{ color: '#7A3B22' }}>
              {formatShortDate(event.wedding_date)}
            </p>
          )}
          <GroovyDivider className="mx-auto mt-4 w-48" />
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
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 bg-white px-6 py-2.5 text-sm font-bold shadow-[4px_4px_0_#5C4033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#5C4033] transition-all"
              style={{ borderColor: COCOA, color: COCOA }}
            >
              📅 Catat Tanggalnya!
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
