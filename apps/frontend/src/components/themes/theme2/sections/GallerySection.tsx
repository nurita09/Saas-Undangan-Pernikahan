import { useEffect, useState } from "react";
import type { GalleryPhotoInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  BatikBand,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  PlayIcon,
  SectionTitle,
  XIcon,
} from "../components/ornaments";
import coupleMain from "../../../../assets/theme2/couple-main.jpg";
import bride from "../../../../assets/theme2/bride.jpg";
import groom from "../../../../assets/theme2/groom.jpg";

const MAX_GALLERY_PHOTOS = 10;

/* Grid fallback bawaan tema saat pasangan belum mengunggah foto galeri. */
const FALLBACK_GALLERY: GalleryPhotoInfo[] = [
  coupleMain,
  bride,
  groom,
  bride,
  groom,
].map((photo_url) => ({ photo_url }));

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
  return idx === 0 ? "col-span-2 row-span-2" : "";
}

/** Section 5: Pethikan Wekdal (Galeri) -- mozaik foto + video prewedding. */
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
    <section className="relative overflow-hidden bg-[var(--jw-tint)] px-6 py-24">
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
          {visiblePhotos.map((photo, idx) => (
            <Reveal
              key={idx}
              variant="bloom"
              delay={idx * 90}
              className={`overflow-hidden rounded-[3px] border border-[var(--jw-gold-soft)] ${tileSpan(idx)}`.trim()}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Perbesar foto galeri ${idx + 1}`}
                className="group relative size-full overflow-hidden"
              >
                <img
                  src={photo.photo_url}
                  alt={`Momen pernikahan ${idx + 1}`}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <span className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-white/40 bg-[var(--jw-night)]/55 text-white opacity-100 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  <ExpandIcon className="h-3.5 w-3.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau galeri"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--jw-night)]/95 px-5 py-20 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Tutup galeri"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/45 bg-black/15 text-white transition-colors hover:bg-white/10"
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
              className="absolute left-4 grid h-11 w-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/45 bg-black/15 text-white transition-colors hover:bg-white/10"
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
              className="absolute right-4 grid h-11 w-11 place-items-center rounded-full border border-[var(--jw-gold-soft)]/45 bg-black/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          )}
          <p className="absolute bottom-7 text-xs tracking-[0.18em] text-[var(--jw-gold-soft)]/80">
            {activeIndex + 1} / {visiblePhotos.length}
          </p>
        </div>
      )}
    </section>
  );
}
