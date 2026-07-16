import type { CoupleInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { ArchDivider } from '../components/ornaments';

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
      <div className="mx-auto w-fit rounded-t-full border border-[var(--color-primary)]/50 p-2 bg-white shadow-sm transition-transform duration-500 hover:-translate-y-1">
        <div className="h-56 w-44 overflow-hidden rounded-t-full">
          <img
            src={photoUrl}
            alt={role}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.3em] font-semibold text-[var(--color-primary)]">
        {role}
      </p>
      <h3 className="mt-2 font-serif text-2xl font-semibold text-neutral-800">{name}</h3>
      {parents && <p className="mt-3 text-sm text-neutral-500 leading-relaxed">{parents}</p>}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/40 px-4 py-1.5 text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition"
        >
          📸 {instagram}
        </a>
      )}
    </div>
  );
}

/** Section 2b: kedua mempelai dengan foto berbingkai lengkung masjid. */
export default function CoupleSection({ couple, fallbackPhotoUrl }: CoupleSectionProps) {
  return (
    <section className="px-6 py-16 text-center bg-[var(--color-secondary)]">
      <Reveal variant="blur">
        <p className="font-arabic text-lg text-[var(--color-primary)]" lang="ar" dir="rtl">
          السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold text-neutral-800">Kedua Mempelai</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-500 leading-relaxed">
          Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan
          putra-putri kami:
        </p>
        <ArchDivider className="mx-auto mt-4 w-44" />
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-10">
        <Reveal variant="left" className="flex w-full justify-center">
          <PersonCard
            role="Mempelai Wanita"
            name={couple.bride_name}
            photoUrl={couple.bride_photo_url || fallbackPhotoUrl}
            parents={couple.bride_parents}
            instagram={couple.bride_ig}
          />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <p className="font-script text-4xl text-[var(--color-primary)]">&amp;</p>
        </Reveal>

        <Reveal variant="right" className="flex w-full justify-center">
          <PersonCard
            role="Mempelai Pria"
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
