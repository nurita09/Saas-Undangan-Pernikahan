import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../components/Reveal';

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
}

function PersonCard({ role, name, photoUrl, parents, instagram }: PersonCardProps) {
  return (
    <div className="w-full max-w-[260px] overflow-hidden rounded-2xl bg-white text-left shadow-lg transition-transform duration-500 hover:-translate-y-1">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={photoUrl}
          alt={role}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div className="px-5 py-5">
        <p className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)]">{role}</p>
        <h3 className="mt-1 text-xl font-bold text-neutral-800">{name}</h3>
        {parents && <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{parents}</p>}
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs text-[var(--color-primary)]"
          >
            <span>📸</span> {instagram}
          </a>
        )}
      </div>
    </div>
  );
}

/** Section 2b: profil Bride & Groom. */
export default function CoupleSection({ couple, fallbackPhotoUrl }: CoupleSectionProps) {
  return (
    <section className="px-6 py-16 text-center bg-[#CCBBA1]">
      <Reveal variant="blur">
        <h2 className="font-script text-4xl text-white">Bride &amp; Groom</h2>
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-8">
        <Reveal variant="left" className="flex w-full justify-center">
          <PersonCard
            role="The Bride"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
          />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <p className="font-script text-3xl text-white">&amp;</p>
        </Reveal>

        <Reveal variant="right" className="flex w-full justify-center">
          <PersonCard
            role="The Groom"
            name={couple.groom_name}
            photoUrl={couple.groom_photo_url || fallbackPhotoUrl}
            parents={couple.groom_parents}
            instagram={couple.groom_ig}
          />
        </Reveal>
      </div>
    </section>
  );
}
