import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { SectionTitle } from '../components/ornaments';
import fallbackBridePhoto from '../../../../assets/theme2/bride.jpg';
import fallbackGroomPhoto from '../../../../assets/theme2/groom.jpg';

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
}

function Person({ role, name, photoUrl, parents, instagram, delay }: PersonProps) {
  return (
    <Reveal variant="bloom" delay={delay} className="text-center">
      <div className="relative mx-auto w-fit">
        <div className="absolute -inset-2.5 rounded-full border border-[var(--jw-gold-soft)]" />
        <div className="size-44 overflow-hidden rounded-full border-2 border-[var(--jw-gold)]/70 shadow-[var(--jw-shadow)]">
          <img src={photoUrl} alt={name} loading="lazy" className="size-full object-cover" />
        </div>
      </div>
      <p className="mt-7 text-[0.6rem] font-medium tracking-[0.3em] text-[var(--jw-gold)] uppercase">
        {role}
      </p>
      <p className="mt-2 font-jawa-script text-4xl text-[var(--color-primary)]">{name}</p>
      {parents && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--jw-muted)]">{parents}</p>
      )}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 border border-[var(--jw-gold)]/50 rounded-full px-4 py-1.5 text-xs text-[var(--color-primary)] transition-colors hover:bg-[var(--jw-gold)]/10"
        >
          @{instagram.replace('@', '')}
        </a>
      )}
    </Reveal>
  );
}

function CoupleConnector() {
  return (
    <Reveal variant="bloom" delay={70}>
      <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-5 text-[var(--jw-gold)]">
        <span className="h-px flex-1 bg-[var(--jw-gold)]/45" />
        <span className="font-jawa-script text-6xl leading-none text-[var(--jw-gold)] drop-shadow-[0_8px_18px_rgba(201,162,39,0.18)]">
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
    <section className="px-6 py-20">
      <div className="mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Bismillahirrahmanirrahim" title="Temanten" />
        </Reveal>

        <div className="mt-14 space-y-14">
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
          />
        </div>
      </div>
    </section>
  );
}
