import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, documentAPI } from '../services/api';

const STATUS_FLOW = [
  { key: 'draft', label: 'Draft', description: 'Application created, awaiting document upload' },
  { key: 'documents_pending', label: 'Documents Pending', description: 'Some required documents are missing or under validation' },
  { key: 'under_review', label: 'Under Review', description: 'All documents submitted, being reviewed by Senzwa AI' },
  { key: 'compiled', label: 'Compiled', description: 'Application package compiled and ready for submission' },
  { key: 'submitted', label: 'Submitted to VFS/DHA', description: 'Application submitted to VFS Global or Department of Home Affairs' },
  { key: 'approved', label: 'Approved', description: 'Visa/permit approved by DHA' },
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
        if (apps.length > 0) {
          selectApplication(apps[0]);
        }
      } catch { /* error */ }
      setLoading(false);
    }
    load();
  }, []);

  async function selectApplication(app) {
    setSelectedApp(app);
    try {
      const docRes = await documentAPI.getByApplication(app.id);
      setDocuments(docRes.data.documents || []);
    } catch {
      setDocuments([]);
    }
  }

  function getStatusIndex(status) {
    return STATUS_FLOW.findIndex((s) => s.key === status);
  }

  function getNextAction(app) {
    switch (app.status) {
      case 'draft':
        return { text: 'Upload Documents', link: `/applications/${app.id}/documents`, type: 'primary' };
      case 'documents_pending':
        return { text: 'Complete Documents', link: `/applications/${app.id}/documents`, type: 'warning' };
      case 'under_review':
        return { text: 'View Application', link: `/applications/${app.id}`, type: 'info' };
      case 'compiled':
        return { text: 'Review & Submit', link: `/applications/${app.id}`, type: 'primary' };
      case 'submitted':
        return { text: 'View Status', link: `/applications/${app.id}`, type: 'info' };
      case 'approved':
        return { text: 'View Approval', link: `/applications/${app.id}`, type: 'success' };
      default:
        return { text: 'View Application', link: `/applications/${app.id}`, type: 'info' };
    }
  }

  if (loading) return <div style={s.loading}>Loading your applications...</div>;

  if (applications.length === 0) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.emptyState}>
            <h2 style={s.emptyTitle}>No Applications Yet</h2>
            <p style={s.emptyText}>
              You haven't started any visa applications yet. Begin by checking your eligibility
              or exploring visa categories to find the right pathway.
            </p>
            <div style={s.emptyActions}>
              <Link to="/eligibility" className="btn btn-primary btn-lg">Check Eligibility</Link>
              <Link to="/visas" className="btn btn-outline btn-lg">Explore Visas</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIdx = selectedApp ? getStatusIndex(selectedApp.status) : 0;

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.title}>Application Tracker</h1>
        <p style={s.subtitle}>Track your visa applications in real time. Every step is logged and accountable.</p>

        {/* Application Selector (if multiple) */}
        {applications.length > 1 && (
          <div style={s.appSelector}>
            {applications.map((app) => (
              <button
                key={app.id}
                style={{
                  ...s.appSelectorBtn,
                  ...(selectedApp?.id === app.id ? s.appSelectorActive : {}),
                }}
                onClick={() => selectApplication(app)}
              >
                <span style={s.appSelectorType}>{(app.visaCategoryId || 'unknown').replace(/_/g, ' ')}</span>
                <span style={s.appSelectorId}>#{app.id.slice(0, 8)}</span>
              </button>
            ))}
          </div>
        )}

        {selectedApp && (
          <>
            {/* Status Pipeline */}
            <div style={s.pipeline}>
              {STATUS_FLOW.map((step, idx) => {
                const isComplete = idx < currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;
                const isRejected = selectedApp.status === 'rejected';

                return (
                  <div key={step.key} style={s.pipelineStep}>
                    <div style={{
                      ...s.pipelineDot,
                      background: isRejected && isCurrent ? '#dc3545'
                        : isComplete ? '#28a745'
                        : isCurrent ? '#1a5632'
                        : '#dee2e6',
                      color: (isComplete || isCurrent) ? '#fff' : '#adb5bd',
                    }}>
                      {isComplete ? '\u2713' : isRejected && isCurrent ? '\u2717' : idx + 1}
                    </div>
                    <div style={s.pipelineLabel}>
                      <span style={{
                        ...s.pipelineName,
                        color: isCurrent ? '#1a5632' : isComplete ? '#28a745' : '#adb5bd',
                        fontWeight: isCurrent ? 700 : 500,
                      }}>
                        {step.label}
                      </span>
                    </div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div style={{
                        ...s.pipelineLine,
                        background: isComplete ? '#28a745' : '#dee2e6',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Status Card */}
            <div style={s.statusCard}>
              <div style={s.statusHeader}>
                <div>
                  <h2 style={s.statusTitle}>
                    {selectedApp.visaCategoryId?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Application'}
                  </h2>
                  <span style={s.statusId}>Application ID: {selectedApp.id.slice(0, 8)}</span>
                </div>
                <div style={{
                  ...s.statusBadge,
                  background: selectedApp.status === 'approved' ? '#d4edda'
                    : selectedApp.status === 'rejected' ? '#f8d7da'
                    : selectedApp.status === 'compiled' ? '#d1ecf1'
                    : '#fff3cd',
                  color: selectedApp.status === 'approved' ? '#155724'
                    : selectedApp.status === 'rejected' ? '#721c24'
                    : selectedApp.status === 'compiled' ? '#0c5460'
                    : '#856404',
                }}>
                  {selectedApp.status.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>

              <div style={s.statusMeta}>
                <div style={s.metaItem}>
                  <span style={s.metaLabel}>Created</span>
                  <span style={s.metaValue}>{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                </div>
                {selectedApp.eligibilityScore != null && (
                  <div style={s.metaItem}>
                    <span style={s.metaLabel}>Eligibility Score</span>
                    <span style={{ ...s.metaValue, color: selectedApp.eligibilityScore >= 70 ? '#28a745' : '#ffc107' }}>
                      {selectedApp.eligibilityScore}%
                    </span>
                  </div>
                )}
                <div style={s.metaItem}>
                  <span style={s.metaLabel}>Documents</span>
                  <span style={s.metaValue}>{documents.length} uploaded</span>
                </div>
              </div>

              {/* Next Action */}
              {(() => {
                const next = getNextAction(selectedApp);
                return (
                  <div style={s.nextAction}>
                    <span style={s.nextActionLabel}>Next Step:</span>
                    <Link to={next.link} className={`btn btn-${next.type}`} style={{ fontSize: '0.875rem' }}>
                      {next.text}
                    </Link>
                  </div>
                );
              })()}
            </div>

            {/* Document Status */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>Document Status</h3>
              {documents.length === 0 ? (
                <div style={s.emptyDocs}>
                  <p>No documents uploaded yet.</p>
                  <Link to={`/applications/${selectedApp.id}/documents`} className="btn btn-primary">Upload Documents</Link>
                </div>
              ) : (
                <div style={s.docList}>
                  {documents.map((doc) => (
                    <div key={doc.id} style={s.docRow}>
                      <div>
                        <span style={s.docName}>{doc.fileName}</span>
                        <span style={s.docType}>{doc.type.replace(/_/g, ' ')}</span>
                      </div>
                      <span style={{
                        ...s.docStatus,
                        background: doc.validationStatus === 'valid' ? '#d4edda'
                          : doc.validationStatus === 'invalid' ? '#f8d7da' : '#fff3cd',
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

            {/* Audit Trail */}
            {selectedApp.auditTrail && selectedApp.auditTrail.length > 0 && (
              <div style={s.section}>
                <h3 style={s.sectionTitle}>Activity Log</h3>
                <div style={s.auditList}>
                  {selectedApp.auditTrail.slice().reverse().map((entry, i) => (
                    <div key={i} style={s.auditRow}>
                      <div style={s.auditDot} />
                      <div style={s.auditContent}>
                        <span style={s.auditAction}>{entry.action.replace(/_/g, ' ')}</span>
                        <span style={s.auditDetails}>{entry.details}</span>
                        <span style={s.auditTime}>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Flags */}
            {selectedApp.riskFlags && selectedApp.riskFlags.length > 0 && (
              <div style={s.section}>
                <h3 style={{ ...s.sectionTitle, color: '#856404' }}>Risk Flags</h3>
                {selectedApp.riskFlags.map((flag, i) => (
                  <div key={i} style={s.riskFlag}>
                    <span style={s.riskSeverity}>{flag.severity?.toUpperCase() || 'MEDIUM'}</span>
                    <span>{flag.details || flag}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem 0', minHeight: 'calc(100vh - 64px)' },
  container: { maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' },
  loading: { textAlign: 'center', padding: '4rem', color: '#6c757d' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1a5632', marginBottom: '0.25rem' },
  subtitle: { color: '#6c757d', fontSize: '0.9375rem', marginBottom: '2rem' },

  // Empty state
  emptyState: { textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 16, border: '1px solid #e9ecef' },
  emptyTitle: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' },
  emptyText: { color: '#6c757d', fontSize: '0.9375rem', maxWidth: 500, margin: '0 auto 1.5rem', lineHeight: 1.6 },
  emptyActions: { display: 'flex', gap: '1rem', justifyContent: 'center' },

  // App selector
  appSelector: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  appSelectorBtn: {
    padding: '0.5rem 1rem', border: '1px solid #dee2e6', borderRadius: 8,
    background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
  },
  appSelectorActive: { borderColor: '#1a5632', background: '#e8f5e9' },
  appSelectorType: { display: 'block', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize' },
  appSelectorId: { fontSize: '0.6875rem', color: '#6c757d' },

  // Pipeline
  pipeline: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '2rem 1rem', background: '#fff', borderRadius: 12, border: '1px solid #e9ecef',
    marginBottom: '1.5rem', overflow: 'auto',
  },
  pipelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1, minWidth: 80 },
  pipelineDot: {
    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
  },
  pipelineLabel: { marginTop: '0.5rem', textAlign: 'center' },
  pipelineName: { fontSize: '0.6875rem', display: 'block' },
  pipelineLine: { position: 'absolute', top: 18, left: '60%', right: '-40%', height: 3, borderRadius: 2, zIndex: 0 },

  // Status card
  statusCard: { background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e9ecef', marginBottom: '1.5rem' },
  statusHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
  statusTitle: { fontSize: '1.125rem', fontWeight: 700 },
  statusId: { fontSize: '0.75rem', color: '#6c757d' },
  statusBadge: {
    padding: '0.375rem 0.875rem', borderRadius: 999, fontSize: '0.6875rem',
    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  statusMeta: { display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' },
  metaItem: { display: 'flex', flexDirection: 'column' },
  metaLabel: { fontSize: '0.6875rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' },
  metaValue: { fontSize: '1rem', fontWeight: 700 },
  nextAction: {
    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
    background: '#f8f9fa', borderRadius: 8, marginTop: '0.5rem',
  },
  nextActionLabel: { fontSize: '0.875rem', fontWeight: 600, color: '#495057' },

  // Documents
  section: { marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' },
  emptyDocs: { padding: '2rem', textAlign: 'center', background: '#f8f9fa', borderRadius: 8, color: '#6c757d' },
  docList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  docRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 1rem', background: '#fff', borderRadius: 8, border: '1px solid #e9ecef',
  },
  docName: { fontWeight: 600, fontSize: '0.875rem', display: 'block' },
  docType: { fontSize: '0.75rem', color: '#6c757d', textTransform: 'capitalize' },
  docStatus: {
    padding: '0.25rem 0.625rem', borderRadius: 999, fontSize: '0.6875rem',
    fontWeight: 600, textTransform: 'uppercase',
  },

  // Audit
  auditList: { position: 'relative', paddingLeft: '1.5rem' },
  auditRow: { display: 'flex', gap: '0.75rem', marginBottom: '1rem', position: 'relative' },
  auditDot: {
    width: 10, height: 10, borderRadius: '50%', background: '#1a5632',
    position: 'absolute', left: '-1.5rem', top: 4,
  },
  auditContent: { display: 'flex', flexDirection: 'column' },
  auditAction: { fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize' },
  auditDetails: { fontSize: '0.8125rem', color: '#6c757d' },
  auditTime: { fontSize: '0.6875rem', color: '#adb5bd' },

  // Risk flags
  riskFlag: {
    display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem',
    background: '#fff3cd', borderRadius: 8, marginBottom: '0.5rem', fontSize: '0.8125rem',
  },
  riskSeverity: {
    padding: '0.125rem 0.5rem', background: '#856404', color: '#fff',
    borderRadius: 999, fontSize: '0.625rem', fontWeight: 700, flexShrink: 0,
  },
};
