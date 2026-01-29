import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentAPI, visaAPI, applicationAPI } from '../services/api';

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
  { value: 'relationship_proof', label: 'Proof of Relationship' },
  { value: 'business_plan', label: 'Business Plan' },
  { value: 'investment_proof', label: 'Proof of Investment' },
  { value: 'acceptance_letter', label: 'Acceptance Letter (Study)' },
  { value: 'professional_registration', label: 'Professional Registration' },
  { value: 'dol_recommendation', label: 'DOL Recommendation Letter' },
  { value: 'employer_registration', label: 'Employer Company Registration' },
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
        const [appRes, docRes] = await Promise.all([
          applicationAPI.get(id),
          documentAPI.getByApplication(id),
        ]);
        setApplication(appRes.data.application);
        setDocuments(docRes.data.documents || []);

        // Check completeness
        if (appRes.data.application?.visaCategoryId) {
          try {
            const compRes = await documentAPI.checkCompleteness({
              applicationId: id,
              visaCategoryId: appRes.data.application.visaCategoryId,
            });
            setCompleteness(compRes.data);
          } catch { /* ignore */ }
        }
      } catch { /* error */ }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpload = async () => {
    if (!docType) {
      alert('Please select a document type');
      return;
    }
    if (!fileRef.current?.files?.[0]) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', fileRef.current.files[0]);
      formData.append('applicationId', id);
      formData.append('documentType', docType);

      await documentAPI.upload(formData);

      // Reload documents
      const docRes = await documentAPI.getByApplication(id);
      setDocuments(docRes.data.documents || []);

      // Update completeness
      if (application?.visaCategoryId) {
        const compRes = await documentAPI.checkCompleteness({
          applicationId: id,
          visaCategoryId: application.visaCategoryId,
        });
        setCompleteness(compRes.data);
      }

      setDocType('');
      fileRef.current.value = '';
      alert('Document uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documentAPI.delete(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div style={s.loading}>Loading...</div>;

  return (
    <div style={s.page}>
      <div className="container" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate(`/applications/${id}`)} style={s.back}>
          &#8592; Back to Application
        </button>

        <h1 style={s.title}>Document Upload</h1>
        <p style={s.subtitle}>
          Upload the required documents for your {application?.visaCategoryId} application.
          All uploads are encrypted and securely stored.
        </p>

        {/* Completeness */}
        {completeness && (
          <div style={s.completenessCard}>
            <div style={s.completenessHeader}>
              <span style={s.completenessTitle}>Document Completeness</span>
              <span style={{
                ...s.completenessScore,
                color: completeness.complete ? '#155724' : '#856404',
              }}>
                {completeness.completionPercentage}%
              </span>
            </div>
            <div style={s.progressBar}>
              <div style={{
                ...s.progressFill,
                width: `${completeness.completionPercentage}%`,
                background: completeness.complete ? '#28a745' : '#ffc107',
              }} />
            </div>
            <div style={s.completenessStats}>
              <span>{completeness.totalProvided} of {completeness.totalRequired} required documents uploaded</span>
            </div>
            {completeness.missing.length > 0 && (
              <div style={s.missingList}>
                <strong style={{ fontSize: '0.8125rem' }}>Missing documents:</strong>
                {completeness.missing.map((doc, i) => (
                  <div key={i} style={s.missingItem}>
                    <span style={s.missingIcon}>&#9679;</span>
                    <span>{doc.name} - {doc.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Form */}
        <div style={s.uploadCard}>
          <h2 style={s.cardTitle}>Upload New Document</h2>
          <div className="input-group">
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select document type</option>
              {DOC_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>{dt.label}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>File (PDF, JPEG, PNG, TIFF, DOC - max 10MB)</label>
            <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx" />
          </div>
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>

        {/* Uploaded Documents */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Uploaded Documents ({documents.length})</h2>
          {documents.length === 0 ? (
            <p style={s.empty}>No documents uploaded yet.</p>
          ) : (
            <div style={s.docList}>
              {documents.map((doc) => (
                <div key={doc.id} style={s.docItem}>
                  <div style={s.docInfo}>
                    <span style={s.docName}>{doc.fileName}</span>
                    <span style={s.docMeta}>
                      {doc.type} | {(doc.fileSize / 1024).toFixed(0)} KB |{' '}
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={s.docActions}>
                    <span style={{
                      ...s.validationBadge,
                      background: doc.validationStatus === 'valid' ? '#d4edda'
                        : doc.validationStatus === 'invalid' ? '#f8d7da' : '#fff3cd',
                      color: doc.validationStatus === 'valid' ? '#155724'
                        : doc.validationStatus === 'invalid' ? '#721c24' : '#856404',
                    }}>
                      {doc.validationStatus}
                    </span>
                    <button style={s.deleteBtn} onClick={() => handleDelete(doc.id)}>
                      Delete
                    </button>
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
  page: { padding: '2rem 0' },
  loading: { textAlign: 'center', padding: '4rem', color: '#6c757d' },
  back: {
    background: 'none', border: 'none', color: '#1a5632', fontWeight: 600,
    fontSize: '0.875rem', cursor: 'pointer', marginBottom: '1.5rem', padding: 0,
    fontFamily: 'inherit',
  },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1a5632', marginBottom: '0.5rem' },
  subtitle: { color: '#6c757d', fontSize: '0.9375rem', marginBottom: '2rem' },
  completenessCard: {
    background: '#fff', borderRadius: 12, padding: '1.5rem',
    border: '1px solid #e9ecef', marginBottom: '1.5rem',
  },
  completenessHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem',
  },
  completenessTitle: { fontWeight: 700, fontSize: '1rem' },
  completenessScore: { fontWeight: 800, fontSize: '1.25rem' },
  progressBar: {
    height: 10, background: '#e9ecef', borderRadius: 999, overflow: 'hidden', marginBottom: '0.75rem',
  },
  progressFill: { height: '100%', borderRadius: 999, transition: 'width 0.5s' },
  completenessStats: { fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.75rem' },
  missingList: { marginTop: '0.75rem' },
  missingItem: {
    display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: '#856404',
    padding: '0.25rem 0',
  },
  missingIcon: { fontSize: '0.5rem', marginTop: '0.375rem', color: '#ffc107' },
  uploadCard: {
    background: '#fff', borderRadius: 12, padding: '1.5rem',
    border: '2px dashed #dee2e6', marginBottom: '1.5rem',
  },
  card: {
    background: '#fff', borderRadius: 12, padding: '1.5rem',
    border: '1px solid #e9ecef', marginBottom: '1.5rem',
  },
  cardTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' },
  empty: { color: '#6c757d', fontSize: '0.875rem' },
  docList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  docItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem', background: '#f8f9fa', borderRadius: 8, flexWrap: 'wrap', gap: '0.5rem',
  },
  docInfo: {},
  docName: { display: 'block', fontWeight: 600, fontSize: '0.875rem' },
  docMeta: { fontSize: '0.75rem', color: '#6c757d' },
  docActions: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  validationBadge: {
    padding: '0.25rem 0.625rem', borderRadius: 999, fontSize: '0.6875rem',
    fontWeight: 600, textTransform: 'uppercase',
  },
  deleteBtn: {
    background: 'none', border: '1px solid #dc3545', color: '#dc3545',
    borderRadius: 6, padding: '0.25rem 0.5rem', fontSize: '0.75rem',
    cursor: 'pointer', fontFamily: 'inherit',
  },
};
