import type { GalleryPhotoInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { FloralCorners, SectionTitle } from '../components/ornaments';
import g1 from '../../../../assets/theme1/g1.jpg';
import g2 from '../../../../assets/theme1/g2.jpg';
import g3 from '../../../../assets/theme1/g3.jpg';
import g4 from '../../../../assets/theme1/g4.jpg';

const MAX_GALLERY_PHOTOS = 10;

/* Grid fallback bawaan tema saat pasangan belum mengunggah foto galeri. */
const FALLBACK_GALLERY: GalleryPhotoInfo[] = [g1, g2, g4, g3].map((photo_url) => ({ photo_url }));

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

/** Section 5: galeri -- video prewedding + grid foto berbingkai polaroid. */
export default function GallerySection({ photos, videoUrl }: GallerySectionProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;
  const galleryPhotos = photos && photos.length > 0 ? photos : FALLBACK_GALLERY;

  return (
    <section className="relative overflow-hidden bg-[var(--fl-tint)] px-6 py-20">
      <FloralCorners spots={['tr', 'bl']} opacity="opacity-45" />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle eyebrow="Moments" title="Our Gallery" />
        </Reveal>

        {youtubeId && (
          <Reveal variant="bloom" className="mt-10">
            <div className="card-petal p-2">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Video prewedding"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Reveal>
        )}

        <div className="mt-10 grid grid-cols-2 gap-3">
          {galleryPhotos.slice(0, MAX_GALLERY_PHOTOS).map((photo, idx) => (
            <Reveal key={idx} variant="bloom" delay={(idx % 2) * 100}>
              <div className="card-petal group overflow-hidden p-2">
                <img
                  src={photo.photo_url}
                  alt={`Momen pernikahan ${idx + 1}`}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
