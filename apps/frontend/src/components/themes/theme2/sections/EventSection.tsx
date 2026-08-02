import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { BatikBand, CalendarIcon, FramedCard, MapPinIcon, SectionTitle } from '../components/ornaments';

interface EventSectionProps {
  event: EventInfo;
  photoUrl: string;
}

interface EventCardProps {
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
  photoUrl: string;
  delay: number;
}

function EventCard({ title, date, location, mapsUrl, photoUrl, delay }: EventCardProps) {
  return (
    <Reveal variant="bloom" delay={delay}>
      <FramedCard>
        <div className="flex gap-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-full border border-[var(--jw-gold)]/60">
            <img src={photoUrl} alt={title} className="size-full object-cover" />
          </div>
          <div>
            <h3 className="font-jawa-serif text-2xl font-semibold text-[var(--color-primary)]">
              {title}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-[var(--jw-ink)]/85">
              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-[var(--jw-gold)]" />
              {date ? formatLongDate(date) : 'Tanggal menyusul'}
            </p>
            {date && <p className="text-sm text-[var(--jw-ink)]/85">{formatTime(date)}</p>}
          </div>
        </div>
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-[var(--jw-gold)]/70 to-transparent" />
        <p className="text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold)] uppercase">
          Papan Panggenan
        </p>
        <p className="mt-2 font-jawa-serif text-lg text-[var(--color-primary)]">{location || 'Lokasi belum ditentukan'}</p>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-secondary)] transition hover:opacity-90"
          >
            <MapPinIcon className="h-4 w-4" />
            Google Maps
          </a>
        )}
      </FramedCard>
    </Reveal>
  );
}

/** Section 3: Rangkaian Acara -- Akad Nikah & Resepsi. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--jw-tint)] px-6 py-20">
      <BatikBand />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Wekdal saha Papan" title="Rangkaian Acara" script={false} />
        </Reveal>
        <div className="mt-12 space-y-8">
          <EventCard
            title="Akad Nikah"
            date={event.akad_date || event.wedding_date}
            location={event.akad_location || event.location_address}
            mapsUrl={event.akad_maps_url || event.maps_url}
            photoUrl={photoUrl}
            delay={0}
          />
          <EventCard
            title="Resepsi"
            date={event.resepsi_date || event.wedding_date}
            location={event.resepsi_location || event.location_address}
            mapsUrl={event.resepsi_maps_url || event.maps_url}
            photoUrl={photoUrl}
            delay={140}
          />
        </div>
      </div>
    </section>
  );
}
