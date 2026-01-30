import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicantAPI, applicationAPI, eligibilityAPI } from '../services/api';
import Logo from '../components/Logo';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [profRes, appRes] = await Promise.all([
          applicantAPI.getMe().catch(() => null),
          applicationAPI.list().catch(() => ({ data: { applications: [] } })),
        ]);
        if (profRes?.data?.applicant) setProfile(profRes.data.applicant);
        setApplications(appRes?.data?.applications || []);
        try {
          const evalRes = await eligibilityAPI.getMyEvaluation();
          setEvaluation(evalRes.data);
        } catch {}
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}>
      <div className="spinner" />
    </div>
  );

  const completedSteps = [!!profile, !!evaluation, applications.length > 0].filter(Boolean).length;
  const totalSteps = 5;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  const activeApps = applications.filter(a => !['approved', 'rejected'].includes(a.status));
  const pendingActions = applications.filter(a => ['draft', 'documents_pending'].includes(a.status)).length;
  const hasAlerts = applications.some(a => a.status === 'rejected');

  const statusConfig = {
    draft: { color: '#a1a1aa', bg: 'rgba(255,255,255,0.06)', label: 'Draft' },
    documents_pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Documents Needed' },
    under_review: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Under Review' },
    compiled: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)', label: 'Compiled' },
    submitted: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', label: 'Submitted' },
    approved: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Approved' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Rejected' },
  };

  return (
    <div style={s.page}>
      <div className="container-sm" style={{ maxWidth: 600 }}>
        {/* Centered Logo */}
        <div style={s.logoWrap}>
          <Logo height={40} />
          <p style={s.slogan}>MigrateSA</p>
        </div>

        {/* Greeting */}
        <h1 style={s.greeting}>Welcome back, {user?.firstName || 'there'}</h1>
        <p style={s.subGreeting}>Your migration journey at a glance</p>

        {/* Status Summary Cards */}
        <div style={s.statusGrid}>
          <div style={s.statusCard}>
            <span style={s.statusNum}>{activeApps.length}</span>
            <span style={s.statusLabel}>Active Applications</span>
          </div>
          <div style={s.statusCard}>
            <span style={{ ...s.statusNum, color: pendingActions > 0 ? '#f59e0b' : '#52525b' }}>{pendingActions}</span>
            <span style={s.statusLabel}>Pending Actions</span>
          </div>
          <div style={s.statusCard}>
            <span style={{ ...s.statusNum, color: hasAlerts ? '#ef4444' : '#22c55e' }}>{hasAlerts ? '!' : '0'}</span>
            <span style={s.statusLabel}>{hasAlerts ? 'Risk Alert' : 'No Alerts'}</span>
          </div>
        </div>

        {/* Progress Ring */}
        <div style={s.progressCard}>
          <div style={s.ringWrap}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="#d4a843" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${progressPct * 1.885} 188.5`}
                transform="rotate(-90 36 36)"
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <span style={s.ringText}>{progressPct}%</span>
          </div>
          <div>
            <div style={s.progressTitle}>Journey Progress</div>
            <div style={s.progressSub}>{completedSteps} of {totalSteps} steps complete</div>
          </div>
        </div>

        {/* Primary CTAs */}
        <div style={s.ctaGroup}>
          <Link to="/visas" className="btn btn-primary btn-lg" style={{ flex: 1, textAlign: 'center' }}>
            Start New Application
          </Link>
          {applications.length > 0 && (
            <Link to="/tracker" className="btn btn-secondary btn-lg" style={{ flex: 1, textAlign: 'center' }}>
              Continue Application
            </Link>
          )}
        </div>

        {/* Applications List */}
        {applications.length > 0 && (
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Your Applications</h2>
              <Link to="/tracker" style={s.seeAll}>View All</Link>
            </div>
            {applications.slice(0, 3).map((app) => {
              const sc = statusConfig[app.status] || statusConfig.draft;
              const progressVal = ['draft', 'documents_pending', 'under_review', 'compiled', 'submitted', 'approved'].indexOf(app.status);
              const progressWidth = Math.max(10, ((progressVal + 1) / 6) * 100);
              return (
                <div key={app.id} style={s.appCard} onClick={() => navigate(`/applications/${app.id}`)}>
                  <div style={s.appTop}>
                    <div>
                      <span style={s.appType}>{(app.visaCategoryId || 'application').replace(/_/g, ' ')}</span>
                      <span style={s.appDate}>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span style={{ ...s.appStatus, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                  <div style={s.appBar}>
                    <div style={{ ...s.appBarFill, width: `${progressWidth}%`, background: sc.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Assistant Quick Entry */}
        <Link to="/messages" style={s.aiCard}>
          <div style={s.aiIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <div style={s.aiTitle}>Ask Senzwa AI</div>
            <div style={s.aiDesc}>Get instant answers about visas, eligibility, and documents</div>
          </div>
          <span style={s.aiArrow}>&rsaquo;</span>
        </Link>

        {/* Quick Actions */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Quick Actions</h2>
          <div style={s.quickGrid}>
            {[
              { label: 'Knowledge Hub', desc: 'Immigration info', link: '/knowledge', iconPath: 'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' },
              { label: 'Explore Visas', desc: '22+ categories', link: '/visas', iconPath: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
              { label: 'Eligibility', desc: 'AI assessment', link: '/eligibility', iconPath: 'M22 11.08V12a10 10 0 11-5.93-9.14' },
              { label: 'Profile', desc: 'Your details', link: '/profile', iconPath: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={s.quickCard}>
                <div style={s.quickIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <span style={s.quickLabel}>{item.label}</span>
                <span style={s.quickDesc}>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 80, paddingBottom: 48, minHeight: '100vh' },
  logoWrap: { textAlign: 'center', marginBottom: 24 },
  slogan: { fontSize: 12, color: '#52525b', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6 },
  greeting: { fontSize: 26, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', textAlign: 'center' },
  subGreeting: { fontSize: 14, color: '#52525b', marginTop: 4, textAlign: 'center', marginBottom: 24 },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 },
  statusCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
    padding: '18px 12px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  statusNum: { fontSize: 24, fontWeight: 800, color: '#d4a843' },
  statusLabel: { fontSize: 10, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.04em' },
  progressCard: {
    display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px',
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, marginBottom: 20,
  },
  ringWrap: { position: 'relative', width: 72, height: 72, flexShrink: 0 },
  ringText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 16, fontWeight: 800, color: '#d4a843' },
  progressTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa' },
  progressSub: { fontSize: 13, color: '#52525b', marginTop: 2 },
  ctaGroup: { display: 'flex', gap: 10, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#fafafa' },
  seeAll: { fontSize: 13, fontWeight: 600, color: '#d4a843', textDecoration: 'none' },
  appCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
    padding: '16px 18px', marginBottom: 8, cursor: 'pointer', transition: 'all 0.3s',
  },
  appTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  appType: { display: 'block', fontSize: 14, fontWeight: 600, color: '#fafafa', textTransform: 'capitalize' },
  appDate: { display: 'block', fontSize: 11, color: '#52525b', marginTop: 2 },
  appStatus: { padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' },
  appBar: { height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' },
  appBarFill: { height: '100%', borderRadius: 999, transition: 'width 0.5s ease' },
  aiCard: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
    background: 'rgba(212,168,67,0.06)', backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(212,168,67,0.15)', borderRadius: 14,
    marginBottom: 24, textDecoration: 'none', transition: 'all 0.3s',
  },
  aiIcon: {
    width: 42, height: 42, borderRadius: 12,
    background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  aiTitle: { fontSize: 14, fontWeight: 700, color: '#d4a843' },
  aiDesc: { fontSize: 12, color: '#a1a1aa', marginTop: 1 },
  aiArrow: { fontSize: 22, color: '#d4a843', marginLeft: 'auto', fontWeight: 300 },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 },
  quickCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
    padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 6,
    textDecoration: 'none', transition: 'all 0.3s',
  },
  quickIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  quickLabel: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  quickDesc: { fontSize: 11, color: '#52525b' },
};
