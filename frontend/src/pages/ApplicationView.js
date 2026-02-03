import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';

const STATUS_FLOW = [
  { key: 'draft', label: 'Draft', color: '#a1a1aa' },
  { key: 'documents_pending', label: 'Documents', color: '#f59e0b' },
  { key: 'under_review', label: 'Review', color: '#3b82f6' },
  { key: 'compiled', label: 'Compiled', color: '#a855f7' },
  { key: 'submitted', label: 'Submitted', color: '#22c55e' },
  { key: 'approved', label: 'Approved', color: '#22c55e' },
];

export default function ApplicationView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await applicationAPI.get(id);
        setApplication(res.data.application);
        setDocuments(res.data.documents || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  const handleCompile = async () => {
    setCompiling(true);
    try {
      await applicationAPI.compile(id);
      const res = await applicationAPI.get(id);
      setApplication(res.data.application);
      setDocuments(res.data.documents || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Compilation failed');
    } finally {
      setCompiling(false);
    }
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}><div className="spinner" /></div>;
  if (!application) return <div style={{ textAlign: 'center', paddingTop: 120, color: '#52525b' }}>Application not found.</div>;

  const sc = {
    draft: { color: '#a1a1aa', bg: 'rgba(255,255,255,0.06)' },
    documents_pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    under_review: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    compiled: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    submitted: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    approved: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };
  const st = sc[application.status] || sc.draft;

  // Progress calculation
  const currentIdx = STATUS_FLOW.findIndex(s => s.key === application.status);
  const progressPct = currentIdx >= 0 ? Math.round(((currentIdx + 1) / STATUS_FLOW.length) * 100) : 10;

  return (
    <div style={s.page}>
      <div className="container-md">
        <button onClick={() => navigate('/dashboard')} style={s.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </button>

        {/* Header with progress ring */}
        <div style={s.headerCard}>
          <div style={s.headerTop}>
            <div style={s.ringWrap}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle cx="36" cy="36" r="30" fill="none" stroke={st.color} strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPct * 1.885} 188.5`}
                  transform="rotate(-90 36 36)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <span style={{ ...s.ringText, color: st.color }}>{progressPct}%</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={s.headerRow}>
                <h1 style={s.title}>Application</h1>
                <span style={{ ...s.badge, background: st.bg, color: st.color }}>{application.status.replace(/_/g, ' ')}</span>
              </div>
              <p style={s.appId}>ID: {application.id.slice(0, 8)}</p>
              <p style={s.appType}>{(application.visaCategoryId || 'visa').replace(/_/g, ' ')}</p>
            </div>
          </div>

          {/* Step progress bar */}
          <div style={s.stepBar}>
            {STATUS_FLOW.map((step, i) => {
              const done = i <= currentIdx;
              const current = i === currentIdx;
              return (
                <div key={step.key} style={s.stepItem}>
                  <div style={{
                    ...s.stepDot,
                    background: done ? step.color : 'rgba(255,255,255,0.06)',
                    border: current ? `2px solid ${step.color}` : done ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: current ? `0 0 12px ${step.color}40` : 'none',
                  }}>
                    {done && !current && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <span style={{ ...s.stepLabel, color: done ? '#fafafa' : '#3f3f46' }}>{step.label}</span>
                  {i < STATUS_FLOW.length - 1 && (
                    <div style={{ ...s.stepLine, background: done ? step.color : 'rgba(255,255,255,0.06)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Details grid */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Details</h2>
          <div style={s.grid}>
            {[
              { l: 'Visa Category', v: application.visaCategoryId?.replace(/_/g, ' '), icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
              { l: 'Created', v: new Date(application.createdAt).toLocaleDateString(), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { l: 'Eligibility', v: application.eligibilityScore != null ? `${application.eligibilityScore}%` : 'N/A', icon: 'M22 11.08V12a10 10 0 11-5.93-9.14' },
              { l: 'Documents', v: `${documents.length} uploaded`, icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
            ].map((d, i) => (
              <div key={i} style={s.gridItem}>
                <div style={s.gridIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d.icon}/></svg>
                </div>
                <span style={s.gridLabel}>{d.l}</span>
                <span style={s.gridValue}>{d.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={s.actions}>
          <button className="btn btn-primary" onClick={() => navigate(`/applications/${id}/documents`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Documents
          </button>
          <button className="btn btn-secondary" onClick={handleCompile} disabled={compiling}>
            {compiling ? 'Compiling...' : 'Compile Package'}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(`/visas/${application.visaCategoryId}`)}>View Requirements</button>
        </div>

        {/* Documents */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Documents ({documents.length})
          </h2>
          {documents.length === 0 ? (
            <div style={s.emptyState}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p style={s.emptyText}>No documents uploaded yet.</p>
              <button className="btn btn-outline btn-sm" onClick={() => navigate(`/applications/${id}/documents`)}>Upload Now</button>
            </div>
          ) : (
            <div style={s.list}>
              {documents.map(doc => {
                const vColor = doc.validationStatus === 'valid' ? '#22c55e' : doc.validationStatus === 'invalid' ? '#ef4444' : '#f59e0b';
                const vBg = doc.validationStatus === 'valid' ? 'rgba(34,197,94,0.12)' : doc.validationStatus === 'invalid' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)';
                return (
                  <div key={doc.id} style={s.docRow}>
                    <div style={s.docIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={s.docName}>{doc.fileName}</span>
                      <span style={s.docType}>{doc.type}</span>
                    </div>
                    <span style={{ ...s.docBadge, background: vBg, color: vColor }}>{doc.validationStatus}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Risk Flags */}
        {application.riskFlags?.length > 0 && (
          <div style={{ ...s.card, borderColor: 'rgba(245,158,11,0.2)' }}>
            <h2 style={{ ...s.cardTitle, color: '#f59e0b' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Risk Flags
            </h2>
            {application.riskFlags.map((f, i) => (
              <div key={i} style={s.riskRow}>
                <span style={{ color: '#f59e0b', flexShrink: 0 }}>{'\u26A0'}</span>
                <span style={{ color: '#a1a1aa', fontSize: 13 }}>{f.details || f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Audit Trail - Visual Timeline */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Audit Trail
          </h2>
          {(application.auditTrail || []).length === 0 ? (
            <p style={{ color: '#3f3f46', fontSize: 13 }}>No activity recorded yet.</p>
          ) : (
            <div style={s.timeline}>
              {(application.auditTrail || []).map((e, i) => (
                <div key={i} style={s.timelineItem}>
                  <div style={s.timelineLeft}>
                    <div style={s.timelineDot} />
                    {i < (application.auditTrail || []).length - 1 && <div style={s.timelineLine} />}
                  </div>
                  <div style={s.timelineContent}>
                    <div style={s.timelineAction}>{e.action}</div>
                    <div style={s.timelineDetail}>{e.details}</div>
                    <div style={s.timelineTime}>{new Date(e.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  back: {
    background: 'none', border: 'none', color: '#a1a1aa', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24, padding: 0,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  headerCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, marginBottom: 14,
  },
  headerTop: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 },
  ringWrap: { position: 'relative', width: 72, height: 72, flexShrink: 0 },
  ringText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 16, fontWeight: 800 },
  headerRow: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  title: { fontSize: 24, fontWeight: 800, color: '#fafafa' },
  appId: { fontSize: 12, color: '#3f3f46', fontFamily: 'monospace', marginTop: 2 },
  appType: { fontSize: 14, color: '#a1a1aa', textTransform: 'capitalize', marginTop: 2 },
  badge: { padding: '5px 14px', borderRadius: 999, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' },
  stepBar: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepItem: { display: 'flex', alignItems: 'center' },
  stepDot: { width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' },
  stepLabel: { fontSize: 9, fontWeight: 600, marginLeft: 3, whiteSpace: 'nowrap', letterSpacing: '0.02em' },
  stepLine: { width: 20, height: 2, borderRadius: 2, margin: '0 4px', transition: 'background 0.3s' },
  card: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24, marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  gridItem: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 14px' },
  gridIcon: {
    width: 28, height: 28, borderRadius: 8, marginBottom: 8,
    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  gridLabel: { display: 'block', fontSize: 10, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  gridValue: { fontSize: 14, fontWeight: 600, color: '#fafafa', textTransform: 'capitalize' },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 },
  emptyState: { textAlign: 'center', padding: '24px 0' },
  emptyText: { color: '#3f3f46', fontSize: 13, margin: '12px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: 6 },
  docRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 },
  docIcon: {
    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  docName: { fontWeight: 600, fontSize: 13, color: '#fafafa', display: 'block' },
  docType: { fontSize: 11, color: '#52525b' },
  docBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', flexShrink: 0 },
  riskRow: { display: 'flex', gap: 8, padding: '8px 0' },
  // Visual timeline
  timeline: { display: 'flex', flexDirection: 'column' },
  timelineItem: { display: 'flex', gap: 14 },
  timelineLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 },
  timelineDot: { width: 10, height: 10, borderRadius: '50%', background: '#d4a843', flexShrink: 0, marginTop: 4 },
  timelineLine: { width: 2, flex: 1, background: 'rgba(212,168,67,0.15)', minHeight: 16 },
  timelineContent: { paddingBottom: 20 },
  timelineAction: { fontWeight: 600, fontSize: 13, color: '#fafafa', marginBottom: 2 },
  timelineDetail: { fontSize: 12, color: '#a1a1aa', lineHeight: 1.5 },
  timelineTime: { fontSize: 11, color: '#3f3f46', fontFamily: 'monospace', marginTop: 4 },
};
