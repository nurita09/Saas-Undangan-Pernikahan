import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import Reveal from '../components/Reveal';
import section7TopRight from '../../../../assets/theme1/section7/th1-section7-ataskanan.png';

interface RsvpSectionProps {
  guestName?: string;
}

/** Section 7: form RSVP + daftar ucapan. Section ini baru di-mount setelah
 *  undangan dibuka, jadi fetch daftar ucapan cukup sekali di mount. */
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
    <section className="relative overflow-hidden px-6 py-16">
      <img
        src={section7TopRight}
        alt=""
        aria-hidden="true"
        className="deco-float pointer-events-none select-none absolute top-0 right-0 w-[26%] h-auto z-0"
        style={{ animationDuration: '10s' }}
      />

      <div className="relative z-10 mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-2xl font-bold text-neutral-800">Send Your Wishes</h2>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            Doa, harapan, dan ucapan terbaik dari Anda akan menjadi kenangan indah yang selalu kami hargai.
          </p>
        </Reveal>

        <Reveal variant="up" delay={150}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-neutral-500">Nama anda</label>
              <input
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder="Nama anda"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-neutral-500">Ucapan</label>
              <textarea
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                className="h-28 w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder="Ucapan"
              ></textarea>
            </div>
            <div>
              <label className="mb-2 block text-sm text-neutral-500">Konfirmasi Kehadiran</label>
              <div className="flex gap-3">
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 transition ${rsvpStatus === 'attending' ? 'border-[var(--color-primary)]' : 'border-neutral-200'}`}
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
                  <span className="text-sm text-neutral-700">Hadir</span>
                </label>
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-4 py-3 transition ${rsvpStatus === 'not_attending' ? 'border-[var(--color-primary)]' : 'border-neutral-200'}`}
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
                  <span className="text-sm text-neutral-700">Tidak Hadir</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] py-3 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                'Mengirim...'
              ) : (
                <>
                  <span aria-hidden="true">✈</span> Kirim
                </>
              )}
            </button>
          </form>
        </Reveal>

        <div className="mt-10 max-h-[500px] space-y-4 overflow-y-auto pr-1">
          {rsvps.map((rsvp) => (
            <div key={rsvp.id} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-neutral-800">{rsvp.guest_name}</h4>
              <p className="mt-0.5 text-sm text-neutral-400">
                {rsvp.attendance_status === 'attending'
                  ? 'Hadir'
                  : rsvp.attendance_status === 'not_attending'
                    ? 'Tidak Hadir'
                    : 'Mungkin'}
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
