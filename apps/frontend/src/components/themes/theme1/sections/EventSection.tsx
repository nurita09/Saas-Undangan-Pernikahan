import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal, { type RevealVariant } from '../components/Reveal';
import section3TopLeft from '../../../../assets/theme1/section3/th1-section3-ataskiri.png';
import section3TopRight from '../../../../assets/theme1/section3/th1-section3-ataskanan.png';

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
  revealVariant: RevealVariant;
}

function EventCard({ title, date, location, mapsUrl, photoUrl, revealVariant }: EventCardProps) {
  return (
    <Reveal variant={revealVariant}>
      <div className="rounded-2xl bg-white p-5 shadow-sm transition-transform duration-500 hover:-translate-y-1">
        <div className="flex gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
            <img
              src={photoUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-800">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{date ? formatLongDate(date) : 'Tanggal menyusul'}</p>
            <p className="text-sm text-neutral-600">{date ? formatTime(date) : ''}</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="font-bold text-neutral-800">Event Location</p>
          <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
            {location || 'Lokasi belum ditentukan'}
          </p>
        </div>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            📍 Google Maps
          </a>
        )}
      </div>
    </Reveal>
  );
}

/** Section 3: Wedding Event -- kartu Akad Nikah & Resepsi. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section className="relative px-6 py-16 overflow-hidden">
      <img
        src={section3TopLeft}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-6 left-0 w-[24%] h-auto z-0"
        style={{ animationDuration: '10s' }}
      />
      <img
        src={section3TopRight}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-0 right-0 w-[30%] h-auto z-0"
        style={{ animationDuration: '8s', animationDelay: '1.2s' }}
      />

      <div className="relative z-10 mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-neutral-800">Wedding Event</h2>
        </Reveal>

        <div className="mt-10 space-y-8">
          <EventCard
            title="Akad Nikah"
            date={event.akad_date || event.wedding_date}
            location={event.akad_location || event.location_address}
            mapsUrl={event.akad_maps_url || event.maps_url}
            photoUrl={photoUrl}
            revealVariant="left"
          />
          <EventCard
            title="Resepsi"
            date={event.resepsi_date || event.wedding_date}
            location={event.resepsi_location || event.location_address}
            mapsUrl={event.resepsi_maps_url || event.maps_url}
            photoUrl={photoUrl}
            revealVariant="right"
          />
        </div>
      </div>
    </section>
  );
}
