import { useRef, useState, type CSSProperties } from 'react';
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

const DEFAULT_PRIMARY_COLOR = '#6B4423'; // cokelat sogan batik
const DEFAULT_SECONDARY_COLOR = '#F3EAD8'; // krem lawas

const FALLBACK_COVER_URL =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

interface ThemeCssVars extends CSSProperties {
  '--color-primary': string;
  '--color-secondary': string;
}

/**
 * Theme 2 - Adat Jawa.
 *
 * Orkestrator tipis (pola sama dengan theme1): pegang state lintas-section
 * (buka undangan, musik) dan susun urutan section. Ornamen khas Jawa (batik
 * kawung, gunungan wayang, ukiran sudut) ada di ./components/ornaments.tsx --
 * semuanya SVG murni tanpa file asset.
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
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (musicUrl && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
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
      <LeftPane couple={couple} weddingDate={event.wedding_date} coverPhotoUrl={coverPhotoUrl} />

      {/* Right Pane (mobile frame) -- pola sama dengan theme1 */}
      <div className="w-full lg:w-[420px] lg:shrink-0 min-h-screen bg-[var(--color-secondary)] relative overflow-x-hidden shadow-2xl z-20">
        {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

        {!isOpened && (
          <CoverSection
            couple={couple}
            weddingDate={event.wedding_date}
            coverPhotoUrl={coverPhotoUrl}
            guestName={guestName}
            onOpen={handleOpenInvitation}
          />
        )}

        {isOpened && (
          <div ref={contentRef} className="animate-fade-in">
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
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full border border-[#C9A227] text-[var(--color-secondary)] shadow-lg flex items-center justify-center bg-[var(--color-primary)] hover:scale-105 transition z-50"
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
