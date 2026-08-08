import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { Daisy, InstagramIcon, SectionHeading } from "../components/ornaments";

interface CoupleSectionProps {
  couple: CoupleInfo;
  fallbackPhotoUrl: string;
}
interface PersonProps {
  role: string;
  name: string;
  photoUrl: string;
  parents?: string | null;
  instagram?: string | null;
  accentClass: string;
}

function Person({
  role,
  name,
  photoUrl,
  parents,
  instagram,
  accentClass,
}: PersonProps) {
  const handle = instagram?.replace("@", "");
  return (
    <article className="min-w-0">
      <figure className="rp-card relative aspect-[3/4] overflow-hidden p-1">
        <img
          src={photoUrl}
          alt={name}
          loading="lazy"
          className="size-full object-cover"
        />
        <figcaption
          className={`absolute inset-x-1 bottom-1 px-2 py-2 text-center text-[0.5rem] font-bold uppercase tracking-[0.18em] text-[var(--rp-ink)] ${accentClass}`}
        >
          {role}
        </figcaption>
      </figure>
      <h3 className="mt-5 break-words font-retro text-[1.65rem] leading-tight text-[var(--rp-ink)]">
        {name}
      </h3>
      {parents && (
        <p className="mt-2 text-[0.68rem] leading-relaxed text-[var(--rp-muted)]">
          {parents}
        </p>
      )}
      {handle && (
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex max-w-full items-center gap-1.5 text-[0.62rem] font-bold text-[var(--color-primary)]"
        >
          <InstagramIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">@{handle}</span>
        </a>
      )}
    </article>
  );
}

/** Spread pasangan dua kolom seperti halaman profil majalah. */
export default function CoupleSection({
  couple,
  fallbackPhotoUrl,
}: CoupleSectionProps) {
  return (
    <section
      id="couple"
      className="rp-section-cool relative overflow-hidden px-6 py-24"
    >
      <Daisy className="absolute -right-6 top-16 h-24 w-24 rotate-12 text-[var(--rp-pink)]/45" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            eyebrow="Meet The Lovers"
            title="Two Hearts, One Story"
          />
        </Reveal>
        <div className="mt-11 grid grid-cols-2 gap-4 text-center">
          <Reveal variant="left">
            <Person
              role="The Bride"
              name={couple.bride_name}
              photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
              parents={couple.bride_parents}
              instagram={couple.bride_ig}
              accentClass="bg-[var(--rp-yellow)]"
            />
          </Reveal>
          <Reveal variant="right" delay={80}>
            <Person
              role="The Groom"
              name={couple.groom_name}
              photoUrl={couple.groom_photo_url || fallbackPhotoUrl}
              parents={couple.groom_parents}
              instagram={couple.groom_ig}
              accentClass="bg-[var(--rp-pink)]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
