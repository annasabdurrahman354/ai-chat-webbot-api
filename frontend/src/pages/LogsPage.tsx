import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function LogsPage() {
  const { user, searchQuery } = useOutletContext<{ user: any; searchQuery: string }>();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
  }, [user.id]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => 
    (l.username && l.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    l.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    error: logs.filter(l => l.status === 'error').length
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Request Management</h1>
          <p className="text-on-surface-variant text-lg">Monitor and audit all browser automation traffic.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-6 py-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Total Requests</span>
            <span className="text-2xl font-black text-on-surface">{stats.total}</span>
          </div>
          <div className="bg-surface-container-low px-6 py-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Successful</span>
            <span className="text-2xl font-black text-secondary">{stats.success}</span>
          </div>
          <div className="bg-surface-container-low px-6 py-4 rounded-xl flex flex-col gap-1 border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Failed</span>
            <span className="text-2xl font-black text-error">{stats.error}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Timestamp</th>
                {user.role === 'admin' && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">User</th>}
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Token (Ref)</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Params</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredLogs.map((l, i) => {
                const params = JSON.parse(l.request_params || '{}');
                return (
                  <tr key={l.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/20'} hover:bg-surface-container transition-colors group`}>
                    <td className="px-8 py-5 text-sm font-medium text-on-surface-variant whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    {user.role === 'admin' && (
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-on-surface">{l.username || 'System'}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs text-on-surface-variant opacity-70">
                        {l.token.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium text-on-surface truncate max-w-[200px] block">
                        {params.message || 'No message'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                        l.status === 'success' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedLog(l)}
                        className="p-2 hover:bg-surface-container-high rounded-lg text-primary transition-all"
                        title="View Full Details"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={user.role === 'admin' ? 6 : 5} className="px-8 py-16 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-20">history</span>
                    <p className="font-bold">No request logs found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setSelectedLog(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-2xl p-8 rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold font-headline mb-6">Request Audit Details</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-xl">
                  <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest block mb-1">Status</span>
                  <span className={`font-bold ${selectedLog.status === 'success' ? 'text-secondary' : 'text-error'}`}>{selectedLog.status}</span>
                </div>
                <div className="bg-surface-container p-4 rounded-xl">
                  <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest block mb-1">Timestamp</span>
                  <span className="font-bold text-sm">{new Date(selectedLog.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-2">Request Parameters</label>
                <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-48">
                  <pre className="text-blue-400 text-xs font-mono">{JSON.stringify(JSON.parse(selectedLog.request_params), null, 2)}</pre>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-widest mb-2">Response Data</label>
                <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-64">
                  <pre className="text-emerald-400 text-xs font-mono">{JSON.stringify(JSON.parse(selectedLog.response_data), null, 2)}</pre>
                </div>
              </div>

              <div className="pt-4">
                <button onClick={() => setSelectedLog(null)} className="w-full px-4 py-3 bg-on-surface text-surface rounded-xl font-bold text-sm">Close Audit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
