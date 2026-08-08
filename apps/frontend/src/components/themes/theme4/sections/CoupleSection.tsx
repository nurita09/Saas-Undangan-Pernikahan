import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  InstagramIcon,
  KhatamStar,
  SectionHeading,
} from "../components/ornaments";

interface CoupleSectionProps {
  couple: CoupleInfo;
  fallbackPhotoUrl: string;
}

interface PersonProfileProps {
  role: string;
  name: string;
  photoUrl: string;
  parents?: string | null;
  instagram?: string | null;
  reverse?: boolean;
}

function PersonProfile({
  role,
  name,
  photoUrl,
  parents,
  instagram,
  reverse = false,
}: PersonProfileProps) {
  const handle = instagram?.replace("@", "");
  return (
    <article
      className={`im-card grid min-h-52 grid-cols-[42%_1fr] gap-4 overflow-hidden p-3 ${reverse ? "text-right" : "text-left"}`}
    >
      <figure
        className={`im-mihrab-photo aspect-[3/4] p-1 ${reverse ? "order-2" : ""}`}
      >
        <img
          src={photoUrl}
          alt={name}
          loading="lazy"
          className="size-full rounded-t-[999px] object-cover"
        />
      </figure>
      <div className="flex min-w-0 flex-col justify-center py-3">
        <p className="text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          {role}
        </p>
        <h3 className="mt-2 break-words font-serif text-[1.75rem] leading-tight text-[var(--im-ink)]">
          {name}
        </h3>
        {parents && (
          <p className="mt-3 text-xs leading-relaxed text-[var(--im-muted)]">
            {parents}
          </p>
        )}
        {handle && (
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noreferrer"
            className={`mt-4 inline-flex items-center gap-2 text-[0.65rem] text-[var(--color-primary)] ${reverse ? "justify-end" : ""}`}
          >
            <InstagramIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">@{handle}</span>
          </a>
        )}
      </div>
    </article>
  );
}

/** Profil mempelai dalam dua panel editorial horizontal. */
export default function CoupleSection({
  couple,
  fallbackPhotoUrl,
}: CoupleSectionProps) {
  return (
    <section id="couple" className="im-section-tint px-6 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading
            arabic="السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ"
            eyebrow="Dengan Rahmat Allah"
            title="Kedua Mempelai"
            description="Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami."
          />
        </Reveal>

        <div className="mt-11 space-y-6">
          <Reveal variant="left">
            <PersonProfile
              role="Mempelai Wanita"
              name={couple.bride_name}
              photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
              parents={couple.bride_parents}
              instagram={couple.bride_ig}
            />
          </Reveal>
          <Reveal variant="zoom">
            <KhatamStar className="mx-auto h-7 w-7 text-[var(--im-clay)]" />
          </Reveal>
          <Reveal variant="right">
            <PersonProfile
              role="Mempelai Pria"
              name={couple.groom_name}
              photoUrl={couple.groom_photo_url || fallbackPhotoUrl}
              parents={couple.groom_parents}
              instagram={couple.groom_ig}
              reverse
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
