import { useEffect, useState } from "react";
import type { GalleryPhotoInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  GoldDivider,
  XIcon,
} from "../components/ornaments";

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

function tileClass(index: number): string {
  if (index === 0) return "col-span-2 aspect-[16/11]";
  if (index === 3) return "col-span-2 aspect-[16/9]";
  return "aspect-[3/4]";
}

/** Galeri mozaik dengan lightbox, navigasi keyboard, dan kontrol sentuh. */
export default function GallerySection({
  photos,
  videoUrl,
}: GallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;
  const visiblePhotos = (photos || []).slice(0, MAX_GALLERY_PHOTOS);

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
    <section className="noir-section-alt px-4 py-24 text-center">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[var(--color-primary)]">
            Fragments Of Forever
          </p>
          <h2 className="mt-4 font-script text-[4rem] leading-none text-[var(--dk-ivory)]">
            Our Moments
          </h2>
          <GoldDivider className="mx-auto mt-5 w-48" />
        </Reveal>

        {youtubeId && (
          <Reveal variant="zoom" className="mt-11">
            <div className="noir-card p-1.5">
              <div className="aspect-video overflow-hidden bg-black">
                <iframe
                  className="size-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="Video prewedding"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        )}

        {visiblePhotos.length > 0 && (
          <div className="mt-11 grid grid-cols-2 gap-2">
            {visiblePhotos.map((photo, idx) => (
              <Reveal
                key={`${photo.photo_url}-${idx}`}
                variant="zoom"
                delay={(idx % 3) * 80}
                className={tileClass(idx)}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Perbesar foto galeri ${idx + 1}`}
                  className="group relative size-full overflow-hidden border border-[var(--dk-line)] bg-[var(--dk-surface)] p-1 text-left"
                >
                  <img
                    src={photo.photo_url}
                    alt={`Galeri ${idx + 1}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/55 text-white backdrop-blur-sm transition-colors group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]">
                    <ExpandIcon className="h-4 w-4" />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {activeIndex !== null && visiblePhotos[activeIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto galeri ${activeIndex + 1}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[color-mix(in_oklab,var(--color-secondary)_92%,black)] px-14 py-20 backdrop-blur-md"
          onClick={() => setActiveIndex(null)}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Tutup galeri"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <XIcon className="h-5 w-5" />
          </button>
          {visiblePhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-2 flex h-12 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:left-6"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Foto berikutnya"
                className="absolute right-2 flex h-12 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:right-6"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={visiblePhotos[activeIndex].photo_url}
            alt={`Galeri ${activeIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <p className="absolute bottom-7 text-xs tracking-[0.2em] text-[var(--color-primary)]">
            {activeIndex + 1} / {visiblePhotos.length}
          </p>
        </div>
      )}
    </section>
  );
}
