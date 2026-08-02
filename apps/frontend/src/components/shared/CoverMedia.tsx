import { isVideoUrl } from '../../utils/media';

interface CoverMediaProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Media cover pasangan (dipakai di CoverSection & LeftPane semua tema): foto
 * atau video, dipilih otomatis dari ekstensi `src` (lihat utils/media.ts).
 * Video selalu tanpa suara & loop -- ini cover pengganti foto, bukan pemutar
 * dengan audio sendiri (musik latar undangan sudah ditangani terpisah).
 */
export default function CoverMedia({ src, alt, className }: CoverMediaProps) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
        className={className}
      />
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
