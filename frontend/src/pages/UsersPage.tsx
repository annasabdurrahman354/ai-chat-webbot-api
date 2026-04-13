import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function UsersPage() {
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [users, setUsers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!res.ok) return;
    setUsers(data || []);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
    });
    if (res.ok) {
      setNewUsername('');
      setNewPassword('');
      setShowAddModal(false);
      fetchUsers();
    }
  };

  const handleEditOpen = (user: any) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditPassword('');
    setEditConfirmPassword('');
    setError('');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPassword && editPassword !== editConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch(`/api/admin/users/${editingUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: editUsername, 
        role: editRole,
        password: editPassword || undefined 
      })
    });

    if (res.ok) {
      setEditingUser(null);
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || 'Update failed');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchUsers();
    } else {
      const data = await res.json();
      alert(data.error || 'Delete failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">User Management</h1>
          <p className="text-on-surface-variant max-w-lg">Configure platform access and assign administrative roles.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">Total Users</p>
            <p className="text-2xl font-black font-headline text-on-surface">{users.length}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">groups</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">Active Roles</p>
            <p className="text-2xl font-black font-headline text-on-surface">{new Set(users.map(u => u.role)).size}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">shield_person</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">System Health</p>
            <p className="text-2xl font-black font-headline text-on-surface">100%</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">User Identity</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Access Role</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">Created At</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredUsers.map((u, i) => (
                <tr key={u.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/20'} hover:bg-surface-container transition-colors group`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm uppercase">
                        {u.username.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface">{u.username}</div>
                        <div className="text-xs text-on-surface-variant">ID: {u.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                      u.role === 'admin' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditOpen(u)}
                        className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant font-medium">
                    No users found matching your search.
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
            <h2 className="text-2xl font-bold font-headline mb-6">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Username</label>
                <input required value={newUsername} onChange={e=>setNewUsername(e.target.value)} type="text" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Initial Password</label>
                <input required value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="password" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Privilege Role</label>
                <select value={newRole} onChange={e=>setNewRole(e.target.value)} className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
                  <option value="user">User Access</option>
                  <option value="admin">Admin Authority</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 border border-outline-variant/30 rounded-xl font-bold text-sm hover:bg-surface-container-high">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim">Create Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setEditingUser(null)}></div>
          <div className="relative bg-surface-container-lowest w-full max-w-md p-8 rounded-2xl shadow-2xl border border-outline-variant/20 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold font-headline mb-6">Modify User Instance</h2>
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Updated Username</label>
                <input required value={editUsername} onChange={e=>setEditUsername(e.target.value)} type="text" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">New Password (Optional)</label>
                <input placeholder="Leave blank to keep current" value={editPassword} onChange={e=>setEditPassword(e.target.value)} type="password" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Confirm New Password</label>
                <input value={editConfirmPassword} onChange={e=>setEditConfirmPassword(e.target.value)} type="password" className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Access Role</label>
                <select value={editRole} onChange={e=>setEditRole(e.target.value)} className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
                  <option value="user">User Access</option>
                  <option value="admin">Admin Authority</option>
                </select>
              </div>

              {error && (
                <div className="text-error text-xs font-bold flex items-center gap-2 bg-error-container/10 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-3 border border-outline-variant/30 rounded-xl font-bold text-sm hover:bg-surface-container-high">Discard</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim">Update Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
