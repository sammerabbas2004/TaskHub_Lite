import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'user@example.com', password: 'User123!' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try { const { data } = await api.post('/auth/login', form); login(data); navigate('/tasks', { replace: true }); }
    catch (err) { setError(err.response?.data?.message || 'Unable to log in'); }
    finally { setBusy(false); }
  };

  return <main className="auth-shell"><form className="login-card" onSubmit={submit}>
    <p className="eyebrow">TASKHUB LITE</p><h1>Welcome back</h1><p className="muted">Sign in to manage your tasks.</p>
    {error && <div className="error">{error}</div>}
    <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
    <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
    <button className="primary wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    <p className="hint">Seeded demo: user@example.com / User123!</p>
  </form></main>;
}
