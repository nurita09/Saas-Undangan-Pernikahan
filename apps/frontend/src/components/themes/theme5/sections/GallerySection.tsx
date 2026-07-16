import type { GalleryPhotoInfo } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { COCOA, GroovyDivider } from '../components/ornaments';

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

/** Section 5: momen seru -- grid foto sticker miring selang-seling. */
export default function GallerySection({ photos, videoUrl }: GallerySectionProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;

  return (
    <section className="bg-white px-6 py-16 text-center">
      <Reveal variant="blur">
        <h2 className="font-retro text-3xl" style={{ color: COCOA }}>
          Momen Seru
        </h2>
        <GroovyDivider className="mx-auto mt-3 w-48" />
      </Reveal>

      {youtubeId && (
        <Reveal variant="zoom" className="mx-auto mt-10 w-full max-w-3xl">
          <div
            className="rounded-[2rem] border-4 bg-[var(--color-secondary)] p-2 shadow-[6px_6px_0_#E3B23C]"
            style={{ borderColor: COCOA }}
          >
            <div className="aspect-video w-full overflow-hidden rounded-[1.5rem] bg-black">
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
        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-4">
          {photos.slice(0, MAX_GALLERY_PHOTOS).map((photo, idx) => (
            <Reveal key={idx} variant="zoom" delay={(idx % 2) * 120 + Math.floor(idx / 2) * 60}>
              <div
                className={`${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} rounded-[1.5rem] border-4 bg-[var(--color-secondary)] p-1.5 transition-transform duration-500 hover:rotate-0`}
                style={{
                  borderColor: COCOA,
                  boxShadow: `4px 4px 0 ${idx % 2 === 0 ? '#C75B39' : '#E3B23C'}`,
                }}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[1rem]">
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
