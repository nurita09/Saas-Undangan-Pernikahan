import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { FloralCorners, SectionTitle } from '../components/ornaments';
import fallbackBridePhoto from '../../../../assets/theme1/bride.jpg';
import fallbackGroomPhoto from '../../../../assets/theme1/groom.jpg';

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

function PersonCard({ role, name, photoUrl, parents, instagram, delay }: PersonCardProps) {
  return (
    <Reveal variant="bloom" delay={delay}>
      <article className="card-petal overflow-hidden pb-9 text-center">
        <div className="overflow-hidden">
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="h-96 w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
          />
        </div>
        <p className="label-caps mt-7 text-[var(--fl-clay)]">{role}</p>
        <h3 className="mt-2 font-floral-script text-4xl text-[var(--color-primary)]">{name}</h3>
        {parents && (
          <p className="mx-auto mt-3 max-w-xs font-floral-serif text-base text-[var(--fl-muted)]">
            {parents}
          </p>
        )}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="label-caps mt-4 inline-block text-[0.6rem] text-[var(--fl-muted)] transition-colors hover:text-[var(--fl-clay)]"
          >
            @{instagram.replace('@', '')}
          </a>
        )}
      </article>
    </Reveal>
  );
}

/** Section 2b: profil Bride & Groom -- kartu foto besar, dipisah "&" script. */
export default function CoupleSection({ couple }: CoupleSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      <FloralCorners spots={['tl', 'br']} opacity="opacity-40" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="Kedua Mempelai" title="Bride & Groom" />
        </Reveal>

        <div className="mt-12 space-y-8">
          <PersonCard
            role="The Bride"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackBridePhoto}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
            delay={0}
          />
          <p className="drift-slow text-center font-floral-serif text-5xl italic text-[var(--fl-clay)]">
            &amp;
          </p>
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
