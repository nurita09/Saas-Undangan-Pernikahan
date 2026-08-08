import { formatLongDate, formatTime } from "../../../../utils/formatDate";
import type { EventInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  SectionTitle,
} from "../components/ornaments";
import venueLine from "../../../../assets/theme6/venue-line.png";

interface EventSectionProps {
  event: EventInfo;
}

interface EventRowProps {
  index: string;
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
}

function EventRow({ index, title, date, location, mapsUrl }: EventRowProps) {
  return (
    <div className="grid grid-cols-[2.2rem_minmax(0,1fr)] gap-4 border-t border-[var(--va-line)] py-6 first:border-t-0 first:pt-0 last:pb-0">
      <span className="font-vintage text-2xl text-[var(--va-oxblood)]">
        {index}
      </span>
      <div>
        <h3 className="font-vintage text-2xl text-[var(--va-forest)]">
          {title}
        </h3>
        <div className="mt-3 space-y-2 text-sm text-[var(--va-muted)]">
          <p className="flex items-start gap-2.5">
            <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--va-brass)]" />
            {date ? formatLongDate(date) : "Tanggal menyusul"}
          </p>
          {date && (
            <p className="flex items-start gap-2.5">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--va-brass)]" />
              {formatTime(date)}
            </p>
          )}
          <p className="flex items-start gap-2.5 leading-6">
            <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-[var(--va-brass)]" />
            {location || "Lokasi akan segera diinformasikan"}
          </p>
        </div>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-10 items-center gap-2 bg-[var(--va-oxblood)] px-4 text-[0.6rem] tracking-[0.18em] text-white uppercase transition hover:bg-[var(--va-forest)]"
          >
            <MapPinIcon className="h-4 w-4" /> Buka peta
          </a>
        )}
      </div>
    </div>
  );
}

export default function EventSection({ event }: EventSectionProps) {
  return (
    <section id="events" className="bg-[var(--va-vellum)] py-24">
      <div className="px-7">
        <Reveal variant="up">
          <SectionTitle
            kicker="Wedding Itinerary"
            title="Rangkaian Acara"
            align="left"
          />
        </Reveal>
      </div>

      <Reveal variant="zoom" className="mt-9">
        <div className="relative h-[19rem] overflow-hidden bg-[var(--va-forest)]">
          <div className="absolute inset-5 border border-[var(--va-brass-soft)]/25" />
          <div className="absolute inset-7 border border-dashed border-[var(--va-brass-soft)]/15" />
          <div className="absolute inset-x-7 top-6 flex items-center justify-between text-[0.52rem] tracking-[0.22em] text-[var(--va-brass-soft)] uppercase">
            <span>Venue archive</span>
            <span>File no. 06</span>
          </div>
          <img
            src={venueLine}
            alt=""
            aria-hidden="true"
            className="absolute -left-[8%] bottom-[4.6rem] w-[116%] opacity-55 mix-blend-screen"
          />
          <div className="absolute inset-x-7 bottom-6 flex items-end justify-between border-t border-[var(--va-brass-soft)]/25 pt-4 text-[var(--va-vellum)]">
            <div>
              <p className="text-[0.55rem] tracking-[0.25em] text-[var(--va-brass-soft)] uppercase">
                Destination record
              </p>
              <p className="mt-2 max-w-[15rem] font-vintage text-xl leading-6">
                {event.location_address || "Lokasi perayaan kami"}
              </p>
            </div>
            <span className="font-vintage text-4xl text-[var(--va-brass-soft)]">
              06
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal variant="up" className="mx-5 -mt-1">
        <div className="va-archive-card relative px-5 py-7">
          <EventRow
            index="I"
            title="Akad Nikah"
            date={event.akad_date || event.wedding_date}
            location={event.akad_location || event.location_address}
            mapsUrl={event.akad_maps_url || event.maps_url}
          />
          <EventRow
            index="II"
            title="Resepsi"
            date={event.resepsi_date || event.wedding_date}
            location={event.resepsi_location || event.location_address}
            mapsUrl={event.resepsi_maps_url || event.maps_url}
          />
        </div>
      </Reveal>
    </section>
  );
}
