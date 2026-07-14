import { useState } from 'react';
import AdminLogin from './AdminLogin.tsx';
import AdminDashboard from './AdminDashboard.tsx';

const SESSION_KEY = 'undangan_admin_auth';

/**
 * Gerbang login sebelum Admin Dashboard. authHeader ("base64(username:password)")
 * disimpan di sessionStorage (hilang saat tab ditutup) dan dikirim ulang di setiap
 * request admin (mis. POST /api/weddings) -- backend yang benar-benar memvalidasi
 * ulang tiap kali, bukan cuma gate di sisi frontend.
 */
export default function AdminGate() {
  const [authHeader, setAuthHeader] = useState<string | null>(() =>
    sessionStorage.getItem(SESSION_KEY),
  );

  const handleLoginSuccess = (header: string) => {
    sessionStorage.setItem(SESSION_KEY, header);
    setAuthHeader(header);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthHeader(null);
  };

  if (!authHeader) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard authHeader={authHeader} onLogout={handleLogout} />;
}
