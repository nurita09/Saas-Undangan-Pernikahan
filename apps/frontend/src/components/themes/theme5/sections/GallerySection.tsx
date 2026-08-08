import { useEffect, useState } from "react";
import type { GalleryPhotoInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  SectionHeading,
  XIcon,
} from "../components/ornaments";

const MAX_GALLERY_PHOTOS = 10;
interface GallerySectionProps {
  photos: GalleryPhotoInfo[];
  videoUrl?: string | null;
}

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
  );
  return match && match[2].length === 11 ? match[2] : null;
}
function tileClass(index: number) {
  if (index === 0) return "col-span-2 aspect-[16/11]";
  if (index === 3) return "col-span-2 aspect-[16/9]";
  return "aspect-[3/4]";
}

/** Kolase zine dengan lightbox dan navigasi keyboard. */
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
      if (event.key === "ArrowLeft")
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
        );
      if (event.key === "ArrowRight")
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % visiblePhotos.length,
        );
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, visiblePhotos.length]);
  const showPrevious = () =>
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
    );
  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % visiblePhotos.length,
    );

  return (
    <section className="rp-section-cool px-4 py-24">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <SectionHeading eyebrow="The Good Stuff" title="Photo Booth" />
        </Reveal>
        {youtubeId && (
          <Reveal variant="zoom" className="mt-10">
            <div className="rp-card p-1.5">
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
          <div className="mt-10 grid grid-cols-2 gap-2">
            {visiblePhotos.map((photo, index) => (
              <Reveal
                key={`${photo.photo_url}-${index}`}
                variant="zoom"
                delay={(index % 3) * 70}
                className={tileClass(index)}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Perbesar foto galeri ${index + 1}`}
                  className={`group relative size-full overflow-hidden border-2 border-[var(--rp-ink)] p-1 ${index % 3 === 0 ? "bg-[var(--rp-yellow)]" : index % 3 === 1 ? "bg-[var(--color-primary)]" : "bg-[var(--rp-teal)]"}`}
                >
                  <img
                    src={photo.photo_url}
                    alt={`Galeri ${index + 1}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-[var(--rp-yellow)] text-[var(--rp-ink)] shadow-[2px_2px_0_var(--rp-ink)]">
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--rp-ink)]/96 px-14 py-20"
          onClick={() => setActiveIndex(null)}
        >
          <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--color-primary)_0_33%,var(--rp-yellow)_33%_66%,var(--rp-teal)_66%)]" />
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Tutup galeri"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border-2 border-white text-white"
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
                className="absolute left-2 flex h-12 w-10 items-center justify-center border-2 border-white/50 text-white sm:left-6"
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
                className="absolute right-2 flex h-12 w-10 items-center justify-center border-2 border-white/50 text-white sm:right-6"
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
          <p className="absolute bottom-7 font-retro text-xs tracking-[0.18em] text-[var(--rp-yellow)]">
            {activeIndex + 1} / {visiblePhotos.length}
          </p>
        </div>
      )}
    </section>
  );
}
