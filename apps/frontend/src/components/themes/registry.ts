import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { ThemeComponentProps } from "../../types/wedding";

type ThemeComponent = LazyExoticComponent<ComponentType<ThemeComponentProps>>;

const Theme1 = lazy(() => import("./theme1/index.tsx"));
const Theme2 = lazy(() => import("./theme2/index.tsx"));
const Theme3 = lazy(() => import("./theme3/index.tsx"));
const Theme4 = lazy(() => import("./theme4/index.tsx"));
const Theme5 = lazy(() => import("./theme5/index.tsx"));
const Theme6 = lazy(() => import("./theme6/index.tsx"));

// Tambah tema baru: import komponennya di atas, lalu daftarkan di sini.
// theme_id harus sama persis dengan nilai kolom weddings.theme_id di database.
// Warna default per tema di-set backend saat create (routes/wedding.rs
// default_colors_for_theme) -- selaraskan kalau menambah tema.
const THEME_COMPONENTS: Record<number, ThemeComponent> = {
  1: Theme1,
  2: Theme2,
  3: Theme3,
  4: Theme4,
  5: Theme5,
  6: Theme6,
};

export interface ThemeOption {
  id: number;
  label: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 1, label: "Theme 1 - Floral Elegant" },
  { id: 2, label: "Theme 2 - Adat Jawa" },
  { id: 3, label: "Theme 3 - Modern Elegant (Dark)" },
  { id: 4, label: "Theme 4 - Islami Modern" },
  { id: 5, label: "Theme 5 - Retro Pop" },
  { id: 6, label: "Theme 6 - Vintage Monogram" },
];

export function getThemeComponent(themeId: number): ThemeComponent {
  return THEME_COMPONENTS[themeId] ?? Theme1;
}
