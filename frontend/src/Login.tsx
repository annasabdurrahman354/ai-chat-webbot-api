import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      navigate('/admin/tokens');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-fixed opacity-20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-primary-fixed-dim opacity-30 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-surface-container-low rounded-2xl shadow-2xl shadow-on-surface/5 overflow-hidden border border-outline-variant/10 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Left Side: Visual Anchor */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <img 
              className="w-full h-full object-cover grayscale brightness-75 scale-110 animate-pulse duration-[10s]" 
              alt="Network pattern" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCq5K5M-fvKgBdjGypSgBmSXl2Ay0ldTXFeD5H6lGQTLLffO2cjtRozqSect3-s5LtclRPiLyNu2DsGXXkZZYSN6PI5-Y-tpOUoE4_N75bhYGycEvFvvgEhELDsgmAuzlS6EwhQhAaIjXYr-3hsIhgXNral1XkWKvogj8L32TXgpzirUVgKfrM9ALX43wKOoQ1flrE0ytvO99J12gVlji1ZHIaHHpWbHdWpRJRmZFKi7s_kTw2i1fXg9rz0gzzrID_gkZ2CgbFM75q"
            />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-on-primary rounded-lg flex items-center justify-center text-primary shadow-lg">
              <span className="material-symbols-outlined font-black">terminal</span>
            </div>
            <span className="font-headline font-black text-2xl tracking-tighter text-on-primary uppercase">Monolith API</span>
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h1 className="font-headline font-black text-4xl leading-tight text-on-primary tracking-tight">
                  Architectural Intelligence <br/>
                  <span className="text-secondary-fixed opacity-80">Enterprise Gateway</span>
              </h1>
              <p className="text-on-primary/80 font-medium text-lg max-w-sm leading-relaxed">
                  Access the command center of your digital infrastructure with precision-engineered security protocols.
              </p>
            </div>
            
            <div className="pt-8 border-t border-on-primary/10 flex gap-12">
              <div className="space-y-1">
                <p className="text-secondary-fixed-dim text-[10px] font-black tracking-widest uppercase">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <p className="text-on-primary font-bold text-sm">Online</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-secondary-fixed-dim text-[10px] font-black tracking-widest uppercase">Encryption</p>
                <p className="text-on-primary font-bold text-sm">AES-256 Bit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interaction Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest relative">
          <div className="mb-10 animate-in slide-in-from-top-4 duration-700">
            <h2 className="font-headline font-black text-4xl text-on-surface mb-3 tracking-tight">Access Gateway</h2>
            <p className="text-on-surface-variant font-medium text-lg leading-snug">Enter your administrative credentials to initialize session.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2 group">
              <label className="block text-[10px] font-black text-on-surface-variant tracking-widest uppercase pl-1" htmlFor="username">Identity Identifier</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">person</span>
                </div>
                <input 
                  autoFocus
                  required
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-primary-container/20 transition-all font-medium" 
                  id="username" name="username" placeholder="e.g. admin_monolith" type="text" 
                />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <label className="block text-[10px] font-black text-on-surface-variant tracking-widest uppercase pl-1" htmlFor="password">Security Protocol</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-primary-container/20 transition-all font-medium" 
                  id="password" name="password" placeholder="••••••••••••" type="password" 
                />
              </div>
            </div>

            {error && (
              <div className="animate-in shake duration-300 text-error font-bold text-xs bg-error-container/20 p-4 rounded-xl border border-error/10 flex items-center gap-3">
                <span className="material-symbols-outlined">warning</span>
                {error}
              </div>
            )}

            <div className="pt-4">
              <button 
                disabled={loading} 
                className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-black py-4 rounded-xl shadow-xl shadow-primary/15 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg tracking-tight group" 
                type="submit"
              >
                <span>{loading ? 'Authenticating...' : 'Secure Access'}</span>
                {!loading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </div>
          </form>

          <footer className="mt-16 pt-8 border-t border-surface-container-high">
            <p className="text-[10px] font-black text-on-surface-variant/40 leading-relaxed uppercase tracking-widest">
                Authorized use only. Session activity is monitored for security and auditing purposes within the Monolith infrastructure.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
