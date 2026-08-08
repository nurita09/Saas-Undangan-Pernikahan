import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookHeart,
  CalendarDays,
  Check,
  CircleAlert,
  CloudUpload,
  ExternalLink,
  Eye,
  Gift,
  HeartHandshake,
  Image as ImageIcon,
  Images,
  LoaderCircle,
  LockKeyhole,
  Music2,
  Quote,
  RefreshCw,
  RotateCcw,
  Save,
  Star,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  ApiError,
  fetchEditAuth,
  fetchMusicLibrary,
  updateWedding,
  uploadPhoto,
} from "../lib/api";
import type { MusicTrack, WeddingEditData } from "../types/wedding";
import { isVideoUrl } from "../utils/media";
import { readAccessToken } from "../utils/token";

interface WeddingEditorProps {
  slug: string;
}

const INPUT_CLASS =
  "mt-2 w-full rounded-md border border-[#CDD2CC] bg-white px-3.5 py-3 text-sm text-[#26312C] outline-none transition placeholder:text-[#929A94] hover:border-[#ABB3AC] focus:border-[#3F6253] focus:ring-2 focus:ring-[#3F6253]/15";
const LABEL_CLASS =
  "block text-[0.72rem] font-semibold tracking-[0.08em] text-[#58645E] uppercase";
const MAX_LOVE_STORIES = 5;
const MAX_GALLERY_PHOTOS = 10;
const MAX_WEDDING_GIFTS = 4;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

interface LoveStoryForm {
  date: string;
  description: string;
  photo_url: string;
}

interface GiftForm {
  gift_type: "bank" | "kado";
  bank_name: string;
  account_name: string;
  account_number: string;
}

interface EditorFormState {
  theme_id: number;
  groom_name: string;
  bride_name: string;
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

type AuthState = "checking" | "denied" | "authorized";
type SaveState = "idle" | "saving" | "success" | "error";
type UploadStatus = "idle" | "uploading" | "success" | "error";
type EditorView = "edit" | "preview";
type ConfirmAction = "discard" | "reload" | null;
type SectionKey =
  | "cover"
  | "ayat"
  | "pengantin"
  | "acara"
  | "story"
  | "galeri"
  | "gift"
  | "musik";

interface UploadFeedback {
  status: UploadStatus;
  message?: string;
}

interface EditorSection {
  key: SectionKey;
  label: string;
  hint: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const SECTIONS: EditorSection[] = [
  {
    key: "cover",
    label: "Cover",
    hint: "Nama & media utama",
    title: "Identitas Undangan",
    description:
      "Atur nama pasangan dan media utama yang pertama kali dilihat tamu.",
    icon: ImageIcon,
  },
  {
    key: "ayat",
    label: "Kutipan",
    hint: "Teks & foto pembuka",
    title: "Kutipan Pembuka",
    description:
      "Gunakan ayat, puisi, atau kalimat yang mewakili perjalanan kalian.",
    icon: Quote,
  },
  {
    key: "pengantin",
    label: "Pengantin",
    hint: "Profil kedua mempelai",
    title: "Profil Mempelai",
    description:
      "Lengkapi foto, keterangan keluarga, dan akun sosial kedua mempelai.",
    icon: UsersRound,
  },
  {
    key: "acara",
    label: "Acara",
    hint: "Jadwal & lokasi",
    title: "Rangkaian Acara",
    description:
      "Data umum menjadi fallback apabila detail akad atau resepsi dikosongkan.",
    icon: CalendarDays,
  },
  {
    key: "story",
    label: "Love Story",
    hint: "Tahapan perjalanan",
    title: "Love Story",
    description: "Susun hingga lima momen penting secara kronologis.",
    icon: BookHeart,
  },
  {
    key: "galeri",
    label: "Galeri",
    hint: "Foto & video",
    title: "Galeri Kenangan",
    description: "Atur urutan foto dan tambahkan video YouTube bila tersedia.",
    icon: Images,
  },
  {
    key: "gift",
    label: "Gift",
    hint: "Rekening & alamat",
    title: "Wedding Gift",
    description:
      "Bagian ini otomatis disembunyikan apabila tidak ada data yang diisi.",
    icon: Gift,
  },
  {
    key: "musik",
    label: "Musik",
    hint: "Lagu latar",
    title: "Musik Latar",
    description:
      "Pilih satu lagu dari koleksi platform atau biarkan undangan tanpa musik.",
    icon: Music2,
  },
];

function toDatetimeLocalValue(iso: string | null): string {
  return iso ? iso.slice(0, 16) : "";
}

function toFormState(data: WeddingEditData): EditorFormState {
  return {
    theme_id: data.theme_id,
    groom_name: data.groom_name,
    bride_name: data.bride_name,
    primary_color: data.primary_color,
    secondary_color: data.secondary_color,
    wedding_date: toDatetimeLocalValue(data.wedding_date),
    location_address: data.location_address ?? "",
    maps_url: data.maps_url ?? "",
    cover_photo_url: data.cover_photo_url ?? "",
    section1_photo_url: data.theme_settings?.section1_photo_url ?? "",
    section2_photo_url: data.theme_settings?.section2_photo_url ?? "",
    quote_text: data.theme_settings?.quote_text ?? "",
    quote_source: data.theme_settings?.quote_source ?? "",
    groom_photo_url: data.groom_photo_url ?? "",
    bride_photo_url: data.bride_photo_url ?? "",
    groom_parents: data.groom_parents ?? "",
    bride_parents: data.bride_parents ?? "",
    groom_ig: data.groom_ig ?? "",
    bride_ig: data.bride_ig ?? "",
    akad_date: toDatetimeLocalValue(data.akad_date),
    akad_location: data.akad_location ?? "",
    akad_maps_url: data.akad_maps_url ?? "",
    resepsi_date: toDatetimeLocalValue(data.resepsi_date),
    resepsi_location: data.resepsi_location ?? "",
    resepsi_maps_url: data.resepsi_maps_url ?? "",
    gallery_video_url: data.gallery_video_url ?? "",
    love_stories: data.love_stories.map((story) => ({
      date: story.date ?? "",
      description: story.description ?? "",
      photo_url: story.photo_url ?? "",
    })),
    gallery_photos: [...data.gallery_photos],
    wedding_gifts: data.wedding_gifts.map((gift) => ({
      gift_type: gift.gift_type === "kado" ? "kado" : "bank",
      bank_name: gift.bank_name ?? "",
      account_name: gift.account_name ?? "",
      account_number: gift.account_number ?? "",
    })),
    music_url: data.music_url ?? "",
  };
}

function cloneFormState(form: EditorFormState): EditorFormState {
  return JSON.parse(JSON.stringify(form)) as EditorFormState;
}

export function canEditQuotePhoto(themeId: number): boolean {
  return themeId >= 2 && themeId <= 6;
}

export function normalizeInstagramHandle(value: string): string {
  const withoutProtocol = value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  const username =
    withoutProtocol.replace(/^@/, "").split(/[/?#]/)[0]?.trim() ?? "";
  return username ? `@${username}` : "";
}

export function validateMediaFile(
  file: Pick<File, "type" | "size">,
  allowVideo: boolean,
): string | null {
  const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  const isVideo = ["video/mp4", "video/webm"].includes(file.type);
  if (!isImage && !(allowVideo && isVideo)) {
    return allowVideo
      ? "Gunakan JPEG, PNG, WEBP, MP4, atau WEBM."
      : "Gunakan JPEG, PNG, atau WEBP.";
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES)
    return "Ukuran video maksimal 20 MB.";
  if (isImage && file.size > MAX_IMAGE_BYTES)
    return "Ukuran foto maksimal 10 MB.";
  return null;
}

interface PhotoFieldProps {
  id: string;
  label: string;
  hint?: string;
  photoUrl: string;
  upload: UploadFeedback;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  compact?: boolean;
  allowVideo?: boolean;
}

function PhotoField({
  id,
  label,
  hint,
  photoUrl,
  upload,
  onSelect,
  onClear,
  compact = false,
  allowVideo = false,
}: PhotoFieldProps) {
  const previewIsVideo = allowVideo && isVideoUrl(photoUrl);
  const isUploading = upload.status === "uploading";

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={LABEL_CLASS}>{label}</p>
          {hint && (
            <p className="mt-1 text-xs leading-5 text-[#7D8781]">{hint}</p>
          )}
        </div>
        {photoUrl && (
          <button
            type="button"
            onClick={onClear}
            disabled={isUploading}
            title="Hapus media"
            aria-label={`Hapus ${label}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#D6DAD6] text-[#7A4549] transition hover:border-[#7A4549] hover:bg-[#7A4549] hover:text-white disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 overflow-hidden rounded-md border border-[#D6DAD6] bg-white">
        {photoUrl ? (
          previewIsVideo ? (
            <video
              src={photoUrl}
              controls
              muted
              loop
              className={`${compact ? "h-32" : "h-52"} w-full bg-black object-cover`}
            />
          ) : (
            <img
              src={photoUrl}
              alt={`Pratinjau ${label}`}
              className={`${compact ? "h-32" : "h-52"} w-full object-cover`}
            />
          )
        ) : (
          <div
            className={`${compact ? "h-28" : "h-36"} flex flex-col items-center justify-center bg-[#F2F4F1] px-5 text-center text-[#8A948E]`}
          >
            <ImageIcon className="h-6 w-6" />
            <p className="mt-2 text-xs">
              Belum ada media. Tema akan memakai gambar fallback.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-[#E1E4E1] px-3 py-3">
          <p className="min-w-0 text-xs text-[#7D8781]">
            {allowVideo
              ? "Foto maks. 10 MB, video maks. 20 MB"
              : "JPEG, PNG, atau WEBP maks. 10 MB"}
          </p>
          <label
            htmlFor={id}
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-[#3F6253] px-3 text-xs font-semibold text-[#3F6253] transition hover:bg-[#3F6253] hover:text-white ${
              isUploading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >
            {isUploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : photoUrl ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Mengunggah" : photoUrl ? "Ganti" : "Pilih"}
            <input
              id={id}
              type="file"
              accept={
                allowVideo
                  ? "image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  : "image/jpeg,image/png,image/webp"
              }
              onChange={onSelect}
              disabled={isUploading}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {upload.message && (
        <p
          role={upload.status === "error" ? "alert" : "status"}
          className={`mt-2 flex items-center gap-2 text-xs ${
            upload.status === "error" ? "text-[#A03F47]" : "text-[#3F6253]"
          }`}
        >
          {upload.status === "error" ? (
            <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Check className="h-3.5 w-3.5 shrink-0" />
          )}
          {upload.message}
        </p>
      )}
    </div>
  );
}

interface PreviewPanelProps {
  token: string | null;
  version: number;
  onRefresh: () => void;
  mobile?: boolean;
}

function PreviewPanel({
  token,
  version,
  onRefresh,
  mobile = false,
}: PreviewPanelProps) {
  return (
    <div
      className={`flex h-full flex-col ${mobile ? "bg-[#E7EAE6] px-4 py-6" : "px-7 py-6"}`}
    >
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#6F7973] uppercase">
            Preview tersimpan
          </p>
          <p className="mt-1 text-xs text-[#89918C]">
            Diperbarui setelah perubahan disimpan.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          title="Muat ulang preview"
          aria-label="Muat ulang preview"
          className="grid h-10 w-10 place-items-center rounded-md border border-[#C9CEC9] bg-white text-[#3F6253] transition hover:border-[#3F6253]"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex min-h-0 flex-1 items-center justify-center">
        <div
          className={`relative aspect-[9/19] overflow-hidden border-[8px] border-[#202723] bg-[#202723] shadow-[0_25px_60px_-30px_rgba(25,35,30,0.65)] ${
            mobile
              ? "h-[min(68svh,700px)] rounded-[2rem]"
              : "h-[min(76vh,760px)] rounded-[2.4rem]"
          }`}
        >
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-[#202723]" />
          <iframe
            key={version}
            src={`/#token=${token ?? ""}`}
            title="Preview undangan"
            className="h-full w-full rounded-[1.8rem] bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default function WeddingEditor({ slug }: WeddingEditorProps) {
  const token = readAccessToken();
  const savedFormRef = useRef<EditorFormState | null>(null);

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [form, setForm] = useState<EditorFormState | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [hasConflict, setHasConflict] = useState(false);
  const [uploadStates, setUploadStates] = useState<
    Record<string, UploadFeedback>
  >({});
  const [musicLibrary, setMusicLibrary] = useState<MusicTrack[]>([]);
  const [activeSection, setActiveSection] = useState<SectionKey>("cover");
  const [viewMode, setViewMode] = useState<EditorView>("edit");
  const [previewVersion, setPreviewVersion] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const activeSectionInfo =
    SECTIONS.find((section) => section.key === activeSection) ?? SECTIONS[0];
  const formSnapshot = useMemo(
    () => (form ? JSON.stringify(form) : ""),
    [form],
  );
  const savedSnapshot = savedFormRef.current
    ? JSON.stringify(savedFormRef.current)
    : "";
  const isDirty = Boolean(
    form && savedFormRef.current && formSnapshot !== savedSnapshot,
  );
  const isUploading = Object.values(uploadStates).some(
    (item) => item.status === "uploading",
  );

  const setUploadFeedback = (key: string, feedback: UploadFeedback) => {
    setUploadStates((current) => ({ ...current, [key]: feedback }));
  };

  const getUploadFeedback = (key: string): UploadFeedback =>
    uploadStates[key] ?? { status: "idle" };

  const clearMedia = (key: string, clear: () => void) => {
    clear();
    setUploadStates((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const applyLoadedData = (data: WeddingEditData) => {
    const nextForm = toFormState(data);
    savedFormRef.current = cloneFormState(nextForm);
    setForm(nextForm);
    setUpdatedAt(data.updated_at);
    setSaveState("idle");
    setSaveMessage("");
    setHasConflict(false);
  };

  useEffect(() => {
    if (!token) {
      setAuthState("denied");
      return;
    }

    fetchEditAuth(slug, token)
      .then((data) => {
        applyLoadedData(data);
        setAuthState("authorized");
      })
      .catch(() => setAuthState("denied"));
  }, [slug, token]);

  useEffect(() => {
    fetchMusicLibrary()
      .then(setMusicLibrary)
      .catch(() => setMusicLibrary([]));
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (isDirty && saveState === "success") setSaveState("idle");
  }, [isDirty, saveState]);

  const updateField = (field: keyof EditorFormState, value: string) => {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const updateStory = (
    index: number,
    field: keyof LoveStoryForm,
    value: string,
  ) => {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        love_stories: current.love_stories.map((story, itemIndex) =>
          itemIndex === index ? { ...story, [field]: value } : story,
        ),
      };
    });
  };

  const addStory = () => {
    setForm((current) => {
      if (!current || current.love_stories.length >= MAX_LOVE_STORIES)
        return current;
      return {
        ...current,
        love_stories: [
          ...current.love_stories,
          { date: "", description: "", photo_url: "" },
        ],
      };
    });
  };

  const removeStory = (index: number) => {
    setForm((current) =>
      current
        ? {
            ...current,
            love_stories: current.love_stories.filter(
              (_, itemIndex) => itemIndex !== index,
            ),
          }
        : current,
    );
  };

  const moveStory = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.love_stories.length) return current;
      const loveStories = [...current.love_stories];
      [loveStories[index], loveStories[target]] = [
        loveStories[target],
        loveStories[index],
      ];
      return { ...current, love_stories: loveStories };
    });
  };

  const removeGalleryPhoto = (index: number) => {
    setForm((current) =>
      current
        ? {
            ...current,
            gallery_photos: current.gallery_photos.filter(
              (_, itemIndex) => itemIndex !== index,
            ),
          }
        : current,
    );
  };

  const moveGalleryPhoto = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.gallery_photos.length) return current;
      const photos = [...current.gallery_photos];
      [photos[index], photos[target]] = [photos[target], photos[index]];
      return { ...current, gallery_photos: photos };
    });
  };

  const moveGalleryPhotoToFront = (index: number) => {
    setForm((current) => {
      if (!current || index <= 0) return current;
      const photos = [...current.gallery_photos];
      const [photo] = photos.splice(index, 1);
      photos.unshift(photo);
      return { ...current, gallery_photos: photos };
    });
  };

  const updateGift = (index: number, field: keyof GiftForm, value: string) => {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        wedding_gifts: current.wedding_gifts.map((giftItem, itemIndex) =>
          itemIndex === index ? { ...giftItem, [field]: value } : giftItem,
        ),
      };
    });
  };

  const addGift = () => {
    setForm((current) => {
      if (!current || current.wedding_gifts.length >= MAX_WEDDING_GIFTS)
        return current;
      return {
        ...current,
        wedding_gifts: [
          ...current.wedding_gifts,
          {
            gift_type: "bank",
            bank_name: "",
            account_name: "",
            account_number: "",
          },
        ],
      };
    });
  };

  const removeGift = (index: number) => {
    setForm((current) =>
      current
        ? {
            ...current,
            wedding_gifts: current.wedding_gifts.filter(
              (_, itemIndex) => itemIndex !== index,
            ),
          }
        : current,
    );
  };

  const uploadThen = async (
    key: string,
    event: ChangeEvent<HTMLInputElement>,
    apply: (url: string) => void,
    allowVideo = false,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !token) return;

    const validationError = validateMediaFile(file, allowVideo);
    if (validationError) {
      setUploadFeedback(key, { status: "error", message: validationError });
      return;
    }

    setUploadFeedback(key, {
      status: "uploading",
      message: "Mengunggah media...",
    });
    try {
      const url = await uploadPhoto(token, file);
      apply(url);
      setUploadFeedback(key, {
        status: "success",
        message: "Media siap disimpan.",
      });
    } catch (error) {
      setUploadFeedback(key, {
        status: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Upload gagal. Silakan coba lagi.",
      });
    }
  };

  const uploadGalleryPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || !token || !form) return;

    const remainingSlots = MAX_GALLERY_PHOTOS - form.gallery_photos.length;
    if (remainingSlots <= 0) return;

    const selectedFiles = files.slice(0, remainingSlots);
    const validFiles: File[] = [];
    let invalidCount = 0;
    for (const file of selectedFiles) {
      if (validateMediaFile(file, false)) invalidCount += 1;
      else validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setUploadFeedback("gallery", {
        status: "error",
        message:
          "Tidak ada foto valid untuk diunggah. Gunakan JPEG, PNG, atau WEBP maksimal 10 MB.",
      });
      return;
    }

    setUploadFeedback("gallery", {
      status: "uploading",
      message: `Mengunggah ${validFiles.length} foto...`,
    });
    const results = await Promise.allSettled(
      validFiles.map((file) => uploadPhoto(token, file)),
    );
    const uploadedUrls = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    const failedCount = results.length - uploadedUrls.length + invalidCount;

    if (uploadedUrls.length > 0) {
      setForm((current) =>
        current
          ? {
              ...current,
              gallery_photos: [
                ...current.gallery_photos,
                ...uploadedUrls,
              ].slice(0, MAX_GALLERY_PHOTOS),
            }
          : current,
      );
    }

    const omittedCount = Math.max(0, files.length - remainingSlots);
    if (failedCount > 0 || omittedCount > 0) {
      const notes = [
        `${uploadedUrls.length} foto berhasil`,
        failedCount > 0 ? `${failedCount} gagal atau tidak valid` : "",
        omittedCount > 0 ? `${omittedCount} melewati batas galeri` : "",
      ].filter(Boolean);
      setUploadFeedback("gallery", {
        status: "error",
        message: `${notes.join(", ")}.`,
      });
    } else {
      setUploadFeedback("gallery", {
        status: "success",
        message: `${uploadedUrls.length} foto siap disimpan.`,
      });
    }
  };

  const executeConfirmedAction = async () => {
    const action = confirmAction;
    setConfirmAction(null);
    if (action === "discard" && savedFormRef.current) {
      setForm(cloneFormState(savedFormRef.current));
      setUploadStates({});
      setSaveState("idle");
      setSaveMessage("");
      return;
    }

    if (action === "reload" && token) {
      setSaveState("saving");
      try {
        const latest = await fetchEditAuth(slug, token);
        applyLoadedData(latest);
        setPreviewVersion((current) => current + 1);
      } catch {
        setSaveState("error");
        setSaveMessage(
          "Data terbaru belum dapat dimuat. Silakan coba kembali.",
        );
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !form || !isDirty || isUploading) return;

    if (!form.groom_name.trim() || !form.bride_name.trim()) {
      setActiveSection("cover");
      setViewMode("edit");
      setSaveState("error");
      setSaveMessage("Nama kedua mempelai wajib diisi.");
      return;
    }

    setSaveState("saving");
    setSaveMessage("");
    setHasConflict(false);

    const loveStories = form.love_stories
      .filter(
        (story) =>
          story.date.trim() || story.description.trim() || story.photo_url,
      )
      .map((story) => ({
        date: story.date.trim() || null,
        description: story.description.trim() || null,
        photo_url: story.photo_url || null,
      }));
    const weddingGifts = form.wedding_gifts
      .filter((giftItem) =>
        [
          giftItem.bank_name,
          giftItem.account_name,
          giftItem.account_number,
        ].some((value) => value.trim()),
      )
      .map((giftItem) => ({
        gift_type: giftItem.gift_type,
        bank_name: giftItem.bank_name.trim() || null,
        account_name: giftItem.account_name.trim() || null,
        account_number: giftItem.account_number.trim() || null,
      }));

    try {
      const updated = await updateWedding(token, {
        groom_name: form.groom_name.trim(),
        bride_name: form.bride_name.trim(),
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        wedding_date: form.wedding_date || null,
        location_address: form.location_address.trim() || null,
        maps_url: form.maps_url.trim() || null,
        cover_photo_url: form.cover_photo_url || null,
        music_url: form.music_url || null,
        groom_photo_url: form.groom_photo_url || null,
        bride_photo_url: form.bride_photo_url || null,
        groom_parents: form.groom_parents.trim() || null,
        bride_parents: form.bride_parents.trim() || null,
        groom_ig: normalizeInstagramHandle(form.groom_ig) || null,
        bride_ig: normalizeInstagramHandle(form.bride_ig) || null,
        akad_date: form.akad_date || null,
        akad_location: form.akad_location.trim() || null,
        akad_maps_url: form.akad_maps_url.trim() || null,
        resepsi_date: form.resepsi_date || null,
        resepsi_location: form.resepsi_location.trim() || null,
        resepsi_maps_url: form.resepsi_maps_url.trim() || null,
        gallery_video_url: form.gallery_video_url.trim() || null,
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
      applyLoadedData(updated);
      setSaveState("success");
      setUploadStates({});
      setPreviewVersion((current) => current + 1);
    } catch (error) {
      const conflict = error instanceof ApiError && error.status === 409;
      setHasConflict(conflict);
      setSaveMessage(
        conflict
          ? "Data undangan berubah dari tab atau perangkat lain. Muat data terbaru sebelum melanjutkan."
          : error instanceof ApiError
            ? error.message
            : "Terjadi kesalahan tak terduga.",
      );
      setSaveState("error");
    }
  };

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F5F2]">
        <div className="text-center text-[#66716B]">
          <LoaderCircle className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-3 text-xs font-semibold tracking-[0.18em] uppercase">
            Memeriksa akses
          </p>
        </div>
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F5F2] px-6">
        <div className="w-full max-w-md border border-[#D9DDD8] bg-white p-8 text-center shadow-[0_18px_45px_-35px_rgba(30,45,37,0.4)]">
          <LockKeyhole className="mx-auto h-8 w-8 text-[#7A4549]" />
          <h1 className="mt-5 font-serif text-2xl text-[#26312C]">
            Tautan editor tidak valid
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#748078]">
            Buka kembali tautan editor lengkap yang diberikan admin. Token akses
            tidak boleh dihapus dari bagian akhir URL.
          </p>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const ActiveIcon = activeSectionInfo.icon;

  return (
    <div className="min-h-screen bg-[#F3F5F2] text-[#26312C]">
      <header className="sticky top-0 z-50 border-b border-[#DDE1DC] bg-white/95 backdrop-blur">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[0.62rem] font-bold tracking-[0.2em] text-[#7A4549] uppercase">
                Nurita Editor
              </span>
              <span className="h-3 w-px bg-[#D7DBD7]" />
              <span className="text-[0.62rem] font-semibold text-[#7B857F]">
                Theme {form.theme_id}
              </span>
            </div>
            <h1 className="mt-1 truncate font-serif text-lg leading-tight sm:text-xl">
              {form.groom_name || "Pengantin Pria"} &amp;{" "}
              {form.bride_name || "Pengantin Wanita"}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div
              className="hidden items-center gap-2 text-xs sm:flex"
              aria-live="polite"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  saveState === "error"
                    ? "bg-[#A03F47]"
                    : saveState === "saving" || isUploading
                      ? "animate-pulse bg-[#B58A43]"
                      : isDirty
                        ? "bg-[#B58A43]"
                        : "bg-[#4F735F]"
                }`}
              />
              <span className="text-[#68736D]">
                {saveState === "saving"
                  ? "Menyimpan"
                  : isUploading
                    ? "Mengunggah"
                    : isDirty
                      ? "Belum tersimpan"
                      : "Tersimpan"}
              </span>
            </div>
            <a
              href={`/#token=${token ?? ""}`}
              target="_blank"
              rel="noreferrer"
              title="Buka undangan"
              aria-label="Buka undangan di tab baru"
              className="grid h-10 w-10 place-items-center rounded-md border border-[#D5DAD5] text-[#3F6253] transition hover:border-[#3F6253] hover:bg-[#EFF3EF]"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-[#E4E7E3] lg:hidden">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex h-11 items-center justify-center gap-2 text-xs font-semibold transition ${
              viewMode === "edit"
                ? "bg-[#3F6253] text-white"
                : "bg-white text-[#68736D]"
            }`}
          >
            <ActiveIcon className="h-4 w-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex h-11 items-center justify-center gap-2 border-l border-[#E4E7E3] text-xs font-semibold transition ${
              viewMode === "preview"
                ? "bg-[#3F6253] text-white"
                : "bg-white text-[#68736D]"
            }`}
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[13rem_minmax(28rem,34rem)_minmax(20rem,1fr)]">
        <aside className="sticky top-[4.5rem] hidden h-[calc(100vh-4.5rem)] border-r border-[#DDE1DC] bg-white lg:flex lg:flex-col">
          <div className="px-5 pb-3 pt-6">
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#89918C] uppercase">
              Struktur undangan
            </p>
          </div>
          <nav
            className="flex-1 overflow-y-auto px-3 pb-4"
            aria-label="Bagian undangan"
          >
            {SECTIONS.map((section, index) => {
              const Icon = section.icon;
              const active = section.key === activeSection;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  aria-current={active ? "step" : undefined}
                  className={`mb-1 grid w-full grid-cols-[2rem_minmax(0,1fr)] items-start gap-2 rounded-md px-2.5 py-3 text-left transition ${
                    active
                      ? "bg-[#EAF0EB] text-[#2E5946]"
                      : "text-[#68736D] hover:bg-[#F4F6F3]"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-md ${
                      active
                        ? "bg-[#3F6253] text-white"
                        : "border border-[#DDE1DC] bg-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.68rem] text-[#929A94]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold leading-4">
                      {section.label}
                    </span>
                    <span className="mt-1 block text-[0.68rem] leading-4 text-[#929A94]">
                      {section.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="border-t border-[#E3E6E2] p-4">
            <div className="flex items-center gap-3 text-xs text-[#7A847E]">
              <CloudUpload className="h-4 w-4 text-[#3F6253]" />
              <span>Semua perubahan disimpan sekaligus.</span>
            </div>
          </div>
        </aside>

        <main
          className={`${viewMode === "preview" ? "hidden" : "block"} min-w-0 border-r border-[#DDE1DC] lg:block`}
        >
          <nav
            aria-label="Bagian undangan"
            className="sticky top-[7.25rem] z-30 flex gap-1 overflow-x-auto border-b border-[#DDE1DC] bg-white px-3 py-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
          >
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const active = section.key === activeSection;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-xs font-semibold transition ${
                    active ? "bg-[#EAF0EB] text-[#2E5946]" : "text-[#758079]"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {section.label}
                </button>
              );
            })}
          </nav>

          <form onSubmit={handleSubmit} className="min-h-[calc(100vh-4.5rem)]">
            <div className="px-5 pb-10 pt-8 sm:px-8 sm:pt-10">
              <div className="border-b border-[#D9DED9] pb-7">
                <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.17em] text-[#7A4549] uppercase">
                  <ActiveIcon className="h-4 w-4" /> Bagian{" "}
                  {SECTIONS.findIndex((item) => item.key === activeSection) + 1}
                </div>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-[#26312C]">
                  {activeSectionInfo.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#748078]">
                  {activeSectionInfo.description}
                </p>
              </div>

              <div className="mt-8">
                {activeSection === "cover" && (
                  <fieldset className="space-y-6">
                    <legend className="sr-only">Identitas undangan</legend>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="groom_name" className={LABEL_CLASS}>
                          Nama pengantin pria
                        </label>
                        <input
                          id="groom_name"
                          type="text"
                          required
                          maxLength={150}
                          value={form.groom_name}
                          onChange={(event) =>
                            updateField("groom_name", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                      <div>
                        <label htmlFor="bride_name" className={LABEL_CLASS}>
                          Nama pengantin wanita
                        </label>
                        <input
                          id="bride_name"
                          type="text"
                          required
                          maxLength={150}
                          value={form.bride_name}
                          onChange={(event) =>
                            updateField("bride_name", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>
                    <PhotoField
                      id="cover-media"
                      label="Media utama undangan"
                      hint="Gunakan foto potret atau video vertikal dengan subjek berada dekat bagian tengah."
                      photoUrl={form.cover_photo_url}
                      upload={getUploadFeedback("cover")}
                      onSelect={(event) =>
                        uploadThen(
                          "cover",
                          event,
                          (url) => updateField("cover_photo_url", url),
                          true,
                        )
                      }
                      onClear={() =>
                        clearMedia("cover", () =>
                          updateField("cover_photo_url", ""),
                        )
                      }
                      allowVideo
                    />
                  </fieldset>
                )}

                {activeSection === "ayat" && (
                  <fieldset className="space-y-6">
                    <legend className="sr-only">Kutipan pembuka</legend>
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="quote_text" className={LABEL_CLASS}>
                          Teks kutipan
                        </label>
                        <span className="text-xs tabular-nums text-[#929A94]">
                          {form.quote_text.length}/800
                        </span>
                      </div>
                      <textarea
                        id="quote_text"
                        rows={6}
                        maxLength={800}
                        value={form.quote_text}
                        onChange={(event) =>
                          updateField("quote_text", event.target.value)
                        }
                        placeholder="Kosongkan untuk memakai kutipan bawaan tema."
                        className={`${INPUT_CLASS} resize-y leading-6`}
                      />
                    </div>
                    <div>
                      <label htmlFor="quote_source" className={LABEL_CLASS}>
                        Sumber kutipan
                      </label>
                      <input
                        id="quote_source"
                        type="text"
                        maxLength={120}
                        value={form.quote_source}
                        onChange={(event) =>
                          updateField("quote_source", event.target.value)
                        }
                        placeholder="Contoh: QS. Ar-Rum: 21, 1 Korintus 13:4, atau Anonim"
                        className={INPUT_CLASS}
                      />
                    </div>
                    {canEditQuotePhoto(form.theme_id) && (
                      <PhotoField
                        id="quote-photo"
                        label="Foto pendamping kutipan"
                        hint="Tersedia untuk Theme 2 sampai Theme 6. Komposisi terbaik mengikuti foto potret."
                        photoUrl={form.section1_photo_url}
                        upload={getUploadFeedback("quote")}
                        onSelect={(event) =>
                          uploadThen("quote", event, (url) =>
                            updateField("section1_photo_url", url),
                          )
                        }
                        onClear={() =>
                          clearMedia("quote", () =>
                            updateField("section1_photo_url", ""),
                          )
                        }
                      />
                    )}
                  </fieldset>
                )}

                {activeSection === "pengantin" && (
                  <fieldset className="space-y-5">
                    <legend className="sr-only">Profil kedua mempelai</legend>
                    {[
                      {
                        role: "Pengantin wanita",
                        photoKey: "bride",
                        photo: form.bride_photo_url,
                        photoField: "bride_photo_url" as const,
                        parents: form.bride_parents,
                        parentsField: "bride_parents" as const,
                        parentsPlaceholder: "Putri dari Bapak ... dan Ibu ...",
                        instagram: form.bride_ig,
                        instagramField: "bride_ig" as const,
                      },
                      {
                        role: "Pengantin pria",
                        photoKey: "groom",
                        photo: form.groom_photo_url,
                        photoField: "groom_photo_url" as const,
                        parents: form.groom_parents,
                        parentsField: "groom_parents" as const,
                        parentsPlaceholder: "Putra dari Bapak ... dan Ibu ...",
                        instagram: form.groom_ig,
                        instagramField: "groom_ig" as const,
                      },
                    ].map((person) => (
                      <article
                        key={person.photoKey}
                        className="rounded-md border border-[#D8DDD8] bg-white p-5"
                      >
                        <div className="mb-5 flex items-center gap-3 border-b border-[#E2E5E2] pb-4">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EAF0EB] text-[#3F6253]">
                            <UserRound className="h-4 w-4" />
                          </span>
                          <h3 className="font-serif text-xl">{person.role}</h3>
                        </div>
                        <div className="space-y-5">
                          <PhotoField
                            id={`${person.photoKey}-photo`}
                            label={`Foto ${person.role}`}
                            photoUrl={person.photo}
                            upload={getUploadFeedback(person.photoKey)}
                            onSelect={(event) =>
                              uploadThen(person.photoKey, event, (url) =>
                                updateField(person.photoField, url),
                              )
                            }
                            onClear={() =>
                              clearMedia(person.photoKey, () =>
                                updateField(person.photoField, ""),
                              )
                            }
                            compact
                          />
                          <div>
                            <label
                              htmlFor={`${person.photoKey}-parents`}
                              className={LABEL_CLASS}
                            >
                              Keterangan orang tua
                            </label>
                            <textarea
                              id={`${person.photoKey}-parents`}
                              rows={2}
                              maxLength={300}
                              value={person.parents}
                              onChange={(event) =>
                                updateField(
                                  person.parentsField,
                                  event.target.value,
                                )
                              }
                              placeholder={person.parentsPlaceholder}
                              className={`${INPUT_CLASS} resize-y`}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${person.photoKey}-instagram`}
                              className={LABEL_CLASS}
                            >
                              Instagram
                            </label>
                            <input
                              id={`${person.photoKey}-instagram`}
                              type="text"
                              maxLength={80}
                              value={person.instagram}
                              onChange={(event) =>
                                updateField(
                                  person.instagramField,
                                  event.target.value,
                                )
                              }
                              onBlur={(event) =>
                                updateField(
                                  person.instagramField,
                                  normalizeInstagramHandle(event.target.value),
                                )
                              }
                              placeholder="@username atau link profil Instagram"
                              className={INPUT_CLASS}
                            />
                          </div>
                        </div>
                      </article>
                    ))}
                  </fieldset>
                )}

                {activeSection === "acara" && (
                  <fieldset className="space-y-6">
                    <legend className="sr-only">Rangkaian acara</legend>
                    <div className="space-y-5">
                      <h3 className="font-serif text-xl">Informasi umum</h3>
                      <div>
                        <label htmlFor="wedding_date" className={LABEL_CLASS}>
                          Tanggal dan waktu utama
                        </label>
                        <input
                          id="wedding_date"
                          type="datetime-local"
                          value={form.wedding_date}
                          onChange={(event) =>
                            updateField("wedding_date", event.target.value)
                          }
                          className={INPUT_CLASS}
                        />
                        <p className="mt-2 text-xs text-[#7D8781]">
                          Dipakai pada cover dan hitung mundur.
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="location_address"
                          className={LABEL_CLASS}
                        >
                          Alamat lokasi umum
                        </label>
                        <textarea
                          id="location_address"
                          rows={3}
                          maxLength={500}
                          value={form.location_address}
                          onChange={(event) =>
                            updateField("location_address", event.target.value)
                          }
                          className={`${INPUT_CLASS} resize-y`}
                        />
                      </div>
                      <div>
                        <label htmlFor="maps_url" className={LABEL_CLASS}>
                          Link Google Maps umum
                        </label>
                        <input
                          id="maps_url"
                          type="url"
                          value={form.maps_url}
                          onChange={(event) =>
                            updateField("maps_url", event.target.value)
                          }
                          placeholder="https://maps.google.com/..."
                          className={INPUT_CLASS}
                        />
                      </div>
                    </div>

                    {[
                      {
                        key: "akad",
                        title: "Akad nikah",
                        date: form.akad_date,
                        dateField: "akad_date" as const,
                        location: form.akad_location,
                        locationField: "akad_location" as const,
                        maps: form.akad_maps_url,
                        mapsField: "akad_maps_url" as const,
                      },
                      {
                        key: "resepsi",
                        title: "Resepsi",
                        date: form.resepsi_date,
                        dateField: "resepsi_date" as const,
                        location: form.resepsi_location,
                        locationField: "resepsi_location" as const,
                        maps: form.resepsi_maps_url,
                        mapsField: "resepsi_maps_url" as const,
                      },
                    ].map((eventItem) => (
                      <article
                        key={eventItem.key}
                        className="rounded-md border border-[#D8DDD8] bg-white p-5"
                      >
                        <div className="flex items-start justify-between gap-4 border-b border-[#E2E5E2] pb-4">
                          <div>
                            <h3 className="font-serif text-xl">
                              {eventItem.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#7D8781]">
                              Opsional, data umum digunakan bila kosong.
                            </p>
                          </div>
                          <CalendarDays className="h-5 w-5 text-[#7A4549]" />
                        </div>
                        <div className="mt-5 space-y-5">
                          <div>
                            <label
                              htmlFor={`${eventItem.key}-date`}
                              className={LABEL_CLASS}
                            >
                              Tanggal dan waktu
                            </label>
                            <input
                              id={`${eventItem.key}-date`}
                              type="datetime-local"
                              value={eventItem.date}
                              onChange={(event) =>
                                updateField(
                                  eventItem.dateField,
                                  event.target.value,
                                )
                              }
                              className={INPUT_CLASS}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${eventItem.key}-location`}
                              className={LABEL_CLASS}
                            >
                              Lokasi
                            </label>
                            <textarea
                              id={`${eventItem.key}-location`}
                              rows={2}
                              maxLength={500}
                              value={eventItem.location}
                              onChange={(event) =>
                                updateField(
                                  eventItem.locationField,
                                  event.target.value,
                                )
                              }
                              className={`${INPUT_CLASS} resize-y`}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${eventItem.key}-maps`}
                              className={LABEL_CLASS}
                            >
                              Link Google Maps
                            </label>
                            <input
                              id={`${eventItem.key}-maps`}
                              type="url"
                              value={eventItem.maps}
                              onChange={(event) =>
                                updateField(
                                  eventItem.mapsField,
                                  event.target.value,
                                )
                              }
                              className={INPUT_CLASS}
                            />
                          </div>
                        </div>
                      </article>
                    ))}

                    <PhotoField
                      id="event-photo"
                      label="Foto suasana atau lokasi acara"
                      hint="Tema akan menyesuaikan foto ini ke komposisi masing-masing."
                      photoUrl={form.section2_photo_url}
                      upload={getUploadFeedback("event")}
                      onSelect={(event) =>
                        uploadThen("event", event, (url) =>
                          updateField("section2_photo_url", url),
                        )
                      }
                      onClear={() =>
                        clearMedia("event", () =>
                          updateField("section2_photo_url", ""),
                        )
                      }
                    />
                  </fieldset>
                )}

                {activeSection === "story" && (
                  <fieldset className="space-y-4">
                    <legend className="sr-only">Love story</legend>
                    {form.love_stories.length === 0 && (
                      <div className="border-l-2 border-[#B58A43] bg-[#F7F3E9] px-4 py-3 text-sm leading-6 text-[#746A55]">
                        Belum ada cerita. Beberapa tema akan menyembunyikan
                        bagian ini, sementara tema lain memakai konten fallback.
                      </div>
                    )}
                    {form.love_stories.map((story, index) => (
                      <article
                        key={index}
                        className="rounded-md border border-[#D8DDD8] bg-white p-5"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-[#E2E5E2] pb-4">
                          <div>
                            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#7A4549] uppercase">
                              Catatan {String(index + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-1 font-serif text-lg">
                              Momen perjalanan
                            </h3>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveStory(index, -1)}
                              disabled={index === 0}
                              title="Geser ke atas"
                              aria-label={`Geser cerita ${index + 1} ke atas`}
                              className="grid h-9 w-9 place-items-center rounded-md border border-[#D6DAD6] text-[#68736D] hover:border-[#3F6253] disabled:opacity-30"
                            >
                              <ArrowLeft className="h-4 w-4 rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveStory(index, 1)}
                              disabled={index === form.love_stories.length - 1}
                              title="Geser ke bawah"
                              aria-label={`Geser cerita ${index + 1} ke bawah`}
                              className="grid h-9 w-9 place-items-center rounded-md border border-[#D6DAD6] text-[#68736D] hover:border-[#3F6253] disabled:opacity-30"
                            >
                              <ArrowRight className="h-4 w-4 rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStory(index)}
                              title="Hapus cerita"
                              aria-label={`Hapus cerita ${index + 1}`}
                              className="grid h-9 w-9 place-items-center rounded-md border border-[#D6DAD6] text-[#7A4549] hover:border-[#7A4549] hover:bg-[#7A4549] hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-5 space-y-5">
                          <div>
                            <label
                              htmlFor={`story-date-${index}`}
                              className={LABEL_CLASS}
                            >
                              Judul atau tanggal
                            </label>
                            <input
                              id={`story-date-${index}`}
                              type="text"
                              maxLength={120}
                              value={story.date}
                              onChange={(event) =>
                                updateStory(index, "date", event.target.value)
                              }
                              placeholder="Contoh: Januari 2020 - Pertama bertemu"
                              className={INPUT_CLASS}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <label
                                htmlFor={`story-description-${index}`}
                                className={LABEL_CLASS}
                              >
                                Cerita
                              </label>
                              <span className="text-xs tabular-nums text-[#929A94]">
                                {story.description.length}/1200
                              </span>
                            </div>
                            <textarea
                              id={`story-description-${index}`}
                              rows={4}
                              maxLength={1200}
                              value={story.description}
                              onChange={(event) =>
                                updateStory(
                                  index,
                                  "description",
                                  event.target.value,
                                )
                              }
                              className={`${INPUT_CLASS} resize-y leading-6`}
                            />
                          </div>
                          <PhotoField
                            id={`story-photo-${index}`}
                            label="Foto cerita"
                            photoUrl={story.photo_url}
                            upload={getUploadFeedback(`story-${index}`)}
                            onSelect={(event) =>
                              uploadThen(`story-${index}`, event, (url) =>
                                updateStory(index, "photo_url", url),
                              )
                            }
                            onClear={() =>
                              clearMedia(`story-${index}`, () =>
                                updateStory(index, "photo_url", ""),
                              )
                            }
                            compact
                          />
                        </div>
                      </article>
                    ))}
                    {form.love_stories.length < MAX_LOVE_STORIES && (
                      <button
                        type="button"
                        onClick={addStory}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#AEB6AF] text-sm font-semibold text-[#3F6253] transition hover:border-[#3F6253] hover:bg-[#EDF2EE]"
                      >
                        <BookHeart className="h-4 w-4" /> Tambah cerita (
                        {form.love_stories.length}/{MAX_LOVE_STORIES})
                      </button>
                    )}
                  </fieldset>
                )}

                {activeSection === "galeri" && (
                  <fieldset className="space-y-6">
                    <legend className="sr-only">Galeri</legend>
                    <div>
                      <label
                        htmlFor="gallery_video_url"
                        className={LABEL_CLASS}
                      >
                        Link video YouTube
                      </label>
                      <input
                        id="gallery_video_url"
                        type="url"
                        value={form.gallery_video_url}
                        onChange={(event) =>
                          updateField("gallery_video_url", event.target.value)
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className={INPUT_CLASS}
                      />
                    </div>

                    {form.gallery_photos.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {form.gallery_photos.map((url, index) => (
                          <article
                            key={`${url}-${index}`}
                            className="overflow-hidden rounded-md border border-[#D7DCD7] bg-white"
                          >
                            <div className="relative">
                              <img
                                src={url}
                                alt={`Galeri ${index + 1}`}
                                className="aspect-[4/5] w-full object-cover"
                              />
                              <span className="absolute left-2 top-2 bg-[#26312C]/85 px-2 py-1 text-[0.6rem] font-semibold text-white backdrop-blur-sm">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              {index === 0 && (
                                <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#F4E7BF] px-2 py-1 text-[0.58rem] font-bold text-[#6D5724]">
                                  <Star className="h-3 w-3" /> Pertama
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-4 border-t border-[#E1E4E1]">
                              <button
                                type="button"
                                onClick={() => moveGalleryPhoto(index, -1)}
                                disabled={index === 0}
                                title="Geser ke kiri"
                                aria-label={`Geser foto ${index + 1} ke kiri`}
                                className="grid h-10 place-items-center text-[#68736D] hover:bg-[#F1F4F1] disabled:opacity-30"
                              >
                                <ArrowLeft className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveGalleryPhoto(index, 1)}
                                disabled={
                                  index === form.gallery_photos.length - 1
                                }
                                title="Geser ke kanan"
                                aria-label={`Geser foto ${index + 1} ke kanan`}
                                className="grid h-10 place-items-center border-l border-[#E1E4E1] text-[#68736D] hover:bg-[#F1F4F1] disabled:opacity-30"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveGalleryPhotoToFront(index)}
                                disabled={index === 0}
                                title="Jadikan foto pertama"
                                aria-label={`Jadikan foto ${index + 1} sebagai foto pertama`}
                                className="grid h-10 place-items-center border-l border-[#E1E4E1] text-[#98762F] hover:bg-[#F7F3E8] disabled:opacity-30"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeGalleryPhoto(index)}
                                title="Hapus foto"
                                aria-label={`Hapus foto galeri ${index + 1}`}
                                className="grid h-10 place-items-center border-l border-[#E1E4E1] text-[#7A4549] hover:bg-[#F8ECEE]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}

                    {form.gallery_photos.length < MAX_GALLERY_PHOTOS && (
                      <label
                        htmlFor="gallery-upload"
                        className={`flex min-h-24 flex-col items-center justify-center rounded-md border border-dashed border-[#AEB6AF] bg-white px-5 text-center text-[#3F6253] transition hover:border-[#3F6253] hover:bg-[#EDF2EE] ${
                          getUploadFeedback("gallery").status === "uploading"
                            ? "pointer-events-none opacity-55"
                            : "cursor-pointer"
                        }`}
                      >
                        {getUploadFeedback("gallery").status === "uploading" ? (
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                          <Upload className="h-5 w-5" />
                        )}
                        <span className="mt-2 text-sm font-semibold">
                          {getUploadFeedback("gallery").status === "uploading"
                            ? "Mengunggah foto"
                            : `Tambah beberapa foto (${form.gallery_photos.length}/${MAX_GALLERY_PHOTOS})`}
                        </span>
                        <span className="mt-1 text-xs text-[#7D8781]">
                          JPEG, PNG, atau WEBP maksimal 10 MB per foto.
                        </span>
                        <input
                          id="gallery-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={uploadGalleryPhotos}
                          disabled={
                            getUploadFeedback("gallery").status === "uploading"
                          }
                          className="sr-only"
                        />
                      </label>
                    )}
                    {getUploadFeedback("gallery").message && (
                      <p
                        role={
                          getUploadFeedback("gallery").status === "error"
                            ? "alert"
                            : "status"
                        }
                        className={`flex items-center gap-2 text-xs ${
                          getUploadFeedback("gallery").status === "error"
                            ? "text-[#A03F47]"
                            : "text-[#3F6253]"
                        }`}
                      >
                        {getUploadFeedback("gallery").status === "error" ? (
                          <CircleAlert className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        {getUploadFeedback("gallery").message}
                      </p>
                    )}
                  </fieldset>
                )}

                {activeSection === "gift" && (
                  <fieldset className="space-y-4">
                    <legend className="sr-only">Wedding gift</legend>
                    {form.wedding_gifts.length === 0 && (
                      <div className="border-l-2 border-[#3F6253] bg-[#EAF0EB] px-4 py-3 text-sm leading-6 text-[#4D6559]">
                        Belum ada informasi hadiah. Section Wedding Gift tidak
                        akan ditampilkan di undangan.
                      </div>
                    )}
                    {form.wedding_gifts.map((giftItem, index) => (
                      <article
                        key={index}
                        className="rounded-md border border-[#D8DDD8] bg-white p-5"
                      >
                        <div className="flex items-center justify-between border-b border-[#E2E5E2] pb-4">
                          <div>
                            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#7A4549] uppercase">
                              Gift {String(index + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-1 font-serif text-lg">
                              {giftItem.gift_type === "bank"
                                ? "Rekening bank"
                                : "Pengiriman kado"}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGift(index)}
                            title="Hapus gift"
                            aria-label={`Hapus gift ${index + 1}`}
                            className="grid h-9 w-9 place-items-center rounded-md border border-[#D6DAD6] text-[#7A4549] hover:border-[#7A4549] hover:bg-[#7A4549] hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-5">
                          <p className={LABEL_CLASS}>Jenis gift</p>
                          <div className="mt-2 grid grid-cols-2 border border-[#CDD2CC]">
                            <button
                              type="button"
                              onClick={() =>
                                updateGift(index, "gift_type", "bank")
                              }
                              className={`flex h-11 items-center justify-center gap-2 text-xs font-semibold transition ${
                                giftItem.gift_type === "bank"
                                  ? "bg-[#3F6253] text-white"
                                  : "bg-white text-[#68736D]"
                              }`}
                            >
                              <Gift className="h-4 w-4" /> Rekening
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateGift(index, "gift_type", "kado")
                              }
                              className={`flex h-11 items-center justify-center gap-2 border-l border-[#CDD2CC] text-xs font-semibold transition ${
                                giftItem.gift_type === "kado"
                                  ? "bg-[#3F6253] text-white"
                                  : "bg-white text-[#68736D]"
                              }`}
                            >
                              <HeartHandshake className="h-4 w-4" /> Kirim kado
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 space-y-5">
                          {giftItem.gift_type === "bank" && (
                            <div>
                              <label
                                htmlFor={`gift-bank-${index}`}
                                className={LABEL_CLASS}
                              >
                                Nama bank
                              </label>
                              <input
                                id={`gift-bank-${index}`}
                                type="text"
                                maxLength={80}
                                value={giftItem.bank_name}
                                onChange={(event) =>
                                  updateGift(
                                    index,
                                    "bank_name",
                                    event.target.value,
                                  )
                                }
                                placeholder="Contoh: BCA"
                                className={INPUT_CLASS}
                              />
                            </div>
                          )}
                          <div>
                            <label
                              htmlFor={`gift-name-${index}`}
                              className={LABEL_CLASS}
                            >
                              {giftItem.gift_type === "bank"
                                ? "Atas nama"
                                : "Nama penerima"}
                            </label>
                            <input
                              id={`gift-name-${index}`}
                              type="text"
                              maxLength={150}
                              value={giftItem.account_name}
                              onChange={(event) =>
                                updateGift(
                                  index,
                                  "account_name",
                                  event.target.value,
                                )
                              }
                              className={INPUT_CLASS}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`gift-account-${index}`}
                              className={LABEL_CLASS}
                            >
                              {giftItem.gift_type === "bank"
                                ? "Nomor rekening"
                                : "Alamat pengiriman"}
                            </label>
                            {giftItem.gift_type === "bank" ? (
                              <input
                                id={`gift-account-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={80}
                                value={giftItem.account_number}
                                onChange={(event) =>
                                  updateGift(
                                    index,
                                    "account_number",
                                    event.target.value,
                                  )
                                }
                                className={INPUT_CLASS}
                              />
                            ) : (
                              <textarea
                                id={`gift-account-${index}`}
                                rows={3}
                                maxLength={500}
                                value={giftItem.account_number}
                                onChange={(event) =>
                                  updateGift(
                                    index,
                                    "account_number",
                                    event.target.value,
                                  )
                                }
                                className={`${INPUT_CLASS} resize-y`}
                              />
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                    {form.wedding_gifts.length < MAX_WEDDING_GIFTS && (
                      <button
                        type="button"
                        onClick={addGift}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#AEB6AF] text-sm font-semibold text-[#3F6253] transition hover:border-[#3F6253] hover:bg-[#EDF2EE]"
                      >
                        <Gift className="h-4 w-4" /> Tambah gift (
                        {form.wedding_gifts.length}/{MAX_WEDDING_GIFTS})
                      </button>
                    )}
                  </fieldset>
                )}

                {activeSection === "musik" && (
                  <fieldset className="space-y-6">
                    <legend className="sr-only">Musik latar</legend>
                    <div>
                      <label htmlFor="music_url" className={LABEL_CLASS}>
                        Pilih lagu
                      </label>
                      <select
                        id="music_url"
                        value={form.music_url}
                        onChange={(event) =>
                          updateField("music_url", event.target.value)
                        }
                        className={INPUT_CLASS}
                      >
                        <option value="">Tanpa musik</option>
                        {musicLibrary.map((track) => (
                          <option key={track.id} value={track.file_url}>
                            {track.title}
                            {track.artist ? ` - ${track.artist}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.music_url ? (
                      <div className="rounded-md border border-[#D8DDD8] bg-white p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3F6253]">
                          <Music2 className="h-4 w-4" /> Pratinjau lagu
                        </div>
                        <audio
                          key={form.music_url}
                          controls
                          src={form.music_url}
                          className="w-full"
                        >
                          Browser tidak mendukung pemutar audio.
                        </audio>
                      </div>
                    ) : (
                      <div className="border-l-2 border-[#B58A43] bg-[#F7F3E9] px-4 py-3 text-sm text-[#746A55]">
                        Undangan akan dibuka tanpa musik latar.
                      </div>
                    )}
                  </fieldset>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 z-30 border-t border-[#D7DCD7] bg-white/95 px-4 py-3 shadow-[0_-12px_30px_-28px_rgba(25,40,31,0.7)] backdrop-blur sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0" aria-live="polite">
                  <p className="flex items-center gap-2 text-xs font-semibold text-[#4E5B54]">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        saveState === "error"
                          ? "bg-[#A03F47]"
                          : saveState === "saving" || isUploading
                            ? "animate-pulse bg-[#B58A43]"
                            : isDirty
                              ? "bg-[#B58A43]"
                              : "bg-[#4F735F]"
                      }`}
                    />
                    {saveState === "saving"
                      ? "Menyimpan perubahan"
                      : isUploading
                        ? "Upload sedang berjalan"
                        : isDirty
                          ? "Ada perubahan belum tersimpan"
                          : saveState === "success"
                            ? "Perubahan berhasil disimpan"
                            : "Semua perubahan tersimpan"}
                  </p>
                  {saveState === "error" && (
                    <p
                      role="alert"
                      className="mt-1 max-w-sm truncate text-xs text-[#A03F47]"
                    >
                      {saveMessage}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => setConfirmAction("discard")}
                      title="Batalkan perubahan"
                      className="grid h-11 w-11 place-items-center rounded-md border border-[#D2D7D2] text-[#68736D] transition hover:border-[#7A4549] hover:text-[#7A4549] sm:flex sm:w-auto sm:px-3"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="hidden text-xs font-semibold sm:inline">
                        Batalkan
                      </span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!isDirty || saveState === "saving" || isUploading}
                    className="flex h-11 min-w-[8.5rem] items-center justify-center gap-2 rounded-md bg-[#3F6253] px-4 text-xs font-semibold text-white transition hover:bg-[#304D40] disabled:cursor-not-allowed disabled:bg-[#AEB6B0]"
                  >
                    {saveState === "saving" ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saveState === "saving" ? "Menyimpan" : "Simpan perubahan"}
                  </button>
                </div>
              </div>

              {saveState === "error" && hasConflict && (
                <button
                  type="button"
                  onClick={() => setConfirmAction("reload")}
                  className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#A03F47]/40 bg-[#FAEFF0] text-xs font-semibold text-[#8D3840]"
                >
                  <RefreshCw className="h-4 w-4" /> Muat data terbaru
                </button>
              )}
            </div>
          </form>
        </main>

        <aside
          className={`${viewMode === "preview" ? "block" : "hidden"} min-w-0 bg-[#E7EAE6] lg:sticky lg:top-[4.5rem] lg:block lg:h-[calc(100vh-4.5rem)]`}
        >
          <PreviewPanel
            token={token}
            version={previewVersion}
            onRefresh={() => setPreviewVersion((current) => current + 1)}
            mobile={viewMode === "preview"}
          />
        </aside>
      </div>

      {confirmAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E2B25]/55 px-5 backdrop-blur-sm"
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="w-full max-w-sm rounded-md border border-[#D9DDD8] bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#F7EDEF] text-[#7A4549]">
                <CircleAlert className="h-5 w-5" />
              </span>
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                aria-label="Tutup konfirmasi"
                className="grid h-9 w-9 place-items-center rounded-md text-[#758079] hover:bg-[#F1F3F0]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h2 id="discard-title" className="mt-5 font-serif text-2xl">
              {confirmAction === "reload"
                ? "Muat data terbaru?"
                : "Batalkan perubahan?"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#748078]">
              {confirmAction === "reload"
                ? "Versi terbaru dari server akan dimuat dan perubahan lokal pada editor ini akan dibuang."
                : "Semua perubahan sejak penyimpanan terakhir akan dikembalikan."}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="h-11 rounded-md border border-[#CDD2CC] text-xs font-semibold text-[#65706A]"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className="h-11 rounded-md bg-[#7A4549] text-xs font-semibold text-white hover:bg-[#64373B]"
              >
                {confirmAction === "reload"
                  ? "Muat terbaru"
                  : "Batalkan perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
