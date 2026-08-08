import { useEffect, useRef, useState } from "react";

/**
 * Deteksi kapan elemen masuk/keluar viewport. Mode default berulang setiap
 * kali; opsi `once` berhenti mengamati setelah elemen tampil pertama kali.
 * Dipakai oleh komponen <Reveal> untuk animasi scroll-reveal semua tema.
 */
export function useRevealOnScroll<T extends HTMLElement>(
  threshold = 0.15,
  once = false,
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Browser lawas tanpa IntersectionObserver: langsung tampilkan saja.
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      // rootMargin negatif di bawah: elemen baru dianggap "terlihat" setelah
      // benar-benar masuk ~10% dari tepi bawah layar, bukan pas menyentuh tepi --
      // supaya user sempat melihat gerakan reveal-nya. Margin yang sama juga
      // jadi jeda sebelum dianggap "keluar" lagi saat scroll balik ke bawah.
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold]);

  return { ref, isVisible };
}
