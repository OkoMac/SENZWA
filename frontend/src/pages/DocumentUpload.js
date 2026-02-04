import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentAPI, applicationAPI } from '../services/api';

const DOC_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'photo', label: 'Passport Photos' },
  { value: 'police_clearance', label: 'Police Clearance Certificate' },
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'radiological_report', label: 'Radiological Report' },
  { value: 'financial_proof', label: 'Proof of Funds / Bank Statements' },
  { value: 'employment_contract', label: 'Employment Contract' },
  { value: 'qualifications', label: 'Educational Qualifications' },
  { value: 'saqa_evaluation', label: 'SAQA Evaluation Certificate' },
  { value: 'cv', label: 'Curriculum Vitae' },
  { value: 'return_ticket', label: 'Return/Onward Ticket' },
  { value: 'accommodation', label: 'Proof of Accommodation' },
  { value: 'medical_insurance', label: 'Medical Insurance' },
  { value: 'marriage_certificate', label: 'Marriage Certificate' },
  { value: 'business_plan', label: 'Business Plan' },
  { value: 'professional_registration', label: 'Professional Registration' },
  { value: 'other', label: 'Other Document' },
];

export default function DocumentUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [documents, setDocuments] = useState([]);
  const [application, setApplication] = useState(null);
  const [docType, setDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completeness, setCompleteness] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [appRes, docRes] = await Promise.all([applicationAPI.get(id), documentAPI.getByApplication(id)]);
        setApplication(appRes.data.application);
        setDocuments(docRes.data.documents || []);
        if (appRes.data.application?.visaCategoryId) {
          try {
            const compRes = await documentAPI.checkCompleteness({ applicationId: id, visaCategoryId: appRes.data.application.visaCategoryId });
            setCompleteness(compRes.data);
          } catch {}
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpload = async () => {
    if (!docType) { alert('Select a document type'); return; }
    if (!fileRef.current?.files?.[0]) { alert('Select a file'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', fileRef.current.files[0]);
      formData.append('applicationId', id);
      formData.append('documentType', docType);
      await documentAPI.upload(formData);
      const docRes = await documentAPI.getByApplication(id);
      setDocuments(docRes.data.documents || []);
      if (application?.visaCategoryId) {
        const compRes = await documentAPI.checkCompleteness({ applicationId: id, visaCategoryId: application.visaCategoryId });
        setCompleteness(compRes.data);
      }
      setDocType('');
      fileRef.current.value = '';
    } catch (err) { alert(err.response?.data?.error || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try { await documentAPI.delete(docId); setDocuments(prev => prev.filter(d => d.id !== docId)); } catch { alert('Delete failed'); }
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}><div className="spinner" /></div>;

  const pct = completeness?.completionPercentage || 0;
  const pctColor = completeness?.complete ? '#22c55e' : '#d4a843';

  return (
    <div style={s.page}>
      <div className="container-md">
        <button onClick={() => navigate(`/applications/${id}`)} style={s.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Application
        </button>

        <div style={s.headerRow}>
          <div>
            <h1 style={s.title}>Document Upload</h1>
            <p style={s.subtitle}>Upload required documents for your {application?.visaCategoryId?.replace(/_/g, ' ')} application.</p>
          </div>
        </div>

        {/* Completeness card with progress ring */}
        {completeness && (
          <div style={s.compCard}>
            <div style={s.compTop}>
              <div style={s.ringWrap}>
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                  <circle cx="36" cy="36" r="30" fill="none" stroke={pctColor} strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${pct * 1.885} 188.5`}
                    transform="rotate(-90 36 36)"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                </svg>
                <span style={{ ...s.ringText, color: pctColor }}>{pct}%</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={s.compTitle}>Document Completeness</div>
                <div style={s.compStats}>{completeness.totalProvided} of {completeness.totalRequired} required documents</div>
                {completeness.complete && <div style={s.compComplete}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  All required documents uploaded
                </div>}
              </div>
            </div>
            {completeness.missing?.length > 0 && (
              <div style={s.missingWrap}>
                <div style={s.missingHeader}>Missing Documents</div>
                {completeness.missing.map((d, i) => (
                  <div key={i} style={s.missingRow}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={s.missingText}>{d.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload area */}
        <div style={s.uploadCard}>
          <div style={s.uploadIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h2 style={s.uploadTitle}>Upload New Document</h2>
          <p style={s.uploadHint}>PDF, JPEG, PNG, TIFF, DOC - max 10MB</p>

          <div className="input-group" style={{ marginTop: 20 }}>
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select document type</option>
              {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>File</label>
            <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx" />
          </div>
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading} style={{ width: '100%' }}>
            {uploading ? (
              <><div className="spinner spinner-sm" style={{ borderTopColor: '#09090b' }} /> Uploading...</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Document
              </>
            )}
          </button>
        </div>

        {/* Uploaded documents */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Uploaded ({documents.length})
          </h2>
          {documents.length === 0 ? (
            <div style={s.emptyState}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p style={s.emptyText}>No documents uploaded yet.</p>
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={s.docName}>{doc.fileName}</span>
                      <span style={s.docMeta}>{doc.type} | {(doc.fileSize / 1024).toFixed(0)} KB</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ ...s.docBadge, background: vBg, color: vColor }}>{doc.validationStatus}</span>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
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
  headerRow: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 800, color: '#fafafa', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#a1a1aa' },
  // Completeness card
  compCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16,
  },
  compTop: { display: 'flex', alignItems: 'center', gap: 20 },
  ringWrap: { position: 'relative', width: 72, height: 72, flexShrink: 0 },
  ringText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 16, fontWeight: 800 },
  compTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 4 },
  compStats: { fontSize: 13, color: '#52525b' },
  compComplete: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#22c55e', marginTop: 6 },
  missingWrap: { marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' },
  missingHeader: { fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
  missingRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' },
  missingText: { fontSize: 13, color: '#f59e0b' },
  // Upload area
  uploadCard: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '2px dashed rgba(212,168,67,0.2)', borderRadius: 16, padding: '32px 24px',
    marginBottom: 16, textAlign: 'center',
  },
  uploadIcon: {
    width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  uploadTitle: { fontSize: 17, fontWeight: 700, color: '#fafafa', marginBottom: 4 },
  uploadHint: { fontSize: 12, color: '#52525b' },
  // Documents list
  card: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24, marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  emptyState: { textAlign: 'center', padding: '24px 0' },
  emptyText: { color: '#3f3f46', fontSize: 13, margin: '12px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  docRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10,
    flexWrap: 'wrap',
  },
  docIcon: {
    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  docName: { display: 'block', fontWeight: 600, fontSize: 13, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  docMeta: { fontSize: 11, color: '#52525b' },
  docBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' },
};
