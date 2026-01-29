import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { visaAPI, applicationAPI } from '../services/api';

export default function VisaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await visaAPI.getCategory(id);
        setCategory(res.data.category);
      } catch { /* error */ }
      setLoading(false);
    }
    load();
  }, [id]);

  const startApplication = async () => {
    setCreating(true);
    try {
      const res = await applicationAPI.create({ visaCategoryId: id });
      navigate(`/applications/${res.data.application.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create application. Please complete onboarding first.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div style={s.loading}>Loading visa details...</div>;
  if (!category) return <div style={s.loading}>Visa category not found.</div>;

  return (
    <div style={s.page}>
      <div className="container" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/visas')} style={s.back}>&#8592; Back to All Visas</button>

        <div style={s.header}>
          <span style={s.badge}>{category.category.replace(/_/g, ' ')}</span>
          <h1 style={s.title}>{category.name}</h1>
          <p style={s.subtitle}>{category.description}</p>
          <div style={s.meta}>
            <span style={s.metaItem}>Duration: {category.maxDuration}</span>
            <span style={s.metaItem}>Fee: {category.fees?.application || 'Varies'}</span>
            <span style={s.metaItem}>{category.legalReference}</span>
          </div>
        </div>

        {/* Eligibility */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Eligibility Requirements</h2>
          <div style={s.list}>
            {category.eligibility.requirements.map((req, i) => (
              <div key={i} style={s.listItem}>
                <span style={s.checkIcon}>&#10003;</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Disqualifiers */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Disqualifying Factors</h2>
          <div style={s.list}>
            {category.eligibility.disqualifiers.map((d, i) => (
              <div key={i} style={{ ...s.listItem, borderColor: '#f8d7da' }}>
                <span style={{ ...s.checkIcon, color: '#dc3545' }}>&#10007;</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Required Documents</h2>
          <div style={s.docGrid}>
            {category.requiredDocuments.map((doc, i) => (
              <div key={i} style={s.docCard}>
                <div style={s.docHeader}>
                  <span style={s.docName}>{doc.name}</span>
                  <span style={{
                    ...s.docBadge,
                    background: doc.required ? '#d4edda' : '#fff3cd',
                    color: doc.required ? '#155724' : '#856404',
                  }}>
                    {doc.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <p style={s.docDesc}>{doc.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Rejection Reasons */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Common Rejection Reasons</h2>
          <div style={s.warningBox}>
            {category.commonRejectionReasons.map((reason, i) => (
              <div key={i} style={s.warningItem}>
                <span style={s.warningIcon}>&#9888;</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={s.cta}>
          <button className="btn btn-primary btn-lg" onClick={startApplication} disabled={creating}>
            {creating ? 'Creating...' : 'Start Application for This Visa'}
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/eligibility')}>
            Check My Eligibility First
          </button>
        </div>

        <p style={s.disclaimer}>
          Disclaimer: This information is based on the Immigration Act 13 of 2002 (as amended) and current DHA regulations.
          Final decisions on all visa applications are made by the Department of Home Affairs.
        </p>
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
  header: { marginBottom: '2rem' },
  badge: {
    display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 999,
    fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
    background: '#e8f5e9', color: '#1a5632', marginBottom: '0.75rem',
  },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#212529', marginBottom: '0.5rem' },
  subtitle: { fontSize: '1rem', color: '#6c757d', lineHeight: 1.6 },
  meta: { display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' },
  metaItem: { fontSize: '0.8125rem', color: '#495057', fontWeight: 500 },
  section: {
    background: '#fff', borderRadius: 12, padding: '1.5rem',
    border: '1px solid #e9ecef', marginBottom: '1.5rem',
  },
  sectionTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: '#212529' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  listItem: {
    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
    padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: 8,
    fontSize: '0.875rem', borderLeft: '3px solid #d4edda',
  },
  checkIcon: { color: '#28a745', fontWeight: 700, flexShrink: 0 },
  docGrid: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  docCard: { padding: '0.75rem', background: '#f8f9fa', borderRadius: 8 },
  docHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
  docName: { fontWeight: 600, fontSize: '0.875rem' },
  docBadge: { padding: '0.125rem 0.5rem', borderRadius: 999, fontSize: '0.6875rem', fontWeight: 600 },
  docDesc: { fontSize: '0.8125rem', color: '#6c757d' },
  warningBox: {
    background: '#fff8e1', borderRadius: 8, padding: '1rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
  },
  warningItem: { display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#856404' },
  warningIcon: { flexShrink: 0 },
  cta: {
    display: 'flex', gap: '1rem', justifyContent: 'center',
    flexWrap: 'wrap', marginTop: '2rem', marginBottom: '1.5rem',
  },
  disclaimer: {
    fontSize: '0.75rem', color: '#adb5bd', fontStyle: 'italic',
    textAlign: 'center', lineHeight: 1.5,
  },
};
