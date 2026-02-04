import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={s.page}>
      <div className="container-sm">
        {/* Header */}
        <div style={s.header}>
          <Logo height={32} />
          <h1 style={s.title}>Profile</h1>
        </div>

        {/* Identity Card */}
        <div style={s.identityCard}>
          <div style={s.avatarRow}>
            <div style={s.avatar}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <div style={s.fullName}>{user?.firstName} {user?.lastName}</div>
              <div style={s.email}>{user?.email}</div>
            </div>
          </div>
          <div style={s.idGrid}>
            <div style={s.idItem}>
              <span style={s.idLabel}>Account Status</span>
              <span style={s.idValueGreen}>Active</span>
            </div>
            <div style={s.idItem}>
              <span style={s.idLabel}>Member Since</span>
              <span style={s.idValue}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}</span>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div style={s.sectionTitle}>Account</div>
        <div style={s.cardGroup}>
          <Link to="/onboarding" style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Personal Details</span>
                <span style={s.rowDesc}>Name, nationality, passport info</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </Link>
          <Link to="/eligibility" style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Eligibility Profile</span>
                <span style={s.rowDesc}>Qualifications, experience, background</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </Link>
          <Link to="/tracker" style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>My Applications</span>
                <span style={s.rowDesc}>View and track all submissions</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </Link>
        </div>

        <div style={s.sectionTitle}>Security & Privacy</div>
        <div style={s.cardGroup}>
          <div style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Password & Security</span>
                <span style={s.rowDesc}>Change password, two-factor auth</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </div>
          <div style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Data Privacy</span>
                <span style={s.rowDesc}>POPIA & GDPR compliance settings</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </div>
          <div style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Consent History</span>
                <span style={s.rowDesc}>View all legal acknowledgements</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </div>
        </div>

        <div style={s.sectionTitle}>Support</div>
        <div style={s.cardGroup}>
          <Link to="/messages" style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Contact Support</span>
                <span style={s.rowDesc}>Chat with Senzwa AI or a human agent</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </Link>
          <Link to="/knowledge" style={s.row}>
            <div style={s.rowLeft}>
              <div style={s.rowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <span style={s.rowTitle}>Help & FAQ</span>
                <span style={s.rowDesc}>Knowledge hub and common questions</span>
              </div>
            </div>
            <span style={s.rowArrow}>&rsaquo;</span>
          </Link>
        </div>

        {/* Legal */}
        <div style={s.legal}>
          <p style={s.legalText}>Senzwa provides guidance only. Final visa decisions are made by the Department of Home Affairs.</p>
          <p style={s.legalText}>Based on the Immigration Act 13 of 2002. POPIA and GDPR Compliant.</p>
        </div>

        {/* Sign Out */}
        <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: 32 },
  title: { fontSize: 20, fontWeight: 700, color: '#fafafa', marginTop: 12 },
  identityCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 32,
  },
  avatarRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: {
    width: 56, height: 56, borderRadius: 16,
    background: 'linear-gradient(135deg, #d4a843, #b8922e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#09090b', fontSize: 20, fontWeight: 800, flexShrink: 0,
  },
  fullName: { fontSize: 18, fontWeight: 700, color: '#fafafa' },
  email: { fontSize: 13, color: '#52525b', marginTop: 2 },
  idGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  idItem: {
    padding: '12px 14px', borderRadius: 12,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  idLabel: { fontSize: 10, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  idValue: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  idValueGreen: { fontSize: 14, fontWeight: 700, color: '#22c55e' },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px', marginBottom: 10 },
  cardGroup: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
    overflow: 'hidden', marginBottom: 24,
  },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s',
  },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  rowIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  rowTitle: { display: 'block', fontSize: 14, fontWeight: 600, color: '#fafafa' },
  rowDesc: { display: 'block', fontSize: 12, color: '#52525b', marginTop: 1 },
  rowArrow: { fontSize: 20, color: '#3f3f46', fontWeight: 300 },
  legal: { textAlign: 'center', padding: '20px 0', marginBottom: 16 },
  legalText: { fontSize: 11, color: '#3f3f46', lineHeight: 1.6, marginBottom: 4 },
  logoutBtn: {
    width: '100%', padding: '14px', fontSize: 15, fontWeight: 600,
    color: '#ef4444', background: 'rgba(239,68,68,0.06)',
    border: '1px solid rgba(239,68,68,0.1)', borderRadius: 14,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
  },
};
