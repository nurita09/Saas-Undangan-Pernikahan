import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { GoldDivider } from '../components/ornaments';

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
      <div className="mx-auto w-fit rounded-full border border-[#D4AF37]/70 p-1.5 shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-transform duration-500 hover:-translate-y-1">
        <div className="h-44 w-44 overflow-hidden rounded-full">
          <img
            src={photoUrl}
            alt={role}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.4em] font-semibold text-[#D4AF37]">{role}</p>
      <h3 className="mt-2 font-script text-3xl text-neutral-100">{name}</h3>
      {parents && <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{parents}</p>}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 px-4 py-1.5 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
        >
          📸 {instagram}
        </a>
      )}
    </div>
  );
}

/** Section 2b: Bride & Groom di latar gelap dengan foto ber-halo emas. */
export default function CoupleSection({ couple, fallbackPhotoUrl }: CoupleSectionProps) {
  return (
    <section className="px-6 py-16 text-center bg-[var(--color-secondary)]">
      <Reveal variant="blur">
        <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-neutral-100">
          Bride <span className="text-[#D4AF37]">&amp;</span> Groom
        </h2>
        <GoldDivider className="mx-auto mt-3 w-48" />
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-10">
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
          <p className="font-script text-4xl text-[#D4AF37]">&amp;</p>
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
