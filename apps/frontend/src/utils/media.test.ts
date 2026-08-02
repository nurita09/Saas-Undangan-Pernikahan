import { describe, expect, it } from 'vitest';
import { isVideoUrl } from './media';

describe('isVideoUrl', () => {
  it('mengenali ekstensi video yang didukung', () => {
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.mp4')).toBe(true);
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.webm')).toBe(true);
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.mov')).toBe(true);
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.m4v')).toBe(true);
  });

  it('tidak menganggap foto sebagai video', () => {
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.jpg')).toBe(false);
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.png')).toBe(false);
    expect(isVideoUrl('https://cdn.example.com/weddings/1/abc.webp')).toBe(false);
  });

  it('deteksi tidak terganggu oleh query string atau fragment', () => {
    expect(isVideoUrl('https://cdn.example.com/abc.mp4?v=2')).toBe(true);
    expect(isVideoUrl('https://cdn.example.com/abc.jpg#section')).toBe(false);
  });

  it('perbandingan ekstensi tidak case-sensitive', () => {
    expect(isVideoUrl('https://cdn.example.com/abc.MP4')).toBe(true);
  });

  it('nilai kosong/tanpa ekstensi bukan video', () => {
    expect(isVideoUrl(null)).toBe(false);
    expect(isVideoUrl(undefined)).toBe(false);
    expect(isVideoUrl('')).toBe(false);
    expect(isVideoUrl('https://cdn.example.com/tanpa-ekstensi')).toBe(false);
  });
});
