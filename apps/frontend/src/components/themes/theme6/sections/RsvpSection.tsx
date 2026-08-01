import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import type { AttendanceStatus } from '../../../../types/wedding';
import Reveal from '../../../shared/Reveal';
import { SectionTitle } from '../components/ornaments';

interface RsvpSectionProps {
  guestName?: string;
}

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'attending', label: 'Hadir' },
  { value: 'maybe', label: 'Ragu' },
  { value: 'not_attending', label: 'Tidak' },
];

function attendanceLabel(status: string): string {
  if (status === 'attending') return 'Hadir';
  if (status === 'not_attending') return 'Tidak Hadir';
  return 'Ragu';
}

function badgeClass(status: string): string {
  if (status === 'attending') return 'bg-[var(--color-primary)]/15 text-[var(--sage-deep)]';
  if (status === 'not_attending') return 'bg-neutral-500/10 text-[var(--t6-muted)]';
  return 'bg-[var(--t6-gold)]/25 text-[var(--t6-ink)]';
}

/** Section 7: form RSVP (3 pilihan kehadiran) + daftar ucapan. Section baru
 *  di-mount setelah undangan dibuka, jadi fetch daftar cukup sekali di mount. */
export default function RsvpSection({ guestName }: RsvpSectionProps) {
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [name, setName] = useState(guestName || '');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRsvps().then(setRsvps).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const newRsvp = await submitRsvp(name, attendance, message);
      setRsvps((prev) => [newRsvp, ...prev]);
      setMessage('');
    } catch {
      alert('Gagal mengirim ucapan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-sm border border-[var(--color-primary)]/30 bg-[var(--t6-card)] px-4 py-3 text-sm text-[var(--t6-ink)] placeholder:text-[var(--t6-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40';

  return (
    <section className="px-7 py-20">
      <Reveal variant="up">
        <SectionTitle kicker="RSVP" title="Ucapan & Doa" />
      </Reveal>
      <Reveal variant="up" delay={80}>
        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
            placeholder="Nama Anda"
            className={inputClass}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={400}
            placeholder="Tulis ucapan & doa"
            className={`${inputClass} resize-none`}
          />
          <div className="grid grid-cols-3 gap-2">
            {ATTENDANCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAttendance(option.value)}
                className={`rounded-sm border px-2 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors ${
                  attendance === option.value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-primary)]/30 bg-[var(--t6-card)] text-[var(--t6-muted)] hover:bg-[var(--color-primary)]/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-[var(--color-primary)] py-3 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>
      </Reveal>

      <div className="mt-8">
        <p className="text-[0.6rem] tracking-[0.35em] text-[var(--color-primary)] uppercase">
          {rsvps.length} Ucapan
        </p>
        <div className="mt-3 max-h-96 space-y-3 overflow-y-auto pr-1">
          {rsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="border border-[var(--color-primary)]/25 bg-[var(--t6-card)] px-4 py-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <p className="truncate font-vintage text-lg text-[var(--sage-deep)]">
                  {rsvp.guest_name}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6rem] tracking-[0.15em] uppercase ${badgeClass(rsvp.attendance_status)}`}
                >
                  {attendanceLabel(rsvp.attendance_status)}
                </span>
              </div>
              {rsvp.message && (
                <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-[var(--t6-muted)]">
                  {rsvp.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
