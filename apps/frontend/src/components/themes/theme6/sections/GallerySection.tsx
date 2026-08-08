import { useEffect, useState } from "react";
import type { GalleryPhotoInfo } from "../../../../types/wedding";
import Reveal from "../components/ThemeReveal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandIcon,
  PlayIcon,
  SectionTitle,
  XIcon,
} from "../components/ornaments";
import gallery1 from "../../../../assets/theme6/gallery-1.jpg";
import gallery2 from "../../../../assets/theme6/gallery-2.jpg";
import gallery3 from "../../../../assets/theme6/gallery-3.jpg";
import gallery4 from "../../../../assets/theme6/gallery-4.jpg";

const MAX_GALLERY_PHOTOS = 10;
const FALLBACK_GALLERY: GalleryPhotoInfo[] = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
].map((photo_url) => ({ photo_url }));

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
  if (index === 0 || index === 5) return "col-span-2 aspect-[16/10]";
  return index % 3 === 0 ? "aspect-square" : "aspect-[3/4]";
}

export default function GallerySection({
  photos,
  videoUrl,
}: GallerySectionProps) {
  const galleryPhotos = (photos?.length ? photos : FALLBACK_GALLERY).slice(
    0,
    MAX_GALLERY_PHOTOS,
  );
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + galleryPhotos.length) % galleryPhotos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % galleryPhotos.length,
        );
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, galleryPhotos.length]);

  const showPrevious = () =>
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + galleryPhotos.length) % galleryPhotos.length,
    );
  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % galleryPhotos.length,
    );

  return (
    <section className="bg-[var(--va-paper)] px-5 py-24">
      <Reveal variant="up">
        <SectionTitle
          kicker="Contact Sheet"
          title="Memori Terpilih"
          description="Potongan momen yang kami simpan untuk dikenang kembali."
        />
      </Reveal>

      {youtubeId && (
        <Reveal variant="zoom" className="mt-9">
          <div className="va-photo-frame">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Video prewedding"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full bg-black"
            />
            <p className="flex items-center justify-center gap-2 pb-1 pt-2 text-[0.52rem] tracking-[0.2em] text-[var(--va-oxblood)] uppercase">
              <PlayIcon className="h-3 w-3" /> Motion archive
            </p>
          </div>
        </Reveal>
      )}

      <div className="mt-9 grid grid-cols-2 gap-2.5">
        {galleryPhotos.map((photo, index) => (
          <Reveal
            key={`${photo.photo_url}-${index}`}
            variant="zoom"
            className={tileClass(index)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Perbesar foto galeri ${index + 1}`}
              className="group relative h-full w-full overflow-hidden border border-[var(--va-line)] bg-[var(--va-vellum)] p-1.5 text-left"
            >
              <img
                src={photo.photo_url}
                alt={`Foto galeri ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover saturate-[0.82] transition duration-700 group-hover:scale-[1.035] group-hover:saturate-100"
              />
              <span className="absolute bottom-3 left-3 bg-[var(--va-paper)] px-2 py-1 font-vintage text-xs text-[var(--va-forest)] shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center bg-[var(--va-oxblood)] text-white opacity-90 transition group-hover:bg-[var(--va-forest)]">
                <ExpandIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {activeIndex !== null && galleryPhotos[activeIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto galeri ${activeIndex + 1}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--va-forest)]/97 px-12 py-20"
          onClick={() => setActiveIndex(null)}
        >
          <div className="absolute inset-4 border border-[var(--va-brass-soft)]/25" />
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Tutup galeri"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-[var(--va-brass-soft)]/50 text-[var(--va-vellum)]"
          >
            <XIcon className="h-5 w-5" />
          </button>
          {galleryPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-1 z-10 grid h-12 w-10 place-items-center border border-[var(--va-brass-soft)]/40 text-[var(--va-vellum)] sm:left-5"
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
                className="absolute right-1 z-10 grid h-12 w-10 place-items-center border border-[var(--va-brass-soft)]/40 text-[var(--va-vellum)] sm:right-5"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
          <img
            src={galleryPhotos[activeIndex].photo_url}
            alt={`Foto galeri ${activeIndex + 1}`}
            className="relative max-h-full max-w-full border-4 border-[var(--va-vellum)] object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
          <p className="absolute bottom-7 text-[0.6rem] tracking-[0.22em] text-[var(--va-brass-soft)] uppercase">
            Frame {activeIndex + 1} / {galleryPhotos.length}
          </p>
        </div>
      )}
    </section>
  );
}
