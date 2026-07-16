import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import Reveal from '../../../shared/Reveal';
import { GoldDivider, SURFACE } from '../components/ornaments';

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  'w-full border border-[#D4AF37]/40 bg-transparent px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37]';

/** Section 7: Send Your Wishes -- form RSVP dark + daftar ucapan. Section ini
 *  baru di-mount setelah undangan dibuka, jadi fetch cukup sekali di mount. */
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
          <h2 className="text-center text-xl font-semibold uppercase tracking-[0.35em] text-neutral-100">
            Send Your Wishes
          </h2>
          <GoldDivider className="mx-auto mt-3 w-48" />
          <p className="mt-4 text-center text-sm text-neutral-400 leading-relaxed">
            Doa, harapan, dan ucapan terbaik dari Anda menjadi kenangan indah bagi kami.
          </p>
        </Reveal>

        <Reveal variant="up" delay={150}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
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
              <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
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
              <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">
                Konfirmasi Kehadiran
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border px-4 py-3 transition ${rsvpStatus === 'attending' ? 'border-[#D4AF37]' : 'border-[#D4AF37]/30'}`}
                  style={{ backgroundColor: SURFACE }}
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
                  <span className="text-sm text-neutral-200">Hadir</span>
                </label>
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 border px-4 py-3 transition ${rsvpStatus === 'not_attending' ? 'border-[#D4AF37]' : 'border-[#D4AF37]/30'}`}
                  style={{ backgroundColor: SURFACE }}
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
                  <span className="text-sm text-neutral-200">Tidak Hadir</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold tracking-widest text-[#10131C] hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : '✦ Kirim Ucapan'}
            </button>
          </form>
        </Reveal>

        <div className="mt-10 max-h-[500px] space-y-4 overflow-y-auto pr-1">
          {rsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="border border-[#D4AF37]/20 p-5"
              style={{ backgroundColor: SURFACE }}
            >
              <h4 className="font-serif font-bold text-neutral-100">{rsvp.guest_name}</h4>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">
                {rsvp.attendance_status === 'attending'
                  ? 'Hadir'
                  : rsvp.attendance_status === 'not_attending'
                    ? 'Tidak Hadir'
                    : 'Mungkin'}
              </p>
              {rsvp.message && (
                <p className="mt-2 text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
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
