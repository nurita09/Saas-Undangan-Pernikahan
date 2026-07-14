import { describe, expect, it } from 'vitest';
import {
  parseWibDate,
  formatLongDate,
  formatShortDate,
  formatCoverDate,
  formatTime,
  buildIcsDataUrl,
} from './formatDate';

// Konvensi platform: timestamp backend = jam dinding WIB walau bertanda "Z".
const SAMPLE = '2026-12-01T08:30:00Z';

describe('parseWibDate', () => {
  it('menafsirkan timestamp sebagai jam dinding WIB (+07:00)', () => {
    // 08:30 WIB = 01:30 UTC pada tanggal yang sama.
    expect(parseWibDate(SAMPLE).getTime()).toBe(Date.UTC(2026, 11, 1, 1, 30, 0));
  });

  it('menerima format pendek dari <input type="datetime-local">', () => {
    expect(parseWibDate('2026-12-01T08:30').getTime()).toBe(Date.UTC(2026, 11, 1, 1, 30, 0));
  });
});

describe('format tampilan', () => {
  it('formatTime menampilkan jam dinding WIB apa adanya', () => {
    expect(formatTime(SAMPLE)).toBe('08.30 WIB');
  });

  it('formatLongDate memakai hari & bulan Indonesia di zona WIB', () => {
    expect(formatLongDate(SAMPLE)).toBe('Selasa, 01 Desember 2026');
  });

  it('formatShortDate & formatCoverDate mengambil komponen literal string', () => {
    expect(formatShortDate(SAMPLE)).toBe('01.12.2026');
    expect(formatCoverDate(SAMPLE)).toBe('01. 12. 2026');
  });

  it('null/undefined menghasilkan null', () => {
    expect(formatTime(null)).toBeNull();
    expect(formatLongDate(undefined)).toBeNull();
    expect(formatShortDate(null)).toBeNull();
  });

  it('jam larut malam WIB tidak menggeser tanggal tampilan', () => {
    // 23:00 WIB = 16:00 UTC; komponen literal harus tetap tanggal 1.
    expect(formatShortDate('2026-12-01T23:00:00Z')).toBe('01.12.2026');
    expect(formatLongDate('2026-12-01T23:00:00Z')).toContain('01 Desember 2026');
  });
});

describe('buildIcsDataUrl', () => {
  it('DTSTART memakai instant UTC yang benar dari jam WIB', () => {
    const url = buildIcsDataUrl({
      title: 'Tes',
      description: 'Tes',
      location: 'Tes',
      startDate: SAMPLE,
    });
    const decoded = decodeURIComponent(url!);
    // 08:30 WIB = 01:30 UTC.
    expect(decoded).toContain('DTSTART:20261201T013000Z');
    // Durasi default 2 jam.
    expect(decoded).toContain('DTEND:20261201T033000Z');
  });

  it('null kalau tanggal belum diisi', () => {
    expect(buildIcsDataUrl({ title: 'x', description: 'x', location: 'x', startDate: null })).toBeNull();
  });
});
