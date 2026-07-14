import type { GalleryPhotoInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { OrnamentDivider } from '../components/ornaments';

const MAX_GALLERY_PHOTOS = 10;

interface GallerySectionProps {
  photos: GalleryPhotoInfo[];
  videoUrl?: string | null;
}

function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/** Section 5: galeri foto berbingkai tipis emas + video YouTube. */
export default function GallerySection({ photos, videoUrl }: GallerySectionProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;

  return (
    <section className="bg-[var(--color-secondary)] px-6 py-16 text-center">
      <Reveal variant="blur">
        <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Galeri
        </h2>
        <OrnamentDivider className="mx-auto mt-3 w-44" />
      </Reveal>

      {youtubeId && (
        <Reveal variant="zoom" className="mx-auto mt-10 w-full max-w-3xl">
          <div className="border border-[#C9A227]/50 bg-white p-1.5">
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      )}

      {photos && photos.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-3">
          {photos.slice(0, MAX_GALLERY_PHOTOS).map((photo, idx) => (
            <Reveal key={idx} variant="zoom" delay={(idx % 2) * 120 + Math.floor(idx / 2) * 60}>
              <div className="border border-[#C9A227]/40 bg-white p-1.5">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={photo.photo_url}
                    alt={`Galeri ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
