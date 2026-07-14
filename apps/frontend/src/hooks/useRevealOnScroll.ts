import { useEffect, useRef, useState } from 'react';

/**
 * Deteksi kapan elemen masuk viewport (sekali saja -- setelah terlihat,
 * observer dilepas supaya animasi reveal tidak mengulang saat scroll balik).
 * Dipakai oleh komponen <Reveal> untuk animasi scroll-reveal per section.
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
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      // rootMargin negatif di bawah: elemen baru dianggap "terlihat" setelah
      // benar-benar masuk ~10% dari tepi bawah layar, bukan pas menyentuh tepi --
      // supaya user sempat melihat gerakan reveal-nya.
      { threshold, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
