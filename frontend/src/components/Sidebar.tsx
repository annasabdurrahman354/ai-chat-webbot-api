import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  role: 'admin' | 'user';
  onLogout: () => void;
}

export default function Sidebar({ role, onLogout }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed inset-y-0 left-0 bg-slate-100 dark:bg-slate-900 h-screen w-64 border-r-0 flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter">Monolith API</h1>
        <p className="text-xs text-on-surface-variant/70 font-medium mt-1 uppercase tracking-widest">Enterprise Gateway</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {role === 'admin' && (
          <Link 
            to="/admin/users" 
            className={`flex items-center px-3 py-2.5 transition-all rounded-xl group ${
              isActive('/admin/users') 
                ? 'text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-slate-200/50 dark:bg-slate-800/50' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined mr-3">group</span>
            <span className="font-medium">Users</span>
          </Link>
        )}

        <Link 
          to="/admin/tokens" 
          className={`flex items-center px-3 py-2.5 transition-all rounded-xl group ${
            isActive('/admin/tokens') 
              ? 'text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-slate-200/50 dark:bg-slate-800/50' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined mr-3">key</span>
          <span className="font-medium">API Tokens</span>
        </Link>

        {/* Placeholder for Settings */}
        <div className="flex items-center px-3 py-2.5 text-slate-400 cursor-not-allowed opacity-50 rounded-xl">
          <span className="material-symbols-outlined mr-3">settings</span>
          <span className="font-medium">Settings</span>
        </div>
      </nav>

      <div className="px-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 space-y-1">
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-error hover:bg-error/5 transition-colors rounded-xl font-medium"
        >
          <span className="material-symbols-outlined mr-3">logout</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
