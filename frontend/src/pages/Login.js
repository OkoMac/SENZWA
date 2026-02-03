import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || (err.code === 'ERR_NETWORK' ? 'Cannot connect to server. The backend API is not running.' : 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.card}>
          <div style={s.header}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Logo height={36} /></div>
            <h1 style={s.title}>Welcome back</h1>
            <p style={s.subtitle}>Sign in to continue your migration journey</p>
          </div>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={s.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={s.link}>Create one</Link>
          </p>

          <div style={s.trustRow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={s.trustText}>POPIA compliant. Your data is encrypted and secure.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', padding: '64px 24px 24px' },
  container: { width: '100%', maxWidth: 420 },
  card: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '40px 32px' },
  header: { textAlign: 'center', marginBottom: 32 },
  logoMark: { width: 48, height: 48, background: 'linear-gradient(135deg, #d4a843 0%, #b8922e 100%)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#09090b', fontWeight: 900, fontSize: 22, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#a1a1aa' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#52525b' },
  link: { color: '#d4a843', fontWeight: 600, textDecoration: 'none' },
  trustRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)' },
  trustText: { fontSize: 11, color: '#3f3f46', letterSpacing: '0.02em' },
};
