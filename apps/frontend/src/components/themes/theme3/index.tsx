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

const DEFAULT_PRIMARY_COLOR = '#D4AF37'; // emas murni
const DEFAULT_SECONDARY_COLOR = '#10131C'; // deep charcoal-navy

const FALLBACK_COVER_URL =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

interface ThemeCssVars extends CSSProperties {
  '--color-primary': string;
  '--color-secondary': string;
}

/**
 * Theme 3 - Modern Elegant (Dark).
 *
 * Orkestrator tipis (pola sama dengan theme1/theme2). Latar gelap pekat +
 * aksen emas murni; ornamen art-deco (kipas, sudut, pembatas wajik) ada di
 * ./components/ornaments.tsx -- SVG murni tanpa file asset. Catatan pemetaan
 * warna: --color-primary = EMAS (aksen/tombol), --color-secondary = warna
 * LATAR gelap; teks memakai neutral terang, bukan warisan text-neutral-800.
 */
export default function Theme3({ data, guestName }: ThemeComponentProps) {
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
  };

  const coverPhotoUrl = data.cover_photo_url || FALLBACK_COVER_URL;
  const section1PhotoUrl = data.theme_settings?.section1_photo_url || coverPhotoUrl;
  const section2PhotoUrl = data.theme_settings?.section2_photo_url || coverPhotoUrl;

  return (
    <div
      className="wedding-invitation flex w-full min-h-screen font-sans text-neutral-200 selection:bg-[var(--color-primary)] selection:text-black"
      style={cssVars}
    >
      <LeftPane couple={couple} weddingDate={event.wedding_date} coverPhotoUrl={coverPhotoUrl} />

      {/* Right Pane (mobile frame) -- pola sama dengan theme1/theme2 */}
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
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--color-primary)] text-[#10131C] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center hover:scale-105 transition z-50"
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
