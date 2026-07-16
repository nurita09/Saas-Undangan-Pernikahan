import { useEffect, useState } from 'react';
import AdminGate from './pages/AdminGate.tsx';
import InvitationNotFound from './pages/InvitationNotFound.tsx';
import LandingPage from './pages/LandingPage.tsx';
import WeddingEditor from './pages/WeddingEditor.tsx';
import { fetchWeddingDetails, ApiError } from './lib/api';
import { getThemeComponent } from './components/themes/registry';
import { resolveSubdomainSlug } from './utils/subdomain';
import { readAccessToken } from './utils/token';
import type { WeddingData } from './types/wedding';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFBF2]">
      <p className="text-sm tracking-widest uppercase text-neutral-400">Memuat undangan...</p>
    </div>
  );
}

type LoadState =
  | { status: 'loading'; data: null }
  | { status: 'success'; data: WeddingData }
  | { status: 'not-found'; data: null }
  | { status: 'error'; data: null };

export default function App() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const slug = resolveSubdomainSlug(hostname);
  const isEditRoute = slug !== null && pathname === '/edit';

  const [state, setState] = useState<LoadState>({ status: 'loading', data: null });

  useEffect(() => {
    if (slug === null || isEditRoute) return;

    let cancelled = false;
    setState({ status: 'loading', data: null });

    // Token (kalau ada di URL) diteruskan supaya pasangan bisa melihat preview
    // undangannya sendiri walau masih draft; tamu biasa tanpa token dapat 404.
    fetchWeddingDetails(readAccessToken())
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) {
          setState({ status: 'not-found', data: null });
        } else {
          setState({ status: 'error', data: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, isEditRoute]);

  // Root domain (tanpa subdomain tenant): "/" = landing page publik,
  // "/admin" = Admin Dashboard (dulu di "/", digeser karena root sekarang
  // jadi etalase Nurita Undangan).
  if (slug === null) {
    return pathname === '/admin' ? <AdminGate /> : <LandingPage />;
  }

  if (isEditRoute) {
    return <WeddingEditor slug={slug} />;
  }

  if (state.status === 'loading') {
    return <LoadingScreen />;
  }

  if (state.status === 'not-found') {
    return <InvitationNotFound />;
  }

  if (state.status === 'error') {
    return <InvitationNotFound message="Terjadi kesalahan saat memuat undangan, coba lagi nanti." />;
  }

  const ThemeComponent = getThemeComponent(state.data.theme.theme_id);
  const guestName = new URLSearchParams(window.location.search).get('to') ?? undefined;

  return <ThemeComponent data={state.data} guestName={guestName} />;
}
