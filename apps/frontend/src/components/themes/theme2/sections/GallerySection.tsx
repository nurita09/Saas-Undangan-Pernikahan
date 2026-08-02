import type { GalleryPhotoInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { BatikBand, PlayIcon, SectionTitle } from '../components/ornaments';
import coupleMain from '../../../../assets/theme2/couple-main.jpg';
import bride from '../../../../assets/theme2/bride.jpg';
import groom from '../../../../assets/theme2/groom.jpg';

const MAX_GALLERY_PHOTOS = 10;

/* Grid fallback bawaan tema saat pasangan belum mengunggah foto galeri. */
const FALLBACK_GALLERY: GalleryPhotoInfo[] = [coupleMain, bride, groom, bride, groom].map(
  (photo_url) => ({ photo_url }),
);

interface GallerySectionProps {
  photos: GalleryPhotoInfo[];
  videoUrl?: string | null;
}

/** Ambil ID video dari berbagai bentuk URL YouTube (watch?v=, youtu.be/, embed/). */
function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/* Ubin pertama tampil besar (2x2) seperti mozaik galeri desain asal. */
function tileSpan(idx: number): string {
  return idx === 0 ? 'col-span-2 row-span-2' : '';
}

/** Section 5: Pethikan Wekdal (Galeri) -- mozaik foto + video prewedding. */
export default function GallerySection({ photos, videoUrl }: GallerySectionProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;
  const galleryPhotos = photos && photos.length > 0 ? photos : FALLBACK_GALLERY;

  return (
    <section className="relative overflow-hidden bg-[var(--jw-tint)] px-6 py-20">
      <BatikBand />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Pethikan Wekdal" title="Galeri" />
        </Reveal>

        {youtubeId && (
          <Reveal variant="bloom" className="mt-10">
            <div className="border border-[var(--jw-gold-soft)] bg-[var(--jw-card)] p-1.5">
              <div className="aspect-video w-full overflow-hidden bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="Video prewedding"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-[0.6rem] tracking-[0.25em] text-[var(--jw-gold)] uppercase">
              <PlayIcon className="h-3 w-3" /> Prewedding Film
            </p>
          </Reveal>
        )}

        <div className="mt-10 grid auto-rows-[6.5rem] grid-cols-4 gap-3">
          {galleryPhotos.slice(0, MAX_GALLERY_PHOTOS).map((photo, idx) => (
            <Reveal
              key={idx}
              variant="bloom"
              delay={idx * 90}
              className={`overflow-hidden border border-[var(--jw-gold-soft)] ${tileSpan(idx)}`.trim()}
            >
              <img
                src={photo.photo_url}
                alt={`Momen pernikahan ${idx + 1}`}
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1200ms] hover:scale-110"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
