import { useEffect, useState } from 'react';

export interface TimeLeft {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(targetDate: Date): TimeLeft {
  const remainingMs = Math.max(targetDate.getTime() - Date.now(), 0);
  return {
    total: remainingMs,
    days: Math.floor(remainingMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remainingMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remainingMs / (1000 * 60)) % 60),
    seconds: Math.floor((remainingMs / 1000) % 60),
  };
}

/**
 * Hitung mundur menuju `targetDateString` (ISO string), update tiap detik.
 * Mengembalikan null kalau targetDateString kosong (mis. wedding_date belum diisi).
 */
export function useCountdown(targetDateString: string | null | undefined): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    targetDateString ? computeTimeLeft(new Date(targetDateString)) : null,
  );

  useEffect(() => {
    if (!targetDateString) {
      setTimeLeft(null);
      return;
    }

    const target = new Date(targetDateString);
    setTimeLeft(computeTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  return timeLeft;
}
