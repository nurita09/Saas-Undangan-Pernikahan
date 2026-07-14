import type { ComponentType } from 'react';
import Theme1 from './theme1/index.tsx';
import type { ThemeComponentProps } from '../../types/wedding';

// Tambah tema baru: import komponennya di atas, lalu daftarkan di sini.
// theme_id harus sama persis dengan nilai kolom weddings.theme_id di database.
const THEME_COMPONENTS: Record<number, ComponentType<ThemeComponentProps>> = {
  1: Theme1,
};

export interface ThemeOption {
  id: number;
  label: string;
}

export const THEME_OPTIONS: ThemeOption[] = [{ id: 1, label: 'Theme 1 - Floral Elegant' }];

export function getThemeComponent(themeId: number): ComponentType<ThemeComponentProps> {
  return THEME_COMPONENTS[themeId] ?? Theme1;
}
