import React, { useState } from 'react';

interface AuthModalProps {
  onAuthenticated: (data: { user: any; workspace: any }) => void;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAuthenticated, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register'
        ? { legalName: name, workspaceName, email, password }
        : { email, password };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Authentication failed.');
      onAuthenticated({ user: data.user, workspace: data.workspace });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{mode === 'register' ? 'Create your seller workspace' : 'Sign in to Nexa Deal AI'}</h2>
            <p className="mt-1 text-xs text-slate-400">Your transaction data is isolated to your authenticated workspace.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">✕</button>
        </div>

        <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 mb-5">
          <button onClick={() => setMode('login')} className={`rounded-lg py-2 text-xs font-semibold ${mode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Sign In</button>
          <button onClick={() => setMode('register')} className={`rounded-lg py-2 text-xs font-semibold ${mode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Create Account</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && <>
            <input required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="Legal name" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
            <input value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} placeholder="Workspace name (optional)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
          </>}
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
          <input required minLength={10} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (10+ characters)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500" />
          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</div>}
          <button disabled={busy} className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50">{busy ? 'Please wait…' : mode === 'register' ? 'Create Workspace' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
};
