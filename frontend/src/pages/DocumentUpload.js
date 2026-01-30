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

  return (
    <div style={s.page}>
      <div className="container-md">
        <button onClick={() => navigate(`/applications/${id}`)} style={s.back}>&larr; Back to Application</button>
        <h1 style={s.title}>Document Upload</h1>
        <p style={s.subtitle}>Upload required documents for your {application?.visaCategoryId?.replace(/_/g, ' ')} application.</p>

        {completeness && (
          <div style={s.card}>
            <div style={s.compHeader}>
              <span style={s.compLabel}>Document Completeness</span>
              <span style={{ ...s.compScore, color: completeness.complete ? '#22c55e' : '#d4a843' }}>{completeness.completionPercentage}%</span>
            </div>
            <div style={s.bar}><div style={{ ...s.barFill, width: `${completeness.completionPercentage}%`, background: completeness.complete ? '#22c55e' : '#d4a843' }} /></div>
            <span style={s.compStats}>{completeness.totalProvided} of {completeness.totalRequired} required documents</span>
            {completeness.missing?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {completeness.missing.map((d, i) => (
                  <div key={i} style={s.missingRow}><span style={s.missingDot} /><span style={s.missingText}>{d.name}</span></div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ ...s.card, borderStyle: 'dashed' }}>
          <h2 style={s.cardTitle}>Upload New Document</h2>
          <div className="input-group">
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select document type</option>
              {DOC_TYPES.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>File (PDF, JPEG, PNG, TIFF, DOC - max 10MB)</label>
            <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx" />
          </div>
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Document'}</button>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>Uploaded ({documents.length})</h2>
          {documents.length === 0 ? <p style={s.muted}>No documents uploaded yet.</p> : (
            <div style={s.list}>
              {documents.map(doc => (
                <div key={doc.id} style={s.docRow}>
                  <div>
                    <span style={s.docName}>{doc.fileName}</span>
                    <span style={s.docMeta}>{doc.type} | {(doc.fileSize / 1024).toFixed(0)} KB</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...s.docBadge, background: doc.validationStatus === 'valid' ? 'rgba(34,197,94,0.12)' : doc.validationStatus === 'invalid' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: doc.validationStatus === 'valid' ? '#22c55e' : doc.validationStatus === 'invalid' ? '#ef4444' : '#f59e0b' }}>{doc.validationStatus}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>Delete</button>
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
  back: { background: 'none', border: 'none', color: '#a1a1aa', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24, padding: 0 },
  title: { fontSize: 28, fontWeight: 800, color: '#fafafa', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#a1a1aa', marginBottom: 28 },
  card: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  compHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  compLabel: { fontWeight: 700, fontSize: 15, color: '#fafafa' },
  compScore: { fontWeight: 800, fontSize: 20 },
  bar: { height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: '100%', borderRadius: 999, transition: 'width 0.5s ease' },
  compStats: { fontSize: 12, color: '#52525b' },
  missingRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' },
  missingDot: { width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 },
  missingText: { fontSize: 13, color: '#f59e0b' },
  muted: { color: '#52525b', fontSize: 14 },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  docRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, flexWrap: 'wrap', gap: 8 },
  docName: { display: 'block', fontWeight: 600, fontSize: 13, color: '#fafafa' },
  docMeta: { fontSize: 11, color: '#52525b' },
  docBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' },
};
