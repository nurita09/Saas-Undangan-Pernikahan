export function formatLongDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoString));
}

export function formatShortDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}`;
}

export function formatTime(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const formatted = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
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

  const start = new Date(startDate);
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
