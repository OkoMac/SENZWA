import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, documentAPI } from '../services/api';

const STATUS_FLOW = [
  { key: 'draft', label: 'Draft' },
  { key: 'documents_pending', label: 'Documents' },
  { key: 'under_review', label: 'Review' },
  { key: 'compiled', label: 'Compiled' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'approved', label: 'Approved' },
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
        <h2 style={s.emptyTitle}>No Applications Yet</h2>
        <p style={s.emptyText}>Start by checking your eligibility or exploring visa categories.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/eligibility" className="btn btn-primary btn-lg">Check Eligibility</Link>
          <Link to="/visas" className="btn btn-secondary btn-lg">Explore Visas</Link>
        </div>
      </div>
    </div></div>
  );

  const curIdx = selectedApp ? getIdx(selectedApp.status) : 0;

  return (
    <div style={s.page}><div className="container-lg">
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
        {/* Pipeline */}
        <div style={s.pipeline}>
          {STATUS_FLOW.map((step, i) => {
            const done = i < curIdx;
            const cur = i === curIdx;
            return (
              <div key={step.key} style={s.pipeStep}>
                <div style={{ ...s.pipeDot, background: done ? '#22c55e' : cur ? '#d4a843' : 'rgba(255,255,255,0.06)', color: done || cur ? '#09090b' : '#52525b' }}>
                  {done ? '\u2713' : i + 1}
                </div>
                <span style={{ ...s.pipeLabel, color: cur ? '#fafafa' : done ? '#22c55e' : '#52525b', fontWeight: cur ? 700 : 400 }}>{step.label}</span>
                {i < STATUS_FLOW.length - 1 && <div style={{ ...s.pipeLine, background: done ? '#22c55e' : 'rgba(255,255,255,0.06)' }} />}
              </div>
            );
          })}
        </div>

        {/* Status */}
        <div style={s.card}>
          <div style={s.statusTop}>
            <div>
              <h2 style={s.statusTitle}>{selectedApp.visaCategoryId?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Application'}</h2>
              <span style={s.statusId}>ID: {selectedApp.id.slice(0, 8)}</span>
            </div>
            <span style={{ ...s.statusBadge, background: selectedApp.status === 'approved' ? 'rgba(34,197,94,0.12)' : selectedApp.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(212,168,67,0.12)', color: selectedApp.status === 'approved' ? '#22c55e' : selectedApp.status === 'rejected' ? '#ef4444' : '#d4a843' }}>
              {selectedApp.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={s.meta}>
            <div style={s.metaItem}><span style={s.metaLabel}>Created</span><span style={s.metaValue}>{new Date(selectedApp.createdAt).toLocaleDateString()}</span></div>
            {selectedApp.eligibilityScore != null && <div style={s.metaItem}><span style={s.metaLabel}>Score</span><span style={{ ...s.metaValue, color: selectedApp.eligibilityScore >= 70 ? '#22c55e' : '#f59e0b' }}>{selectedApp.eligibilityScore}%</span></div>}
            <div style={s.metaItem}><span style={s.metaLabel}>Docs</span><span style={s.metaValue}>{documents.length}</span></div>
          </div>
          <div style={s.nextRow}>
            <span style={s.nextLabel}>Next Step:</span>
            {(() => { const a = getNext(selectedApp); return <Link to={a.link} className={`btn ${a.cls}`}>{a.text}</Link>; })()}
          </div>
        </div>

        {/* Docs */}
        {documents.length > 0 && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>Documents</h3>
            <div style={s.docList}>
              {documents.map(doc => (
                <div key={doc.id} style={s.docRow}>
                  <div><span style={s.docName}>{doc.fileName}</span><span style={s.docType}>{doc.type.replace(/_/g, ' ')}</span></div>
                  <span style={{ ...s.docBadge, background: doc.validationStatus === 'valid' ? 'rgba(34,197,94,0.12)' : doc.validationStatus === 'invalid' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: doc.validationStatus === 'valid' ? '#22c55e' : doc.validationStatus === 'invalid' ? '#ef4444' : '#f59e0b' }}>{doc.validationStatus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit */}
        {selectedApp.auditTrail?.length > 0 && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>Activity Log</h3>
            <div style={{ paddingLeft: 16 }}>
              {selectedApp.auditTrail.slice().reverse().map((e, i) => (
                <div key={i} style={s.auditRow}>
                  <div style={s.auditDot} />
                  <div><span style={s.auditAction}>{e.action.replace(/_/g, ' ')}</span><span style={s.auditDetail}>{e.details}</span><span style={s.auditTime}>{new Date(e.timestamp).toLocaleString()}</span></div>
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
  subtitle: { fontSize: 14, color: '#52525b', marginBottom: 28 },
  empty: { textAlign: 'center', padding: '60px 24px', background: '#1a1a1d', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#a1a1aa', marginBottom: 24 },
  selector: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  selBtn: { padding: '10px 16px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, background: '#1a1a1d', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s' },
  selActive: { borderColor: 'rgba(212,168,67,0.4)', background: 'rgba(212,168,67,0.08)' },
  selType: { display: 'block', fontWeight: 600, fontSize: 13, color: '#fafafa', textTransform: 'capitalize' },
  selId: { fontSize: 11, color: '#52525b' },
  pipeline: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 20px', background: '#1a1a1d', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16, overflow: 'auto' },
  pipeStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1, minWidth: 70 },
  pipeDot: { width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 },
  pipeLabel: { fontSize: 11, marginTop: 6 },
  pipeLine: { position: 'absolute', top: 18, left: '60%', right: '-40%', height: 2, borderRadius: 2, zIndex: 0 },
  card: { background: '#1a1a1d', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 14 },
  statusTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  statusTitle: { fontSize: 18, fontWeight: 700, color: '#fafafa', textTransform: 'capitalize' },
  statusId: { fontSize: 11, color: '#52525b' },
  statusBadge: { padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  meta: { display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' },
  metaItem: { display: 'flex', flexDirection: 'column' },
  metaLabel: { fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  metaValue: { fontSize: 16, fontWeight: 700, color: '#fafafa' },
  nextRow: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10 },
  nextLabel: { fontSize: 13, fontWeight: 600, color: '#a1a1aa' },
  docList: { display: 'flex', flexDirection: 'column', gap: 6 },
  docRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 },
  docName: { fontWeight: 600, fontSize: 13, color: '#fafafa', display: 'block' },
  docType: { fontSize: 11, color: '#52525b', textTransform: 'capitalize' },
  docBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' },
  auditRow: { display: 'flex', gap: 12, marginBottom: 14, position: 'relative' },
  auditDot: { width: 8, height: 8, borderRadius: '50%', background: '#d4a843', position: 'absolute', left: -16, top: 4 },
  auditAction: { fontWeight: 600, fontSize: 13, color: '#fafafa', display: 'block', textTransform: 'capitalize' },
  auditDetail: { fontSize: 12, color: '#a1a1aa', display: 'block' },
  auditTime: { fontSize: 11, color: '#52525b', display: 'block', marginTop: 2 },
};
