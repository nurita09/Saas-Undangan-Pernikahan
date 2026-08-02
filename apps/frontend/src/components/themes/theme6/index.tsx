import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ThemeComponentProps } from '../../../types/wedding';
import LeftPane from './components/LeftPane';
import { DiscIcon, PauseIcon } from './components/ornaments';
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
import fallbackCover from '../../../assets/theme6/cover.jpg';

const DEFAULT_PRIMARY_COLOR = '#5F7D66'; // sage lawas
const DEFAULT_SECONDARY_COLOR = '#F5F1E6'; // krem kertas

interface ThemeCssVars extends CSSProperties {
  '--color-primary': string;
  '--color-secondary': string;
  '--sage-deep': string;
  '--sage-soft': string;
  '--t6-card': string;
  '--t6-gold': string;
  '--t6-ink': string;
  '--t6-muted': string;
}

/**
 * Theme 6 - Vintage Monogram (port desain Lovable "everlasting-echo").
 *
 * File ini cuma orkestrator: pegang state lintas-section (buka undangan, musik)
 * dan menyusun urutan section -- pola sama dengan theme1-5. Ciri khasnya:
 * monogram inisial pasangan, serif klasik Cormorant + script Parisienne,
 * palet sage/krem lawas, dan tekstur kertas (.paper-grain). Turunan warna
 * (sage tua, tint section, kartu) dihitung via color-mix dari warna tema DB
 * supaya tetap ikut berubah kalau admin mengganti primary/secondary.
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

  const scrollToContent = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contentRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
    '--color-primary': primaryColor,
    '--color-secondary': secondaryColor,
    '--sage-deep': 'color-mix(in oklab, var(--color-primary) 68%, #1F2A22)',
    '--sage-soft': 'color-mix(in oklab, var(--color-primary) 12%, var(--color-secondary))',
    '--t6-card': 'color-mix(in oklab, var(--color-secondary) 45%, white)',
    '--t6-gold': '#C9A45C',
    '--t6-ink': '#3E463F',
    '--t6-muted': '#71786C',
  };

  const coverPhotoUrl = data.cover_photo_url || fallbackCover;

  return (
    <div
      className="wedding-invitation flex w-full min-h-screen font-sans text-[var(--t6-ink)] selection:bg-[var(--color-primary)] selection:text-white"
      style={cssVars}
    >
      {/* ===== Left Pane (Desktop Background) ===== */}
      <LeftPane couple={couple} weddingDate={event.wedding_date} coverPhotoUrl={coverPhotoUrl} />

      {/* ===== Right Pane (Mobile Frame) ===== */}
      <div className="w-full lg:w-[420px] lg:shrink-0 min-h-screen bg-[var(--color-secondary)] relative overflow-x-hidden shadow-2xl z-20">
        {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

        {/* Cover tetap jadi section paling atas (tidak di-unmount) -- guest
            bisa scroll balik ke atas dan melihatnya lagi kapan pun. */}
        <CoverSection
          couple={couple}
          weddingDate={event.wedding_date}
          coverPhotoUrl={coverPhotoUrl}
          guestName={guestName}
          onOpen={handleOpenInvitation}
        />

        {isOpened && (
          <div ref={contentRef} className="paper-grain relative">
            <QuoteSection
              couple={couple}
              quoteText={data.theme_settings?.quote_text}
              quoteSource={data.theme_settings?.quote_source}
            />
            <SaveTheDateSection couple={couple} event={event} />
            <CoupleSection couple={couple} />
            <EventSection event={event} />
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
            className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--t6-card)]/90 text-[var(--sage-deep)] shadow-lg backdrop-blur transition hover:bg-[var(--color-primary)]/10"
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <DiscIcon className="h-5 w-5" />
            )}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full border border-dashed border-[var(--color-primary)]/40 animate-[spin_9s_linear_infinite]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
