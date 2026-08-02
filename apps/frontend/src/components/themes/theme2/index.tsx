import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ThemeComponentProps } from '../../../types/wedding';
import LeftPane from './components/LeftPane';
import { MusicIcon, PauseIcon } from './components/ornaments';
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
import fallbackCover from '../../../assets/theme2/couple-main.jpg';

const DEFAULT_PRIMARY_COLOR = '#6B4423'; // cokelat sogan batik
const DEFAULT_SECONDARY_COLOR = '#F3EAD8'; // krem lawas

/* Durasi animasi keluar cover (.cover-exit-scale di index.css) -- konten baru
   di-mount setelah animasi ini selesai supaya transisinya terasa. */
const COVER_EXIT_MS = 700;

interface ThemeCssVars extends CSSProperties {
  '--color-primary': string;
  '--color-secondary': string;
  '--jw-gold': string;
  '--jw-gold-soft': string;
  '--jw-sogan-deep': string;
  '--jw-sogan-gradient': string;
  '--jw-tint': string;
  '--jw-card': string;
  '--jw-ink': string;
  '--jw-muted': string;
  '--jw-shadow': string;
}

/**
 * Theme 2 - Adat Jawa (redesain "javanese elegance revival" dari Lovable).
 *
 * File ini cuma orkestrator: pegang state lintas-section (buka undangan, musik)
 * dan menyusun urutan section -- pola sama dengan theme1. Ciri khasnya: script
 * Italianno + serif Cormorant + label kapital Jost, ornamen wayang (Gunungan),
 * pembatas rangkaian wajik (Divider), kartu berbingkai ukiran sudut
 * (FramedCard), dan tekstur batik samar (BatikBand) di beberapa section.
 * Turunan warna (gold, sogan gelap, tint, kartu) dihitung via color-mix dari
 * warna tema DB supaya tetap ikut berubah kalau admin mengganti primary/secondary.
 */
export default function Theme2({ data, guestName }: ThemeComponentProps) {
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
    '--jw-gold': '#C9A227',
    '--jw-gold-soft': '#E8D9A0',
    '--jw-sogan-deep': 'color-mix(in oklab, var(--color-primary) 70%, #1A0F06)',
    '--jw-sogan-gradient':
      'linear-gradient(170deg, var(--jw-sogan-deep) 0%, var(--color-primary) 55%, var(--jw-sogan-deep) 100%)',
    '--jw-tint': 'color-mix(in oklab, var(--color-primary) 6%, var(--color-secondary))',
    '--jw-card': 'color-mix(in oklab, var(--color-secondary) 30%, white)',
    '--jw-ink': '#3A2A18',
    '--jw-muted': '#7A6A55',
    '--jw-shadow': '0 24px 60px -32px color-mix(in oklab, var(--jw-sogan-deep) 55%, transparent)',
  };

  const coverPhotoUrl = data.cover_photo_url || fallbackCover;
  const section1PhotoUrl = data.theme_settings?.section1_photo_url || coverPhotoUrl;
  const section2PhotoUrl = data.theme_settings?.section2_photo_url || coverPhotoUrl;

  return (
    <div
      className="wedding-invitation flex w-full min-h-screen font-jawa-sans text-[var(--jw-ink)] selection:bg-[var(--jw-gold)]/40"
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
            <CoupleSection couple={couple} />
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
            className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-[var(--jw-gold)]/60 bg-[var(--color-primary)] text-[var(--color-secondary)] shadow-[var(--jw-shadow)] transition-transform duration-500 hover:scale-105"
          >
            {isPlaying ? <PauseIcon className="h-5 w-5" /> : <MusicIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
