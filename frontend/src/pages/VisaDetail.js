import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { visaAPI } from '../services/api';

export default function VisaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await visaAPI.getCategory(id);
        setVisa(res.data.category || res.data);
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}><div className="spinner" /></div>;
  if (!visa) return <div style={{ textAlign: 'center', paddingTop: 120, color: '#52525b' }}>Visa category not found.</div>;

  const groupColors = { temporary_residence: '#3b82f6', work_permit: '#22c55e', family: '#d4a843', permanent_residence: '#a855f7', refugee: '#ef4444' };
  const color = groupColors[visa.category] || '#a1a1aa';

  return (
    <div style={s.page}>
      <div className="container-md">
        <button onClick={() => navigate('/visas')} style={s.back}>&larr; All Visa Categories</button>

        {/* Hero */}
        <div style={s.hero}>
          <div style={{ ...s.heroDot, background: color }} />
          <h1 style={s.heroTitle}>{visa.name}</h1>
          <p style={s.heroDesc}>{visa.description}</p>
          <div style={s.heroMeta}>
            <span style={{ ...s.metaBadge, background: color + '18', color }}>{visa.maxDuration}</span>
            <span style={s.legalRef}>{visa.legalReference}</span>
          </div>
        </div>

        {/* Eligibility */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Eligibility Requirements</h2>
          <div style={s.listWrap}>
            {(visa.eligibility?.requirements || []).map((req, i) => (
              <div key={i} style={s.listItem}>
                <span style={{ ...s.listIcon, color: '#22c55e' }}>{'\u2713'}</span>
                <span style={s.listText}>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disqualifiers */}
        <div style={s.section}>
          <h2 style={{ ...s.sectionTitle, color: '#ef4444' }}>Disqualifying Factors</h2>
          <div style={s.listWrap}>
            {(visa.eligibility?.disqualifiers || []).map((d, i) => (
              <div key={i} style={s.listItem}>
                <span style={{ ...s.listIcon, color: '#ef4444' }}>{'\u2717'}</span>
                <span style={s.listText}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Required Documents</h2>
          <div style={s.docGrid}>
            {(visa.requiredDocuments || []).map((doc, i) => (
              <div key={i} style={{ ...s.docCard, borderLeftColor: doc.required ? '#d4a843' : 'rgba(255,255,255,0.06)' }}>
                <div style={s.docHeader}>
                  <span style={s.docName}>{doc.name}</span>
                  <span style={{ ...s.docBadge, background: doc.required ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.06)', color: doc.required ? '#d4a843' : '#52525b' }}>
                    {doc.required ? 'REQUIRED' : 'OPTIONAL'}
                  </span>
                </div>
                <p style={s.docDesc}>{doc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rejection Reasons */}
        <div style={s.section}>
          <h2 style={{ ...s.sectionTitle, color: '#f59e0b' }}>Common Rejection Reasons</h2>
          <div style={s.listWrap}>
            {(visa.commonRejectionReasons || []).map((r, i) => (
              <div key={i} style={s.listItem}>
                <span style={{ ...s.listIcon, color: '#f59e0b' }}>{'\u26A0'}</span>
                <span style={s.listText}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fees */}
        {visa.fees && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Fees</h2>
            <div style={s.feeRow}>
              {Object.entries(visa.fees).map(([key, val]) => (
                <div key={key} style={s.feeCard}>
                  <span style={s.feeLabel}>{key.replace(/_/g, ' ')}</span>
                  <span style={s.feeValue}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={s.cta}>
          <Link to="/eligibility" className="btn btn-primary btn-lg">Check Your Eligibility</Link>
          <Link to="/knowledge" className="btn btn-secondary btn-lg">View Knowledge Hub</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  back: { background: 'none', border: 'none', color: '#a1a1aa', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24, padding: 0, display: 'block', transition: 'color 0.2s' },
  hero: { marginBottom: 40 },
  heroDot: { width: 10, height: 10, borderRadius: '50%', marginBottom: 16 },
  heroTitle: { fontSize: 32, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 12 },
  heroDesc: { fontSize: 16, color: '#a1a1aa', lineHeight: 1.7, marginBottom: 16 },
  heroMeta: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  metaBadge: { padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600 },
  legalRef: { fontSize: 12, color: '#52525b', fontStyle: 'italic' },
  section: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 24px', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  listWrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  listItem: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  listIcon: { fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 },
  listText: { fontSize: 14, color: '#a1a1aa', lineHeight: 1.6 },
  docGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  docCard: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px', borderLeft: '3px solid' },
  docHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  docName: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  docBadge: { fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' },
  docDesc: { fontSize: 12, color: '#52525b' },
  feeRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  feeCard: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 120 },
  feeLabel: { fontSize: 11, color: '#52525b', textTransform: 'capitalize', fontWeight: 500 },
  feeValue: { fontSize: 16, fontWeight: 700, color: '#d4a843' },
  cta: { display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' },
};
