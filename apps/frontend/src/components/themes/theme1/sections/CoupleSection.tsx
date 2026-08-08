import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  FloralCorners,
  InstagramIcon,
  SectionTitle,
} from "../components/ornaments";
import fallbackBridePhoto from "../../../../assets/theme1/bride.jpg";
import fallbackGroomPhoto from "../../../../assets/theme1/groom.jpg";

interface CoupleSectionProps {
  couple: CoupleInfo;
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
    <Reveal variant="bloom" delay={delay}>
      <article className="mx-auto max-w-[21rem] text-center">
        <div className="person-portrait relative mx-4 p-2">
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="aspect-[3/4] w-full rounded-t-[999px] rounded-b-[5px] object-cover transition-transform duration-[1200ms] hover:scale-[1.025]"
          />
        </div>
        <div className="person-details relative -mt-12 mx-auto w-[calc(100%-1.75rem)] px-6 py-7">
          <p className="label-caps text-[var(--fl-clay)]">{role}</p>
          <h3 className="mt-2 font-floral-script text-[2.85rem] leading-none text-[var(--color-primary)]">
            {name}
          </h3>
          {parents && (
            <p className="mx-auto mt-4 max-w-xs font-floral-serif text-base leading-relaxed text-[var(--fl-muted)]">
              {parents}
            </p>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-floral-sans text-xs text-[var(--fl-muted)] transition-colors hover:text-[var(--fl-clay)]"
            >
              <InstagramIcon className="h-4 w-4" />@{instagram.replace("@", "")}
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

/** Section 2b: profil Bride & Groom -- kartu foto besar, dipisah "&" script. */
export default function CoupleSection({ couple }: CoupleSectionProps) {
  return (
    <section
      id="couple"
      className="floral-section relative overflow-hidden px-6 py-24"
    >
      <FloralCorners spots={["bl"]} size="w-32" opacity="opacity-30" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="Kedua Mempelai" title="Bride & Groom" />
        </Reveal>

        <div className="mt-12 space-y-11">
          <PersonCard
            role="The Bride"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackBridePhoto}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
            delay={0}
          />
          <div
            className="mx-auto flex max-w-[14rem] items-center gap-5"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-[var(--fl-gold)]/40" />
            <p className="font-floral-script text-5xl leading-none text-[var(--fl-clay)]">
              &amp;
            </p>
            <span className="h-px flex-1 bg-[var(--fl-gold)]/40" />
          </div>
          <PersonCard
            role="The Groom"
            name={couple.groom_name}
            photoUrl={couple.groom_photo_url || fallbackGroomPhoto}
            parents={couple.groom_parents}
            instagram={couple.groom_ig}
            delay={120}
          />
        </div>
      </div>
    </section>
  );
}
