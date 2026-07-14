/**
 * Baca access token dari URL saat ini. Prioritas ke fragment ("#token=xxx")
 * karena fragment TIDAK pernah dikirim browser ke server -- tidak nempel di
 * access log maupun header Referer. Fallback ke query string ("?token=xxx")
 * supaya link lama yang terlanjur dibagikan tetap berfungsi.
 */
export function readAccessToken(): string | null {
  const hashMatch = window.location.hash.match(/token=([^&]+)/);
  if (hashMatch) return decodeURIComponent(hashMatch[1]);

  return new URLSearchParams(window.location.search).get('token');
}
