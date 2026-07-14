const RESERVED_SUBDOMAINS = new Set(['www', 'admin']);

/**
 * Cermin dari backend `extract_subdomain` (apps/backend/src/middleware/tenant.rs):
 * pecah hostname berdasarkan titik, ambil label pertama sebagai slug. Root domain
 * dianggap 2 label, KECUALI ".localhost" yang root-nya 1 label (supaya
 * "ivan-aura.localhost" tetap ter-resolve saat dev lokal).
 */
export function resolveSubdomainSlug(hostname: string): string | null {
  const labels = hostname.split('.');
  const isLocalhostRoot = labels[labels.length - 1]?.toLowerCase() === 'localhost';
  const rootLabelCount = isLocalhostRoot ? 1 : 2;

  if (labels.length <= rootLabelCount) return null;

  const slug = labels[0]?.toLowerCase();
  if (!slug || RESERVED_SUBDOMAINS.has(slug)) return null;

  return slug;
}

/**
 * Kebalikan dari resolveSubdomainSlug: dari slug baru + lokasi Admin Dashboard
 * saat ini (window.location), bentuk URL undangan yang benar-benar bisa diakses --
 * otomatis ikut host lokal saat dev ("http://ivan-aura.localhost:5173") maupun
 * domain asli saat production (apa pun yang di-set di depan nginx/Cloudflare),
 * TANPA perlu tahu domain itu lewat env var apa pun.
 */
export function buildInviteUrl(slug: string): string {
  const { protocol, hostname, port } = window.location;
  const rootHost = hostname.replace(/^(www|admin)\./, '');
  const portSuffix = port ? `:${port}` : '';
  return `${protocol}//${slug}.${rootHost}${portSuffix}`;
}

/** Sama seperti buildInviteUrl, tapi mengarah ke /edit dengan token terpasang --
 * dipakai admin untuk mengirim ulang link editor kalau pasangan lupa tokennya. */
export function buildEditUrl(slug: string, accessToken: string): string {
  return `${buildInviteUrl(slug)}/edit?token=${accessToken}`;
}
