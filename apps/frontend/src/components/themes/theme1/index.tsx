import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ThemeComponentProps } from '../../../types/wedding';
import LeftPane from './components/LeftPane';
import CoverSection from './sections/CoverSection';
import QuoteSection from './sections/QuoteSection';
import SaveTheDateSection from './sections/SaveTheDateSection';
import CoupleSection from './sections/CoupleSection';
import EventSection from './sections/EventSection';
import LoveStorySection from './sections/LoveStorySection';
import GallerySection from './sections/GallerySection';
import GiftSection from './sections/GiftSection';
import RsvpSection from './sections/RsvpSection';
import ThankYouSection from './sections/ThankYouSection';
import FooterSection from './sections/FooterSection';

const DEFAULT_PRIMARY_COLOR = '#8D7B68';
const DEFAULT_SECONDARY_COLOR = '#F9F8F4';

const FALLBACK_COVER_URL =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

/* Durasi animasi keluar cover (.cover-exit di index.css) -- konten baru
   di-mount setelah animasi ini selesai supaya transisinya terasa. */
const COVER_EXIT_MS = 700;

interface ThemeCssVars extends CSSProperties {
  '--color-primary': string;
  '--color-secondary': string;
}

/**
 * Theme 1 - Floral Elegant.
 *
 * File ini cuma orkestrator: pegang state lintas-section (buka undangan, musik)
 * dan menyusun urutan section. Markup tiap section ada di ./sections/*, komponen
 * kecil yang dipakai bersama di ./components/*. Animasi scroll-reveal lewat
 * <Reveal> (components/Reveal.tsx) + kelas .reveal-* di index.css.
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
  const [isCoverExiting, setIsCoverExiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
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
        document.addEventListener('pointerdown', startOnFirstGesture, { once: true });
        document.addEventListener('keydown', startOnFirstGesture, { once: true });
      });

    return () => {
      document.removeEventListener('pointerdown', startOnFirstGesture);
      document.removeEventListener('keydown', startOnFirstGesture);
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
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleOpenInvitation = () => {
    if (isCoverExiting || isOpened) return;
    setIsCoverExiting(true);
    if (musicUrl && audioRef.current?.paused) playMusic();
    // Cover diberi waktu menyelesaikan animasi keluarnya dulu, baru konten
    // di-mount (dengan animasi masuknya sendiri, .content-enter).
    window.setTimeout(() => {
      setIsOpened(true);
      window.scrollTo({ top: 0 });
    }, COVER_EXIT_MS);
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
    '--color-primary': primaryColor,
    '--color-secondary': secondaryColor,
  };

  const coverPhotoUrl = data.cover_photo_url || FALLBACK_COVER_URL;
  const section1PhotoUrl = data.theme_settings?.section1_photo_url || coverPhotoUrl;
  const section2PhotoUrl = data.theme_settings?.section2_photo_url || coverPhotoUrl;

  return (
    <div
      className="flex w-full min-h-screen font-sans text-neutral-800 selection:bg-[var(--color-primary)] selection:text-white"
      style={cssVars}
    >
      {/* ===== Left Pane (Desktop Background) ===== */}
      <LeftPane couple={couple} weddingDate={event.wedding_date} coverPhotoUrl={coverPhotoUrl} />

      {/* ===== Right Pane (Mobile Frame) ===== */}
      <div className="w-full lg:w-[420px] lg:shrink-0 min-h-screen bg-[var(--color-secondary)] relative overflow-x-hidden shadow-2xl z-20">
        {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

        {/* Cover hilang total begitu isOpened -- bukan sekadar discroll lewat --
            supaya scroll-up dari Section 1 tidak balik nemu Cover lagi, dan
            panjang halaman jadi cuma sepanjang Section 1-9. */}
        {!isOpened && (
          <CoverSection
            couple={couple}
            weddingDate={event.wedding_date}
            coverPhotoUrl={coverPhotoUrl}
            guestName={guestName}
            isExiting={isCoverExiting}
            onOpen={handleOpenInvitation}
          />
        )}

        {isOpened && (
          <div className="content-enter">
            <QuoteSection
              photoUrl={section1PhotoUrl}
              quoteText={data.theme_settings?.quote_text}
              quoteSource={data.theme_settings?.quote_source}
            />
            <SaveTheDateSection couple={couple} event={event} />
            <CoupleSection couple={couple} fallbackPhotoUrl={coverPhotoUrl} />
            <EventSection event={event} photoUrl={section2PhotoUrl} />
            <LoveStorySection stories={love_stories} />
            <GallerySection photos={gallery_photos} videoUrl={gallery_video_url} />
            <GiftSection gifts={wedding_gifts} />
            <RsvpSection guestName={guestName} />
            <ThankYouSection couple={couple} />
            <FooterSection contact={contact} />
          </div>
        )}

        {isOpened && musicUrl && (
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center bg-[var(--color-primary)] hover:scale-105 transition z-50"
          >
            {isPlaying && (
              <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-40 animate-ping" />
            )}
            <span className="relative">{isPlaying ? '⏸' : '▶'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
