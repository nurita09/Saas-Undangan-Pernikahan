// KONVENSI TIMEZONE PLATFORM: nilai datetime dari backend ("2026-11-04T08:00:00Z")
// adalah JAM DINDING WIB (Asia/Jakarta) yang kebetulan disimpan bertanda "Z" --
// pasar produk ini Indonesia, dan editor menyimpan input <datetime-local> apa
// adanya tanpa konversi. Karena itu JANGAN pernah `new Date(iso)` langsung untuk
// ditampilkan (browser akan menggesernya ke timezone lokal); selalu lewat
// parseWibDate() + format dengan timeZone 'Asia/Jakarta', atau ambil komponen
// literal dari string-nya.

const WIB_TIME_ZONE = 'Asia/Jakarta';

/**
 * Tafsirkan datetime dari backend sebagai jam dinding WIB, kembalikan Date yang
 * menunjuk INSTANT yang benar secara global (dipakai countdown & file .ics --
 * tamu di timezone mana pun melihat hitungan mundur ke momen yang sama).
 */
export function parseWibDate(isoString: string): Date {
  // "2026-11-04T08:00[:00Z]" -> ambil menit-nya saja, tempel offset WIB eksplisit.
  return new Date(`${isoString.slice(0, 16)}:00+07:00`);
}

export function formatLongDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: WIB_TIME_ZONE,
  }).format(parseWibDate(isoString));
}

export function formatShortDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  // Komponen literal dari string -- bebas dari pergeseran timezone browser.
  const dd = isoString.slice(8, 10);
  const mm = isoString.slice(5, 7);
  const yyyy = isoString.slice(0, 4);
  return `${dd}.${mm}.${yyyy}`;
}

/** Variasi tampilan cover: "01. 12. 2026". */
export function formatCoverDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const dd = isoString.slice(8, 10);
  const mm = isoString.slice(5, 7);
  const yyyy = isoString.slice(0, 4);
  return `${dd}. ${mm}. ${yyyy}`;
}

export function formatTime(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const formatted = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: WIB_TIME_ZONE,
  }).format(parseWibDate(isoString));
  return `${formatted} WIB`;
}

interface BuildIcsArgs {
  title: string;
  description: string;
  location: string;
  startDate: string | null | undefined;
}

/** Bikin data: URL berkas .ics supaya tombol "Save to Calendar" bisa langsung diunduh. */
export function buildIcsDataUrl({ title, description, location, startDate }: BuildIcsArgs): string | null {
  if (!startDate) return null;

  const start = parseWibDate(startDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const toIcsDate = (date: Date) => `${date.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return `data:text/calendar;charset=utf8,${encodeURIComponent(lines.join('\r\n'))}`;
}
