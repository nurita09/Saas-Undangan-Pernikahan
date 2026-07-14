import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import Reveal from '../../../shared/Reveal';
import { OrnamentDivider } from '../components/ornaments';

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  'w-full border border-[#C9A227]/50 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]';

/** Section 7: Atur Pangestu -- form RSVP + daftar ucapan. Section ini baru
 *  di-mount setelah undangan dibuka, jadi fetch cukup sekali di mount. */
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
    <section className="px-6 py-16 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center text-2xl font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Atur Pangestu
          </h2>
          <OrnamentDivider className="mx-auto mt-3 w-44" />
          <p className="mt-4 text-center text-sm text-neutral-600 leading-relaxed">
            Doa, pangestu, dan ucapan terbaik panjenengan menjadi kenangan indah bagi kami.
          </p>
        </Reveal>

        <Reveal variant="up" delay={150}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                Asma / Nama
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
              <label className="mb-2 block text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                Ucapan
              </label>
              <textarea
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                className={`h-28 resize-none ${INPUT_CLASS}`}
                placeholder="Ucapan & doa"
              ></textarea>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest font-semibold text-[#C9A227]">
                Konfirmasi Kehadiran
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border bg-white px-4 py-3 transition ${rsvpStatus === 'attending' ? 'border-[var(--color-primary)]' : 'border-[#C9A227]/40'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={rsvpStatus === 'attending'}
                    onChange={() => setRsvpStatus('attending')}
                  />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                    ✓
                  </span>
                  <span className="text-sm text-neutral-700">Rawuh</span>
                </label>
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border bg-white px-4 py-3 transition ${rsvpStatus === 'not_attending' ? 'border-[var(--color-primary)]' : 'border-[#C9A227]/40'}`}
                >
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={rsvpStatus === 'not_attending'}
                    onChange={() => setRsvpStatus('not_attending')}
                  />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    ✕
                  </span>
                  <span className="text-sm text-neutral-700">Mboten Rawuh</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] py-3 text-sm font-medium tracking-wider text-[var(--color-secondary)] border border-[#C9A227] hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Ngintun...' : 'Kirim Pangestu'}
            </button>
          </form>
        </Reveal>

        <div className="mt-10 max-h-[500px] space-y-4 overflow-y-auto pr-1">
          {rsvps.map((rsvp) => (
            <div key={rsvp.id} className="border border-[#C9A227]/30 bg-white p-5">
              <h4 className="font-serif font-bold text-[var(--color-primary)]">{rsvp.guest_name}</h4>
              <p className="mt-0.5 text-xs uppercase tracking-widest text-[#C9A227]">
                {rsvp.attendance_status === 'attending'
                  ? 'Rawuh'
                  : rsvp.attendance_status === 'not_attending'
                    ? 'Mboten Rawuh'
                    : 'Mangke Rumiyin'}
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
