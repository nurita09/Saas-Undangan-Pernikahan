import type { EventInfo } from "../../../../types/wedding";
import { formatLongDate, formatTime } from "../../../../utils/formatDate";
import Reveal from "../components/ThemeReveal";
import {
  CalendarIcon,
  MapPinIcon,
  SectionHeading,
} from "../components/ornaments";

interface EventSectionProps {
  event: EventInfo;
  photoUrl: string;
}

interface AgendaProps {
  number: string;
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
}

function Agenda({ number, title, date, location, mapsUrl }: AgendaProps) {
  return (
    <article className="border-t border-[var(--im-line)] px-5 py-7 text-left first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
            Agenda {number}
          </p>
          <h3 className="mt-2 font-serif text-2xl text-[var(--im-ink)]">
            {title}
          </h3>
        </div>
        <span className="font-serif text-4xl leading-none text-[var(--im-clay)]/45">
          {number}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-[18px_1fr] gap-x-3 gap-y-1">
        <CalendarIcon className="mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
        <div>
          <p className="text-sm text-[var(--im-ink)]">
            {date ? formatLongDate(date) : "Tanggal menyusul"}
          </p>
          {date && (
            <p className="mt-1 text-xs text-[var(--im-muted)]">
              Pukul {formatTime(date)}
            </p>
          )}
        </div>
        <MapPinIcon className="mt-4 h-4 w-4 text-[var(--color-primary)]" />
        <p className="mt-3 text-sm leading-relaxed text-[var(--im-muted)]">
          {location || "Lokasi belum ditentukan"}
        </p>
      </div>
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[var(--color-primary)] px-4 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
        >
          <MapPinIcon className="h-4 w-4" />
          Buka Peta
        </a>
      )}
    </article>
  );
}

/** Satu foto perayaan dan dua agenda dalam satu itinerary arsitektural. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section id="events" className="im-section px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            arabic="وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ"
            eyebrow="Rangkaian Ibadah"
            title="Rangkaian Acara"
          />
        </Reveal>

        <Reveal variant="zoom" className="mt-11">
          <div className="im-card overflow-hidden">
            <figure className="relative aspect-[16/11] overflow-hidden">
              <img
                src={photoUrl}
                alt="Momen perayaan"
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--im-deep)]/75 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-white">
                Walimatul &lsquo;Ursy
              </figcaption>
            </figure>
            <Agenda
              number="01"
              title="Akad Nikah"
              date={event.akad_date || event.wedding_date}
              location={event.akad_location || event.location_address}
              mapsUrl={event.akad_maps_url || event.maps_url}
            />
            <Agenda
              number="02"
              title="Walimatul 'Ursy"
              date={event.resepsi_date || event.wedding_date}
              location={event.resepsi_location || event.location_address}
              mapsUrl={event.resepsi_maps_url || event.maps_url}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
