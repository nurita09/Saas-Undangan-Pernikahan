import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { fetchEditAuth, fetchMusicLibrary, updateWedding, uploadPhoto, ApiError } from '../lib/api';
import { readAccessToken } from '../utils/token';
import { isVideoUrl } from '../utils/media';
import type { MusicTrack, WeddingEditData } from '../types/wedding';

interface WeddingEditorProps {
  slug: string;
}

const INPUT_CLASS =
  'mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none';
const LABEL_CLASS = 'block text-xs font-medium text-neutral-600';

// Selaras dengan batas render Theme1 & validasi backend (routes/wedding_edit.rs).
const MAX_LOVE_STORIES = 5;
const MAX_GALLERY_PHOTOS = 10;
const MAX_WEDDING_GIFTS = 4;

interface LoveStoryForm {
  date: string;
  description: string;
  photo_url: string;
}

interface GiftForm {
  gift_type: 'bank' | 'kado';
  bank_name: string;
  account_name: string;
  account_number: string;
}

interface EditorFormState {
  theme_id: number;
  groom_name: string;
  bride_name: string;
  // Warna tidak bisa diedit dari editor (warna tema dikunci bawaan). Tetap di
  // state supaya ikut terkirim apa adanya -- backend mewajibkan kedua field ini.
  primary_color: string;
  secondary_color: string;
  wedding_date: string;
  location_address: string;
  maps_url: string;
  cover_photo_url: string;
  section1_photo_url: string;
  section2_photo_url: string;
  quote_text: string;
  quote_source: string;
  groom_photo_url: string;
  bride_photo_url: string;
  groom_parents: string;
  bride_parents: string;
  groom_ig: string;
  bride_ig: string;
  akad_date: string;
  akad_location: string;
  akad_maps_url: string;
  resepsi_date: string;
  resepsi_location: string;
  resepsi_maps_url: string;
  gallery_video_url: string;
  love_stories: LoveStoryForm[];
  gallery_photos: string[];
  wedding_gifts: GiftForm[];
  music_url: string;
}

/**
 * ISO string dari backend ("2026-11-04T08:00:00Z") -> "YYYY-MM-DDTHH:MM" untuk
 * <input type="datetime-local">. Diambil literal (bukan lewat objek Date) karena
 * backend menyimpan jam apa adanya tanpa konversi timezone -- geser lewat Date()
 * di browser justru akan menggeser jamnya sesuai timezone lokal.
 */
function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

function toFormState(data: WeddingEditData): EditorFormState {
  return {
    theme_id: data.theme_id,
    groom_name: data.groom_name,
    bride_name: data.bride_name,
    primary_color: data.primary_color,
    secondary_color: data.secondary_color,
    wedding_date: toDatetimeLocalValue(data.wedding_date),
    location_address: data.location_address ?? '',
    maps_url: data.maps_url ?? '',
    cover_photo_url: data.cover_photo_url ?? '',
    section1_photo_url: data.theme_settings?.section1_photo_url ?? '',
    section2_photo_url: data.theme_settings?.section2_photo_url ?? '',
    quote_text: data.theme_settings?.quote_text ?? '',
    quote_source: data.theme_settings?.quote_source ?? '',
    groom_photo_url: data.groom_photo_url ?? '',
    bride_photo_url: data.bride_photo_url ?? '',
    groom_parents: data.groom_parents ?? '',
    bride_parents: data.bride_parents ?? '',
    groom_ig: data.groom_ig ?? '',
    bride_ig: data.bride_ig ?? '',
    akad_date: toDatetimeLocalValue(data.akad_date),
    akad_location: data.akad_location ?? '',
    akad_maps_url: data.akad_maps_url ?? '',
    resepsi_date: toDatetimeLocalValue(data.resepsi_date),
    resepsi_location: data.resepsi_location ?? '',
    resepsi_maps_url: data.resepsi_maps_url ?? '',
    gallery_video_url: data.gallery_video_url ?? '',
    love_stories: data.love_stories.map((story) => ({
      date: story.date ?? '',
      description: story.description ?? '',
      photo_url: story.photo_url ?? '',
    })),
    gallery_photos: [...data.gallery_photos],
    wedding_gifts: data.wedding_gifts.map((gift) => ({
      gift_type: gift.gift_type === 'kado' ? 'kado' : 'bank',
      bank_name: gift.bank_name ?? '',
      account_name: gift.account_name ?? '',
      account_number: gift.account_number ?? '',
    })),
    music_url: data.music_url ?? '',
  };
}

function canEditQuotePhoto(themeId: number): boolean {
  return themeId >= 2 && themeId <= 5;
}

type AuthState = 'checking' | 'denied' | 'authorized';
type SaveState = 'idle' | 'saving' | 'success' | 'error';
type UploadState = 'idle' | 'uploading' | 'error';

/** Bagian undangan yang bisa diedit -- dipetakan ke section di Theme1. */
type SectionKey = 'cover' | 'ayat' | 'pengantin' | 'acara' | 'story' | 'galeri' | 'gift' | 'musik';

const SECTIONS: { key: SectionKey; label: string; hint: string }[] = [
  { key: 'cover', label: 'Cover', hint: 'Nama pengantin & foto utama' },
  { key: 'ayat', label: '1 · Kutipan', hint: 'Foto, teks kutipan & sumbernya' },
  { key: 'pengantin', label: '2 · Pengantin', hint: 'Foto, orang tua & Instagram' },
  { key: 'acara', label: '3 · Acara', hint: 'Tanggal, akad, resepsi & foto' },
  { key: 'story', label: '4 · Love Story', hint: 'Timeline kisah cinta' },
  { key: 'galeri', label: '5 · Galeri', hint: 'Foto-foto & video YouTube' },
  { key: 'gift', label: '6 · Gift', hint: 'Rekening & alamat kado' },
  { key: 'musik', label: 'Musik', hint: 'Lagu latar undangan' },
];

interface PhotoFieldProps {
  label: string;
  photoUrl: string;
  uploadState: UploadState;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
  /** Kalau true, field ini juga menerima video (dipakai cover -- lihat
   *  routes/wedding_edit.rs upload_photo: video disimpan mentah MP4/WEBM,
   *  tanpa resize/re-encode seperti foto). */
  allowVideo?: boolean;
}

function PhotoField({
  label,
  photoUrl,
  uploadState,
  onSelect,
  compact = false,
  allowVideo = false,
}: PhotoFieldProps) {
  const previewIsVideo = allowVideo && isVideoUrl(photoUrl);
  const previewClass = `${compact ? 'h-24' : 'h-40'} w-full rounded-lg object-cover`;

  return (
    <div className="space-y-2">
      <p className={LABEL_CLASS}>{label}</p>

      {photoUrl &&
        (previewIsVideo ? (
          <video
            src={photoUrl}
            controls
            muted
            loop
            className={`${previewClass} bg-black`}
          />
        ) : (
          <img src={photoUrl} alt={`Pratinjau ${label}`} className={previewClass} />
        ))}

      <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400">
        {uploadState === 'uploading' ? 'Mengunggah...' : allowVideo ? 'Pilih Foto/Video' : 'Pilih Foto'}
        <input
          type="file"
          accept={
            allowVideo
              ? 'image/jpeg,image/png,image/webp,video/mp4,video/webm'
              : 'image/jpeg,image/png,image/webp'
          }
          onChange={onSelect}
          className="hidden"
        />
      </label>
      {allowVideo && (
        <p className="text-xs text-neutral-400">
          Foto: JPEG/PNG/WEBP maks 10MB. Video: MP4/WEBM maks 20MB, akan diputar tanpa suara &amp;
          diulang otomatis.
        </p>
      )}
    </div>
  );
}

export default function WeddingEditor({ slug }: WeddingEditorProps) {
  // Fragment (#token=...) lebih aman dari query string; link lama ?token= tetap didukung.
  const token = readAccessToken();

  const [authState, setAuthState] = useState<AuthState>('checking');
  const [form, setForm] = useState<EditorFormState | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [galleryUploadMessage, setGalleryUploadMessage] = useState('');
  const [musicLibrary, setMusicLibrary] = useState<MusicTrack[]>([]);
  const [activeSection, setActiveSection] = useState<SectionKey>('cover');
  // Nomor versi preview: dinaikkan setiap simpan sukses supaya iframe di-mount
  // ulang (key berubah) dan memuat data terbaru dari API.
  const [previewVersion, setPreviewVersion] = useState(0);
  // Versi data untuk optimistic locking -- dikirim balik saat simpan; kalau
  // sudah basi (ada simpanan dari tab lain), backend menolak 409.
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setAuthState('denied');
      return;
    }

    fetchEditAuth(slug, token)
      .then((data) => {
        setForm(toFormState(data));
        setUpdatedAt(data.updated_at);
        setAuthState('authorized');
      })
      .catch(() => setAuthState('denied'));
  }, [slug, token]);

  // Daftar lagu bersifat publik (dipakai lintas wedding), jadi tidak perlu
  // menunggu authState -- ambil begitu editor dibuka.
  useEffect(() => {
    fetchMusicLibrary()
      .then(setMusicLibrary)
      .catch(() => setMusicLibrary([]));
  }, []);

  const updateField = (field: keyof EditorFormState, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateStory = (index: number, field: keyof LoveStoryForm, value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const love_stories = prev.love_stories.map((story, i) =>
        i === index ? { ...story, [field]: value } : story,
      );
      return { ...prev, love_stories };
    });
  };

  const addStory = () => {
    setForm((prev) => {
      if (!prev || prev.love_stories.length >= MAX_LOVE_STORIES) return prev;
      return {
        ...prev,
        love_stories: [...prev.love_stories, { date: '', description: '', photo_url: '' }],
      };
    });
  };

  const removeStory = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, love_stories: prev.love_stories.filter((_, i) => i !== index) };
    });
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, gallery_photos: prev.gallery_photos.filter((_, i) => i !== index) };
    });
  };

  const moveGalleryPhoto = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      if (!prev) return prev;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.gallery_photos.length) return prev;

      const gallery_photos = [...prev.gallery_photos];
      [gallery_photos[index], gallery_photos[targetIndex]] = [
        gallery_photos[targetIndex],
        gallery_photos[index],
      ];
      return { ...prev, gallery_photos };
    });
  };

  const moveGalleryPhotoToFront = (index: number) => {
    setForm((prev) => {
      if (!prev || index <= 0) return prev;
      const gallery_photos = [...prev.gallery_photos];
      const [photo] = gallery_photos.splice(index, 1);
      gallery_photos.unshift(photo);
      return { ...prev, gallery_photos };
    });
  };

  const updateGift = (index: number, field: keyof GiftForm, value: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const wedding_gifts = prev.wedding_gifts.map((gift, i) =>
        i === index ? { ...gift, [field]: value } : gift,
      );
      return { ...prev, wedding_gifts };
    });
  };

  const addGift = () => {
    setForm((prev) => {
      if (!prev || prev.wedding_gifts.length >= MAX_WEDDING_GIFTS) return prev;
      return {
        ...prev,
        wedding_gifts: [
          ...prev.wedding_gifts,
          { gift_type: 'bank', bank_name: '', account_name: '', account_number: '' },
        ],
      };
    });
  };

  const removeGift = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, wedding_gifts: prev.wedding_gifts.filter((_, i) => i !== index) };
    });
  };

  /** Upload foto lalu simpan URL-nya lewat callback -- dipakai field scalar
   *  maupun item array (love story, galeri). */
  const uploadThen = async (event: ChangeEvent<HTMLInputElement>, apply: (url: string) => void) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !token) return;

    setUploadState('uploading');
    try {
      const url = await uploadPhoto(token, file);
      apply(url);
      setUploadState('idle');
    } catch {
      setUploadState('error');
    }
  };

  const uploadGalleryPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length || !token || !form) return;

    const remainingSlots = MAX_GALLERY_PHOTOS - form.gallery_photos.length;
    if (remainingSlots <= 0) return;

    const selectedFiles = files.slice(0, remainingSlots);
    setGalleryUploadMessage(
      files.length > remainingSlots
        ? `Hanya ${remainingSlots} foto pertama yang diunggah karena batas maksimal ${MAX_GALLERY_PHOTOS} foto.`
        : '',
    );
    setUploadState('uploading');

    try {
      const uploadedUrls = await Promise.all(selectedFiles.map((file) => uploadPhoto(token, file)));
      setForm((prev) =>
        prev
          ? {
              ...prev,
              gallery_photos: [...prev.gallery_photos, ...uploadedUrls].slice(0, MAX_GALLERY_PHOTOS),
            }
          : prev,
      );
      setUploadState('idle');
    } catch {
      setUploadState('error');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !form) return;

    setSaveState('saving');
    setSaveMessage('');

    // Baris yang seluruh isinya kosong tidak usah dikirim -- menghindari
    // menyimpan entri hampa yang cuma bikin section tampil aneh.
    const loveStories = form.love_stories
      .filter((s) => s.date.trim() || s.description.trim() || s.photo_url)
      .map((s) => ({
        date: s.date.trim() || null,
        description: s.description.trim() || null,
        photo_url: s.photo_url || null,
      }));

    const weddingGifts = form.wedding_gifts
      .filter((g) => g.bank_name.trim() || g.account_name.trim() || g.account_number.trim())
      .map((g) => ({
        gift_type: g.gift_type,
        bank_name: g.bank_name.trim() || null,
        account_name: g.account_name.trim() || null,
        account_number: g.account_number.trim() || null,
      }));

    try {
      const updated = await updateWedding(token, {
        groom_name: form.groom_name,
        bride_name: form.bride_name,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        wedding_date: form.wedding_date || null,
        location_address: form.location_address || null,
        maps_url: form.maps_url || null,
        cover_photo_url: form.cover_photo_url || null,
        music_url: form.music_url || null,
        groom_photo_url: form.groom_photo_url || null,
        bride_photo_url: form.bride_photo_url || null,
        groom_parents: form.groom_parents || null,
        bride_parents: form.bride_parents || null,
        groom_ig: form.groom_ig || null,
        bride_ig: form.bride_ig || null,
        akad_date: form.akad_date || null,
        akad_location: form.akad_location || null,
        akad_maps_url: form.akad_maps_url || null,
        resepsi_date: form.resepsi_date || null,
        resepsi_location: form.resepsi_location || null,
        resepsi_maps_url: form.resepsi_maps_url || null,
        gallery_video_url: form.gallery_video_url || null,
        expected_updated_at: updatedAt,
        theme_settings: {
          section1_photo_url: form.section1_photo_url || null,
          section2_photo_url: form.section2_photo_url || null,
          quote_text: form.quote_text.trim() || null,
          quote_source: form.quote_source.trim() || null,
        },
        love_stories: loveStories,
        gallery_photos: form.gallery_photos,
        wedding_gifts: weddingGifts,
      });
      setForm(toFormState(updated));
      setUpdatedAt(updated.updated_at);
      setSaveState('success');
      setPreviewVersion((v) => v + 1);
    } catch (error) {
      setSaveMessage(error instanceof ApiError ? error.message : 'Terjadi kesalahan tak terduga');
      setSaveState('error');
    }
  };

  if (authState === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBF2]">
        <p className="text-sm tracking-widest uppercase text-neutral-400">Memeriksa akses...</p>
      </div>
    );
  }

  if (authState === 'denied') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF2] px-6 text-center">
        <p className="text-5xl">🔒</p>
        <h1 className="mt-6 font-serif text-2xl text-neutral-800">Akses Ditolak: Token Tidak Valid</h1>
        <p className="mt-3 max-w-sm text-sm text-neutral-500">
          Pastikan kamu membuka tautan editor lengkap dengan token yang benar (mis.
          <span className="whitespace-nowrap"> ?token=xxxx</span>).
        </p>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="flex min-h-screen bg-[#FFFBF2]">
      {/* ===== Panel kiri: preview undangan dalam frame HP ===== */}
      {/* iframe menunjuk ke "/" di subdomain yang sama (halaman undangan asli),
          jadi preview 100% identik dengan yang dilihat tamu -- termasuk animasi.
          Yang tampil adalah data TERSIMPAN; setiap simpan sukses, key berubah
          dan iframe dimuat ulang. */}
      <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-0 lg:h-screen items-center justify-center bg-neutral-100 px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[min(82vh,780px)] aspect-[9/19] overflow-hidden rounded-[2.8rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl">
            <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
            {/* Token dibawa di fragment supaya preview tetap jalan walau undangan
                masih draft (belum publish) -- fragment tidak dikirim ke server. */}
            <iframe
              key={previewVersion}
              src={`/#token=${token ?? ''}`}
              title="Preview undangan"
              className="h-full w-full rounded-[2rem] bg-white"
            />
          </div>
          <p className="text-xs text-neutral-400">
            Preview data tersimpan — muat ulang otomatis setiap kali kamu menyimpan.
          </p>
        </div>
      </div>

      {/* ===== Panel kanan: editor per-section ===== */}
      <div className="w-full lg:w-[460px] lg:shrink-0 overflow-y-auto px-6 py-10 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C7A97E]">Editor Undangan</p>
        <h1 className="mt-2 font-serif text-3xl text-neutral-800">
          {form.groom_name} &amp; {form.bride_name}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Pilih bagian yang ingin diubah, lalu simpan — preview di kiri ikut diperbarui.
        </p>

        {/* Navigasi section */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${activeSection === section.key
                ? 'border-[#8B4513] bg-[#8B4513] text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                }`}
            >
              <span className="block text-sm font-medium">{section.label}</span>
              <span
                className={`mt-0.5 block text-[11px] leading-tight ${activeSection === section.key ? 'text-white/80' : 'text-neutral-400'
                  }`}
              >
                {section.hint}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-8 rounded-2xl bg-white p-6 shadow-sm">
          {/* ===== Cover ===== */}
          {activeSection === 'cover' && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-neutral-800">Cover</legend>
              <div>
                <label htmlFor="groom_name" className={LABEL_CLASS}>
                  Pengantin Pria
                </label>
                <input
                  id="groom_name"
                  type="text"
                  required
                  value={form.groom_name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('groom_name', e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="bride_name" className={LABEL_CLASS}>
                  Pengantin Wanita
                </label>
                <input
                  id="bride_name"
                  type="text"
                  required
                  value={form.bride_name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('bride_name', e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <PhotoField
                label="Foto/Video Cover Utama (lingkaran di cover & panel kiri undangan)"
                photoUrl={form.cover_photo_url}
                uploadState={uploadState}
                onSelect={(e) => uploadThen(e, (url) => updateField('cover_photo_url', url))}
                allowVideo
              />
            </fieldset>
          )}

          {/* ===== Section 1: Kutipan / Ayat ===== */}
          {activeSection === 'ayat' && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-neutral-800">Section 1 · Kutipan</legend>
              <div>
                <label htmlFor="quote_text" className={LABEL_CLASS}>
                  Teks Kutipan
                </label>
                <textarea
                  id="quote_text"
                  rows={5}
                  value={form.quote_text}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField('quote_text', e.target.value)}
                  placeholder="Kosongkan untuk memakai bawaan (Qs. Ar-Rum: 21). Bisa diganti ayat kitab lain, puisi, atau kata-kata sendiri."
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="quote_source" className={LABEL_CLASS}>
                  Sumber Kutipan
                </label>
                <input
                  id="quote_source"
                  type="text"
                  value={form.quote_source}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('quote_source', e.target.value)}
                  placeholder="mis. Qs. Ar-Rum: 21 / 1 Korintus 13:4 / Anonim"
                  className={INPUT_CLASS}
                />
              </div>

              {canEditQuotePhoto(form.theme_id) && (
                <PhotoField
                  label="Foto di card kutipan (rasio potret 4:5 paling pas)"
                  photoUrl={form.section1_photo_url}
                  uploadState={uploadState}
                  onSelect={(e) => uploadThen(e, (url) => updateField('section1_photo_url', url))}
                />
              )}
            </fieldset>
          )}

          {/* ===== Section 2: Pengantin ===== */}
          {activeSection === 'pengantin' && (
            <fieldset className="space-y-6">
              <legend className="text-sm font-semibold text-neutral-800">Section 2 · Pengantin</legend>

              <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">The Bride</p>
                <PhotoField
                  label="Foto Pengantin Wanita"
                  photoUrl={form.bride_photo_url}
                  uploadState={uploadState}
                  onSelect={(e) => uploadThen(e, (url) => updateField('bride_photo_url', url))}
                  compact
                />
                <div>
                  <label htmlFor="bride_parents" className={LABEL_CLASS}>
                    Keterangan Orang Tua
                  </label>
                  <textarea
                    id="bride_parents"
                    rows={2}
                    value={form.bride_parents}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateField('bride_parents', e.target.value)
                    }
                    placeholder="Putri dari Bapak ... & Ibu ..."
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="bride_ig" className={LABEL_CLASS}>
                    Instagram
                  </label>
                  <input
                    id="bride_ig"
                    type="text"
                    value={form.bride_ig}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('bride_ig', e.target.value)}
                    placeholder="@username"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">The Groom</p>
                <PhotoField
                  label="Foto Pengantin Pria"
                  photoUrl={form.groom_photo_url}
                  uploadState={uploadState}
                  onSelect={(e) => uploadThen(e, (url) => updateField('groom_photo_url', url))}
                  compact
                />
                <div>
                  <label htmlFor="groom_parents" className={LABEL_CLASS}>
                    Keterangan Orang Tua
                  </label>
                  <textarea
                    id="groom_parents"
                    rows={2}
                    value={form.groom_parents}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateField('groom_parents', e.target.value)
                    }
                    placeholder="Putra dari Bapak ... & Ibu ..."
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="groom_ig" className={LABEL_CLASS}>
                    Instagram
                  </label>
                  <input
                    id="groom_ig"
                    type="text"
                    value={form.groom_ig}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('groom_ig', e.target.value)}
                    placeholder="@username"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* ===== Section 3: Acara ===== */}
          {activeSection === 'acara' && (
            <fieldset className="space-y-6">
              <legend className="text-sm font-semibold text-neutral-800">Section 3 · Acara</legend>

              <div className="space-y-4">
                <div>
                  <label htmlFor="wedding_date" className={LABEL_CLASS}>
                    Tanggal &amp; Waktu Utama (countdown &amp; cover)
                  </label>
                  <input
                    id="wedding_date"
                    type="datetime-local"
                    value={form.wedding_date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('wedding_date', e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="location_address" className={LABEL_CLASS}>
                    Alamat Lokasi Umum
                  </label>
                  <textarea
                    id="location_address"
                    rows={2}
                    value={form.location_address}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateField('location_address', e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="maps_url" className={LABEL_CLASS}>
                    Link Google Maps Umum
                  </label>
                  <input
                    id="maps_url"
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={form.maps_url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('maps_url', e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Akad Nikah (opsional — kalau kosong pakai data umum)
                </p>
                <div>
                  <label htmlFor="akad_date" className={LABEL_CLASS}>
                    Tanggal &amp; Waktu Akad
                  </label>
                  <input
                    id="akad_date"
                    type="datetime-local"
                    value={form.akad_date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('akad_date', e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="akad_location" className={LABEL_CLASS}>
                    Lokasi Akad
                  </label>
                  <textarea
                    id="akad_location"
                    rows={2}
                    value={form.akad_location}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateField('akad_location', e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="akad_maps_url" className={LABEL_CLASS}>
                    Link Google Maps Akad
                  </label>
                  <input
                    id="akad_maps_url"
                    type="url"
                    value={form.akad_maps_url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('akad_maps_url', e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Resepsi (opsional — kalau kosong pakai data umum)
                </p>
                <div>
                  <label htmlFor="resepsi_date" className={LABEL_CLASS}>
                    Tanggal &amp; Waktu Resepsi
                  </label>
                  <input
                    id="resepsi_date"
                    type="datetime-local"
                    value={form.resepsi_date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('resepsi_date', e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="resepsi_location" className={LABEL_CLASS}>
                    Lokasi Resepsi
                  </label>
                  <textarea
                    id="resepsi_location"
                    rows={2}
                    value={form.resepsi_location}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateField('resepsi_location', e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="resepsi_maps_url" className={LABEL_CLASS}>
                    Link Google Maps Resepsi
                  </label>
                  <input
                    id="resepsi_maps_url"
                    type="url"
                    value={form.resepsi_maps_url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateField('resepsi_maps_url', e.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <PhotoField
                label="Foto acara (thumbnail di card Akad Nikah & Resepsi)"
                photoUrl={form.section2_photo_url}
                uploadState={uploadState}
                onSelect={(e) => uploadThen(e, (url) => updateField('section2_photo_url', url))}
              />
            </fieldset>
          )}

          {/* ===== Section 4: Love Story ===== */}
          {activeSection === 'story' && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-neutral-800">Section 4 · Love Story</legend>

              {form.love_stories.length === 0 && (
                <p className="text-sm text-neutral-500">
                  Belum ada cerita — kalau dibiarkan kosong, undangan menampilkan contoh bawaan.
                </p>
              )}

              {form.love_stories.map((story, idx) => (
                <div key={idx} className="space-y-3 rounded-xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Cerita {idx + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeStory(idx)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Judul / Tanggal</label>
                    <input
                      type="text"
                      value={story.date}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateStory(idx, 'date', e.target.value)}
                      placeholder="mis. Januari 2020 — Pertama Bertemu"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Cerita</label>
                    <textarea
                      rows={3}
                      value={story.description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        updateStory(idx, 'description', e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <PhotoField
                    label="Foto (opsional)"
                    photoUrl={story.photo_url}
                    uploadState={uploadState}
                    onSelect={(e) => uploadThen(e, (url) => updateStory(idx, 'photo_url', url))}
                    compact
                  />
                </div>
              ))}

              {form.love_stories.length < MAX_LOVE_STORIES && (
                <button
                  type="button"
                  onClick={addStory}
                  className="w-full rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
                >
                  + Tambah Cerita ({form.love_stories.length}/{MAX_LOVE_STORIES})
                </button>
              )}
            </fieldset>
          )}

          {/* ===== Section 5: Galeri ===== */}
          {activeSection === 'galeri' && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-neutral-800">Section 5 · Galeri</legend>
              <p className="text-sm text-neutral-500">
                Urutan foto di bawah akan menjadi urutan tampil di undangan. Foto pertama tampil
                paling awal.
              </p>

              <div>
                <label htmlFor="gallery_video_url" className={LABEL_CLASS}>
                  Link Video YouTube (opsional)
                </label>
                <input
                  id="gallery_video_url"
                  type="url"
                  value={form.gallery_video_url}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateField('gallery_video_url', e.target.value)
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={INPUT_CLASS}
                />
              </div>

              {form.gallery_photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {form.gallery_photos.map((url, idx) => (
                    <div key={`${url}-${idx}`} className="rounded-xl border border-neutral-200 p-2">
                      <div className="relative">
                        <img
                          src={url}
                          alt={`Galeri ${idx + 1}`}
                          className="aspect-[3/4] w-full rounded-lg object-cover"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[0.65rem] font-semibold text-white">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGalleryPhoto(idx)}
                          aria-label={`Hapus foto galeri ${idx + 1}`}
                          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveGalleryPhoto(idx, -1)}
                          disabled={idx === 0}
                          className="rounded-md border border-neutral-200 px-2 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Geser kiri
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryPhoto(idx, 1)}
                          disabled={idx === form.gallery_photos.length - 1}
                          className="rounded-md border border-neutral-200 px-2 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Geser kanan
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryPhotoToFront(idx)}
                          disabled={idx === 0}
                          className="col-span-2 rounded-md border border-neutral-200 px-2 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Jadikan pertama
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {form.gallery_photos.length < MAX_GALLERY_PHOTOS && (
                <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 hover:border-neutral-400">
                  {uploadState === 'uploading'
                    ? 'Mengunggah...'
                    : `+ Tambah Foto Sekaligus (${form.gallery_photos.length}/${MAX_GALLERY_PHOTOS})`}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={uploadGalleryPhotos}
                    className="hidden"
                  />
                </label>
              )}
              {galleryUploadMessage && (
                <p className="text-xs text-amber-700">{galleryUploadMessage}</p>
              )}
            </fieldset>
          )}

          {/* ===== Section 6: Gift ===== */}
          {activeSection === 'gift' && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-neutral-800">Section 6 · Wedding Gift</legend>

              {form.wedding_gifts.length === 0 && (
                <p className="text-sm text-neutral-500">
                  Belum ada — kalau kosong, section Wedding Gift tidak ditampilkan di undangan.
                </p>
              )}

              {form.wedding_gifts.map((gift, idx) => (
                <div key={idx} className="space-y-3 rounded-xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      Gift {idx + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeGift(idx)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Jenis</label>
                    <select
                      value={gift.gift_type}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateGift(idx, 'gift_type', e.target.value)
                      }
                      className={INPUT_CLASS}
                    >
                      <option value="bank">Rekening Bank</option>
                      <option value="kado">Kado (alamat kirim)</option>
                    </select>
                  </div>
                  {gift.gift_type === 'bank' && (
                    <div>
                      <label className={LABEL_CLASS}>Nama Bank</label>
                      <input
                        type="text"
                        value={gift.bank_name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          updateGift(idx, 'bank_name', e.target.value)
                        }
                        placeholder="mis. BCA"
                        className={INPUT_CLASS}
                      />
                    </div>
                  )}
                  <div>
                    <label className={LABEL_CLASS}>
                      {gift.gift_type === 'bank' ? 'Atas Nama' : 'Nama Penerima'}
                    </label>
                    <input
                      type="text"
                      value={gift.account_name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateGift(idx, 'account_name', e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>
                      {gift.gift_type === 'bank' ? 'Nomor Rekening' : 'Alamat Pengiriman'}
                    </label>
                    <input
                      type="text"
                      value={gift.account_number}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateGift(idx, 'account_number', e.target.value)
                      }
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              ))}

              {form.wedding_gifts.length < MAX_WEDDING_GIFTS && (
                <button
                  type="button"
                  onClick={addGift}
                  className="w-full rounded-lg border border-dashed border-neutral-300 px-4 py-2.5 text-sm text-neutral-600 hover:border-neutral-400"
                >
                  + Tambah Gift ({form.wedding_gifts.length}/{MAX_WEDDING_GIFTS})
                </button>
              )}
            </fieldset>
          )}

          {/* ===== Musik ===== */}
          {activeSection === 'musik' && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-neutral-800">Musik Latar</legend>
              <div>
                <label htmlFor="music_url" className={LABEL_CLASS}>
                  Pilih Lagu
                </label>
                <select
                  id="music_url"
                  value={form.music_url}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField('music_url', e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="">Tanpa musik</option>
                  {musicLibrary.map((track) => (
                    <option key={track.id} value={track.file_url}>
                      {track.title}
                      {track.artist ? ` - ${track.artist}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {form.music_url && (
                <audio key={form.music_url} controls src={form.music_url} className="w-full">
                  Browser kamu tidak mendukung pemutar audio.
                </audio>
              )}
            </fieldset>
          )}

          {uploadState === 'error' && (
            <p className="text-sm text-red-600">Gagal mengunggah foto, coba lagi.</p>
          )}
          {saveState === 'error' && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{saveMessage}</p>
          )}
          {saveState === 'success' && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              ✓ Perubahan tersimpan
            </p>
          )}

          <button
            type="submit"
            disabled={saveState === 'saving' || uploadState === 'uploading'}
            className="w-full rounded-lg bg-[#8B4513] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition"
          >
            {saveState === 'saving' ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
