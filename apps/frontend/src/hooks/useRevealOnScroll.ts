import { useEffect, useRef, useState } from 'react';

/**
 * Deteksi kapan elemen masuk/keluar viewport -- berulang setiap kali (scroll
 * turun tampil, scroll naik lalu turun lagi akan tampil ulang animasinya),
 * bukan cuma sekali seumur hidup elemen. Dipakai oleh komponen <Reveal> untuk
 * animasi scroll-reveal per section di semua tema.
 */
export function useRevealOnScroll<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Browser lawas tanpa IntersectionObserver: langsung tampilkan saja.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      // rootMargin negatif di bawah: elemen baru dianggap "terlihat" setelah
      // benar-benar masuk ~10% dari tepi bawah layar, bukan pas menyentuh tepi --
      // supaya user sempat melihat gerakan reveal-nya. Margin yang sama juga
      // jadi jeda sebelum dianggap "keluar" lagi saat scroll balik ke bawah.
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
