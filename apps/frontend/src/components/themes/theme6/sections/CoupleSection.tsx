import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { InstagramIcon, SectionTitle } from '../components/ornaments';
import fallbackGroomPhoto from '../../../../assets/theme6/groom.jpg';
import fallbackBridePhoto from '../../../../assets/theme6/bride.jpg';

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

/** Foto bundar berbingkai belah ketupat + identitas -- ciri khas desain vintage ini. */
function Person({ role, name, photoUrl, parents, instagram, delay }: PersonProps) {
  return (
    <Reveal variant="up" delay={delay}>
      <div className="text-center">
        <div className="relative mx-auto h-44 w-44">
          <div className="absolute inset-0 rotate-45 rounded-[2rem] border border-[var(--color-primary)]/40" />
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="relative h-44 w-44 rounded-full border-4 border-[var(--t6-card)] object-cover shadow-lg"
          />
        </div>
        <p className="mt-5 text-[0.6rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
          {role}
        </p>
        <h3 className="mt-2 font-vintage text-2xl text-[var(--sage-deep)]">{name}</h3>
        {parents && <p className="mt-2 text-sm text-[var(--t6-muted)] leading-relaxed">{parents}</p>}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/35 px-4 py-1.5 text-xs text-[var(--sage-deep)] transition-colors hover:bg-[var(--color-primary)]/10"
          >
            <InstagramIcon className="h-3.5 w-3.5" />@{instagram.replace('@', '')}
          </a>
        )}
      </div>
    </Reveal>
  );
}

/** Section 2b: profil kedua mempelai. Foto fallback ikut asset bawaan tema
 *  (bukan foto cover/global) supaya tampilan default sama dengan desain asalnya. */
export default function CoupleSection({ couple }: CoupleSectionProps) {
  return (
    <section className="bg-[var(--sage-soft)] px-7 pt-16 pb-20">
      <div className="space-y-12">
        <Reveal variant="up">
          <SectionTitle kicker="Mempelai" title="Kedua Pengantin" />
        </Reveal>
        <Person
          role="Mempelai Pria"
          name={couple.groom_name}
          photoUrl={couple.groom_photo_url || fallbackGroomPhoto}
          parents={couple.groom_parents}
          instagram={couple.groom_ig}
          delay={0}
        />
        <Person
          role="Mempelai Wanita"
          name={couple.bride_name}
          photoUrl={couple.bride_photo_url || fallbackBridePhoto}
          parents={couple.bride_parents}
          instagram={couple.bride_ig}
          delay={100}
        />
      </div>
    </section>
  );
}
