interface TopbarProps {
  user: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Topbar({ user, searchQuery, setSearchQuery }: TopbarProps) {
  const handleStopBots = async () => {
    if (!confirm('Are you sure you want to terminate all active browser instances?')) return;
    try {
      const res = await fetch('/api/stop');
      const data = await res.json();
      alert(data.message || 'Bots stopped');
    } catch (err) {
      alert('Failed to stop bots');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center w-full px-8 h-16">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg group-focus-within:text-primary transition-colors">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-highest border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
            placeholder="Search tokens or users..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <button 
            onClick={handleStopBots}
            className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-error/20 transition-all"
            title="Terminate all active browser sessions"
          >
            <span className="material-symbols-outlined text-lg">stop_circle</span>
            <span className="hidden sm:inline">Emergency Stop</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface leading-tight">{user?.username}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{user?.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
