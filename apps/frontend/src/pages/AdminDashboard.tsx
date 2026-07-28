import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  createWedding,
  deleteMusicTrack,
  deleteWedding,
  fetchAdminStats,
  fetchAdminWeddings,
  fetchMusicLibrary,
  fetchSettings,
  setWeddingActiveUntil,
  setWeddingPublished,
  updateMusicTrack,
  updateSettings,
  uploadMusicTrack,
  ApiError,
} from '../lib/api';
import { THEME_OPTIONS } from '../components/themes/registry';
import { buildEditUrl, buildInviteUrl } from '../utils/subdomain';
import type {
  AdminStats,
  ContactSettings,
  CreateWeddingResponse,
  ExpiringWedding,
  MonthlyCount,
  MusicTrack,
  ThemeCount,
  WeddingSummary,
} from '../types/wedding';

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
// Tab: Dashboard (monitoring SaaS)
// ---------------------------------------------------------------------------

// Palet data-viz (light mode). Biru = satu-satunya hue magnitude (chart bulanan
// & distribusi tema); tiga slot kategorikal hanya untuk segmen RSVP yang
// identitasnya dibawa legend. Jangan ganti dengan warna status (emerald/amber).
const VIZ_SERIES_1 = '#2a78d6';
const VIZ_SERIES_2 = '#eb6834';
const VIZ_SERIES_3 = '#1baf7a';
const VIZ_BASELINE = '#c3c2b7';
const VIZ_MUTED = '#898781';

const MONTH_LABELS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** "2026-07" -> "Jul"; tahun ('26) ikut ditulis di kolom pertama & tiap Januari. */
function formatMonthTick(ym: string, withYear: boolean): string {
  const [year, month] = ym.split('-');
  const label = MONTH_LABELS_ID[Number(month) - 1] ?? ym;
  return withYear || month === '01' ? `${label} '${year.slice(2)}` : label;
}

function formatWibDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

interface StatTileProps {
  label: string;
  value: number;
  sub?: string;
  subTone?: 'up' | 'warn' | 'muted';
}

function StatTile({ label, value, sub, subTone = 'muted' }: StatTileProps) {
  const toneClass =
    subTone === 'up' ? 'text-emerald-700' : subTone === 'warn' ? 'text-amber-700' : 'text-neutral-400';

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value.toLocaleString('id-ID')}</p>
      {sub && <p className={`mt-1 text-xs ${toneClass}`}>{sub}</p>}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-neutral-800">{title}</p>
      <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** Kolom undangan baru per bulan. Nilai ditulis di puncak tiap kolom, jadi
 *  sumbu Y tidak dibutuhkan; hover cukup memperjelas, bukan satu-satunya akses. */
function MonthlyChart({ data }: { data: MonthlyCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height: 150 }}>
        {data.map((d) => (
          <div
            key={d.month}
            className="group flex h-full flex-1 flex-col items-center justify-end"
            title={`${formatMonthTick(d.month, true)}: ${d.count} undangan baru`}
          >
            <span className="mb-1 text-xs font-medium text-neutral-700">{d.count}</span>
            <div
              className="w-full rounded-t transition-opacity group-hover:opacity-75"
              style={{
                maxWidth: 24,
                height: d.count === 0 ? 0 : Math.max(4, Math.round((d.count / max) * 118)),
                backgroundColor: VIZ_SERIES_1,
              }}
            />
          </div>
        ))}
      </div>
      <div className="border-t" style={{ borderColor: VIZ_BASELINE }} />
      <div className="mt-1.5 flex gap-3">
        {data.map((d, index) => (
          <p key={d.month} className="flex-1 text-center text-xs" style={{ color: VIZ_MUTED }}>
            {formatMonthTick(d.month, index === 0)}
          </p>
        ))}
      </div>
    </div>
  );
}

/** "Theme 3 - Modern Elegant (Dark)" -> "Modern Elegant (Dark)". */
function themeShortLabel(themeId: number): string {
  const option = THEME_OPTIONS.find((t) => t.id === themeId);
  if (!option) return `Tema ${themeId}`;
  return option.label.split(' - ')[1] ?? option.label;
}

/** Bar horizontal jumlah undangan per tema -- satu seri, satu warna (bukan
 *  ramp gelap-terang: kategori tema tidak punya urutan nilai). */
function ThemeBars({ data }: { data: ThemeCount[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-neutral-500">Belum ada undangan yang dibuat.</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.theme_id} title={`${themeShortLabel(d.theme_id)}: ${d.count} undangan`}>
          <p className="text-xs text-neutral-600">{themeShortLabel(d.theme_id)}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <div
              className="h-3 shrink-0 rounded-r"
              style={{
                // maks 85% supaya angka di ujung bar selalu kebagian tempat
                width: `${Math.max(1.5, (d.count / max) * 85)}%`,
                backgroundColor: VIZ_SERIES_1,
              }}
            />
            <span className="text-xs font-medium text-neutral-700">{d.count}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Satu stacked bar proporsi kehadiran + legend berisi nilai (part-to-whole). */
function RsvpBreakdown({ stats }: { stats: AdminStats }) {
  if (stats.total_rsvp === 0) {
    return <p className="text-sm text-neutral-500">Belum ada RSVP yang masuk dari tamu.</p>;
  }

  const segments = [
    { key: 'Hadir', value: stats.rsvp_attending, color: VIZ_SERIES_1 },
    { key: 'Tidak Hadir', value: stats.rsvp_not_attending, color: VIZ_SERIES_2 },
    { key: 'Ragu-ragu', value: stats.rsvp_maybe, color: VIZ_SERIES_3 },
  ];

  return (
    <div>
      {/* gap-0.5 = celah 2px warna surface antar segmen (pemisah tanpa border) */}
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded">
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <div
              key={segment.key}
              title={`${segment.key}: ${segment.value}`}
              style={{ flexGrow: segment.value, flexBasis: 0, backgroundColor: segment.color }}
            />
          ))}
      </div>
      <ul className="mt-4 space-y-2">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-neutral-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.key}
            </span>
            <span className="font-medium text-neutral-800">
              {segment.value.toLocaleString('id-ID')}
              <span className="ml-1.5 text-xs font-normal text-neutral-400">
                ({Math.round((segment.value / stats.total_rsvp) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExpiringList({ items }: { items: ExpiringWedding[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Tidak ada undangan yang masa aktifnya berakhir dalam 14 hari ke depan.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100">
      {items.map((item) => {
        const days = daysUntil(item.active_until);
        return (
          <li key={item.subdomain_slug} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm text-neutral-800">
                {item.groom_name} &amp; {item.bride_name}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {item.subdomain_slug} · s.d. {formatWibDate(item.active_until)}
                {!item.is_published && ' · Draft'}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                days <= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {days === 0 ? 'berakhir hari ini' : `${days} hari lagi`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function DashboardTab({ authHeader, onUnauthorized }: TabProps) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = (mode: 'initial' | 'refresh') => {
    if (mode === 'refresh') setIsRefreshing(true);
    else setStatus('loading');

    fetchAdminStats(authHeader)
      .then((data) => {
        setStats(data);
        setStatus('loaded');
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized();
          return;
        }
        if (mode === 'initial') setStatus('error');
        else alert('Gagal memuat ulang statistik');
      })
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    load('initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeader]);

  if (status === 'loading') {
    return <p className="text-sm text-neutral-500">Memuat statistik platform...</p>;
  }

  if (status === 'error' || !stats) {
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Gagal memuat statistik platform.</p>;
  }

  const attendingPct =
    stats.total_rsvp > 0 ? Math.round((stats.rsvp_attending / stats.total_rsvp) * 100) : 0;

  return (
    // Saat refresh, render lama ditahan dengan opacity turun -- tidak ada
    // flash "Memuat..." yang bikin layout lompat.
    <div className={`space-y-6 transition-opacity ${isRefreshing ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">Agregat seluruh platform (bukan per halaman).</p>
        <button
          type="button"
          onClick={() => load('refresh')}
          disabled={isRefreshing}
          className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-neutral-400 transition disabled:opacity-50"
        >
          {isRefreshing ? 'Memuat...' : 'Muat Ulang'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile
          label="Total Undangan"
          value={stats.total_weddings}
          sub={`+${stats.new_last_30d} dalam 30 hari terakhir`}
          subTone={stats.new_last_30d > 0 ? 'up' : 'muted'}
        />
        <StatTile label="Publish" value={stats.published} sub="tayang untuk tamu" />
        <StatTile label="Draft" value={stats.draft} sub="belum dipublish" />
        <StatTile
          label="Kedaluwarsa"
          value={stats.expired}
          sub={stats.expired > 0 ? 'tawarkan perpanjangan' : 'semua masa aktif aman'}
          subTone={stats.expired > 0 ? 'warn' : 'muted'}
        />
        <StatTile
          label="Total RSVP"
          value={stats.total_rsvp}
          sub={`+${stats.rsvp_last_7d} dalam 7 hari terakhir`}
          subTone={stats.rsvp_last_7d > 0 ? 'up' : 'muted'}
        />
        <StatTile
          label="Konfirmasi Hadir"
          value={stats.rsvp_attending}
          sub={stats.total_rsvp > 0 ? `${attendingPct}% dari total RSVP` : 'belum ada RSVP'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Undangan Baru per Bulan" subtitle="6 bulan kalender terakhir (WIB)">
          <MonthlyChart data={stats.monthly_new} />
        </ChartCard>
        <ChartCard title="Distribusi Tema" subtitle="Jumlah undangan per tema — kelihatan tema mana yang laris">
          <ThemeBars data={stats.theme_distribution} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="RSVP Tamu" subtitle="Konfirmasi kehadiran lintas semua undangan">
          <RsvpBreakdown stats={stats} />
        </ChartCard>
        <ChartCard title="Segera Berakhir" subtitle="Masa aktif habis ≤ 14 hari ke depan — bahan follow-up perpanjangan">
          <ExpiringList items={stats.expiring_soon} />
        </ChartCard>
      </div>
    </div>
  );
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
  // Undangan baru selalu lahir sebagai Draft (tamu dapat 404 sampai
  // dipublish) -- state ini untuk tombol "Publish Sekarang" di kotak hasil.
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const wedding = await createWedding({ groomName, brideName, themeId }, authHeader);
      setResult(wedding);
      setIsPublished(wedding.is_published);
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

  const handlePublishNow = async () => {
    if (!result) return;
    setIsPublishing(true);
    try {
      await setWeddingPublished(authHeader, result.subdomain_slug, true);
      setIsPublished(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      alert(error instanceof ApiError ? error.message : 'Gagal mem-publish undangan');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReset = () => {
    setGroomName('');
    setBrideName('');
    setThemeId(THEME_OPTIONS[0].id);
    setResult(null);
    setIsPublished(false);
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

          {/* Tanpa penjelasan ini, admin buka Invite URL lalu bingung kenapa
              404 -- undangan baru memang Draft sampai dipublish. */}
          {isPublished ? (
            <p className="rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-800">
              ✓ Sudah <strong>Publish</strong> — Invite URL bisa dibuka tamu.
            </p>
          ) : (
            <div className="space-y-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <p className="text-sm text-amber-800">
                Status masih <strong>Draft</strong> — Invite URL akan menampilkan &ldquo;tidak
                ditemukan&rdquo; ke tamu sampai di-publish. Gunakan <strong>Link Editor</strong> untuk
                melihat &amp; mengisi undangan lebih dulu.
              </p>
              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isPublishing}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition disabled:opacity-50"
              >
                {isPublishing ? 'Mem-publish...' : 'Publish Sekarang'}
              </button>
            </div>
          )}

          <CopyableField label="Subdomain Slug" value={result.subdomain_slug} />
          <CopyableField label="Access Token" value={result.access_token} />
          <CopyableField
            label="Link Editor (untuk pasangan, bisa dibuka walau Draft)"
            value={buildEditUrl(result.subdomain_slug, result.access_token)}
          />
          <CopyableField label="Invite URL (untuk tamu, setelah Publish)" value={buildInviteUrl(result.subdomain_slug)} />

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

const WEDDINGS_PER_PAGE = 10;

/** "2027-12-31T16:59:59Z" (instant) -> "YYYY-MM-DD" tanggal WIB untuk <input type="date">. */
function toWibDateInputValue(iso: string | null): string {
  if (!iso) return '';
  const wib = new Date(new Date(iso).getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

function isExpired(activeUntil: string | null): boolean {
  return activeUntil !== null && new Date(activeUntil).getTime() < Date.now();
}

function WeddingsTab({ authHeader, onUnauthorized }: TabProps) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [weddings, setWeddings] = useState<WeddingSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  // Slug yang requestnya sedang berjalan (publish/hapus/masa aktif) -- disable kontrolnya.
  const [busySlug, setBusySlug] = useState<string | null>(null);
  // Draft nilai <input type="date"> masa aktif per slug (belum tersimpan).
  const [activeUntilDrafts, setActiveUntilDrafts] = useState<Record<string, string>>({});

  const totalPages = Math.max(1, Math.ceil(total / WEDDINGS_PER_PAGE));

  const loadPage = (targetPage: number) => {
    setStatus('loading');
    fetchAdminWeddings(authHeader, targetPage, WEDDINGS_PER_PAGE)
      .then((data) => {
        setWeddings(data.weddings);
        setTotal(data.total);
        setPage(data.page);
        setActiveUntilDrafts({});
        setStatus('loaded');
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized();
          return;
        }
        setStatus('error');
      });
  };

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeader]);

  const runRowAction = async (slug: string, action: () => Promise<void>) => {
    setBusySlug(slug);
    try {
      await action();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      alert(error instanceof ApiError ? error.message : 'Terjadi kesalahan tak terduga');
    } finally {
      setBusySlug(null);
    }
  };

  const handleTogglePublish = (wedding: WeddingSummary) =>
    runRowAction(wedding.subdomain_slug, async () => {
      await setWeddingPublished(authHeader, wedding.subdomain_slug, !wedding.is_published);
      setWeddings((prev) =>
        prev.map((w) =>
          w.subdomain_slug === wedding.subdomain_slug ? { ...w, is_published: !w.is_published } : w,
        ),
      );
    });

  const handleDelete = (wedding: WeddingSummary) => {
    const confirmed = window.confirm(
      `Hapus undangan ${wedding.groom_name} & ${wedding.bride_name} (${wedding.subdomain_slug})?\n` +
        'Semua data (RSVP, foto, love story) ikut terhapus PERMANEN.',
    );
    if (!confirmed) return;

    void runRowAction(wedding.subdomain_slug, async () => {
      await deleteWedding(authHeader, wedding.subdomain_slug);
      loadPage(weddings.length === 1 && page > 1 ? page - 1 : page);
    });
  };

  const handleSaveActiveUntil = (wedding: WeddingSummary) => {
    const draft = activeUntilDrafts[wedding.subdomain_slug] ?? toWibDateInputValue(wedding.active_until);
    void runRowAction(wedding.subdomain_slug, async () => {
      const updated = await setWeddingActiveUntil(authHeader, wedding.subdomain_slug, draft || null);
      setWeddings((prev) =>
        prev.map((w) => (w.subdomain_slug === wedding.subdomain_slug ? updated : w)),
      );
      setActiveUntilDrafts((prev) => {
        const next = { ...prev };
        delete next[wedding.subdomain_slug];
        return next;
      });
    });
  };

  // Search & filter berlaku di halaman yang sedang dimuat (bukan lintas halaman).
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
        <StatCard label="Total Wedding" value={total} />
        <StatCard label="Publish (hal. ini)" value={stats.published} />
        <StatCard label="Draft (hal. ini)" value={stats.draft} />
        <StatCard label="RSVP (hal. ini)" value={stats.totalRsvp} />
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
                <th className="px-4 py-3 text-left font-medium text-neutral-600">Masa Aktif</th>
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
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(wedding)}
                        disabled={busySlug === wedding.subdomain_slug}
                        title={wedding.is_published ? 'Klik untuk jadikan Draft' : 'Klik untuk Publish'}
                        className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium transition disabled:opacity-50 ${
                          wedding.is_published
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {busySlug === wedding.subdomain_slug
                          ? '...'
                          : wedding.is_published
                            ? 'Publish'
                            : 'Draft'}
                      </button>
                      {isExpired(wedding.active_until) && (
                        <span className="w-fit rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Kedaluwarsa
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={
                          activeUntilDrafts[wedding.subdomain_slug] ??
                          toWibDateInputValue(wedding.active_until)
                        }
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          setActiveUntilDrafts((prev) => ({
                            ...prev,
                            [wedding.subdomain_slug]: event.target.value,
                          }))
                        }
                        title="Kosongkan lalu Set = tanpa batas"
                        className="rounded-md border border-neutral-200 px-1.5 py-1 text-xs text-neutral-600 focus:border-neutral-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveActiveUntil(wedding)}
                        disabled={busySlug === wedding.subdomain_slug}
                        className="rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition disabled:opacity-50"
                      >
                        Set
                      </button>
                    </div>
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
                      <button
                        type="button"
                        onClick={() => handleDelete(wedding)}
                        disabled={busySlug === wedding.subdomain_slug}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:border-red-400 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Halaman {page} dari {totalPages} — {total} undangan
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadPage(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-neutral-400 transition disabled:opacity-40"
            >
              ‹ Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => loadPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-neutral-400 transition disabled:opacity-40"
            >
              Berikutnya ›
            </button>
          </div>
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
  // Track yang sedang diedit judul/artisnya (inline), plus nilai draft-nya.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const startEdit = (track: MusicTrack) => {
    setEditingId(track.id);
    setEditTitle(track.title);
    setEditArtist(track.artist ?? '');
  };

  const handleSaveEdit = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await updateMusicTrack(authHeader, id, { title: editTitle, artist: editArtist });
      setTracks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      alert(error instanceof ApiError ? error.message : 'Gagal menyimpan lagu');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteTrack = async (track: MusicTrack) => {
    const confirmed = window.confirm(
      `Hapus lagu "${track.title}" dari library?\n` +
        'Undangan yang sedang memakai lagu ini otomatis jadi tanpa musik.',
    );
    if (!confirmed) return;

    setBusyId(track.id);
    try {
      await deleteMusicTrack(authHeader, track.id);
      setTracks((prev) => prev.filter((t) => t.id !== track.id));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
        return;
      }
      alert(error instanceof ApiError ? error.message : 'Gagal menghapus lagu');
    } finally {
      setBusyId(null);
    }
  };

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
                {editingId === track.id ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setEditTitle(event.target.value)}
                      placeholder="Judul"
                      className="flex-1 min-w-40 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={editArtist}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setEditArtist(event.target.value)}
                      placeholder="Artis (opsional)"
                      className="flex-1 min-w-32 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm focus:border-neutral-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(track.id)}
                      disabled={busyId === track.id || !editTitle.trim()}
                      className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 transition disabled:opacity-50"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:border-neutral-400 transition"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-neutral-800">
                      {track.title}
                      {track.artist ? <span className="text-neutral-500"> — {track.artist}</span> : null}
                    </p>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(track)}
                        className="rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTrack(track)}
                        disabled={busyId === track.id}
                        className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:border-red-400 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
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
    shopee_url: '',
    tokopedia_url: '',
    tiktok_url: '',
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
        shopee_url: form.shopee_url || null,
        tokopedia_url: form.tokopedia_url || null,
        tiktok_url: form.tiktok_url || null,
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

      <div className="border-t border-neutral-100 pt-4">
        <p className="text-sm font-semibold text-neutral-800">Link Toko (Landing Page)</p>
        <p className="mt-1 text-xs text-neutral-500">
          Tombol pemesanan di landing page — hanya yang diisi yang tampil.
        </p>
      </div>

      <div>
        <label htmlFor="shopee_url" className="block text-xs font-medium text-neutral-600">
          Link Shopee
        </label>
        <input
          id="shopee_url"
          type="url"
          placeholder="https://shopee.co.id/..."
          value={form.shopee_url ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => updateField('shopee_url', event.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tokopedia_url" className="block text-xs font-medium text-neutral-600">
          Link Tokopedia
        </label>
        <input
          id="tokopedia_url"
          type="url"
          placeholder="https://www.tokopedia.com/..."
          value={form.tokopedia_url ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            updateField('tokopedia_url', event.target.value)
          }
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="tiktok_url" className="block text-xs font-medium text-neutral-600">
          Link TikTok
        </label>
        <input
          id="tiktok_url"
          type="url"
          placeholder="https://www.tiktok.com/@..."
          value={form.tiktok_url ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => updateField('tiktok_url', event.target.value)}
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

type TabKey = 'dashboard' | 'generate' | 'weddings' | 'musik' | 'settings';

const TABS: { key: TabKey; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Monitoring ringkas seluruh platform' },
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
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
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
            {activeTab === 'dashboard' && <DashboardTab {...tabProps} />}
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
