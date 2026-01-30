import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicantAPI, applicationAPI, eligibilityAPI } from '../services/api';

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

  const steps = [
    { num: '01', title: 'Create Profile', desc: 'Set up your applicant profile with personal and travel details', done: !!profile, link: '/onboarding', action: profile ? 'Update Profile' : 'Start Onboarding' },
    { num: '02', title: 'Check Eligibility', desc: 'AI-powered assessment across all 22+ visa categories', done: !!evaluation, link: '/eligibility', action: 'Check Now' },
    { num: '03', title: 'Start Application', desc: 'Begin your visa application with the recommended pathway', done: applications.length > 0, link: '/visas', action: 'Browse Visas' },
    { num: '04', title: 'Upload Documents', desc: 'Upload and validate all required documentation', done: applications.some(a => a.status !== 'draft'), link: applications[0] ? `/applications/${applications[0].id}/documents` : '/visas', action: 'Upload' },
    { num: '05', title: 'Track & Submit', desc: 'Monitor progress and compile your application package', done: applications.some(a => ['compiled', 'submitted', 'approved'].includes(a.status)), link: '/tracker', action: 'Track' },
  ];

  const completedSteps = steps.filter(s => s.done).length;

  const statusConfig = {
    draft: { color: '#a1a1aa', bg: 'rgba(255,255,255,0.06)' },
    documents_pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    under_review: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    compiled: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    submitted: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    approved: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };

  return (
    <div style={s.page}>
      <div className="container-lg">
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.greeting}>Welcome back, {user?.firstName || 'there'}</h1>
            <p style={s.subGreeting}>Your migration journey at a glance</p>
          </div>
          <div style={s.progressBadge}>
            <span style={s.progressNum}>{completedSteps}</span>
            <span style={s.progressLabel}>of 5 steps complete</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${(completedSteps / 5) * 100}%` }} />
        </div>

        {/* Journey Steps */}
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={i} style={{ ...s.stepCard, ...(step.done ? s.stepDone : {}), ...(i === completedSteps ? s.stepCurrent : {}) }}>
              <div style={s.stepTop}>
                <div style={{
                  ...s.stepNum,
                  background: step.done ? 'rgba(34,197,94,0.15)' : i === completedSteps ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                  color: step.done ? '#22c55e' : i === completedSteps ? '#d4a843' : '#52525b',
                }}>
                  {step.done ? '\u2713' : step.num}
                </div>
                {i === completedSteps && <span style={s.currentBadge}>NEXT</span>}
              </div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
              <Link to={step.link} className={`btn ${i === completedSteps ? 'btn-primary' : 'btn-secondary'} btn-sm`} style={{ marginTop: 'auto' }}>
                {step.action}
              </Link>
            </div>
          ))}
        </div>

        {/* Applications */}
        {applications.length > 0 && (
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Your Applications</h2>
              <Link to="/tracker" style={s.seeAll}>View Tracker</Link>
            </div>
            <div style={s.appList}>
              {applications.slice(0, 3).map((app) => {
                const sc = statusConfig[app.status] || statusConfig.draft;
                return (
                  <div key={app.id} style={s.appCard} onClick={() => navigate(`/applications/${app.id}`)}>
                    <div style={s.appInfo}>
                      <span style={s.appType}>{(app.visaCategoryId || 'application').replace(/_/g, ' ')}</span>
                      <span style={s.appDate}>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span style={{ ...s.appStatus, background: sc.bg, color: sc.color }}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Quick Actions</h2>
          <div style={s.quickGrid}>
            {[
              { label: 'Knowledge Hub', desc: 'All immigration info in one place', link: '/knowledge', icon: '\u{1F4D6}' },
              { label: 'Explore Visas', desc: 'Browse all 22+ visa categories', link: '/visas', icon: '\u{1F30D}' },
              { label: 'Check Eligibility', desc: 'AI assessment of your profile', link: '/eligibility', icon: '\u{2713}' },
              { label: 'Track Applications', desc: 'Monitor your active applications', link: '/tracker', icon: '\u{1F4CA}' },
            ].map((item, i) => (
              <Link key={i} to={item.link} style={s.quickCard}>
                <span style={s.quickIcon}>{item.icon}</span>
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
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em' },
  subGreeting: { fontSize: 14, color: '#52525b', marginTop: 4 },
  progressBadge: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 16px' },
  progressNum: { fontSize: 22, fontWeight: 800, color: '#d4a843' },
  progressLabel: { fontSize: 13, color: '#a1a1aa' },
  progressBar: { height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, marginBottom: 32, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #d4a843, #e0b94f)', borderRadius: 999, transition: 'width 0.6s ease' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 40 },
  stepCard: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 0.3s', minHeight: 180 },
  stepDone: { borderColor: 'rgba(34,197,94,0.2)' },
  stepCurrent: { borderColor: 'rgba(212,168,67,0.3)', boxShadow: '0 0 30px rgba(212,168,67,0.08)' },
  stepTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stepNum: { width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  currentBadge: { fontSize: 10, fontWeight: 700, color: '#d4a843', background: 'rgba(212,168,67,0.15)', padding: '2px 8px', borderRadius: 999, letterSpacing: '0.05em' },
  stepTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa' },
  stepDesc: { fontSize: 12, color: '#a1a1aa', lineHeight: 1.5 },
  section: { marginBottom: 36 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#fafafa' },
  seeAll: { fontSize: 13, fontWeight: 600, color: '#d4a843', textDecoration: 'none' },
  appList: { display: 'flex', flexDirection: 'column', gap: 8 },
  appCard: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' },
  appInfo: { display: 'flex', flexDirection: 'column' },
  appType: { fontSize: 14, fontWeight: 600, color: '#fafafa', textTransform: 'capitalize' },
  appDate: { fontSize: 12, color: '#52525b', marginTop: 2 },
  appStatus: { padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  quickCard: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 6, textDecoration: 'none', transition: 'all 0.3s' },
  quickIcon: { fontSize: 20 },
  quickLabel: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  quickDesc: { fontSize: 12, color: '#52525b' },
};
