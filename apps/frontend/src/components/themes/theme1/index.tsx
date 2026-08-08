import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ThemeComponentProps } from "../../../types/wedding";
import LeftPane from "./components/LeftPane";
import { MusicIcon, PauseIcon, Petals } from "./components/ornaments";
import CoverSection from "./sections/CoverSection";
import QuoteSection from "./sections/QuoteSection";
import SaveTheDateSection from "./sections/SaveTheDateSection";
import CoupleSection from "./sections/CoupleSection";
import EventSection from "./sections/EventSection";
import LoveStorySection from "./sections/LoveStorySection";
import GallerySection from "./sections/GallerySection";
import GiftSection from "./sections/GiftSection";
import RsvpSection from "./sections/RsvpSection";
import ThankYouSection from "./sections/ThankYouSection";
import FooterSection from "./sections/FooterSection";
import fallbackCover from "../../../assets/theme1/hero.jpg";

const DEFAULT_PRIMARY_COLOR = "#8D7B68";
const DEFAULT_SECONDARY_COLOR = "#F9F8F4";

interface ThemeCssVars extends CSSProperties {
  "--color-primary": string;
  "--color-secondary": string;
  "--fl-clay": string;
  "--fl-gold": string;
  "--fl-blush": string;
  "--fl-leaf": string;
  "--fl-tint": string;
  "--fl-card": string;
  "--fl-ink": string;
  "--fl-muted": string;
  "--fl-veil": string;
}

/**
 * Theme 1 - Floral Elegant (redesain "floral dreams" dari Lovable).
 *
 * File ini cuma orkestrator: pegang state lintas-section (buka undangan, musik)
 * dan menyusun urutan section. Ciri khasnya: script Pinyon + serif Cormorant +
 * label kapital Jost (.label-caps), kartu "kelopak" (.card-petal), ornamen
 * bunga di sudut section, dan kelopak berjatuhan (<Petals>) setelah undangan
 * dibuka. Turunan warna (clay, tint, kartu) dihitung via color-mix dari warna
 * tema DB supaya tetap ikut berubah kalau admin mengganti primary/secondary.
 */
export default function Theme1({ data, guestName }: ThemeComponentProps) {
  const {
    couple,
    event,
    theme,
    music_url: musicUrl,
    love_stories,
    gallery_photos,
    gallery_video_url,
    wedding_gifts,
    contact,
  } = data;

  const primaryColor = theme.primary_color || DEFAULT_PRIMARY_COLOR;
  const secondaryColor = theme.secondary_color || DEFAULT_SECONDARY_COLOR;

  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  /* Apakah musik sedang berbunyi saat tab ditinggalkan -- dipakai untuk
     memutuskan resume ketika tab kembali aktif (jangan resume kalau user
     memang mem-pause manual). */
  const wasPlayingRef = useRef(false);

  const playMusic = () => {
    audioRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  /* Musik menyala otomatis tanpa perlu menekan tombol. Browser memblokir
     autoplay beraudio sebelum ada gesture, jadi: coba langsung; kalau ditolak,
     mulai pada interaksi pertama apa pun (tap/klik/tombol keyboard). */
  useEffect(() => {
    if (!musicUrl || !audioRef.current) return;

    const startOnFirstGesture = () => {
      audioRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    };

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        document.addEventListener("pointerdown", startOnFirstGesture, {
          once: true,
        });
        document.addEventListener("keydown", startOnFirstGesture, {
          once: true,
        });
      });

    return () => {
      document.removeEventListener("pointerdown", startOnFirstGesture);
      document.removeEventListener("keydown", startOnFirstGesture);
    };
  }, [musicUrl]);

  /* Musik hanya berbunyi selama tab undangan aktif: pindah tab -> pause,
     kembali -> resume (hanya kalau sebelumnya memang sedang berbunyi). */
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        wasPlayingRef.current = !audio.paused;
        audio.pause();
        setIsPlaying(false);
      } else if (wasPlayingRef.current) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const scrollToContent = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const target = contentRef.current;
    if (!target) return;

    if (prefersReducedMotion) {
      target.scrollIntoView({ behavior: "auto" });
      return;
    }

    const startY = window.scrollY;
    const targetY = startY + target.getBoundingClientRect().top;
    const distance = targetY - startY;
    const duration = 1600;
    const startTime = performance.now();
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollSnapType = root.style.scrollSnapType;

    // Pergerakan dikendalikan per frame; matikan smooth/snap CSS sementara
    // agar keduanya tidak menahan posisi lalu melompat pada akhir transisi.
    root.style.scrollBehavior = "auto";
    root.style.scrollSnapType = "none";

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutSine(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      root.style.scrollBehavior = previousScrollBehavior;
      root.style.scrollSnapType = previousScrollSnapType;
    };

    requestAnimationFrame(step);
  };

  /* Cover tetap berada di halaman. Setelah bloom wipe menutup sampul, konten
     di-mount dan viewport bergerak turun secara halus ke halaman pembuka. */
  useEffect(() => {
    if (isOpened) scrollToContent();
  }, [isOpened]);

  const handleOpenInvitation = () => {
    if (musicUrl && audioRef.current?.paused) playMusic();
    if (isOpened) {
      scrollToContent();
    } else {
      setIsOpened(true);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playMusic();
    }
  };

  const cssVars: ThemeCssVars = {
    "--color-primary": primaryColor,
    "--color-secondary": secondaryColor,
    "--fl-clay": "color-mix(in oklab, var(--color-primary) 55%, #D9A778)",
    "--fl-gold": "#C5A253",
    "--fl-blush": "#E3B7AE",
    "--fl-leaf": "#8FA08A",
    "--fl-tint":
      "color-mix(in oklab, var(--color-primary) 6%, var(--color-secondary))",
    "--fl-card": "color-mix(in oklab, var(--color-secondary) 18%, white)",
    "--fl-ink": "#4A4238",
    "--fl-muted": "#80756A",
    "--fl-veil":
      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, color-mix(in oklab, var(--color-secondary) 28%, transparent) 52%, color-mix(in oklab, var(--color-secondary) 70%, transparent) 100%)",
  };

  const coverPhotoUrl = data.cover_photo_url || fallbackCover;
  const closingPhotoUrl = gallery_photos.at(-1)?.photo_url || coverPhotoUrl;

  return (
    <div
      data-cover-locked={!isOpened}
      className="wedding-invitation theme-floral-elegant flex w-full min-h-screen font-floral-serif text-[var(--fl-ink)] selection:bg-[var(--fl-blush)]/60"
      style={cssVars}
    >
      {/* ===== Left Pane (Desktop Background) ===== */}
      <LeftPane
        couple={couple}
        weddingDate={event.wedding_date}
        coverPhotoUrl={coverPhotoUrl}
      />

      {/* ===== Right Pane (Mobile Frame) ===== */}
      <div className="floral-pane w-full lg:w-[420px] lg:shrink-0 min-h-screen relative overflow-x-hidden shadow-2xl z-20">
        {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

        {/* Cover tetap jadi section paling atas (tidak di-unmount) -- guest
            bisa scroll balik ke atas dan melihatnya lagi kapan pun. */}
        <CoverSection
          couple={couple}
          weddingDate={event.wedding_date}
          coverPhotoUrl={coverPhotoUrl}
          guestName={guestName}
          isOpened={isOpened}
          onOpen={handleOpenInvitation}
        />

        {isOpened && (
          <div ref={contentRef}>
            <QuoteSection
              quoteText={data.theme_settings?.quote_text}
              quoteSource={data.theme_settings?.quote_source}
            />
            <SaveTheDateSection couple={couple} event={event} />
            <CoupleSection couple={couple} />
            <EventSection event={event} />
            <LoveStorySection stories={love_stories} />
            <GallerySection
              photos={gallery_photos}
              videoUrl={gallery_video_url}
            />
            <GiftSection gifts={wedding_gifts} />
            <RsvpSection guestName={guestName} />
            <ThankYouSection couple={couple} photoUrl={closingPhotoUrl} />
            <FooterSection contact={contact} />
          </div>
        )}

        {isOpened && <Petals count={8} />}

        {isOpened && musicUrl && (
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-white/35 bg-[var(--fl-clay)] p-3.5 text-white shadow-[0_18px_40px_-20px_rgba(74,66,56,0.6)] transition-transform duration-500 hover:scale-105"
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <MusicIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
