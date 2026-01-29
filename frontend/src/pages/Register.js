import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Start Your Journey</h1>
          <p style={styles.subtitle}>Create your Senzwa MigrateSA account</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div className="input-group" style={styles.halfInput}>
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First name" />
            </div>
            <div className="input-group" style={styles.halfInput}>
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last name" />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
          </div>

          <div className="input-group">
            <label>Phone Number (optional)</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+27 XX XXX XXXX" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Minimum 8 characters" />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat your password" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>

        <p style={styles.disclaimer}>
          By creating an account, you agree to Senzwa's Terms of Service and acknowledge
          our Privacy Policy (POPIA and GDPR compliant).
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '2.5rem',
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#1a5632', marginBottom: '0.5rem' },
  subtitle: { color: '#6c757d', fontSize: '0.9375rem' },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem 1rem',
    borderRadius: 8,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  row: { display: 'flex', gap: '1rem' },
  halfInput: { flex: 1 },
  submitBtn: { width: '100%', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6c757d' },
  link: { color: '#1a5632', fontWeight: 600 },
  disclaimer: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#adb5bd',
    marginTop: '1rem',
    lineHeight: 1.5,
  },
};
