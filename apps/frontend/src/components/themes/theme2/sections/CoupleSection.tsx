import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { OrnamentDivider } from '../components/ornaments';

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
    <div className="w-full max-w-[270px] text-center">
      <div className="mx-auto rounded-full border-2 border-[#C9A227] p-1.5 w-fit transition-transform duration-500 hover:-translate-y-1">
        <div className="h-44 w-44 overflow-hidden rounded-full">
          <img
            src={photoUrl}
            alt={role}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      <p className="mt-5 text-xs uppercase tracking-[0.3em] font-semibold text-[#C9A227]">{role}</p>
      <h3 className="mt-2 font-script text-3xl text-[var(--color-primary)]">{name}</h3>
      {parents && <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{parents}</p>}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 border border-[#C9A227]/60 rounded-full px-4 py-1.5 text-xs text-[var(--color-primary)] hover:bg-[#C9A227]/10 transition"
        >
          📸 {instagram}
        </a>
      )}
    </div>
  );
}

/** Section 2b: Temanten Kakung & Temanten Putri. */
export default function CoupleSection({ couple, fallbackPhotoUrl }: CoupleSectionProps) {
  return (
    <section className="px-6 py-16 text-center bg-[var(--color-secondary)]">
      <Reveal variant="blur">
        <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Temanten
        </h2>
        <OrnamentDivider className="mx-auto mt-3 w-44" />
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-10">
        <Reveal variant="left" className="flex w-full justify-center">
          <PersonCard
            role="Temanten Putri"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
          />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <p className="font-script text-4xl text-[#C9A227]">&amp;</p>
        </Reveal>

        <Reveal variant="right" className="flex w-full justify-center">
          <PersonCard
            role="Temanten Kakung"
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
