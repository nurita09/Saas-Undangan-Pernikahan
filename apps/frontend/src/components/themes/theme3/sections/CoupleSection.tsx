import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { GoldDivider, InstagramIcon } from "../components/ornaments";

interface CoupleSectionProps {
  couple: CoupleInfo;
  fallbackPhotoUrl: string;
}

interface PersonCardProps {
  role: string;
  name: string;
  photoUrl: string;
  parents?: string | null;
  instagram?: string | null;
  delay: number;
}

function PersonCard({
  role,
  name,
  photoUrl,
  parents,
  instagram,
  delay,
}: PersonCardProps) {
  return (
    <Reveal variant="zoom" delay={delay}>
      <article className="noir-card mx-auto max-w-sm overflow-hidden">
        <figure className="group relative aspect-[4/5] overflow-hidden">
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-secondary)] via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 px-6 pb-7 text-left">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-[var(--color-primary)]">
              {role}
            </p>
            <h3 className="mt-2 font-script text-[3.4rem] leading-none text-white">
              {name}
            </h3>
          </figcaption>
        </figure>
        <div className="px-6 py-6 text-left">
          {parents && (
            <p className="text-sm leading-relaxed text-[var(--dk-muted)]">
              {parents}
            </p>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--color-primary)] transition-colors hover:text-[var(--dk-ivory)]"
            >
              <InstagramIcon className="h-4 w-4" />@{instagram.replace("@", "")}
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

/** Section 2b: portrait pasangan bergaya poster malam. */
export default function CoupleSection({
  couple,
  fallbackPhotoUrl,
}: CoupleSectionProps) {
  return (
    <section id="couple" className="noir-section px-6 py-24 text-center">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            Meet The Couple
          </p>
          <h2 className="mt-4 font-script text-[3.8rem] leading-none text-[var(--dk-ivory)]">
            Bride &amp; Groom
          </h2>
          <GoldDivider className="mx-auto mt-5 w-52" />
        </Reveal>

        <div className="mt-12 space-y-10">
          <PersonCard
            role="The Bride"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
            delay={0}
          />
          <div
            className="mx-auto flex max-w-48 items-center gap-4 text-[var(--color-primary)]"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-current/45" />
            <span className="font-script text-5xl leading-none">&amp;</span>
            <span className="h-px flex-1 bg-current/45" />
          </div>
          <PersonCard
            role="The Groom"
            name={couple.groom_name}
            photoUrl={couple.groom_photo_url || fallbackPhotoUrl}
            parents={couple.groom_parents}
            instagram={couple.groom_ig}
            delay={120}
          />
        </div>
      </div>
    </section>
  );
}
