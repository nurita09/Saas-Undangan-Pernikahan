import { useState, type FormEvent } from 'react';
import { adminLogin } from '../lib/api';

interface AdminLoginProps {
  onSuccess: (authHeader: string) => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await adminLogin(username, password);
      onSuccess(btoa(`${username}:${password}`));
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Admin Login</h1>
          <p className="mt-1 text-sm text-neutral-500">Masuk untuk mengelola undangan.</p>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {status === 'error' && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            Username atau password salah
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition"
        >
          {status === 'loading' ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
