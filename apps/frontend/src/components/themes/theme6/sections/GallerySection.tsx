import type { GalleryPhotoInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { PlayIcon, SectionTitle } from '../components/ornaments';
import gallery1 from '../../../../assets/theme6/gallery-1.jpg';
import gallery2 from '../../../../assets/theme6/gallery-2.jpg';
import gallery3 from '../../../../assets/theme6/gallery-3.jpg';
import gallery4 from '../../../../assets/theme6/gallery-4.jpg';

const MAX_GALLERY_PHOTOS = 10;

/* Grid fallback bawaan tema saat pasangan belum mengunggah foto galeri --
   section tetap tampil seperti desain asalnya, bukan hilang. */
const FALLBACK_GALLERY: GalleryPhotoInfo[] = [gallery1, gallery2, gallery3, gallery4].map(
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

/** Section 5: galeri -- video prewedding + grid foto dengan rasio berselang. */
export default function GallerySection({ photos, videoUrl }: GallerySectionProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;
  const galleryPhotos = photos && photos.length > 0 ? photos : FALLBACK_GALLERY;

  return (
    <section className="px-7 py-20">
      <Reveal variant="up">
        <SectionTitle kicker="Moments" title="Galeri Kami" />
        {youtubeId && (
          <>
            <div className="mt-7 overflow-hidden border border-[var(--color-primary)]/25 shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Video prewedding"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.25em] text-[var(--color-primary)] uppercase">
              <PlayIcon className="h-3 w-3" /> Prewedding Film
            </p>
          </>
        )}
      </Reveal>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {galleryPhotos.slice(0, MAX_GALLERY_PHOTOS).map((photo, idx) => (
          <Reveal key={idx} variant="zoom" delay={(idx % 2) * 70}>
            <img
              src={photo.photo_url}
              alt={`Foto galeri ${idx + 1}`}
              loading="lazy"
              className={`w-full border border-[var(--color-primary)]/25 object-cover shadow-md transition-transform duration-500 hover:scale-[1.03] ${
                idx % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'
              }`}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
