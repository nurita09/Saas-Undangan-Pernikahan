import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ThemeComponentProps } from "../../../types/wedding";
import LeftPane from "./components/LeftPane";
import { DiscIcon, PauseIcon } from "./components/ornaments";
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
import fallbackCover from "../../../assets/theme6/cover.jpg";

const DEFAULT_PRIMARY_COLOR = "#3F6253";
const DEFAULT_SECONDARY_COLOR = "#F3EBDD";

interface ThemeCssVars extends CSSProperties {
  "--color-primary": string;
  "--color-secondary": string;
  "--sage-deep": string;
  "--sage-soft": string;
  "--t6-card": string;
  "--t6-gold": string;
  "--t6-ink": string;
  "--t6-muted": string;
  "--va-forest": string;
  "--va-oxblood": string;
  "--va-brass": string;
  "--va-brass-soft": string;
  "--va-vellum": string;
  "--va-paper": string;
  "--va-ink": string;
  "--va-muted": string;
  "--va-line": string;
}

/**
 * Theme 6 - Vintage Archive Editorial. Monogram, bingkai foto analog, nomor
 * katalog, dan warna vellum/forest/oxblood membentuk satu album arsip modern.
 */
export default function Theme6({ data, guestName }: ThemeComponentProps) {
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
    const duration = 1650;
    const startTime = performance.now();
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollSnapType = root.style.scrollSnapType;

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

  /* Lembar katalog menutup cover lebih dulu, kemudian terangkat saat viewport
     turun dengan ritme sine yang tenang seperti membuka halaman album. */
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
    "--sage-deep": "color-mix(in oklab, var(--color-primary) 68%, #1F2A22)",
    "--sage-soft":
      "color-mix(in oklab, var(--color-primary) 12%, var(--color-secondary))",
    "--t6-card": "color-mix(in oklab, var(--color-secondary) 45%, white)",
    "--t6-gold": "#C9A45C",
    "--t6-ink": "#3E463F",
    "--t6-muted": "#71786C",
    "--va-forest": "color-mix(in oklab, var(--color-primary) 72%, #183127)",
    "--va-oxblood": "#743F45",
    "--va-brass": "#A8843F",
    "--va-brass-soft": "#D9C28E",
    "--va-vellum": "color-mix(in oklab, var(--color-secondary) 88%, #E8D9BE)",
    "--va-paper": "color-mix(in oklab, var(--color-secondary) 45%, white)",
    "--va-ink": "#29332F",
    "--va-muted": "#6D716B",
    "--va-line": "color-mix(in oklab, var(--color-primary) 25%, transparent)",
  };

  const coverPhotoUrl = data.cover_photo_url || fallbackCover;
  const section1PhotoUrl =
    data.theme_settings?.section1_photo_url || coverPhotoUrl;
  const section2PhotoUrl =
    data.theme_settings?.section2_photo_url || coverPhotoUrl;
  const closingPhotoUrl = gallery_photos.at(-1)?.photo_url || coverPhotoUrl;

  return (
    <div
      data-cover-locked={!isOpened}
      className="wedding-invitation theme-vintage-archive flex min-h-screen w-full font-sans text-[var(--va-ink)] selection:bg-[var(--va-oxblood)] selection:text-white"
      style={cssVars}
    >
      {/* ===== Left Pane (Desktop Background) ===== */}
      <LeftPane
        couple={couple}
        weddingDate={event.wedding_date}
        coverPhotoUrl={coverPhotoUrl}
      />

      {/* ===== Right Pane (Mobile Frame) ===== */}
      <div className="relative z-20 min-h-screen w-full overflow-x-hidden bg-[var(--va-vellum)] shadow-2xl lg:w-[430px] lg:shrink-0">
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
          <div ref={contentRef} className="va-paper-grain relative">
            <QuoteSection
              couple={couple}
              photoUrl={section1PhotoUrl}
              quoteText={data.theme_settings?.quote_text}
              quoteSource={data.theme_settings?.quote_source}
            />
            <SaveTheDateSection couple={couple} event={event} />
            <CoupleSection couple={couple} />
            <EventSection event={event} photoUrl={section2PhotoUrl} />
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

        {isOpened && musicUrl && (
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            className="fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-[var(--va-brass)]/60 bg-[var(--va-forest)]/92 text-[var(--va-vellum)] shadow-[0_10px_28px_rgba(19,37,30,0.28)] backdrop-blur transition hover:bg-[var(--va-oxblood)]"
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <DiscIcon className="h-5 w-5" />
            )}
            {isPlaying && (
              <span className="absolute inset-1 rounded-full border border-dashed border-[var(--va-brass-soft)]/50 animate-[spin_9s_linear_infinite]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
