import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Target proxy untuk /api dibaca dari env (docker-compose set ke
// "http://backend:8080"; default lokal non-docker ke localhost:8080).
// changeOrigin sengaja TIDAK diaktifkan supaya Host header asli (mis.
// "ivan-aura.localhost:5173") diteruskan apa adanya ke backend Rust --
// itulah yang dipakai backend untuk resolusi tenant multi-subdomain.
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8080';

/** Salinan logika resolveSubdomainSlug di src/utils/subdomain.ts -- diduplikasi
 *  di sini karena vite.config berjalan di Node (di luar graph modul src/). */
function resolveTenantSlug(hostname: string): string | null {
  const labels = hostname.split('.');
  const isLocalhostRoot = labels[labels.length - 1]?.toLowerCase() === 'localhost';
  const rootLabelCount = isLocalhostRoot ? 1 : 2;

  if (labels.length <= rootLabelCount) return null;

  const slug = labels[0]?.toLowerCase();
  if (!slug || slug === 'www' || slug === 'admin') return null;

  return slug;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

interface WeddingDetailsForOg {
  couple: { groom_name: string; bride_name: string };
  event: { wedding_date: string | null; location_address: string | null };
  cover_photo_url: string | null;
}

/** GET wedding-details ke backend dengan Host header tenant asli. Pakai
 *  node:http (bukan fetch/undici) karena spec fetch MELARANG override header
 *  Host -- undici membuangnya diam-diam dan backend gagal resolve tenant. */
function fetchWeddingDetailsForOg(baseUrl: string, host: string): Promise<WeddingDetailsForOg | null> {
  return new Promise((resolve) => {
    const target = new URL('/api/wedding-details', baseUrl);
    const request = http.request(
      {
        hostname: target.hostname,
        port: target.port,
        path: target.pathname,
        method: 'GET',
        headers: { host },
      },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          resolve(null);
          return;
        }
        let body = '';
        response.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        response.on('end', () => {
          try {
            resolve(JSON.parse(body) as WeddingDetailsForOg);
          } catch {
            resolve(null);
          }
        });
      },
    );
    request.on('error', () => resolve(null));
    request.end();
  });
}

interface OgData {
  title: string;
  description: string;
  imageUrl: string | null;
  pageUrl: string;
}

function buildOgTags({ title, description, imageUrl, pageUrl }: OgData): string {
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`);
  }
  return `    ${tags.join('\n    ')}`;
}

/**
 * Inject OG meta tags per wedding saat halaman undangan diminta -- supaya link
 * yang dishare di WhatsApp/socmed menampilkan judul + foto pasangan, bukan
 * link polos. Crawler socmed tidak menjalankan JavaScript, jadi meta HARUS
 * sudah ada di HTML yang diserve server, bukan di-set client-side.
 *
 * CATATAN PRODUCTION: plugin ini hanya jalan di Vite dev server. Saat nanti
 * production (vite build + nginx/backend yang serve HTML statis), logika yang
 * sama perlu dipindah ke layer yang men-serve index.html (nginx sub_filter /
 * handler backend).
 */
function ogTagsPlugin(): Plugin {
  return {
    name: 'inject-og-tags',
    configureServer(server: ViteDevServer) {
      // Dikembalikan sebagai post-hook: middleware ini terpasang SEBELUM
      // middleware html internal Vite, jadi bisa mengambil alih serving HTML.
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? '/';
          // htmlFallbackMiddleware internal Vite berjalan lebih dulu dan menulis
          // ulang "/" jadi "/index.html" -- jadi yang sampai ke sini berekstensi
          // .html (atau tanpa ekstensi untuk kasus yang tidak di-rewrite).
          const pathnameOnly = url.split('?')[0];
          const extension = path.extname(pathnameOnly);
          const isHtmlRequest =
            req.method === 'GET' &&
            (req.headers.accept ?? '').includes('text/html') &&
            (extension === '' || extension === '.html');

          if (!isHtmlRequest) return next();

          const host = req.headers.host ?? '';
          const slug = resolveTenantSlug(host.split(':')[0]);
          if (!slug) return next();

          // Undangan draft / backend down -> null -> serve HTML default saja.
          const data = await fetchWeddingDetailsForOg(backendInternalUrl, host);
          if (!data) return next();

          const pageTitle = `The Wedding of ${data.couple.groom_name} & ${data.couple.bride_name}`;
          // Timestamp backend = jam dinding WIB (konvensi platform, lihat
          // src/utils/formatDate.ts) -- parse dengan offset +07:00 eksplisit
          // dan format di zona Asia/Jakarta supaya tidak geser di Node (UTC).
          const dateText = data.event.wedding_date
            ? new Date(`${data.event.wedding_date.slice(0, 16)}:00+07:00`).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'Asia/Jakarta',
              })
            : null;
          const description = [
            'Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.',
            dateText,
            data.event.location_address,
          ]
            .filter(Boolean)
            .join(' — ');
          const ogTags = buildOgTags({
            title: pageTitle,
            description,
            imageUrl: data.cover_photo_url,
            pageUrl: `http://${host}/`,
          });

          try {
            const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
            let html = await server.transformIndexHtml(url, template, req.originalUrl);
            html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);
            html = html.replace(
              /<meta name="description"[^>]*\/>/,
              `<meta name="description" content="${escapeHtml(description)}" />`,
            );
            html = html.replace('</head>', `${ogTags}\n  </head>`);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (error) {
            next(error);
          }
        });
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ogTagsPlugin()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: backendInternalUrl,
        changeOrigin: false,
      },
    },
  },
});
