import type { ComponentType } from 'react';
import Theme1 from './theme1/index.tsx';
import Theme2 from './theme2/index.tsx';
import Theme3 from './theme3/index.tsx';
import Theme4 from './theme4/index.tsx';
import type { ThemeComponentProps } from '../../types/wedding';

// Tambah tema baru: import komponennya di atas, lalu daftarkan di sini.
// theme_id harus sama persis dengan nilai kolom weddings.theme_id di database.
// Warna default per tema di-set backend saat create (routes/wedding.rs
// default_colors_for_theme) -- selaraskan kalau menambah tema.
const THEME_COMPONENTS: Record<number, ComponentType<ThemeComponentProps>> = {
  1: Theme1,
  2: Theme2,
  3: Theme3,
  4: Theme4,
};

export interface ThemeOption {
  id: number;
  label: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 1, label: 'Theme 1 - Floral Elegant' },
  { id: 2, label: 'Theme 2 - Adat Jawa' },
  { id: 3, label: 'Theme 3 - Modern Elegant (Dark)' },
  { id: 4, label: 'Theme 4 - Islami Modern' },
];

export function getThemeComponent(themeId: number): ComponentType<ThemeComponentProps> {
  return THEME_COMPONENTS[themeId] ?? Theme1;
}
