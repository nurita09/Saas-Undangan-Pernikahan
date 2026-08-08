import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ThemeComponentProps } from "../../../types/wedding";
import LeftPane from "./components/LeftPane";
import { MusicIcon, PauseIcon } from "./components/ornaments";
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

const DEFAULT_PRIMARY_COLOR = "#7C9070";
const DEFAULT_SECONDARY_COLOR = "#FAFBF7";

const FALLBACK_COVER_URL =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

interface ThemeCssVars extends CSSProperties {
  "--color-primary": string;
  "--color-secondary": string;
  "--im-deep": string;
  "--im-clay": string;
  "--im-ivory": string;
  "--im-card": string;
  "--im-ink": string;
  "--im-muted": string;
  "--im-line": string;
  "--im-shadow": string;
}

/**
 * Theme 4 - Sacred Modern.
 *
 * Bahasa visualnya memadukan mihrab, geometri tipis, kaligrafi Arab, ivory,
 * hijau mineral, dan aksen clay. Warna tema dari editor tetap menjadi sumber
 * utama dan diturunkan menjadi token permukaan yang lebih lengkap.
 */
export default function Theme4({ data, guestName }: ThemeComponentProps) {
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

  /* Musik menyala otomatis tanpa perlu menekan tombol, sejak halaman cover
     tampil (tidak menunggu "Buka Undangan"). Browser memblokir autoplay
     beraudio sebelum ada gesture, jadi: coba langsung; kalau ditolak, mulai
     pada interaksi pertama apa pun (tap/klik/tombol keyboard). */
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
    const easeInOutCirc = (t: number) =>
      t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollSnapType = root.style.scrollSnapType;

    root.style.scrollBehavior = "auto";
    root.style.scrollSnapType = "none";

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCirc(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      root.style.scrollBehavior = previousScrollBehavior;
      root.style.scrollSnapType = previousScrollSnapType;
    };

    requestAnimationFrame(step);
  };

  /* Garis mihrab ditelusuri lebih dulu. Saat portal mulai melebar, konten
     di-mount dan viewport turun dengan kurva circular yang tenang. */
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
    "--im-deep": "color-mix(in oklab, var(--color-primary) 42%, #17382F)",
    "--im-clay": "#B77963",
    "--im-ivory": "color-mix(in oklab, var(--color-secondary) 90%, #F3EEE4)",
    "--im-card": "color-mix(in oklab, var(--color-secondary) 94%, white)",
    "--im-ink": "#26332E",
    "--im-muted": "#6C746F",
    "--im-line": "color-mix(in oklab, var(--color-primary) 36%, transparent)",
    "--im-shadow": "0 28px 60px -42px rgba(30, 52, 44, 0.55)",
  };

  const coverPhotoUrl = data.cover_photo_url || FALLBACK_COVER_URL;
  const section1PhotoUrl =
    data.theme_settings?.section1_photo_url || coverPhotoUrl;
  const closingPhotoUrl = gallery_photos.at(-1)?.photo_url || coverPhotoUrl;

  return (
    <div
      data-cover-locked={!isOpened}
      className="wedding-invitation theme-islamic-modern flex min-h-screen w-full font-sans text-[var(--im-ink)] selection:bg-[var(--color-primary)] selection:text-white"
      style={cssVars}
    >
      <LeftPane
        couple={couple}
        weddingDate={event.wedding_date}
        coverPhotoUrl={coverPhotoUrl}
      />

      {/* Right Pane (mobile frame) -- pola sama dengan theme1-3 */}
      <div className="islamic-pane relative z-20 min-h-screen w-full overflow-x-hidden shadow-2xl lg:w-[420px] lg:shrink-0">
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
              photoUrl={section1PhotoUrl}
              quoteText={data.theme_settings?.quote_text}
              quoteSource={data.theme_settings?.quote_source}
            />
            <SaveTheDateSection couple={couple} event={event} />
            <CoupleSection couple={couple} fallbackPhotoUrl={coverPhotoUrl} />
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

        {isOpened && musicUrl && (
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-[var(--im-deep)] text-white shadow-[0_18px_40px_-22px_rgba(20,45,36,0.8)] transition hover:scale-105"
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
