import type { GalleryPhotoInfo } from '../../../../types/wedding';
import Reveal from '../components/Reveal';

const MAX_GALLERY_PHOTOS = 10;

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

/** Section 5: galeri foto (grid 2 kolom, muncul zoom bergantian) + video YouTube. */
export default function GallerySection({ photos, videoUrl }: GallerySectionProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;

  return (
    <section className="relative bg-white px-6 py-16 text-center">
      <Reveal variant="blur">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-neutral-800">Our Love Story</h2>
      </Reveal>

      {youtubeId && (
        <Reveal variant="zoom" className="mx-auto mt-10 w-full max-w-3xl">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      )}

      {photos && photos.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-3">
          {photos.slice(0, MAX_GALLERY_PHOTOS).map((photo, idx) => (
            <Reveal key={idx} variant="zoom" delay={(idx % 2) * 120 + Math.floor(idx / 2) * 60}>
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
                <img
                  src={photo.photo_url}
                  alt={`Galeri ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
