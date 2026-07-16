import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import Reveal from '../../../shared/Reveal';
import { COCOA, GroovyDivider } from '../components/ornaments';

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  'w-full rounded-2xl border-2 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40';

/** Section 7: konfirmasi & ucapan seru. Baru di-mount setelah undangan
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
    <section className="px-6 py-16 bg-[var(--color-secondary)]">
      <div className="mx-auto max-w-md">
        <Reveal variant="blur">
          <h2 className="text-center font-retro text-3xl" style={{ color: COCOA }}>
            Datang Nggak Nih?
          </h2>
          <GroovyDivider className="mx-auto mt-3 w-48" />
          <p className="mt-4 text-center text-sm text-neutral-600 leading-relaxed">
            Konfirmasi kehadiranmu dan tinggalkan ucapan seru buat kami!
          </p>
        </Reveal>

        <Reveal variant="up" delay={150}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: COCOA }}>
                Nama Kamu
              </label>
              <input
                type="text"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                required
                className={INPUT_CLASS}
                style={{ borderColor: COCOA }}
                placeholder="Nama kamu"
              />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: COCOA }}>
                Ucapan Seru
              </label>
              <textarea
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                className={`h-28 resize-none ${INPUT_CLASS}`}
                style={{ borderColor: COCOA }}
                placeholder="Selamat yaaa! 🎉"
              ></textarea>
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: COCOA }}>
                Kehadiran
              </label>
              <div className="flex gap-3">
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 bg-white px-4 py-3 transition-all ${rsvpStatus === 'attending' ? 'shadow-[3px_3px_0_#8A8B4A]' : ''}`}
                  style={{ borderColor: rsvpStatus === 'attending' ? COCOA : '#D9CDB8' }}
                >
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={rsvpStatus === 'attending'}
                    onChange={() => setRsvpStatus('attending')}
                  />
                  <span className="text-base">🙌</span>
                  <span className="text-sm font-bold" style={{ color: COCOA }}>
                    Gas, Datang!
                  </span>
                </label>
                <label
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 bg-white px-4 py-3 transition-all ${rsvpStatus === 'not_attending' ? 'shadow-[3px_3px_0_#C75B39]' : ''}`}
                  style={{ borderColor: rsvpStatus === 'not_attending' ? COCOA : '#D9CDB8' }}
                >
                  <input
                    type="radio"
                    name="status"
                    className="hidden"
                    checked={rsvpStatus === 'not_attending'}
                    onChange={() => setRsvpStatus('not_attending')}
                  />
                  <span className="text-base">🥲</span>
                  <span className="text-sm font-bold" style={{ color: COCOA }}>
                    Nggak Bisa
                  </span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 bg-[var(--color-primary)] py-3 font-retro text-sm tracking-wider text-white shadow-[4px_4px_0_#5C4033] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#5C4033] transition-all disabled:opacity-50"
              style={{ borderColor: COCOA }}
            >
              {isSubmitting ? 'Mengirim...' : '✌ Kirim!'}
            </button>
          </form>
        </Reveal>

        <div className="mt-10 max-h-[500px] space-y-4 overflow-y-auto pr-1">
          {rsvps.map((rsvp, idx) => (
            <div
              key={rsvp.id}
              className={`rounded-2xl border-2 bg-white p-5 ${idx % 2 === 0 ? 'rotate-[0.5deg]' : '-rotate-[0.5deg]'}`}
              style={{ borderColor: COCOA }}
            >
              <h4 className="font-retro" style={{ color: COCOA }}>
                {rsvp.guest_name}
              </h4>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                {rsvp.attendance_status === 'attending'
                  ? '🙌 Datang!'
                  : rsvp.attendance_status === 'not_attending'
                    ? '🥲 Nggak Bisa'
                    : '🤔 Belum Pasti'}
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
