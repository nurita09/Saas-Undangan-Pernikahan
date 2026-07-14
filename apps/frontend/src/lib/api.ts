import type {
  WeddingData,
  CreateWeddingPayload,
  CreateWeddingResponse,
  WeddingEditData,
  UpdateWeddingPayload,
  UploadResponse,
  AdminLoginPayload,
  MusicTrack,
  WeddingSummary,
  ContactSettings,
  UpdateSettingsPayload,
} from '../types/wedding';

// Semua request pakai path RELATIF ("/api/...") -- bukan URL absolut ke backend.
// Di dev, Vite proxy meneruskan Host header asli browser ke backend Rust (lihat
// vite.config.ts), dan di production frontend + backend disajikan dari domain
// tenant yang sama. Dengan begitu backend selalu menerima Host header yang benar
// untuk resolusi subdomain, tanpa perlu CORS maupun header kustom.

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** accessToken opsional: dikirim sebagai header X-Access-Token supaya pasangan
 *  bisa melihat preview undangannya sendiri yang masih draft (belum publish). */
export async function fetchWeddingDetails(accessToken?: string | null): Promise<WeddingData> {
  const response = await fetch('/api/wedding-details', {
    headers: accessToken ? { 'X-Access-Token': accessToken } : undefined,
  });

  if (response.status === 404) {
    throw new ApiError('Undangan tidak ditemukan', 404);
  }

  if (!response.ok) {
    throw new ApiError('Gagal mengambil data undangan', response.status);
  }

  return (await response.json()) as WeddingData;
}

interface CreateWeddingArgs {
  groomName: string;
  brideName: string;
  themeId: number;
}

interface ApiErrorBody {
  error: string;
}

export async function createWedding(
  { groomName, brideName, themeId }: CreateWeddingArgs,
  authHeader: string,
): Promise<CreateWeddingResponse> {
  const payload: CreateWeddingPayload = {
    groom_name: groomName,
    bride_name: brideName,
    theme_id: themeId,
  };

  const response = await fetch('/api/weddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify(payload),
  });

  const body: CreateWeddingResponse | ApiErrorBody | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const message = body && 'error' in body ? body.error : 'Gagal membuat undangan';
    throw new ApiError(message, response.status);
  }

  return body as CreateWeddingResponse;
}

// ---------------------------------------------------------------------------
// Admin login
// ---------------------------------------------------------------------------

export async function adminLogin(username: string, password: string): Promise<void> {
  const payload: AdminLoginPayload = { username, password };

  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError('Username atau password salah', response.status);
  }
}

// ---------------------------------------------------------------------------
// Editor berbasis token (Langkah 5)
// ---------------------------------------------------------------------------

export async function fetchEditAuth(slug: string, token: string): Promise<WeddingEditData> {
  // Token lewat header, bukan query string -- tidak nempel di access log server.
  const params = new URLSearchParams({ slug });
  const response = await fetch(`/api/wedding/edit-auth?${params.toString()}`, {
    headers: { 'X-Access-Token': token },
  });

  if (response.status === 401) {
    throw new ApiError('Token tidak valid', 401);
  }
  if (!response.ok) {
    throw new ApiError('Gagal memvalidasi token', response.status);
  }

  return (await response.json()) as WeddingEditData;
}

export async function updateWedding(
  token: string,
  payload: UpdateWeddingPayload,
): Promise<WeddingEditData> {
  const response = await fetch('/api/wedding/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': token,
    },
    body: JSON.stringify(payload),
  });

  const body: WeddingEditData | ApiErrorBody | null = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body && 'error' in body ? body.error : 'Gagal menyimpan perubahan';
    throw new ApiError(message, response.status);
  }

  return body as WeddingEditData;
}

export async function uploadPhoto(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  // JANGAN set Content-Type manual -- browser yang mengisi boundary multipart-nya.
  const response = await fetch('/api/wedding/upload', {
    method: 'POST',
    headers: { 'X-Access-Token': token },
    body: formData,
  });

  const body: UploadResponse | ApiErrorBody | null = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body && 'error' in body ? body.error : 'Gagal mengunggah foto';
    throw new ApiError(message, response.status);
  }

  return (body as UploadResponse).url;
}

// ---------------------------------------------------------------------------
// RSVP
// ---------------------------------------------------------------------------

export interface RsvpResponse {
  id: string;
  guest_name: string;
  attendance_status: string;
  message: string | null;
  created_at: string;
}

export async function submitRsvp(
  guestName: string,
  attendanceStatus: string,
  message: string | null,
): Promise<RsvpResponse> {
  const payload = {
    guest_name: guestName,
    attendance_status: attendanceStatus,
    message,
  };

  const response = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = body && 'error' in body ? body.error : 'Gagal mengirim ucapan';
    throw new ApiError(errorMsg, response.status);
  }

  return body as RsvpResponse;
}

export async function fetchRsvps(): Promise<RsvpResponse[]> {
  const response = await fetch('/api/rsvp');

  if (!response.ok) {
    throw new ApiError('Gagal mengambil daftar ucapan', response.status);
  }

  return (await response.json()) as RsvpResponse[];
}

// ---------------------------------------------------------------------------
// Musik (picker publik + kelola admin)
// ---------------------------------------------------------------------------

/** Publik -- dipakai picker lagu di WeddingEditor, tidak perlu login admin. */
export async function fetchMusicLibrary(): Promise<MusicTrack[]> {
  const response = await fetch('/api/music');

  if (!response.ok) {
    throw new ApiError('Gagal mengambil daftar lagu', response.status);
  }

  return (await response.json()) as MusicTrack[];
}

export async function uploadMusicTrack(
  authHeader: string,
  { title, artist, file }: { title: string; artist: string; file: File },
): Promise<MusicTrack> {
  const formData = new FormData();
  formData.append('title', title);
  if (artist) formData.append('artist', artist);
  formData.append('file', file);

  const response = await fetch('/api/admin/music', {
    method: 'POST',
    headers: { Authorization: `Basic ${authHeader}` },
    body: formData,
  });

  const body: MusicTrack | ApiErrorBody | null = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body && 'error' in body ? body.error : 'Gagal mengunggah lagu';
    throw new ApiError(message, response.status);
  }

  return body as MusicTrack;
}

// ---------------------------------------------------------------------------
// Admin: monitoring & setting global
// ---------------------------------------------------------------------------

export async function setWeddingPublished(
  authHeader: string,
  slug: string,
  isPublished: boolean,
): Promise<void> {
  const response = await fetch(`/api/admin/weddings/${encodeURIComponent(slug)}/publish`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({ is_published: isPublished }),
  });

  if (!response.ok) {
    const body: ApiErrorBody | null = await response.json().catch(() => null);
    const message = body && 'error' in body ? body.error : 'Gagal mengubah status publish';
    throw new ApiError(message, response.status);
  }
}

export async function fetchAdminWeddings(authHeader: string): Promise<WeddingSummary[]> {
  const response = await fetch('/api/admin/weddings', {
    headers: { Authorization: `Basic ${authHeader}` },
  });

  if (!response.ok) {
    throw new ApiError('Gagal mengambil daftar undangan', response.status);
  }

  return (await response.json()) as WeddingSummary[];
}

export async function fetchSettings(authHeader: string): Promise<ContactSettings> {
  const response = await fetch('/api/admin/settings', {
    headers: { Authorization: `Basic ${authHeader}` },
  });

  if (!response.ok) {
    throw new ApiError('Gagal mengambil pengaturan', response.status);
  }

  return (await response.json()) as ContactSettings;
}

export async function updateSettings(
  authHeader: string,
  payload: UpdateSettingsPayload,
): Promise<ContactSettings> {
  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify(payload),
  });

  const body: ContactSettings | ApiErrorBody | null = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body && 'error' in body ? body.error : 'Gagal menyimpan pengaturan';
    throw new ApiError(message, response.status);
  }

  return body as ContactSettings;
}

