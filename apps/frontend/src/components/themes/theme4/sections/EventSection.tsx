import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal, { type RevealVariant } from '../../../shared/Reveal';
import { ArchDivider, IslamicArch } from '../components/ornaments';

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
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-white p-6 shadow-sm transition-transform duration-500 hover:-translate-y-1">
        <IslamicArch className="pointer-events-none absolute -right-4 -top-3 h-28 w-auto text-[var(--color-primary)] opacity-10" />

        <div className="flex gap-4">
          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-t-full border border-[var(--color-primary)]/40">
            <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-neutral-800">{title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{date ? formatLongDate(date) : 'Tanggal menyusul'}</p>
            <p className="text-sm text-[var(--color-primary)] font-medium">{date ? formatTime(date) : ''}</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
            Lokasi
          </p>
          <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
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

/** Section 3: rangkaian acara -- Akad Nikah & Walimatul 'Ursy. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center font-serif text-2xl font-semibold text-neutral-800">
            Rangkaian Acara
          </h2>
          <ArchDivider className="mx-auto mt-3 w-44" />
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
            title="Walimatul 'Ursy"
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
