import type { EventInfo } from "../../../../types/wedding";
import { formatLongDate, formatTime } from "../../../../utils/formatDate";
import Reveal from "../components/ThemeReveal";
import {
  ArchDivider,
  CalendarIcon,
  geometricBackground,
  IslamicArch,
  KhatamStar,
  MapPinIcon,
  SectionHeading,
} from "../components/ornaments";

interface EventSectionProps {
  event: EventInfo;
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

/** Portal mihrab dan dua agenda dalam satu itinerary arsitektural. */
export default function EventSection({ event }: EventSectionProps) {
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
            <div className="relative grid min-h-[17rem] place-items-center overflow-hidden bg-[var(--im-deep)] px-10 py-12 text-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={geometricBackground(0.16)}
              />
              <IslamicArch className="pointer-events-none absolute bottom-0 left-1/2 h-[95%] w-auto -translate-x-1/2 text-white/25" />
              <div className="relative max-w-xs">
                <KhatamStar className="mx-auto size-8 text-[var(--im-clay)]" />
                <p className="mt-5 font-arabic text-2xl text-white" lang="ar" dir="rtl">
                  بَارَكَ اللَّهُ لَكُمَا
                </p>
                <p className="mt-4 text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-white/65">
                  Walimatul &lsquo;Ursy
                </p>
                <ArchDivider className="mx-auto mt-5 w-40 text-[var(--im-clay)]" />
                <p className="mt-5 font-serif text-xl leading-snug text-white">
                  {event.location_address || "Tempat penuh keberkahan"}
                </p>
              </div>
            </div>
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
