import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.card}>
          <div style={s.header}>
            <div style={s.logoMark}>S</div>
            <h1 style={s.title}>Create your account</h1>
            <p style={s.subtitle}>Start your South African migration journey</p>
          </div>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={s.row}>
              <div className="input-group" style={{flex:1}}>
                <label>First Name</label>
                <input type="text" placeholder="John" value={form.firstName} onChange={update('firstName')} required />
              </div>
              <div className="input-group" style={{flex:1}}>
                <label>Last Name</label>
                <input type="text" placeholder="Doe" value={form.lastName} onChange={update('lastName')} required />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+27..." value={form.phone} onChange={update('phone')} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Minimum 8 characters" value={form.password} onChange={update('password')} required />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={s.footer}>
            Already have an account?{' '}
            <Link to="/login" style={s.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', padding: '80px 24px 24px' },
  container: { width: '100%', maxWidth: 480 },
  card: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '40px 32px' },
  header: { textAlign: 'center', marginBottom: 32 },
  logoMark: { width: 48, height: 48, background: 'linear-gradient(135deg, #d4a843 0%, #b8922e 100%)', borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#09090b', fontWeight: 900, fontSize: 22, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#a1a1aa' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 },
  row: { display: 'flex', gap: 12 },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#52525b' },
  link: { color: '#d4a843', fontWeight: 600, textDecoration: 'none' },
};
