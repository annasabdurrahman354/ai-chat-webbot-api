import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data.user);
      })
      .catch(() => navigate('/admin'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/admin');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role={user.role} onLogout={handleLogout} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="p-8 flex-1">
          <Outlet context={{ user, searchQuery }} />
        </main>
      </div>
    </div>
  );
}
