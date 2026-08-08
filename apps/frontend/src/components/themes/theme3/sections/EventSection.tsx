import type { EventInfo } from "../../../../types/wedding";
import { formatLongDate, formatTime } from "../../../../utils/formatDate";
import Reveal from "../components/ThemeReveal";
import {
  CalendarIcon,
  DecoCorner,
  GoldDivider,
  MapPinIcon,
} from "../components/ornaments";

interface EventSectionProps {
  event: EventInfo;
  photoUrl: string;
}

interface EventCardProps {
  index: string;
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
  delay: number;
}

function EventCard({
  index,
  title,
  date,
  location,
  mapsUrl,
  delay,
}: EventCardProps) {
  return (
    <Reveal variant="up" delay={delay}>
      <article className="noir-card relative overflow-hidden p-6 text-left">
        <DecoCorner className="absolute bottom-2 right-2 h-8 w-8 rotate-180 opacity-70" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-primary)]">
              Ceremony {index}
            </p>
            <h3 className="mt-2 font-serif text-2xl text-[var(--dk-ivory)]">
              {title}
            </h3>
          </div>
          <span className="font-serif text-4xl leading-none text-[var(--color-primary)]/25">
            {index}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-[18px_1fr] gap-x-3 gap-y-1 border-t border-[var(--dk-line)] pt-5">
          <CalendarIcon className="mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
          <div>
            <p className="text-sm text-[var(--dk-ivory)]">
              {date ? formatLongDate(date) : "Tanggal menyusul"}
            </p>
            {date && (
              <p className="mt-1 text-xs text-[var(--dk-muted)]">
                Pukul {formatTime(date)}
              </p>
            )}
          </div>
          <MapPinIcon className="mt-4 h-4 w-4 text-[var(--color-primary)]" />
          <p className="mt-3 text-sm leading-relaxed text-[var(--dk-muted)]">
            {location || "Lokasi belum ditentukan"}
          </p>
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 border border-[var(--color-primary)] px-4 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
          >
            <MapPinIcon className="h-4 w-4" />
            Buka Peta
          </a>
        )}
      </article>
    </Reveal>
  );
}

/** Jadwal acara: satu hero foto, lalu dua agenda yang mudah dipindai. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section id="events" className="noir-section-alt px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur" className="text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            Save Our Celebration
          </p>
          <h2 className="mt-4 font-script text-[4rem] leading-none text-[var(--dk-ivory)]">
            Wedding Event
          </h2>
          <GoldDivider className="mx-auto mt-5 w-48" />
        </Reveal>

        <Reveal variant="zoom" className="mt-11">
          <figure className="noir-card relative aspect-[16/11] overflow-hidden p-1.5">
            <img
              src={photoUrl}
              alt="Lokasi perayaan pernikahan"
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute inset-1.5 bg-gradient-to-t from-[var(--color-secondary)]/90 via-transparent to-transparent" />
            <figcaption className="absolute bottom-6 left-6 text-left">
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-primary)]">
                The Celebration
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-6 space-y-5">
          <EventCard
            index="01"
            title="Akad Nikah"
            date={event.akad_date || event.wedding_date}
            location={event.akad_location || event.location_address}
            mapsUrl={event.akad_maps_url || event.maps_url}
            delay={80}
          />
          <EventCard
            index="02"
            title="Resepsi"
            date={event.resepsi_date || event.wedding_date}
            location={event.resepsi_location || event.location_address}
            mapsUrl={event.resepsi_maps_url || event.maps_url}
            delay={160}
          />
        </div>
      </div>
    </section>
  );
}
