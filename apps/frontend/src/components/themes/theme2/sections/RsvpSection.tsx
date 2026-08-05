import { useEffect, useState } from 'react';
import { submitRsvp, fetchRsvps, type RsvpResponse } from '../../../../lib/api';
import Reveal from '../../../shared/Reveal';
import { BatikBand, CheckIcon, SectionTitle, XIcon } from '../components/ornaments';

interface RsvpSectionProps {
  guestName?: string;
}

const INPUT_CLASS =
  'mt-2 w-full border border-[var(--jw-gold-soft)]/70 bg-[var(--jw-card)] px-4 py-3.5 text-sm text-[var(--jw-ink)] outline-none transition-colors placeholder:text-[var(--jw-muted)]/70 focus:border-[var(--jw-gold)]';

/** Section 7: Atur Pangestu -- form RSVP + daftar ucapan. Section ini baru
 *  di-mount setelah undangan dibuka, jadi fetch daftar cukup sekali di mount. */
export default function RsvpSection({ guestName }: RsvpSectionProps) {
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [name, setName] = useState(guestName || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'attending' | 'not_attending'>('attending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRsvps().then(setRsvps).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const newRsvp = await submitRsvp(name, status, message);
      setRsvps((prev) => [newRsvp, ...prev]);
      setMessage('');
    } catch {
      alert('Gagal mengirim ucapan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[var(--jw-tint)] px-6 py-20">
      <BatikBand />
      <div className="relative mx-auto max-w-md">
        <Reveal variant="bloom">
          <SectionTitle kicker="Kagem Panjenengan" title="Atur Pangestu" />
          <p className="mx-auto mt-6 max-w-sm text-center text-sm leading-relaxed text-[var(--jw-muted)]">
            Doa, pangestu, lan ucapan pinunjul panjenengan dados kenangan endah kagem kula
            sekaliyan.
          </p>
        </Reveal>

        <Reveal variant="bloom" delay={120}>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold)] uppercase">
                Asma / Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={60}
                placeholder="Nama panjenengan"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold)] uppercase">
                Ucapan
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={400}
                placeholder="Ucapan & doa"
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>
            <div>
              <span className="text-[0.55rem] font-medium tracking-[0.3em] text-[var(--jw-gold)] uppercase">
                Konfirmasi Kehadiran
              </span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(
                  [
                    { value: 'attending', label: 'Rawuh', Icon: CheckIcon },
                    { value: 'not_attending', label: 'Mboten Rawuh', Icon: XIcon },
                  ] as const
                ).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={`flex items-center justify-center gap-2 border px-4 py-3.5 text-sm transition-all duration-300 ${
                      status === value
                        ? 'border-[var(--jw-gold)] bg-[var(--jw-card)] text-[var(--color-primary)] shadow-[var(--jw-shadow)]'
                        : 'border-[var(--jw-gold-soft)]/60 bg-[var(--jw-card)]/50 text-[var(--jw-muted)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--jw-sogan-deep)_88%,#2a1206)_0%,var(--jw-sogan-deep)_100%)] py-4 text-[0.62rem] font-semibold tracking-[0.48em] text-[var(--color-secondary)] uppercase shadow-[0_18px_42px_-28px_rgba(58,30,12,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-500 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:brightness-100"
            >
              {isSubmitting ? 'Ngintun...' : 'Kirim Pangestu'}
            </button>
          </form>
        </Reveal>

        {rsvps.length > 0 && (
          <ul className="mt-10 space-y-4">
            {rsvps.map((rsvp) => (
              <li key={rsvp.id} className="border border-[var(--jw-gold-soft)]/60 bg-[var(--jw-card)] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-jawa-serif text-lg text-[var(--color-primary)]">
                    {rsvp.guest_name}
                  </p>
                  <span className="shrink-0 text-[0.5rem] font-medium tracking-[0.2em] text-[var(--jw-gold)] uppercase">
                    {rsvp.attendance_status === 'attending'
                      ? 'Rawuh'
                      : rsvp.attendance_status === 'not_attending'
                        ? 'Mboten Rawuh'
                        : 'Mangke Rumiyin'}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-[var(--jw-muted)]">
                    {rsvp.message}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
