import { formatLongDate, formatTime } from "../../../../utils/formatDate";
import type { EventInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  BatikBand,
  CalendarIcon,
  CornerFlourish,
  MapPinIcon,
  SectionTitle,
} from "../components/ornaments";

interface EventSectionProps {
  event: EventInfo;
  photoUrl: string;
}

interface EventEntryProps {
  number: string;
  title: string;
  date: string | null;
  location: string | null;
  mapsUrl: string | null;
}

function EventEntry({
  number,
  title,
  date,
  location,
  mapsUrl,
}: EventEntryProps) {
  return (
    <article className="py-8 first:pt-7 last:pb-7">
      <header className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[0.52rem] font-medium tracking-[0.28em] text-[var(--jw-russet)] uppercase">
            Rangkaian {number}
          </p>
          <h3 className="mt-2 font-jawa-script text-[2.8rem] leading-none text-[var(--color-primary)]">
            {title}
          </h3>
        </div>
        <span className="font-jawa-serif text-3xl text-[var(--jw-gold)]/60">
          {number}
        </span>
      </header>

      <div className="mt-5 flex items-start gap-3 border-y border-[var(--jw-gold-soft)]/55 py-4">
        <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--jw-gold)]" />
        <div>
          <p className="font-jawa-serif text-lg text-[var(--jw-ink)]">
            {date ? formatLongDate(date) : "Tanggal menyusul"}
          </p>
          {date && (
            <p className="mt-0.5 text-sm text-[var(--jw-muted)]">
              {formatTime(date)}
            </p>
          )}
        </div>
      </div>

      <p className="mt-5 text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold)] uppercase">
        Papan Panggenan
      </p>
      <p className="mt-2 font-jawa-serif text-lg leading-relaxed text-[var(--color-primary)]">
        {location || "Lokasi belum ditentukan"}
      </p>
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-[var(--jw-indigo)]/45 px-5 py-3 text-xs font-medium tracking-[0.16em] text-[var(--jw-indigo)] uppercase transition-colors hover:bg-[var(--jw-indigo)] hover:text-white"
        >
          <MapPinIcon className="h-4 w-4" />
          Peta Lokasi
        </a>
      )}
    </article>
  );
}

/** Section 3: satu lembar itinerary untuk Akad Nikah dan Resepsi. */
export default function EventSection({ event, photoUrl }: EventSectionProps) {
  return (
    <section
      id="events"
      className="relative overflow-hidden bg-[var(--jw-tint)] px-6 py-24"
    >
      <BatikBand />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle
            kicker="Wekdal saha Papan"
            title="Rangkaian Acara"
            script={false}
          />
        </Reveal>

        <Reveal variant="bloom" delay={120} className="mt-12">
          <div className="jw-itinerary relative overflow-hidden p-2">
            <CornerFlourish className="absolute left-3 top-3 z-10 size-9 text-[var(--jw-gold)]/80" />
            <CornerFlourish
              className="absolute bottom-3 right-3 z-10 size-9 text-[var(--jw-gold)]/80"
              rotate={180}
            />
            <figure className="relative aspect-[16/10] overflow-hidden">
              <img
                src={photoUrl}
                alt="Rangkaian acara pernikahan"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--jw-night)]/65 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 text-[0.58rem] font-medium tracking-[0.3em] text-white uppercase">
                Pawiwahan
              </p>
            </figure>

            <div className="px-5 sm:px-6">
              <EventEntry
                number="01"
                title="Akad Nikah"
                date={event.akad_date || event.wedding_date}
                location={event.akad_location || event.location_address}
                mapsUrl={event.akad_maps_url || event.maps_url}
              />
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--jw-gold)]/70 to-transparent" />
              <EventEntry
                number="02"
                title="Resepsi"
                date={event.resepsi_date || event.wedding_date}
                location={event.resepsi_location || event.location_address}
                mapsUrl={event.resepsi_maps_url || event.maps_url}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
