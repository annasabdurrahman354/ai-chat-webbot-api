import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function TokensPage() {
  const { user, searchQuery } = useOutletContext<{ user: any; searchQuery: string }>();
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New token form
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    fetchTokens();
  }, [user.id]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tokens');
      const data = await res.json();
      setTokens(data || []);
    } catch (err) {
      console.error('Error fetching tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: user.role === 'admin' ? targetUserId : user.id,
        expires_at: expiresAt || null
      })
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Token generated: ${data.token}\n\nPlease copy it now, it won't be shown again.`);
      setShowAddModal(false);
      fetchTokens();
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert('Token copied to clipboard');
  };

  const handleRevokeToken = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this session? Access will be terminated immediately.')) return;
    const res = await fetch(`/api/tokens/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTokens();
  };

  const filteredTokens = tokens.filter(t => 
    t.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.username && t.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = tokens.filter(t => t.status === 'active').length;
  const revokedCountLast24h = tokens.filter(t => t.status === 'revoked').length; // Mock count based on data

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Token Management</h1>
          <p className="text-on-surface-variant text-lg">Oversee security credentials across your infrastructure.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-6 py-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Active Tokens</span>
            <span className="text-2xl font-black text-on-surface">{activeCount}</span>
          </div>
          <div className="bg-surface-container-low px-6 py-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Revoked</span>
            <span className="text-2xl font-black text-error">{revokedCountLast24h}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Authentication Interface</span>
          <p className="text-sm text-on-surface-variant">Tokens are required for all browser automation requests.</p>
        </div>
        <button 
          onClick={() => {
            setTargetUserId(user.id);
            setShowAddModal(true);
          }}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_moderator</span>
          Generate New Token
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Token Identifier</th>
                {user.role === 'admin' && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Associated Owner</th>}
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Expiration</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredTokens.map((t, i) => (
                <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/20'} hover:bg-surface-container transition-colors group`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-lg">terminal</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface font-mono">{t.token.substring(0, 15)}...</p>
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">mon_key_{t.id.substring(0, 4)}</p>
                      </div>
                    </div>
                  </td>
                  {user.role === 'admin' && (
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-black text-on-secondary-container uppercase">
                          {(t.username || '?').substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-on-surface">{t.username || 'System'}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-5 text-sm font-medium text-on-surface-variant">
                    {t.expires_at ? new Date(t.expires_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                      t.status === 'active' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleCopyToken(t.token)}
                        className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all"
                        title="Copy Token"
                      >
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                      {t.status === 'active' && (
                        <button 
                          onClick={() => handleRevokeToken(t.id)}
                          className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-all" 
                          title="Revoke Token"
                        >
                          <span className="material-symbols-outlined text-lg">block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredTokens.length === 0 && (
                <tr>
                  <td colSpan={user.role === 'admin' ? 5 : 4} className="px-8 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-20">inventory_2</span>
                    <p className="font-bold">No active credentials found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md p-8 rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold font-headline mb-6">Authorize New Access</h2>
            <form onSubmit={handleCreateToken} className="space-y-6">
              {user.role === 'admin' && (
                <div className="space-y-2">
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">Assign to User ID</label>
                  <input required placeholder="Enter target user UUID" value={targetUserId} onChange={e=>setTargetUserId(e.target.value)} type="text" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest">Expiration Date (Optional)</label>
                <input value={expiresAt} onChange={e=>setExpiresAt(e.target.value)} type="date" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-outline-variant/30 rounded-xl font-bold text-sm hover:bg-surface-container-high">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
