import { useEffect, useState } from 'react';
import Reveal from '../components/shared/Reveal';
import { fetchPublicSettings } from '../lib/api';
import { buildInviteUrl } from '../utils/subdomain';
import type { ContactSettings } from '../types/wedding';
import logoUrl from '../assets/icons/ic_logo.png';

// Palet brand Nurita (mengikuti warna logo: teal gelap) + aksen hangat.
const BRAND = '#0E3B39';
const BRAND_SOFT = '#EAF2F0';
const ACCENT = '#C9A227';

// Katalog tema untuk showcase -- selaras dengan components/themes/registry.ts.
// Mini-mock digambar dengan CSS memakai palet asli tiap tema.
interface ThemeShowcase {
  id: number;
  name: string;
  vibe: string;
  audience: string;
  bg: string;
  fg: string;
  accent: string;
  fontClass: string;
  ornament: string;
  /** Slug wedding demo yang di-seed backend saat startup (src/seed.rs). */
  demoSlug: string;
  dark?: boolean;
}

const THEMES: ThemeShowcase[] = [
  {
    id: 1,
    demoSlug: 'demo-floral',
    name: 'Floral Elegant',
    vibe: 'Klasik, hangat, dan romantis',
    audience: 'Cocok untuk pernikahan intim yang timeless',
    bg: '#F9F8F4',
    fg: '#4A4238',
    accent: '#8D7B68',
    fontClass: 'font-script',
    ornament: '🌸',
  },
  {
    id: 2,
    demoSlug: 'demo-jawa',
    name: 'Adat Jawa',
    vibe: 'Anggun berbalut budaya',
    audience: 'Cocok untuk pernikahan adat & keluarga besar',
    bg: '#F3EAD8',
    fg: '#6B4423',
    accent: '#C9A227',
    fontClass: 'font-script',
    ornament: '🪷',
  },
  {
    id: 3,
    demoSlug: 'demo-dark',
    name: 'Modern Elegant Dark',
    vibe: 'Mewah, misterius, premium',
    audience: 'Cocok untuk resepsi malam & ballroom',
    bg: '#10131C',
    fg: '#F5F5F5',
    accent: '#D4AF37',
    fontClass: 'font-script',
    ornament: '✦',
    dark: true,
  },
  {
    id: 4,
    demoSlug: 'demo-islami',
    name: 'Islami Modern',
    vibe: 'Suci, damai, dan bersih',
    audience: "Cocok untuk akad & walimatul 'ursy",
    bg: '#FAFBF7',
    fg: '#3E4A38',
    accent: '#7C9070',
    fontClass: 'font-serif',
    ornament: '☪',
  },
  {
    id: 5,
    demoSlug: 'demo-retro',
    name: 'Retro Pop',
    vibe: 'Ceria, unik, anti-mainstream',
    audience: 'Cocok untuk pasangan gen-Z yang santai',
    bg: '#FBF3E4',
    fg: '#5C4033',
    accent: '#C75B39',
    fontClass: 'font-retro',
    ornament: '✌',
  },
];

const FEATURES: { icon: string; title: string; desc: string }[] = [
  { icon: '🎨', title: '5 Tema Premium', desc: 'Dari klasik, adat, islami, dark premium, sampai retro pop.' },
  { icon: '🎵', title: 'Musik Latar', desc: 'Pilih lagu dari library — undangan langsung bernyanyi.' },
  { icon: '📸', title: 'Galeri & Video', desc: 'Sampai 10 foto + video YouTube momen kalian.' },
  { icon: '💌', title: 'RSVP & Ucapan', desc: 'Tamu konfirmasi hadir dan menulis doa langsung di undangan.' },
  { icon: '⏳', title: 'Hitung Mundur', desc: 'Countdown otomatis menuju hari bahagia (zona WIB).' },
  { icon: '🎁', title: 'Amplop Digital', desc: 'Rekening & alamat kado dengan tombol salin sekali tap.' },
  { icon: '🕰️', title: 'Love Story', desc: 'Timeline kisah perjalanan cinta kalian berdua.' },
  { icon: '🔗', title: 'Link Cantik', desc: 'nama-kalian.domain — siap dishare di WhatsApp dengan preview foto.' },
];

const STEPS: { step: string; title: string; desc: string }[] = [
  { step: '1', title: 'Pilih Tema', desc: 'Tentukan tema favorit kalian dari katalog di bawah.' },
  { step: '2', title: 'Kirim Data', desc: 'Hubungi kami via WhatsApp/marketplace — kirim nama, tanggal, & foto.' },
  { step: '3', title: 'Undangan Jadi!', desc: 'Terima link undangan + akses editor untuk mengubah isi kapan saja.' },
];

/** Mini-mock cover undangan yang digambar murni dengan CSS per palet tema. */
function ThemeCard({ theme }: { theme: ThemeShowcase }) {
  return (
    <div className="group w-full max-w-[240px]">
      <div
        className="relative mx-auto aspect-[9/16] overflow-hidden rounded-[1.75rem] border p-5 text-center shadow-lg transition-transform duration-500 group-hover:-translate-y-2"
        style={{ backgroundColor: theme.bg, borderColor: `${theme.accent}66` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-[1.4rem] border"
          style={{ borderColor: `${theme.accent}55` }}
        />
        <p className="relative mt-3 text-lg" style={{ color: theme.accent }}>
          {theme.ornament}
        </p>
        <p
          className="relative mt-1 text-[9px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: theme.dark ? '#A3A3A3' : '#8A8A80' }}
        >
          The Wedding Of
        </p>
        <p className={`relative mt-2 ${theme.fontClass} text-2xl leading-tight`} style={{ color: theme.fg }}>
          Nadia &amp; Reza
        </p>
        <div
          className="relative mx-auto mt-4 h-24 w-20 rounded-t-full border-2"
          style={{ borderColor: theme.accent, backgroundColor: `${theme.accent}22` }}
        />
        <p className="relative mt-4 text-[10px] tracking-[0.25em]" style={{ color: theme.fg }}>
          12 . 12 . 2026
        </p>
        <span
          className="relative mt-3 inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold"
          style={{ backgroundColor: theme.accent, color: theme.dark ? '#10131C' : '#FFFFFF' }}
        >
          Buka Undangan
        </span>
      </div>

      <div className="mt-4 text-center">
        <p className="font-semibold text-neutral-900">{theme.name}</p>
        <p className="mt-0.5 text-sm text-neutral-500">{theme.vibe}</p>
        <p className="mt-1 text-xs text-neutral-400">{theme.audience}</p>
        {/* Demo = undangan sungguhan di subdomain demo (di-seed backend),
            bukan sekadar gambar -- tamu bisa scroll, RSVP, dengar musik. */}
        <a
          href={buildInviteUrl(theme.demoSlug)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold transition hover:text-white"
          style={{ borderColor: BRAND, color: BRAND }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = BRAND;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Lihat Demo →
        </a>
      </div>
    </div>
  );
}

interface ShopLink {
  label: string;
  icon: string;
  url: string;
  color: string;
}

function buildShopLinks(settings: ContactSettings | null): ShopLink[] {
  if (!settings) return [];
  const links: ShopLink[] = [];
  if (settings.contact_whatsapp_url)
    links.push({ label: 'WhatsApp', icon: '💬', url: settings.contact_whatsapp_url, color: '#25D366' });
  if (settings.shopee_url)
    links.push({ label: 'Shopee', icon: '🛒', url: settings.shopee_url, color: '#EE4D2D' });
  if (settings.tokopedia_url)
    links.push({ label: 'Tokopedia', icon: '🛍️', url: settings.tokopedia_url, color: '#03AC0E' });
  if (settings.tiktok_url)
    links.push({ label: 'TikTok', icon: '🎬', url: settings.tiktok_url, color: '#161823' });
  if (settings.contact_instagram_url)
    links.push({ label: 'Instagram', icon: '📸', url: settings.contact_instagram_url, color: '#E1306C' });
  return links;
}

/**
 * Landing page publik Nurita Undangan (root domain). Admin dashboard pindah
 * ke path /admin (lihat routing di App.tsx). Tombol WA/marketplace diambil
 * dari platform_settings (diatur admin di tab Pengaturan) -- hanya tampil
 * yang link-nya terisi.
 */
export default function LandingPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    fetchPublicSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  const shopLinks = buildShopLinks(settings);
  const waUrl = settings?.contact_whatsapp_url ?? null;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      {/* ===== Navbar ===== */}
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <img src={logoUrl} alt="Logo Nurita Undangan" className="h-8 w-auto" />
            <span className="font-serif text-lg font-semibold" style={{ color: BRAND }}>
              Nurita Undangan
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-neutral-600 sm:flex">
            <a href="#tema" className="hover:text-neutral-900 transition">Tema</a>
            <a href="#fitur" className="hover:text-neutral-900 transition">Fitur</a>
            <a href="#cara-pesan" className="hover:text-neutral-900 transition">Cara Pesan</a>
          </nav>
          <a
            href={waUrl ?? '#tema'}
            target={waUrl ? '_blank' : undefined}
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: BRAND }}
          >
            Pesan Sekarang
          </a>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden" style={{ backgroundColor: BRAND_SOFT }}>
        <div className="mx-auto max-w-6xl px-5 py-20 text-center lg:py-28">
          <Reveal variant="up">
            <p
              className="mx-auto w-fit rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ borderColor: `${ACCENT}88`, color: BRAND }}
            >
              ✨ Undangan Pernikahan Digital
            </p>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <h1
              className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-6xl"
              style={{ color: BRAND }}
            >
              Bagikan Hari Bahagiamu, <span style={{ color: ACCENT }}>Seindah Kisahnya</span>
            </h1>
          </Reveal>
          <Reveal variant="up" delay={240}>
            <p className="mx-auto mt-5 max-w-xl text-base text-neutral-600 md:text-lg">
              Undangan digital dengan link cantik atas nama kalian — lengkap dengan musik, galeri,
              hitung mundur, RSVP tamu, dan amplop digital. Siap dishare ke WhatsApp dalam 1 hari.
            </p>
          </Reveal>
          <Reveal variant="up" delay={360}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={waUrl ?? '#tema'}
                target={waUrl ? '_blank' : undefined}
                rel="noreferrer"
                className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{ backgroundColor: BRAND }}
              >
                💬 Konsultasi Gratis
              </a>
              <a
                href="#tema"
                className="rounded-full border px-7 py-3 text-sm font-semibold transition hover:bg-white"
                style={{ borderColor: BRAND, color: BRAND }}
              >
                Lihat Semua Tema
              </a>
            </div>
          </Reveal>
          <Reveal variant="up" delay={480}>
            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-neutral-500">
              5 Tema Premium · Musik &amp; Galeri · RSVP Tamu · Bisa Edit Sendiri
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Showcase Tema ===== */}
      <section id="tema" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal variant="blur">
          <h2 className="text-center font-serif text-3xl font-semibold" style={{ color: BRAND }}>
            Pilih Tema Sesuai Kepribadian Kalian
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-neutral-500">
            Setiap tema dirancang penuh — cover animasi, kutipan yang bisa diganti, profil pasangan,
            rangkaian acara, love story, galeri, amplop digital, sampai RSVP.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-start justify-center gap-8">
          {THEMES.map((theme, idx) => (
            <Reveal key={theme.id} variant="up" delay={idx * 100}>
              <ThemeCard theme={theme} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Fitur ===== */}
      <section id="fitur" className="py-20" style={{ backgroundColor: BRAND }}>
        <div className="mx-auto max-w-6xl px-5">
          <Reveal variant="blur">
            <h2 className="text-center font-serif text-3xl font-semibold text-white">
              Semua yang Undanganmu Butuhkan
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, idx) => (
              <Reveal key={feature.title} variant="up" delay={(idx % 4) * 100}>
                <div className="h-full rounded-2xl bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
                  <p className="text-2xl">{feature.icon}</p>
                  <p className="mt-3 font-semibold text-white">{feature.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Cara Pesan ===== */}
      <section id="cara-pesan" className="mx-auto max-w-6xl px-5 py-20">
        <Reveal variant="blur">
          <h2 className="text-center font-serif text-3xl font-semibold" style={{ color: BRAND }}>
            Pesan Semudah 1-2-3
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, idx) => (
            <Reveal key={step.step} variant="up" delay={idx * 150}>
              <div className="text-center">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full font-serif text-xl font-bold text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {step.step}
                </div>
                <p className="mt-4 font-semibold text-neutral-900">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CTA band ===== */}
      <section className="px-5 pb-20">
        <Reveal variant="zoom">
          <div
            className="mx-auto max-w-4xl rounded-[2rem] px-6 py-12 text-center shadow-xl"
            style={{ backgroundColor: BRAND_SOFT }}
          >
            <h2 className="font-serif text-3xl font-semibold" style={{ color: BRAND }}>
              Siap Bikin Undangan Kalian?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">
              Chat kami atau checkout langsung lewat marketplace favoritmu — tim Nurita siap bantu
              sampai undanganmu tayang.
            </p>
            {shopLinks.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {shopLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 hover:-translate-y-0.5"
                    style={{ backgroundColor: link.color }}
                  >
                    <span>{link.icon}</span> {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-neutral-400">
                (Link pemesanan sedang disiapkan — segera kembali ya!)
              </p>
            )}
          </div>
        </Reveal>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center">
          <div className="flex items-center gap-2.5">
            <img src={logoUrl} alt="Logo Nurita Undangan" className="h-7 w-auto" />
            <span className="font-serif font-semibold" style={{ color: BRAND }}>
              Nurita Undangan
            </span>
          </div>
          {settings?.contact_handle && (
            <p className="text-sm text-neutral-500">{settings.contact_handle}</p>
          )}
          {shopLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {shopLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline transition"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Nurita Undangan — Undangan pernikahan digital.
          </p>
        </div>
      </footer>
    </div>
  );
}
