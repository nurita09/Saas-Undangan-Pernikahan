import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  createWedding,
  fetchAdminWeddings,
  fetchMusicLibrary,
  fetchSettings,
  setWeddingPublished,
  updateSettings,
  uploadMusicTrack,
  ApiError,
} from '../lib/api';
import { THEME_OPTIONS } from '../components/themes/registry';
import { buildEditUrl, buildInviteUrl } from '../utils/subdomain';
import type { ContactSettings, CreateWeddingResponse, MusicTrack, WeddingSummary } from '../types/wedding';

interface CopyableFieldProps {
  label: string;
  value: string;
}

function CopyableField({ label, value }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-800">
          {value}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700 transition"
        >
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
      </div>
    </div>
  );
}

/** Tombol salin ringkas untuk dipakai di dalam sel tabel (bukan blok label seperti CopyableField). */
function CopyButton({ value, children }: { value: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition"
    >
      {copied ? 'Tersalin!' : children}
    </button>
  );
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';
type LoadStatus = 'loading' | 'loaded' | 'error';

interface TabProps {
  authHeader: string;
  onUnauthorized: () => void;
}

// ---------------------------------------------------------------------------
// Tab: Generate Undangan
// ---------------------------------------------------------------------------

function GenerateTab({ authHeader, onUnauthorized }: TabProps) {
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [themeId, setThemeId] = useState<number>(THEME_OPTIONS[0].id);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<CreateWeddingResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const wedding = await createWedding({ groomName, brideName, themeId }, authHeader);
      setResult(wedding);
      setStatus('success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : 'Terjadi kesalahan tak terduga');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setGroomName('');
    setBrideName('');
    setThemeId(THEME_OPTIONS[0].id);
    setResult(null);
    setStatus('idle');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="groom_name" className="block text-sm font-medium text-neutral-700">
            Nama Pengantin Pria
          </label>
          <input
            id="groom_name"
            type="text"
            required
            value={groomName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setGroomName(event.target.value)}
            placeholder="Ivan"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="bride_name" className="block text-sm font-medium text-neutral-700">
            Nama Pengantin Wanita
          </label>
          <input
            id="bride_name"
            type="text"
            required
            value={brideName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setBrideName(event.target.value)}
            placeholder="Aura"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="theme_id" className="block text-sm font-medium text-neutral-700">
            Pilih Tema
          </label>
          <select
            id="theme_id"
            value={themeId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setThemeId(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          >
            {THEME_OPTIONS.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>

        {status === 'error' && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition"
        >
          {status === 'loading' ? 'Membuat undangan...' : 'Generate'}
        </button>
      </form>

      {status === 'success' && result && (
        <div className="mt-6 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-700">
            ✓ Undangan {result.groom_name} & {result.bride_name} berhasil dibuat
          </p>

          <CopyableField label="Subdomain Slug" value={result.subdomain_slug} />
          <CopyableField label="Access Token" value={result.access_token} />
          <CopyableField label="Invite URL" value={buildInviteUrl(result.subdomain_slug)} />

          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-emerald-700 underline underline-offset-2"
          >
            Buat undangan lain
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Daftar Wedding (monitoring)
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

type StatusFilter = 'all' | 'published' | 'draft';

function WeddingsTab({ authHeader, onUnauthorized }: TabProps) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [weddings, setWeddings] = useState<WeddingSummary[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  // Slug yang sedang diproses toggle publish-nya (disable tombol selama request).
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const handleTogglePublish = async (wedding: WeddingSummary) => {
    setTogglingSlug(wedding.subdomain_slug);
    try {
      await setWeddingPublished(authHeader, wedding.subdomain_slug, !wedding.is_published);
      setWeddings((prev) =>
        prev.map((w) =>
          w.subdomain_slug === wedding.subdomain_slug ? { ...w, is_published: !w.is_published } : w,
        ),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      alert(error instanceof ApiError ? error.message : 'Gagal mengubah status publish');
    } finally {
      setTogglingSlug(null);
    }
  };

  useEffect(() => {
    fetchAdminWeddings(authHeader)
      .then((data) => {
        setWeddings(data);
        setStatus('loaded');
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized();
          return;
        }
        setStatus('error');
      });
  }, [authHeader, onUnauthorized]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return weddings.filter((wedding) => {
      if (statusFilter === 'published' && !wedding.is_published) return false;
      if (statusFilter === 'draft' && wedding.is_published) return false;

      if (!query) return true;
      return (
        wedding.groom_name.toLowerCase().includes(query) ||
        wedding.bride_name.toLowerCase().includes(query) ||
        wedding.subdomain_slug.toLowerCase().includes(query)
      );
    });
  }, [weddings, search, statusFilter]);

  const stats = useMemo(() => {
    const published = weddings.filter((w) => w.is_published).length;
    const totalRsvp = weddings.reduce((sum, w) => sum + w.rsvp_count, 0);
    return {
      total: weddings.length,
      published,
      draft: weddings.length - published,
      totalRsvp,
    };
  }, [weddings]);

  if (status === 'loading') {
    return <p className="text-sm text-neutral-500">Memuat daftar undangan...</p>;
  }

  if (status === 'error') {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Gagal memuat daftar undangan.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Wedding" value={stats.total} />
        <StatCard label="Publish" value={stats.published} />
        <StatCard label="Draft" value={stats.draft} />
        <StatCard label="Total RSVP" value={stats.totalRsvp} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          placeholder="Cari nama pengantin atau slug..."
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setStatusFilter(event.target.value as StatusFilter)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="published">Publish</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {weddings.length === 0 && <p className="text-sm text-neutral-500">Belum ada undangan yang dibuat.</p>}

      {weddings.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-neutral-500">Tidak ada undangan yang cocok dengan pencarian.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Pasangan</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Tema</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">RSVP</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Dibuat</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Access Token</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((wedding) => (
                <tr key={wedding.subdomain_slug}>
                  <td className="px-4 py-3 text-neutral-800">
                    {wedding.groom_name} &amp; {wedding.bride_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{wedding.subdomain_slug}</td>
                  <td className="px-4 py-3 text-neutral-500">{wedding.theme_id}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(wedding)}
                      disabled={togglingSlug === wedding.subdomain_slug}
                      title={wedding.is_published ? 'Klik untuk jadikan Draft' : 'Klik untuk Publish'}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium transition disabled:opacity-50 ${
                        wedding.is_published
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {togglingSlug === wedding.subdomain_slug
                        ? '...'
                        : wedding.is_published
                          ? 'Publish'
                          : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{wedding.rsvp_count}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(wedding.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="max-w-[8rem] truncate text-xs text-neutral-500">{wedding.access_token}</code>
                      <CopyButton value={wedding.access_token}>Salin</CopyButton>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CopyButton value={buildEditUrl(wedding.subdomain_slug, wedding.access_token)}>
                        Link Editor
                      </CopyButton>
                      <CopyButton value={buildInviteUrl(wedding.subdomain_slug)}>Link Undangan</CopyButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Musik (kelola library global)
// ---------------------------------------------------------------------------

function MusicTab({ authHeader, onUnauthorized }: TabProps) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<SubmitStatus>('idle');
  const [uploadError, setUploadError] = useState('');

  const loadTracks = () => {
    setStatus('loading');
    fetchMusicLibrary()
      .then((data) => {
        setTracks(data);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(loadTracks, []);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setUploadStatus('loading');
    setUploadError('');

    try {
      await uploadMusicTrack(authHeader, { title, artist, file });
      setTitle('');
      setArtist('');
      setFile(null);
      setUploadStatus('success');
      loadTracks();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      setUploadError(error instanceof ApiError ? error.message : 'Terjadi kesalahan tak terduga');
      setUploadStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-neutral-800">Unggah Lagu Baru</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="music_title" className="block text-xs font-medium text-neutral-600">
              Judul Lagu
            </label>
            <input
              id="music_title"
              type="text"
              required
              value={title}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="music_artist" className="block text-xs font-medium text-neutral-600">
              Artis (opsional)
            </label>
            <input
              id="music_artist"
              type="text"
              value={artist}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setArtist(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="music_file" className="block text-xs font-medium text-neutral-600">
            File Audio (MP3, WAV, OGG, M4A -- maks 15MB)
          </label>
          <input
            id="music_file"
            type="file"
            required
            accept="audio/mpeg,audio/wav,audio/ogg,audio/x-m4a,audio/mp4"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm text-neutral-600"
          />
        </div>

        {uploadStatus === 'error' && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{uploadError}</p>
        )}

        <button
          type="submit"
          disabled={uploadStatus === 'loading'}
          className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition"
        >
          {uploadStatus === 'loading' ? 'Mengunggah...' : 'Unggah Lagu'}
        </button>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-neutral-800">Daftar Lagu</p>

        {status === 'loading' && <p className="mt-3 text-sm text-neutral-500">Memuat...</p>}
        {status === 'error' && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Gagal memuat daftar lagu.</p>
        )}
        {status === 'loaded' && tracks.length === 0 && (
          <p className="mt-3 text-sm text-neutral-500">Belum ada lagu di library.</p>
        )}

        {status === 'loaded' && tracks.length > 0 && (
          <ul className="mt-3 divide-y divide-neutral-100">
            {tracks.map((track) => (
              <li key={track.id} className="space-y-2 py-3">
                <p className="text-sm text-neutral-800">
                  {track.title}
                  {track.artist ? <span className="text-neutral-500"> — {track.artist}</span> : null}
                </p>
                <audio controls src={track.file_url} className="w-full">
                  Browser kamu tidak mendukung pemutar audio.
                </audio>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Pengaturan (global platform settings)
// ---------------------------------------------------------------------------

function SettingsTab({ authHeader, onUnauthorized }: TabProps) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [form, setForm] = useState<ContactSettings>({
    contact_instagram_url: '',
    contact_whatsapp_url: '',
    contact_handle: '',
  });
  const [saveStatus, setSaveStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSettings(authHeader)
      .then((data) => {
        setForm(data);
        setStatus('loaded');
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized();
          return;
        }
        setStatus('error');
      });
  }, [authHeader, onUnauthorized]);

  const updateField = (field: keyof ContactSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveStatus('loading');
    setErrorMessage('');

    try {
      const updated = await updateSettings(authHeader, {
        contact_instagram_url: form.contact_instagram_url || null,
        contact_whatsapp_url: form.contact_whatsapp_url || null,
        contact_handle: form.contact_handle || null,
      });
      setForm(updated);
      setSaveStatus('success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      setErrorMessage(error instanceof ApiError ? error.message : 'Terjadi kesalahan tak terduga');
      setSaveStatus('error');
    }
  };

  if (status === 'loading') {
    return <p className="text-sm text-neutral-500">Memuat pengaturan...</p>;
  }

  if (status === 'error') {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Gagal memuat pengaturan.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-neutral-800">Kontak Global (Footer "Hubungi Kami")</p>
      <p className="text-xs text-neutral-500">
        Berlaku untuk semua undangan di platform ini, bukan per-wedding.
      </p>

      <div>
        <label htmlFor="contact_handle" className="block text-xs font-medium text-neutral-600">
          Nama / Handle
        </label>
        <input
          id="contact_handle"
          type="text"
          value={form.contact_handle ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => updateField('contact_handle', event.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="contact_instagram_url" className="block text-xs font-medium text-neutral-600">
          Link Instagram
        </label>
        <input
          id="contact_instagram_url"
          type="url"
          placeholder="https://instagram.com/..."
          value={form.contact_instagram_url ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateField('contact_instagram_url', event.target.value)
          }
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="contact_whatsapp_url" className="block text-xs font-medium text-neutral-600">
          Link WhatsApp
        </label>
        <input
          id="contact_whatsapp_url"
          type="url"
          placeholder="https://wa.me/..."
          value={form.contact_whatsapp_url ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateField('contact_whatsapp_url', event.target.value)
          }
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {saveStatus === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
      )}
      {saveStatus === 'success' && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">✓ Pengaturan tersimpan</p>
      )}

      <button
        type="submit"
        disabled={saveStatus === 'loading'}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition"
      >
        {saveStatus === 'loading' ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Dashboard: layout sidebar
// ---------------------------------------------------------------------------

type TabKey = 'generate' | 'weddings' | 'musik' | 'settings';

const TABS: { key: TabKey; label: string; description: string }[] = [
  { key: 'generate', label: 'Generate Undangan', description: 'Buat undangan baru untuk pelanggan' },
  { key: 'weddings', label: 'Daftar Wedding', description: 'Monitoring semua undangan & RSVP' },
  { key: 'musik', label: 'Musik', description: 'Kelola library lagu global' },
  { key: 'settings', label: 'Pengaturan', description: 'Kontak global platform' },
];

interface AdminDashboardProps {
  authHeader: string;
  onLogout: () => void;
}

export default function AdminDashboard({ authHeader, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('generate');
  const activeMeta = TABS.find((tab) => tab.key === activeTab)!;

  const tabProps: TabProps = { authHeader, onUnauthorized: onLogout };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="px-5 py-6">
          <p className="text-lg font-semibold text-neutral-900">Admin</p>
          <p className="mt-0.5 text-xs text-neutral-500">Wedding Platform</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-neutral-200 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition"
          >
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden px-8 py-10">
        <div className="mx-auto max-w-4xl">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">{activeMeta.label}</h1>
            <p className="mt-1 text-sm text-neutral-500">{activeMeta.description}</p>
          </div>

          <div className="mt-6">
            {activeTab === 'generate' && <GenerateTab {...tabProps} />}
            {activeTab === 'weddings' && <WeddingsTab {...tabProps} />}
            {activeTab === 'musik' && <MusicTab {...tabProps} />}
            {activeTab === 'settings' && <SettingsTab {...tabProps} />}
          </div>
        </div>
      </main>
    </div>
  );
}
