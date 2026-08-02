import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import {
  CalendarIcon,
  ClockIcon,
  FloralCorners,
  MapPinIcon,
  SectionTitle,
} from '../components/ornaments';

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
    <Reveal variant="bloom" delay={delay}>
      <article className="card-petal h-full px-7 py-9">
        <h3 className="font-floral-script text-4xl text-[var(--color-primary)]">{title}</h3>
        <div className="gold-rule my-5" />
        <p className="flex items-center gap-3 font-floral-serif text-lg text-[var(--fl-ink)]/85">
          <CalendarIcon className="h-4 w-4 shrink-0 text-[var(--fl-clay)]" />
          {date ? formatLongDate(date) : 'Tanggal menyusul'}
        </p>
        {date && (
          <p className="mt-2 flex items-center gap-3 font-floral-serif text-lg text-[var(--fl-ink)]/85">
            <ClockIcon className="h-4 w-4 shrink-0 text-[var(--fl-clay)]" />
            {formatTime(date)}
          </p>
        )}
        <p className="label-caps mt-7 text-[var(--fl-muted)]">Event Location</p>
        <p className="mt-3 font-floral-serif text-base leading-relaxed text-[var(--fl-muted)]">
          {location || 'Lokasi belum ditentukan'}
        </p>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="label-caps mt-7 inline-flex items-center gap-3 border border-[var(--fl-clay)]/50 px-6 py-3 text-[var(--fl-clay)] transition-colors duration-500 hover:bg-[var(--fl-clay)] hover:text-white"
          >
            <MapPinIcon className="h-4 w-4" />
            Google Maps
          </a>
        )}
      </article>
    </Reveal>
  );
}

/** Section 3: Wedding Event -- kartu Akad Nikah & Resepsi. */
export default function EventSection({ event }: EventSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--fl-tint)] px-6 py-20">
      <FloralCorners spots={['tr', 'bl']} opacity="opacity-50" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="Save Our Date" title="Wedding Event" script={false} />
        </Reveal>
        <div className="mt-12 space-y-7">
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
            delay={140}
          />
        </div>
      </div>
    </section>
  );
}
