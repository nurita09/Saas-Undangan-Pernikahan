import type { CoupleInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import { InstagramIcon, SectionTitle } from "../components/ornaments";
import fallbackGroomPhoto from "../../../../assets/theme6/groom.jpg";
import fallbackBridePhoto from "../../../../assets/theme6/bride.jpg";

interface CoupleSectionProps {
  couple: CoupleInfo;
}

interface PersonProps {
  role: string;
  catalogue: string;
  name: string;
  photoUrl: string;
  parents?: string | null;
  instagram?: string | null;
  angle: string;
}

function Person({
  role,
  catalogue,
  name,
  photoUrl,
  parents,
  instagram,
  angle,
}: PersonProps) {
  const username = instagram?.replace("@", "");
  return (
    <Reveal variant="up">
      <article className={`va-archive-card relative p-3 ${angle}`}>
        <div className="relative overflow-hidden bg-[var(--va-forest)]">
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover saturate-[0.78] transition duration-700 hover:saturate-100"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(24,40,34,0.45))]" />
          <span className="absolute bottom-3 right-3 border border-white/45 bg-black/20 px-2 py-1 text-[0.5rem] tracking-[0.2em] text-white uppercase backdrop-blur-sm">
            {catalogue}
          </span>
        </div>
        <div className="px-3 pb-3 pt-5 text-center">
          <p className="text-[0.56rem] tracking-[0.28em] text-[var(--va-oxblood)] uppercase">
            {role}
          </p>
          <h3 className="mt-2 font-vintage-script text-[2.4rem] leading-none text-[var(--va-forest)]">
            {name}
          </h3>
          {parents && (
            <p className="mt-4 text-sm leading-6 text-[var(--va-muted)]">
              {parents}
            </p>
          )}
          {username && (
            <a
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-9 items-center gap-2 border-b border-[var(--va-oxblood)]/35 px-2 text-xs text-[var(--va-oxblood)] transition hover:border-[var(--va-oxblood)]"
            >
              <InstagramIcon className="h-3.5 w-3.5" />@{username}
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function CoupleSection({ couple }: CoupleSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--va-paper)] px-7 py-24">
      <span className="pointer-events-none absolute -right-4 top-12 font-vintage text-[7rem] leading-none text-[var(--va-forest)]/[0.035]">
        II
      </span>
      <Reveal variant="up">
        <SectionTitle
          kicker="The Portrait Register"
          title="Kedua Mempelai"
          description="Dua nama, dua perjalanan, kini dicatat dalam satu kisah yang sama."
        />
      </Reveal>
      <div className="mt-10 space-y-8">
        <Person
          role="The Groom"
          catalogue="Portrait 01"
          name={couple.groom_name}
          photoUrl={couple.groom_photo_url || fallbackGroomPhoto}
          parents={couple.groom_parents}
          instagram={couple.groom_ig}
          angle="rotate-[-0.7deg]"
        />
        <Person
          role="The Bride"
          catalogue="Portrait 02"
          name={couple.bride_name}
          photoUrl={couple.bride_photo_url || fallbackBridePhoto}
          parents={couple.bride_parents}
          instagram={couple.bride_ig}
          angle="rotate-[0.7deg]"
        />
      </div>
    </section>
  );
}
