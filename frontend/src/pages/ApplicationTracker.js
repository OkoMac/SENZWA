import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, documentAPI } from '../services/api';

const STATUS_FLOW = [
  { key: 'draft', label: 'Draft', color: '#a1a1aa' },
  { key: 'documents_pending', label: 'Documents', color: '#f59e0b' },
  { key: 'under_review', label: 'Review', color: '#3b82f6' },
  { key: 'compiled', label: 'Compiled', color: '#a855f7' },
  { key: 'submitted', label: 'Submitted', color: '#22c55e' },
  { key: 'approved', label: 'Approved', color: '#22c55e' },
];

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await applicationAPI.list();
        const apps = res.data.applications || [];
        setApplications(apps);
        if (apps.length > 0) selectApp(apps[0]);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  async function selectApp(app) {
    setSelectedApp(app);
    try { const r = await documentAPI.getByApplication(app.id); setDocuments(r.data.documents || []); }
    catch { setDocuments([]); }
  }

  const getIdx = (status) => STATUS_FLOW.findIndex(s => s.key === status);

  const getNext = (app) => {
    const map = {
      draft: { text: 'Upload Documents', link: `/applications/${app.id}/documents`, cls: 'btn-primary' },
      documents_pending: { text: 'Complete Documents', link: `/applications/${app.id}/documents`, cls: 'btn-warning' },
      under_review: { text: 'View Application', link: `/applications/${app.id}`, cls: 'btn-info' },
      compiled: { text: 'Review & Submit', link: `/applications/${app.id}`, cls: 'btn-primary' },
      submitted: { text: 'View Status', link: `/applications/${app.id}`, cls: 'btn-info' },
      approved: { text: 'View Approval', link: `/applications/${app.id}`, cls: 'btn-success' },
    };
    return map[app.status] || map.draft;
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}><div className="spinner" /></div>;

  if (!applications.length) return (
    <div style={s.page}><div className="container-lg">
      <div style={s.empty}>
        <div style={s.emptyIcon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h2 style={s.emptyTitle}>No Applications Yet</h2>
        <p style={s.emptyText}>Start by checking your eligibility or exploring visa categories to begin your journey.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/eligibility" className="btn btn-primary btn-lg">Check Eligibility</Link>
          <Link to="/visas" className="btn btn-secondary btn-lg">Explore Visas</Link>
        </div>
      </div>
    </div></div>
  );

  const curIdx = selectedApp ? getIdx(selectedApp.status) : 0;
  const progressPct = Math.round(((curIdx + 1) / STATUS_FLOW.length) * 100);

  return (
    <div style={s.page}><div className="container-lg" style={{ maxWidth: 700 }}>
      <h1 style={s.title}>Application Tracker</h1>
      <p style={s.subtitle}>Real-time status tracking. Every step logged and accountable.</p>

      {applications.length > 1 && (
        <div style={s.selector}>
          {applications.map(app => (
            <button key={app.id} style={{ ...s.selBtn, ...(selectedApp?.id === app.id ? s.selActive : {}) }} onClick={() => selectApp(app)}>
              <span style={s.selType}>{(app.visaCategoryId || 'app').replace(/_/g, ' ')}</span>
              <span style={s.selId}>#{app.id.slice(0, 8)}</span>
            </button>
          ))}
        </div>
      )}

      {selectedApp && (<>
        {/* Progress Ring + Status Card */}
        <div style={s.progressCard}>
          <div style={s.progressTop}>
            <div style={s.ringWrap}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#d4a843" strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPct * 2.136} 213.6`}
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <span style={s.ringText}>{progressPct}%</span>
            </div>
            <div style={s.progressInfo}>
              <h2 style={s.progressTitle}>{selectedApp.visaCategoryId?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Application'}</h2>
              <span style={s.progressId}>ID: {selectedApp.id.slice(0, 8)}</span>
              <span style={{ ...s.statusBadge, background: selectedApp.status === 'approved' ? 'rgba(34,197,94,0.12)' : selectedApp.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(212,168,67,0.12)', color: selectedApp.status === 'approved' ? '#22c55e' : selectedApp.status === 'rejected' ? '#ef4444' : '#d4a843' }}>
                {selectedApp.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Horizontal Step Progress */}
          <div style={s.stepsBar}>
            {STATUS_FLOW.map((step, i) => {
              const done = i < curIdx;
              const cur = i === curIdx;
              return (
                <div key={step.key} style={s.stepItem}>
                  <div style={{
                    ...s.stepDot,
                    background: done ? '#22c55e' : cur ? '#d4a843' : 'rgba(255,255,255,0.08)',
                    boxShadow: cur ? '0 0 12px rgba(212,168,67,0.4)' : 'none',
                  }}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ fontSize: 9, fontWeight: 700, color: cur ? '#09090b' : '#52525b' }}>{i + 1}</span>
                    )}
                  </div>
                  <span style={{ ...s.stepLabel, color: cur ? '#fafafa' : done ? '#22c55e' : '#3f3f46', fontWeight: cur ? 700 : 400 }}>{step.label}</span>
                  {i < STATUS_FLOW.length - 1 && (
                    <div style={{ ...s.stepLine, background: done ? '#22c55e' : 'rgba(255,255,255,0.06)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Meta + Next Action */}
        <div style={s.card}>
          <div style={s.metaGrid}>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Created</span>
              <span style={s.metaValue}>{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
            </div>
            {selectedApp.eligibilityScore != null && (
              <div style={s.metaItem}>
                <span style={s.metaLabel}>Eligibility</span>
                <span style={{ ...s.metaValue, color: selectedApp.eligibilityScore >= 70 ? '#22c55e' : '#f59e0b' }}>{selectedApp.eligibilityScore}%</span>
              </div>
            )}
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Documents</span>
              <span style={s.metaValue}>{documents.length}</span>
            </div>
          </div>
          <div style={s.nextRow}>
            <span style={s.nextLabel}>Next Step:</span>
            {(() => { const a = getNext(selectedApp); return <Link to={a.link} className={`btn ${a.cls}`}>{a.text}</Link>; })()}
          </div>
        </div>

        {/* Documents */}
        {documents.length > 0 && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>Documents</h3>
            <div style={s.docList}>
              {documents.map(doc => (
                <div key={doc.id} style={s.docRow}>
                  <div style={s.docInfo}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div>
                      <span style={s.docName}>{doc.fileName}</span>
                      <span style={s.docType}>{doc.type.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <span style={{ ...s.docBadge, background: doc.validationStatus === 'valid' ? 'rgba(34,197,94,0.12)' : doc.validationStatus === 'invalid' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: doc.validationStatus === 'valid' ? '#22c55e' : doc.validationStatus === 'invalid' ? '#ef4444' : '#f59e0b' }}>{doc.validationStatus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        {selectedApp.auditTrail?.length > 0 && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>Activity Timeline</h3>
            <div style={s.timeline}>
              {selectedApp.auditTrail.slice().reverse().map((e, i, arr) => (
                <div key={i} style={s.timelineItem}>
                  <div style={s.timelineLeft}>
                    <div style={s.timelineDot} />
                    {i < arr.length - 1 && <div style={s.timelineLine} />}
                  </div>
                  <div style={s.timelineContent}>
                    <span style={s.timelineAction}>{e.action.replace(/_/g, ' ')}</span>
                    {e.details && <span style={s.timelineDetail}>{e.details}</span>}
                    <span style={s.timelineTime}>{new Date(e.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>)}
    </div></div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  title: { fontSize: 28, fontWeight: 800, color: '#fafafa', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#52525b', marginBottom: 24 },

  // Empty state
  empty: {
    textAlign: 'center', padding: '60px 24px',
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
  },
  emptyIcon: { marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#a1a1aa', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' },

  // App selector
  selector: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  selBtn: {
    padding: '10px 16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s',
  },
  selActive: { borderColor: 'rgba(212,168,67,0.4)', background: 'rgba(212,168,67,0.08)' },
  selType: { display: 'block', fontWeight: 600, fontSize: 13, color: '#fafafa', textTransform: 'capitalize' },
  selId: { fontSize: 11, color: '#52525b' },

  // Progress Ring Card
  progressCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)',
    padding: 24, marginBottom: 14,
  },
  progressTop: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 },
  ringWrap: { position: 'relative', width: 80, height: 80, flexShrink: 0 },
  ringText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 18, fontWeight: 800, color: '#d4a843' },
  progressInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
  progressTitle: { fontSize: 18, fontWeight: 700, color: '#fafafa', textTransform: 'capitalize' },
  progressId: { fontSize: 11, color: '#52525b' },
  statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4, width: 'fit-content' },

  // Step Progress Bar
  stepsBar: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1, minWidth: 50 },
  stepDot: {
    width: 28, height: 28, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.3s',
  },
  stepLabel: { fontSize: 9, marginTop: 5, textAlign: 'center', letterSpacing: '0.02em' },
  stepLine: { position: 'absolute', top: 14, left: '60%', right: '-40%', height: 2, borderRadius: 2, zIndex: 0 },

  // Card
  card: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
    padding: 22, marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 14 },

  // Meta
  metaGrid: { display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' },
  metaItem: { display: 'flex', flexDirection: 'column' },
  metaLabel: { fontSize: 10, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 },
  metaValue: { fontSize: 16, fontWeight: 700, color: '#fafafa' },
  nextRow: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10 },
  nextLabel: { fontSize: 13, fontWeight: 600, color: '#a1a1aa' },

  // Documents
  docList: { display: 'flex', flexDirection: 'column', gap: 6 },
  docRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 },
  docInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  docName: { fontWeight: 600, fontSize: 13, color: '#fafafa', display: 'block' },
  docType: { fontSize: 11, color: '#52525b', textTransform: 'capitalize', display: 'block' },
  docBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' },

  // Timeline
  timeline: { position: 'relative' },
  timelineItem: { display: 'flex', gap: 14, minHeight: 56 },
  timelineLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 },
  timelineDot: {
    width: 10, height: 10, borderRadius: '50%', background: '#d4a843',
    border: '2px solid rgba(9,9,11,0.8)',
    flexShrink: 0, position: 'relative', zIndex: 1,
  },
  timelineLine: {
    width: 2, flex: 1, background: 'rgba(212,168,67,0.2)',
    marginTop: 2, marginBottom: 2, borderRadius: 2,
  },
  timelineContent: { display: 'flex', flexDirection: 'column', paddingBottom: 16 },
  timelineAction: { fontWeight: 600, fontSize: 13, color: '#fafafa', textTransform: 'capitalize' },
  timelineDetail: { fontSize: 12, color: '#a1a1aa', marginTop: 2 },
  timelineTime: { fontSize: 11, color: '#52525b', marginTop: 3 },
};
