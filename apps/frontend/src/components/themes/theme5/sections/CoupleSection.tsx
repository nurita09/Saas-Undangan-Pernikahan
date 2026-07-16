import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, Daisy, GroovyDivider } from '../components/ornaments';

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
  tilt: string;
  shadowColor: string;
}

function PersonCard({ role, name, photoUrl, parents, instagram, tilt, shadowColor }: PersonCardProps) {
  return (
    <div className="w-full max-w-[280px] text-center">
      <div
        className={`mx-auto w-fit ${tilt} rounded-full border-4 bg-white p-2 transition-transform duration-500 hover:rotate-0`}
        style={{ borderColor: COCOA, boxShadow: `6px 6px 0 ${shadowColor}` }}
      >
        <div className="h-44 w-44 overflow-hidden rounded-full">
          <img
            src={photoUrl}
            alt={role}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      <p
        className="mx-auto mt-5 w-fit -rotate-1 rounded-full border-2 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ borderColor: COCOA, color: COCOA, backgroundColor: '#FBF3E4' }}
      >
        {role}
      </p>
      <h3 className="mt-3 font-retro text-2xl" style={{ color: COCOA }}>
        {name}
      </h3>
      {parents && <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{parents}</p>}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border-2 bg-white px-4 py-1.5 text-xs font-bold shadow-[3px_3px_0_#5C4033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#5C4033] transition-all"
          style={{ borderColor: COCOA, color: COCOA }}
        >
          📸 {instagram}
        </a>
      )}
    </div>
  );
}

/** Section 2b: pasangan bahagia -- foto polaroid bundar miring-miring. */
export default function CoupleSection({ couple, fallbackPhotoUrl }: CoupleSectionProps) {
  return (
    <section className="px-6 py-16 text-center bg-[var(--color-secondary)]">
      <Reveal variant="blur">
        <h2 className="font-retro text-3xl" style={{ color: COCOA }}>
          Pasangan Bahagia
        </h2>
        <GroovyDivider className="mx-auto mt-3 w-48" />
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-10">
        <Reveal variant="left" className="flex w-full justify-center">
          <PersonCard
            role="The Bride"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
            tilt="-rotate-2"
            shadowColor="#C75B39"
          />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <Daisy className="h-12 w-12 text-[var(--color-primary)]" />
        </Reveal>

        <Reveal variant="right" className="flex w-full justify-center">
          <PersonCard
            role="The Groom"
            name={couple.groom_name}
            photoUrl={couple.groom_photo_url || fallbackPhotoUrl}
            parents={couple.groom_parents}
            instagram={couple.groom_ig}
            tilt="rotate-2"
            shadowColor="#E3B23C"
          />
        </Reveal>
      </div>
    </section>
  );
}
