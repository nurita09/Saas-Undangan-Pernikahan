import { formatLongDate, formatTime } from '../../../../utils/formatDate';
import type { EventInfo } from '../../../../types/wedding';
import Reveal, { type RevealVariant } from '../../../shared/Reveal';
import { COCOA, GroovyDivider, RetroArches } from '../components/ornaments';

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
  tilt: string;
  shadowColor: string;
}

function EventCard({ title, date, location, mapsUrl, photoUrl, revealVariant, tilt, shadowColor }: EventCardProps) {
  return (
    <Reveal variant={revealVariant}>
      <div
        className={`relative ${tilt} rounded-[2rem] border-4 bg-white p-6 transition-transform duration-500 hover:rotate-0`}
        style={{ borderColor: COCOA, boxShadow: `6px 6px 0 ${shadowColor}` }}
      >
        <RetroArches className="pointer-events-none absolute -top-1 right-4 h-8 w-auto opacity-60" />

        <div className="flex gap-4">
          <div
            className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2"
            style={{ borderColor: COCOA }}
          >
            <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <h3 className="font-retro text-xl" style={{ color: COCOA }}>
              {title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">{date ? formatLongDate(date) : 'Tanggal menyusul'}</p>
            <p className="text-sm font-bold text-[var(--color-primary)]">{date ? formatTime(date) : ''}</p>
          </div>
        </div>
        <div className="mt-5 text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Tempatnya di:
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
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#5C4033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#5C4033] transition-all"
            style={{ borderColor: COCOA }}
          >
            📍 Lihat Maps
          </a>
        )}
      </div>
    </Reveal>
  );
}

/** Section 3: kapan & di mana pestanya. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center font-retro text-3xl" style={{ color: COCOA }}>
            Kapan &amp; Di Mana?
          </h2>
          <GroovyDivider className="mx-auto mt-3 w-48" />
        </Reveal>

        <div className="mt-10 space-y-9">
          <EventCard
            title="Akad Nikah"
            date={event.akad_date || event.wedding_date}
            location={event.akad_location || event.location_address}
            mapsUrl={event.akad_maps_url || event.maps_url}
            photoUrl={photoUrl}
            revealVariant="left"
            tilt="-rotate-1"
            shadowColor="#E3B23C"
          />
          <EventCard
            title="Pesta Resepsi"
            date={event.resepsi_date || event.wedding_date}
            location={event.resepsi_location || event.location_address}
            mapsUrl={event.resepsi_maps_url || event.maps_url}
            photoUrl={photoUrl}
            revealVariant="right"
            tilt="rotate-1"
            shadowColor="#C75B39"
          />
        </div>
      </div>
    </section>
  );
}
