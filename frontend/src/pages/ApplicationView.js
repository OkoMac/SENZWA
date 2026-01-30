import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';

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

  return (
    <div style={s.page}>
      <div className="container-md">
        <button onClick={() => navigate('/dashboard')} style={s.back}>&larr; Dashboard</button>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Application</h1>
            <p style={s.appId}>ID: {application.id.slice(0, 8)}</p>
          </div>
          <span style={{ ...s.badge, background: st.bg, color: st.color }}>{application.status.replace(/_/g, ' ')}</span>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>Details</h2>
          <div style={s.grid}>
            {[
              { l: 'Visa Category', v: application.visaCategoryId?.replace(/_/g, ' ') },
              { l: 'Created', v: new Date(application.createdAt).toLocaleDateString() },
              { l: 'Eligibility', v: application.eligibilityScore != null ? `${application.eligibilityScore}%` : 'N/A' },
              { l: 'Documents', v: `${documents.length} uploaded` },
            ].map((d, i) => (
              <div key={i} style={s.gridItem}><span style={s.gridLabel}>{d.l}</span><span style={s.gridValue}>{d.v}</span></div>
            ))}
          </div>
        </div>

        <div style={s.actions}>
          <button className="btn btn-primary" onClick={() => navigate(`/applications/${id}/documents`)}>Upload Documents</button>
          <button className="btn btn-secondary" onClick={handleCompile} disabled={compiling}>{compiling ? 'Compiling...' : 'Compile Package'}</button>
          <button className="btn btn-ghost" onClick={() => navigate(`/visas/${application.visaCategoryId}`)}>View Requirements</button>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>Documents ({documents.length})</h2>
          {documents.length === 0 ? <p style={s.muted}>No documents uploaded yet.</p> : (
            <div style={s.list}>
              {documents.map(doc => (
                <div key={doc.id} style={s.row}>
                  <div><span style={s.docName}>{doc.fileName}</span><span style={s.docType}>{doc.type}</span></div>
                  <span style={{ ...s.docBadge, background: doc.validationStatus === 'valid' ? 'rgba(34,197,94,0.12)' : doc.validationStatus === 'invalid' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: doc.validationStatus === 'valid' ? '#22c55e' : doc.validationStatus === 'invalid' ? '#ef4444' : '#f59e0b' }}>{doc.validationStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {application.riskFlags?.length > 0 && (
          <div style={{ ...s.card, borderColor: 'rgba(245,158,11,0.2)' }}>
            <h2 style={{ ...s.cardTitle, color: '#f59e0b' }}>Risk Flags</h2>
            {application.riskFlags.map((f, i) => (
              <div key={i} style={s.riskRow}><span style={{ color: '#f59e0b' }}>{'\u26A0'}</span><span style={{ color: '#a1a1aa', fontSize: 13 }}>{f.details || f}</span></div>
            ))}
          </div>
        )}

        <div style={s.card}>
          <h2 style={s.cardTitle}>Audit Trail</h2>
          {(application.auditTrail || []).map((e, i) => (
            <div key={i} style={s.auditRow}>
              <span style={s.auditTime}>{new Date(e.timestamp).toLocaleString()}</span>
              <span style={s.auditAction}>{e.action}</span>
              <span style={s.auditDetail}>{e.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  back: { background: 'none', border: 'none', color: '#a1a1aa', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24, padding: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 28, fontWeight: 800, color: '#fafafa' },
  appId: { fontSize: 12, color: '#52525b', fontFamily: 'monospace' },
  badge: { padding: '6px 16px', borderRadius: 999, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  card: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 },
  gridItem: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px' },
  gridLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  gridValue: { fontSize: 14, fontWeight: 600, color: '#fafafa', textTransform: 'capitalize' },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 },
  muted: { color: '#52525b', fontSize: 14 },
  list: { display: 'flex', flexDirection: 'column', gap: 6 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 },
  docName: { fontWeight: 600, fontSize: 13, color: '#fafafa', display: 'block' },
  docType: { fontSize: 11, color: '#52525b' },
  docBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' },
  riskRow: { display: 'flex', gap: 8, padding: '8px 0' },
  auditRow: { padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  auditTime: { display: 'block', fontSize: 11, color: '#52525b', fontFamily: 'monospace' },
  auditAction: { display: 'block', fontWeight: 600, fontSize: 13, color: '#fafafa', margin: '2px 0' },
  auditDetail: { fontSize: 12, color: '#a1a1aa' },
};
