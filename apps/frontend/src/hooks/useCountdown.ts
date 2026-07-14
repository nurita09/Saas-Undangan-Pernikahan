import { useEffect, useState } from 'react';
import { parseWibDate } from '../utils/formatDate';

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
 * Hitung mundur menuju `targetDateString` (jam dinding WIB dari backend, lihat
 * konvensi di utils/formatDate.ts), update tiap detik. Target diparse lewat
 * parseWibDate supaya tamu di timezone mana pun menghitung mundur ke instant
 * yang sama. Mengembalikan null kalau targetDateString kosong.
 */
export function useCountdown(targetDateString: string | null | undefined): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    targetDateString ? computeTimeLeft(parseWibDate(targetDateString)) : null,
  );

  useEffect(() => {
    if (!targetDateString) {
      setTimeLeft(null);
      return;
    }

    const target = parseWibDate(targetDateString);
    setTimeLeft(computeTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateString]);

  return timeLeft;
}
