import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal, { type RevealVariant } from '../../../shared/Reveal';
import { CornerCarving, OrnamentDivider } from '../components/ornaments';

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
      <div className="relative border border-[#C9A227]/50 bg-white p-6 shadow-sm transition-transform duration-500 hover:-translate-y-1">
        <CornerCarving className="absolute top-1.5 left-1.5 h-7 w-7" />
        <CornerCarving className="absolute bottom-1.5 right-1.5 h-7 w-7 rotate-180" />

        <div className="flex gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[#C9A227]/60">
            <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[var(--color-primary)]">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{date ? formatLongDate(date) : 'Tanggal menyusul'}</p>
            <p className="text-sm text-neutral-600">{date ? formatTime(date) : ''}</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#C9A227]">Papan Panggenan</p>
          <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
            {location || 'Lokasi belum ditentukan'}
          </p>
        </div>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-[var(--color-secondary)] hover:opacity-90 transition"
          >
            📍 Google Maps
          </a>
        )}
      </div>
    </Reveal>
  );
}

/** Section 3: rangkaian acara -- Akad Nikah & Resepsi (kartu berbingkai ukiran). */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section className="px-6 py-16 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center text-2xl font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Rangkaian Acara
          </h2>
          <OrnamentDivider className="mx-auto mt-3 w-44" />
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
