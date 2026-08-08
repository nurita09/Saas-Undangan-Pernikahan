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
interface ScheduleProps {
  number: string;
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
}

function Schedule({ number, title, date, location, mapsUrl }: ScheduleProps) {
  return (
    <article className="grid grid-cols-[42px_1fr] gap-4 border-t-2 border-dashed border-[var(--rp-line)] px-5 py-7 first:border-t-0">
      <span className="font-retro text-3xl leading-none text-[var(--color-primary)]">
        {number}
      </span>
      <div>
        <h3 className="font-retro text-xl text-[var(--rp-ink)]">{title}</h3>
        <div className="mt-4 grid grid-cols-[17px_1fr] gap-x-2 gap-y-1">
          <CalendarIcon className="mt-0.5 h-4 w-4 text-[var(--rp-teal)]" />
          <div>
            <p className="text-sm text-[var(--rp-ink)]">
              {date ? formatLongDate(date) : "Tanggal menyusul"}
            </p>
            {date && (
              <p className="mt-1 text-xs text-[var(--rp-muted)]">
                Pukul {formatTime(date)}
              </p>
            )}
          </div>
          <MapPinIcon className="mt-4 h-4 w-4 text-[var(--rp-teal)]" />
          <p className="mt-3 text-sm leading-relaxed text-[var(--rp-muted)]">
            {location || "Lokasi belum ditentukan"}
          </p>
        </div>
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rp-button mt-5 inline-flex min-h-10 items-center gap-2 bg-[var(--rp-yellow)] px-3 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[var(--rp-ink)] transition-all"
          >
            <MapPinIcon className="h-4 w-4" /> Lihat Peta
          </a>
        )}
      </div>
    </article>
  );
}

/** Rundown pernikahan dalam satu tiket festival. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section id="events" className="rp-section-paper px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            eyebrow="The Main Event"
            title="Where & When"
            align="left"
          />
        </Reveal>
        <Reveal variant="zoom" className="mt-10">
          <div className="rp-card overflow-hidden">
            <figure className="relative aspect-[16/10] overflow-hidden">
              <img
                src={photoUrl}
                alt="Lokasi pesta"
                loading="lazy"
                className="size-full object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 bg-[var(--color-primary)] px-3 py-2 text-[0.52rem] font-bold uppercase tracking-[0.2em] text-white">
                Wedding Day Pass
              </figcaption>
            </figure>
            <Schedule
              number="01"
              title="Akad Nikah"
              date={event.akad_date || event.wedding_date}
              location={event.akad_location || event.location_address}
              mapsUrl={event.akad_maps_url || event.maps_url}
            />
            <Schedule
              number="02"
              title="Pesta Resepsi"
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
