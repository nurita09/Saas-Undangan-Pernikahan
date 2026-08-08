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

const DEFAULT_PRIMARY_COLOR = "#C75B39";
const DEFAULT_SECONDARY_COLOR = "#FBF3E4";

const FALLBACK_COVER_URL =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

interface ThemeCssVars extends CSSProperties {
  "--color-primary": string;
  "--color-secondary": string;
  "--rp-ink": string;
  "--rp-teal": string;
  "--rp-yellow": string;
  "--rp-blue": string;
  "--rp-pink": string;
  "--rp-paper": string;
  "--rp-card": string;
  "--rp-muted": string;
  "--rp-line": string;
}

/**
 * Theme 5 - Retro Editorial Pop.
 *
 * Terinspirasi poster musik dan majalah cetak: blok warna, halftone, garis
 * groovy, tipografi display, dan foto editorial dengan aksen terracotta,
 * teal, mustard, biru cetak, serta ink.
 */
export default function Theme5({ data, guestName }: ThemeComponentProps) {
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
    const duration = 1500;
    const startTime = performance.now();
    const easeOutBack = (t: number) => {
      const c1 = 1.2;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOutBack(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  /* Cover TIDAK dihapus dari halaman -- tetap jadi section paling atas yang
     bisa didatangi lagi dengan scroll ke atas. "Buka Undangan" cuma memicu
     smooth-scroll turun ke section pertama (transisinya scroll sungguhan,
     bukan simulasi fade/transform). Efek ini menangani scroll begitu konten
     baru saja ter-mount; klik berikutnya (setelah kembali ke cover) ditangani
     langsung di handleOpenInvitation karena isOpened sudah true. */
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
    "--rp-ink": "#26343A",
    "--rp-teal": "#377A75",
    "--rp-yellow": "#F1C453",
    "--rp-blue": "#8AB4B1",
    "--rp-pink": "#D98D8D",
    "--rp-paper": "color-mix(in oklab, var(--color-secondary) 82%, #F4EFE5)",
    "--rp-card": "color-mix(in oklab, var(--color-secondary) 36%, white)",
    "--rp-muted": "#657177",
    "--rp-line": "color-mix(in oklab, var(--rp-ink) 32%, transparent)",
  };

  const coverPhotoUrl = data.cover_photo_url || FALLBACK_COVER_URL;
  const section1PhotoUrl =
    data.theme_settings?.section1_photo_url || coverPhotoUrl;
  const section2PhotoUrl =
    data.theme_settings?.section2_photo_url || coverPhotoUrl;
  const closingPhotoUrl = gallery_photos.at(-1)?.photo_url || coverPhotoUrl;

  return (
    <div
      className="wedding-invitation theme-retro-editorial flex min-h-screen w-full font-sans text-[var(--rp-ink)] selection:bg-[var(--color-primary)] selection:text-white"
      style={cssVars}
    >
      <LeftPane
        couple={couple}
        weddingDate={event.wedding_date}
        coverPhotoUrl={coverPhotoUrl}
      />

      {/* Right Pane (mobile frame) -- pola sama dengan theme1-4 */}
      <div className="retro-pane relative z-20 min-h-screen w-full overflow-x-hidden shadow-2xl lg:w-[420px] lg:shrink-0">
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
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--rp-ink)] bg-[var(--rp-yellow)] text-[var(--rp-ink)] shadow-[3px_3px_0_var(--rp-ink)] transition hover:scale-105"
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
