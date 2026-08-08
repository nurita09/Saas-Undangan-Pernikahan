import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { InstagramIcon, SectionTitle } from "../components/ornaments";
import fallbackBridePhoto from "../../../../assets/theme2/bride.jpg";
import fallbackGroomPhoto from "../../../../assets/theme2/groom.jpg";

interface CoupleSectionProps {
  couple: CoupleInfo;
}

interface PersonProps {
  role: string;
  name: string;
  photoUrl: string;
  parents?: string | null;
  instagram?: string | null;
  delay: number;
  reverse?: boolean;
}

function Person({
  role,
  name,
  photoUrl,
  parents,
  instagram,
  delay,
  reverse = false,
}: PersonProps) {
  return (
    <Reveal variant="bloom" delay={delay}>
      <article
        className={`grid items-center gap-5 ${
          reverse
            ? "grid-cols-[minmax(0,1fr)_minmax(7.5rem,9rem)]"
            : "grid-cols-[minmax(7.5rem,9rem)_minmax(0,1fr)]"
        }`}
      >
        <div className={`jw-person-portrait ${reverse ? "order-2" : ""}`}>
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-[999px] object-cover"
          />
        </div>
        <div className={reverse ? "text-right" : "text-left"}>
          <p className="text-[0.56rem] font-medium tracking-[0.26em] text-[var(--jw-gold)] uppercase">
            {role}
          </p>
          <p className="mt-1.5 font-jawa-script text-[2.8rem] leading-none text-[var(--color-primary)]">
            {name}
          </p>
          {parents && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--jw-muted)]">
              {parents}
            </p>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className={`mt-4 inline-flex items-center gap-2 text-xs text-[var(--color-primary)] transition-colors hover:text-[var(--jw-russet)] ${
                reverse ? "justify-end" : ""
              }`}
            >
              <InstagramIcon className="h-4 w-4" />@{instagram.replace("@", "")}
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

function CoupleConnector() {
  return (
    <Reveal variant="bloom" delay={70}>
      <div className="mx-auto flex w-full max-w-48 items-center justify-center gap-4 text-[var(--jw-gold)]">
        <span className="h-px flex-1 bg-[var(--jw-gold)]/45" />
        <span className="font-jawa-script text-5xl leading-none text-[var(--jw-gold)] drop-shadow-[0_8px_18px_rgba(201,162,39,0.18)]">
          &amp;
        </span>
        <span className="h-px flex-1 bg-[var(--jw-gold)]/45" />
      </div>
    </Reveal>
  );
}

/** Section 2b: Temanten -- profil Temanten Putri & Temanten Kakung. */
export default function CoupleSection({ couple }: CoupleSectionProps) {
  return (
    <section id="couple" className="jw-paper-section px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Bismillahirrahmanirrahim" title="Temanten" />
        </Reveal>

        <div className="mt-14 space-y-12">
          <Person
            role="Temanten Putri"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackBridePhoto}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
            delay={0}
          />
          <CoupleConnector />
          <Person
            role="Temanten Kakung"
            name={couple.groom_name}
            photoUrl={couple.groom_photo_url || fallbackGroomPhoto}
            parents={couple.groom_parents}
            instagram={couple.groom_ig}
            delay={100}
            reverse
          />
        </div>
      </div>
    </section>
  );
}
