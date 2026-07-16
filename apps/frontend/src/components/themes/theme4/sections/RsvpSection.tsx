import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import Reveal from '../../../shared/Reveal';
import { ArchDivider } from '../components/ornaments';

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  'w-full rounded-xl border border-[var(--color-primary)]/40 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]';

/** Section 7: Doa & Ucapan -- form RSVP. Baru di-mount setelah undangan
 *  dibuka, jadi fetch daftar ucapan cukup sekali di mount. */
export default function RsvpSection({ guestName }: RsvpSectionProps) {
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'not_attending'>('attending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRsvps().then(setRsvps).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setIsSubmitting(true);
    try {
      const newRsvp = await submitRsvp(rsvpName, rsvpStatus, rsvpMessage);
      setRsvps((prev) => [newRsvp, ...prev]);
      setRsvpMessage('');
    } catch {
      alert('Gagal mengirim ucapan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center font-serif text-2xl font-semibold text-neutral-800">
            Doa &amp; Ucapan
          </h2>
          <ArchDivider className="mx-auto mt-3 w-44" />
          <p className="mt-4 text-center text-sm text-neutral-500 leading-relaxed">
            Doa dan ucapan terbaik Anda menjadi hadiah yang sangat berarti bagi kami.
          </p>
        </Reveal>

        <Reveal variant="up" delay={150}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                Nama
              </label>
              <input
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                required
                className={INPUT_CLASS}
                placeholder="Nama anda"
              />
            </div>
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                Doa / Ucapan
              </label>
              <textarea
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                className={`h-28 resize-none ${INPUT_CLASS}`}
                placeholder="Barakallahu lakuma..."
              ></textarea>
            </div>
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-primary)]">
                Konfirmasi Kehadiran
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 transition ${rsvpStatus === 'attending' ? 'border-[var(--color-primary)]' : 'border-neutral-200'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={rsvpStatus === 'attending'}
                    onChange={() => setRsvpStatus('attending')}
                  />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                    ✓
                  </span>
                  <span className="text-sm text-neutral-700">InsyaAllah Hadir</span>
                </label>
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 transition ${rsvpStatus === 'not_attending' ? 'border-[var(--color-primary)]' : 'border-neutral-200'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={rsvpStatus === 'not_attending'}
                    onChange={() => setRsvpStatus('not_attending')}
                  />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    ✕
                  </span>
                  <span className="text-sm text-neutral-700">Berhalangan</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : '☪ Kirim Doa & Ucapan'}
            </button>
          </form>
        </Reveal>

        <div className="mt-10 max-h-[500px] space-y-4 overflow-y-auto pr-1">
          {rsvps.map((rsvp) => (
            <div key={rsvp.id} className="rounded-2xl border border-[var(--color-primary)]/25 bg-[var(--color-secondary)] p-5">
              <h4 className="font-serif font-bold text-neutral-800">{rsvp.guest_name}</h4>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
                {rsvp.attendance_status === 'attending'
                  ? 'InsyaAllah Hadir'
                  : rsvp.attendance_status === 'not_attending'
                    ? 'Berhalangan'
                    : 'Belum Pasti'}
              </p>
              {rsvp.message && (
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
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
