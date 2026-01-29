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
      } catch { /* error */ }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const res = await applicationAPI.compile(id);
      setApplication((prev) => ({ ...prev, ...res.data.package, status: res.data.package.packageReady ? 'compiled' : prev.status }));
      alert(res.data.message);
      // Reload
      const reloadRes = await applicationAPI.get(id);
      setApplication(reloadRes.data.application);
      setDocuments(reloadRes.data.documents || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Compilation failed');
    } finally {
      setCompiling(false);
    }
  };

  if (loading) return <div style={s.loading}>Loading application...</div>;
  if (!application) return <div style={s.loading}>Application not found.</div>;

  const statusConfig = {
    draft: { color: '#6c757d', bg: '#f8f9fa', label: 'Draft' },
    documents_pending: { color: '#856404', bg: '#fff3cd', label: 'Documents Pending' },
    under_review: { color: '#0c5460', bg: '#d1ecf1', label: 'Under Review' },
    compiled: { color: '#002395', bg: '#e8eaf6', label: 'Compiled' },
    submitted: { color: '#1a5632', bg: '#d4edda', label: 'Submitted' },
    approved: { color: '#155724', bg: '#c3e6cb', label: 'Approved' },
    rejected: { color: '#721c24', bg: '#f8d7da', label: 'Rejected' },
  };

  const st = statusConfig[application.status] || statusConfig.draft;

  return (
    <div style={s.page}>
      <div className="container" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/dashboard')} style={s.back}>&#8592; Back to Dashboard</button>

        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Application</h1>
            <p style={s.appId}>ID: {application.id.slice(0, 8)}</p>
          </div>
          <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>

        {/* Details */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Application Details</h2>
          <div style={s.detailGrid}>
            <div style={s.detail}>
              <span style={s.detailLabel}>Visa Category</span>
              <span style={s.detailValue}>{application.visaCategoryId}</span>
            </div>
            <div style={s.detail}>
              <span style={s.detailLabel}>Created</span>
              <span style={s.detailValue}>{new Date(application.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={s.detail}>
              <span style={s.detailLabel}>Eligibility Score</span>
              <span style={s.detailValue}>{application.eligibilityScore ?? 'Not evaluated'}</span>
            </div>
            <div style={s.detail}>
              <span style={s.detailLabel}>Documents</span>
              <span style={s.detailValue}>{documents.length} uploaded</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={s.actions}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/applications/${id}/documents`)}
          >
            Upload Documents
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCompile}
            disabled={compiling}
          >
            {compiling ? 'Compiling...' : 'Compile Application Package'}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate(`/visas/${application.visaCategoryId}`)}
          >
            View Visa Requirements
          </button>
        </div>

        {/* Documents */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Uploaded Documents ({documents.length})</h2>
          {documents.length === 0 ? (
            <p style={s.empty}>No documents uploaded yet. Start by uploading required documents.</p>
          ) : (
            <div style={s.docList}>
              {documents.map((doc) => (
                <div key={doc.id} style={s.docItem}>
                  <div>
                    <span style={s.docName}>{doc.fileName}</span>
                    <span style={s.docType}>{doc.type}</span>
                  </div>
                  <span style={{
                    ...s.docStatus,
                    color: doc.validationStatus === 'valid' ? '#155724'
                      : doc.validationStatus === 'invalid' ? '#721c24' : '#856404',
                  }}>
                    {doc.validationStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk Flags */}
        {application.riskFlags && application.riskFlags.length > 0 && (
          <div style={{ ...s.card, borderColor: '#ffc107' }}>
            <h2 style={s.cardTitle}>Risk Flags</h2>
            {application.riskFlags.map((flag, i) => (
              <div key={i} style={s.riskItem}>
                <span style={s.riskIcon}>&#9888;</span>
                <span>{flag.details || flag}</span>
              </div>
            ))}
          </div>
        )}

        {/* Audit Trail */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Audit Trail</h2>
          <div style={s.auditList}>
            {(application.auditTrail || []).map((entry, i) => (
              <div key={i} style={s.auditItem}>
                <span style={s.auditTime}>{new Date(entry.timestamp).toLocaleString()}</span>
                <span style={s.auditAction}>{entry.action}</span>
                <span style={s.auditDetails}>{entry.details}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem 0' },
  loading: { textAlign: 'center', padding: '4rem', color: '#6c757d' },
  back: {
    background: 'none', border: 'none', color: '#1a5632', fontWeight: 600,
    fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1.5rem', padding: 0,
    fontFamily: 'inherit',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
  },
  title: { fontSize: '1.5rem', fontWeight: 800 },
  appId: { fontSize: '0.8125rem', color: '#6c757d', fontFamily: 'monospace' },
  statusBadge: {
    padding: '0.5rem 1.25rem', borderRadius: 999, fontWeight: 700,
    fontSize: '0.8125rem', textTransform: 'uppercase',
  },
  card: {
    background: '#fff', borderRadius: 12, padding: '1.5rem',
    border: '1px solid #e9ecef', marginBottom: '1.5rem',
  },
  cardTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' },
  detailGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem',
  },
  detail: { padding: '0.75rem', background: '#f8f9fa', borderRadius: 8 },
  detailLabel: {
    display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#6c757d',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  detailValue: { fontSize: '0.9375rem', fontWeight: 600 },
  actions: {
    display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem',
  },
  empty: { color: '#6c757d', fontSize: '0.875rem' },
  docList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  docItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem', background: '#f8f9fa', borderRadius: 8,
  },
  docName: { fontWeight: 600, fontSize: '0.875rem', display: 'block' },
  docType: { fontSize: '0.75rem', color: '#6c757d' },
  docStatus: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' },
  riskItem: {
    display: 'flex', gap: '0.5rem', padding: '0.5rem',
    fontSize: '0.875rem', color: '#856404',
  },
  riskIcon: { flexShrink: 0 },
  auditList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  auditItem: {
    padding: '0.75rem', background: '#f8f9fa', borderRadius: 8,
    borderLeft: '3px solid #1a5632', fontSize: '0.8125rem',
  },
  auditTime: { display: 'block', fontSize: '0.6875rem', color: '#6c757d', fontFamily: 'monospace' },
  auditAction: { display: 'block', fontWeight: 600, margin: '0.125rem 0' },
  auditDetails: { color: '#495057' },
};
