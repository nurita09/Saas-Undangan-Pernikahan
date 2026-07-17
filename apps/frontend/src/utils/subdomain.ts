const RESERVED_SUBDOMAINS = new Set(['www', 'admin']);

/** Root domain eksplisit dari build-time env (mis. "undangan.nurita.id").
 *  WAJIB di-set saat build production kalau root domain-nya lebih dari 2 label
 *  -- heuristik hitung-label tidak bisa membedakannya dari subdomain tenant.
 *  Di-supply lewat ARG VITE_BASE_DOMAIN (lihat infra/Dockerfile.prod). */
const BASE_DOMAIN: string | undefined = (import.meta.env.VITE_BASE_DOMAIN as string | undefined)
  ?.trim()
  .replace(/^\.+|\.+$/g, '')
  .toLowerCase() || undefined;

/**
 * Cermin dari backend `extract_subdomain` (apps/backend/src/middleware/tenant.rs):
 * kalau BASE_DOMAIN di-set, "slug.base" -> slug dan "base"/"www./admin." -> null;
 * selain itu pecah hostname berdasarkan titik, ambil label pertama sebagai slug.
 * Root domain dianggap 2 label, KECUALI ".localhost" yang root-nya 1 label
 * (supaya "ivan-aura.localhost" tetap ter-resolve saat dev lokal).
 */
export function resolveSubdomainSlug(hostname: string): string | null {
  if (BASE_DOMAIN) {
    const host = hostname.toLowerCase();
    if (host === BASE_DOMAIN) return null;
    if (host.endsWith(`.${BASE_DOMAIN}`)) {
      const prefix = host.slice(0, -(BASE_DOMAIN.length + 1));
      if (!prefix || prefix.includes('.') || RESERVED_SUBDOMAINS.has(prefix)) return null;
      return prefix;
    }
    // Host di luar base domain -> lanjut ke heuristik di bawah.
  }

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
 * dipakai admin untuk mengirim ulang link editor kalau pasangan lupa tokennya.
 * Token ditaruh di fragment (#) karena fragment tidak pernah dikirim ke server,
 * jadi tidak bocor lewat access log maupun Referer. */
export function buildEditUrl(slug: string, accessToken: string): string {
  return `${buildInviteUrl(slug)}/edit#token=${accessToken}`;
}
