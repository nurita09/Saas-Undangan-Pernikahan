const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v']);

/**
 * Deteksi apakah URL menunjuk ke video (bukan foto) dari ekstensi filenya.
 * Backend menyimpan cover sebagai .jpg (foto, hasil re-encode) atau
 * .mp4/.webm (video, disimpan mentah) -- lihat routes/wedding_edit.rs
 * upload_photo -- jadi ekstensi cukup diandalkan tanpa perlu field terpisah.
 */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const withoutQuery = url.split(/[?#]/)[0];
  const dotIndex = withoutQuery.lastIndexOf('.');
  if (dotIndex === -1) return false;
  const ext = withoutQuery.slice(dotIndex + 1).toLowerCase();
  return VIDEO_EXTENSIONS.has(ext);
}
