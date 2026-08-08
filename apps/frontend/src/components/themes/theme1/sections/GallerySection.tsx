import { useEffect, useState } from "react";
import type { GalleryPhotoInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  FloralCorners,
  SectionTitle,
  XIcon,
} from "../components/ornaments";
import g1 from "../../../../assets/theme1/g1.jpg";
import g2 from "../../../../assets/theme1/g2.jpg";
import g3 from "../../../../assets/theme1/g3.jpg";
import g4 from "../../../../assets/theme1/g4.jpg";

const MAX_GALLERY_PHOTOS = 10;

/* Grid fallback bawaan tema saat pasangan belum mengunggah foto galeri. */
const FALLBACK_GALLERY: GalleryPhotoInfo[] = [g1, g2, g4, g3].map(
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

/** Section 5: galeri -- video prewedding + grid foto berbingkai polaroid. */
export default function GallerySection({
  photos,
  videoUrl,
}: GallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;
  const galleryPhotos = photos && photos.length > 0 ? photos : FALLBACK_GALLERY;
  const visiblePhotos = galleryPhotos.slice(0, MAX_GALLERY_PHOTOS);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % visiblePhotos.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, visiblePhotos.length]);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % visiblePhotos.length,
    );
  };

  return (
    <section className="floral-section-tint relative overflow-hidden px-6 py-24">
      <FloralCorners spots={["tr"]} size="w-28" opacity="opacity-30" />
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
          {visiblePhotos.map((photo, idx) => {
            const isWide = idx === 0 || idx % 5 === 3;
            return (
              <Reveal
                key={idx}
                variant="bloom"
                delay={(idx % 2) * 100}
                className={isWide ? "col-span-2" : ""}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Perbesar foto galeri ${idx + 1}`}
                  className="group relative w-full overflow-hidden rounded-[6px] border border-[var(--fl-gold)]/30 bg-white/60 p-1.5 shadow-[0_20px_44px_-34px_rgba(74,66,56,0.72)]"
                >
                  <img
                    src={photo.photo_url}
                    alt={`Momen pernikahan ${idx + 1}`}
                    loading="lazy"
                    className={`${isWide ? "aspect-[16/10]" : "aspect-[4/5]"} w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105`}
                  />
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/35 text-white opacity-100 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <ExpandIcon className="h-4 w-4" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau galeri"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 px-5 py-20 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Tutup galeri"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-black/20 text-white transition-colors hover:bg-white/15"
          >
            <XIcon className="h-5 w-5" />
          </button>
          {visiblePhotos.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-black/20 text-white transition-colors hover:bg-white/15"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          )}
          <img
            src={visiblePhotos[activeIndex].photo_url}
            alt={`Momen pernikahan ${activeIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          {visiblePhotos.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Foto berikutnya"
              className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-black/20 text-white transition-colors hover:bg-white/15"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}
          <p className="absolute bottom-7 font-floral-sans text-xs tracking-[0.16em] text-white/70">
            {activeIndex + 1} / {visiblePhotos.length}
          </p>
        </div>
      )}
    </section>
  );
}
