import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eligibilityAPI, applicantAPI } from '../services/api';

export default function EligibilityCheck() {
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await applicantAPI.getMe();
        setProfile(res.data.applicant);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const handleEvaluate = async () => {
    if (!profile) return;
    setEvaluating(true);
    try {
      const res = await eligibilityAPI.evaluate(profile);
      setResults(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Evaluation failed.');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}><div className="spinner" /></div>;

  return (
    <div style={s.page}>
      <div className="container-md">
        <h1 style={s.title}>Eligibility Assessment</h1>
        <p style={s.subtitle}>AI-powered evaluation of your profile against all South African visa categories based on the Immigration Act 13 of 2002.</p>

        {!profile ? (
          <div style={s.noProfile}>
            <h2 style={s.noProfileTitle}>Complete your profile first</h2>
            <p style={s.noProfileText}>We need your personal details, travel purpose, qualifications, and background to evaluate eligibility.</p>
            <Link to="/onboarding" className="btn btn-primary btn-lg">Start Onboarding</Link>
          </div>
        ) : !results ? (
          <div style={s.readyCard}>
            <div style={s.readyIcon}>AI</div>
            <h2 style={s.readyTitle}>Profile Ready</h2>
            <p style={s.readyText}>Your profile is complete. Our AI engine will evaluate your eligibility across all 22+ visa categories.</p>
            <div style={s.profileSummary}>
              {[
                { l: 'Nationality', v: profile.nationality },
                { l: 'Purpose', v: profile.purposeOfStay },
                { l: 'Duration', v: profile.intendedDuration?.replace(/_/g, ' ') },
                { l: 'Qualifications', v: (profile.qualifications || []).map(q => q.name || q).join(', ') || 'None' },
                { l: 'Job Offer', v: profile.hasJobOffer ? 'Yes' : 'No' },
              ].map((item, i) => (
                <div key={i} style={s.summaryRow}>
                  <span style={s.summaryLabel}>{item.l}</span>
                  <span style={s.summaryValue}>{item.v || '—'}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleEvaluate} disabled={evaluating} style={{ width: '100%' }}>
              {evaluating ? 'Evaluating...' : 'Run AI Assessment'}
            </button>
          </div>
        ) : (
          <div>
            {/* Recommended */}
            {results.recommendedPathway && (
              <div style={s.recommendCard}>
                <span style={s.recommendLabel}>RECOMMENDED PATHWAY</span>
                <h2 style={s.recommendTitle}>{results.recommendedPathway.name}</h2>
                <p style={s.recommendDesc}>{results.recommendedPathway.description}</p>
                <div style={s.scoreBar}>
                  <div style={s.scoreBarBg}>
                    <div style={{ ...s.scoreBarFill, width: `${results.recommendedPathway.score || 0}%` }} />
                  </div>
                  <span style={s.scoreValue}>{results.recommendedPathway.score || 0}%</span>
                </div>
              </div>
            )}

            {/* All results */}
            <h2 style={s.resultsTitle}>All Categories Evaluated ({(results.results || []).length})</h2>
            <div style={s.resultsList}>
              {(results.results || []).sort((a, b) => (b.score || 0) - (a.score || 0)).map((r, i) => (
                <div key={i} style={{ ...s.resultCard, borderLeftColor: r.eligible ? '#22c55e' : r.score >= 40 ? '#f59e0b' : 'rgba(255,255,255,0.06)' }}>
                  <div style={s.resultTop}>
                    <div>
                      <h3 style={s.resultName}>{r.categoryName || r.categoryId}</h3>
                      <span style={{ ...s.resultBadge, background: r.eligible ? 'rgba(34,197,94,0.12)' : r.score >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)', color: r.eligible ? '#22c55e' : r.score >= 40 ? '#f59e0b' : '#52525b' }}>
                        {r.eligible ? 'ELIGIBLE' : r.score >= 40 ? 'PARTIAL' : 'NOT ELIGIBLE'}
                      </span>
                    </div>
                    <div style={s.resultScore}>
                      <span style={{ ...s.resultScoreNum, color: r.eligible ? '#22c55e' : r.score >= 40 ? '#f59e0b' : '#52525b' }}>{r.score || 0}%</span>
                    </div>
                  </div>
                  {r.guidance && <p style={s.resultGuidance}>{r.guidance}</p>}
                  {r.missingRequirements?.length > 0 && (
                    <div style={s.missingList}>
                      {r.missingRequirements.slice(0, 3).map((m, j) => (
                        <span key={j} style={s.missingItem}>{m}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setResults(null)}>Re-evaluate</button>
              <Link to="/visas" className="btn btn-primary">Browse Visa Categories</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  title: { fontSize: 32, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 32, maxWidth: 600 },
  noProfile: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '48px 32px', textAlign: 'center' },
  noProfileTitle: { fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 8 },
  noProfileText: { fontSize: 14, color: '#a1a1aa', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' },
  readyCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '36px 32px', textAlign: 'center' },
  readyIcon: { width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #d4a843 0%, #b8922e 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#09090b', fontWeight: 800, fontSize: 18, marginBottom: 20 },
  readyTitle: { fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 8 },
  readyText: { fontSize: 14, color: '#a1a1aa', marginBottom: 24 },
  profileSummary: { background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px', marginBottom: 24, textAlign: 'left' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  summaryLabel: { fontSize: 13, color: '#52525b' },
  summaryValue: { fontSize: 13, color: '#fafafa', fontWeight: 600, textTransform: 'capitalize' },
  recommendCard: { background: 'linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(212,168,67,0.02) 100%)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 20, padding: '32px 28px', marginBottom: 28 },
  recommendLabel: { fontSize: 10, fontWeight: 700, color: '#d4a843', letterSpacing: '0.1em', textTransform: 'uppercase' },
  recommendTitle: { fontSize: 24, fontWeight: 800, color: '#fafafa', margin: '8px 0' },
  recommendDesc: { fontSize: 14, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 16 },
  scoreBar: { display: 'flex', alignItems: 'center', gap: 12 },
  scoreBarBg: { flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' },
  scoreBarFill: { height: '100%', background: 'linear-gradient(90deg, #d4a843, #e0b94f)', borderRadius: 999, transition: 'width 0.6s ease' },
  scoreValue: { fontSize: 20, fontWeight: 800, color: '#d4a843' },
  resultsTitle: { fontSize: 18, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  resultsList: { display: 'flex', flexDirection: 'column', gap: 10 },
  resultCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px', borderLeft: '3px solid' },
  resultTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  resultName: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 4 },
  resultBadge: { fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.05em' },
  resultScore: {},
  resultScoreNum: { fontSize: 22, fontWeight: 800 },
  resultGuidance: { fontSize: 13, color: '#a1a1aa', marginTop: 8, lineHeight: 1.5 },
  missingList: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 },
  missingItem: { fontSize: 11, color: '#52525b', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 999 },
};
