import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { CalendarIcon, ClockIcon, MapPinIcon, SectionTitle } from '../components/ornaments';
import venueLine from '../../../../assets/theme6/venue-line.png';

interface EventSectionProps {
  event: EventInfo;
}

interface EventCardProps {
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
  delay: number;
}

function EventCard({ title, date, location, mapsUrl, delay }: EventCardProps) {
  return (
    <Reveal variant="up" delay={delay}>
      <div className="border border-[var(--color-primary)]/25 bg-[var(--t6-card)] px-6 py-7 text-center shadow-md">
        <h3 className="font-vintage text-2xl text-[var(--sage-deep)]">{title}</h3>
        <div className="mx-auto mt-3 h-px w-14 bg-[var(--color-primary)]/40" />
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--t6-ink)]">
          <CalendarIcon className="h-4 w-4 text-[var(--color-primary)]" />
          {date ? formatLongDate(date) : 'Tanggal menyusul'}
        </p>
        {date && (
          <p className="mt-1.5 flex items-center justify-center gap-2 text-sm text-[var(--t6-ink)]">
            <ClockIcon className="h-4 w-4 text-[var(--color-primary)]" />
            {formatTime(date)}
          </p>
        )}
        <p className="mt-4 text-sm leading-relaxed text-[var(--t6-muted)]">
          {location || 'Lokasi belum ditentukan'}
        </p>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[var(--color-primary)] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
          >
            <MapPinIcon className="h-4 w-4" />
            Lihat Google Maps
          </a>
        )}
      </div>
    </Reveal>
  );
}

/** Section 3: detail acara -- ilustrasi venue + kartu Akad Nikah & Resepsi. */
export default function EventSection({ event }: EventSectionProps) {
  return (
    <section className="px-7 py-20">
      <Reveal variant="up">
        <SectionTitle kicker="Save The Date" title="Detail Acara" />
        <img
          src={venueLine}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="mx-auto mt-4 w-full max-w-[19rem] opacity-90"
        />
      </Reveal>
      <div className="mt-6 space-y-5">
        <EventCard
          title="Akad Nikah"
          date={event.akad_date || event.wedding_date}
          location={event.akad_location || event.location_address}
          mapsUrl={event.akad_maps_url || event.maps_url}
          delay={0}
        />
        <EventCard
          title="Resepsi"
          date={event.resepsi_date || event.wedding_date}
          location={event.resepsi_location || event.location_address}
          mapsUrl={event.resepsi_maps_url || event.maps_url}
          delay={100}
        />
      </div>
    </section>
  );
}
