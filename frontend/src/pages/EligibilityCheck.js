import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eligibilityAPI } from '../services/api';

export default function EligibilityCheck() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    nationality: '',
    purposeOfStay: '',
    intendedDuration: '',
    passportNumber: 'PROVIDED',
    passportExpiry: '',
    maritalStatus: '',
    hasJobOffer: false,
    hasSAQAEvaluation: false,
    isOnCriticalSkillsList: false,
    hasProfessionalRegistration: false,
    hasDOLRecommendation: false,
    hasPoliceClearance: false,
    hasMedicalReport: false,
    hasAcceptanceLetter: false,
    hasCriminalRecord: false,
    hasImmigrationViolations: false,
    spouseIsSACitizen: false,
    hasLifePartnerInSA: false,
    yearsOnWorkVisa: 0,
    isMultinationalEmployee: false,
    familyTiesInSA: null,
    qualifications: [],
    financialStanding: { monthlyIncome: 0, annualIncome: 0, netWorth: 0, investmentCapital: 0 },
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinancial = (field, value) => {
    setForm((prev) => ({
      ...prev,
      financialStanding: { ...prev.financialStanding, [field]: parseInt(value) || 0 },
    }));
  };

  const runEvaluation = async () => {
    if (!form.nationality || !form.purposeOfStay) {
      alert('Please provide at least your nationality and purpose of stay.');
      return;
    }
    setLoading(true);
    try {
      const res = await eligibilityAPI.evaluate(form);
      setResult(res.data.evaluation);
    } catch (err) {
      alert(err.response?.data?.error || 'Evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={s.header}>
          <h1 style={s.title}>AI Eligibility Assessment</h1>
          <p style={s.subtitle}>
            Answer the questions below and our rules engine will evaluate your eligibility
            across all South African visa categories based on immigration law.
          </p>
        </div>

        {!result ? (
          <div style={s.formCard}>
            {/* Basic Info */}
            <h2 style={s.groupTitle}>Basic Information</h2>
            <div style={s.row}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Nationality</label>
                <input value={form.nationality} onChange={(e) => handleChange('nationality', e.target.value)} placeholder="e.g. Nigerian" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Purpose of Stay</label>
                <select value={form.purposeOfStay} onChange={(e) => handleChange('purposeOfStay', e.target.value)}>
                  <option value="">Select purpose</option>
                  <option value="tourism">Tourism</option>
                  <option value="business_visit">Business Visit</option>
                  <option value="work">Employment</option>
                  <option value="study">Study</option>
                  <option value="business">Start Business</option>
                  <option value="medical">Medical Treatment</option>
                  <option value="remote_work">Remote Work</option>
                  <option value="retirement">Retirement</option>
                  <option value="family_reunion">Family Reunion</option>
                </select>
              </div>
            </div>

            <div style={s.row}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Passport Expiry Date</label>
                <input type="date" value={form.passportExpiry} onChange={(e) => handleChange('passportExpiry', e.target.value)} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Marital Status</label>
                <select value={form.maritalStatus} onChange={(e) => handleChange('maritalStatus', e.target.value)}>
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="life_partner">Life Partner</option>
                </select>
              </div>
            </div>

            {/* Financial */}
            <h2 style={s.groupTitle}>Financial Information</h2>
            <div style={s.row}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Annual Income (ZAR)</label>
                <input type="number" value={form.financialStanding.annualIncome || ''} onChange={(e) => handleFinancial('annualIncome', e.target.value)} placeholder="e.g. 600000" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Net Worth (ZAR)</label>
                <input type="number" value={form.financialStanding.netWorth || ''} onChange={(e) => handleFinancial('netWorth', e.target.value)} placeholder="e.g. 5000000" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Investment Capital (ZAR)</label>
                <input type="number" value={form.financialStanding.investmentCapital || ''} onChange={(e) => handleFinancial('investmentCapital', e.target.value)} placeholder="e.g. 5000000" />
              </div>
            </div>

            {/* Qualifications */}
            <h2 style={s.groupTitle}>Qualifications & Employment</h2>
            <div style={s.checkboxGrid}>
              {[
                ['hasJobOffer', 'I have a job offer in South Africa'],
                ['hasSAQAEvaluation', 'My qualifications are SAQA-evaluated'],
                ['isOnCriticalSkillsList', 'My skill is on the Critical Skills List'],
                ['hasProfessionalRegistration', 'I have SA professional registration'],
                ['hasDOLRecommendation', 'I have a Department of Labour recommendation'],
                ['isMultinationalEmployee', 'I work for a multinational company with SA presence'],
                ['hasAcceptanceLetter', 'I have an acceptance letter from a SA institution'],
              ].map(([field, label]) => (
                <label key={field} style={s.checkbox}>
                  <input type="checkbox" checked={form[field]} onChange={(e) => handleChange(field, e.target.checked)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="input-group">
              <label>Years on work visa in SA</label>
              <input type="number" value={form.yearsOnWorkVisa} onChange={(e) => handleChange('yearsOnWorkVisa', parseInt(e.target.value) || 0)} min="0" max="30" />
            </div>

            {/* Documents & Background */}
            <h2 style={s.groupTitle}>Documents & Background</h2>
            <div style={s.checkboxGrid}>
              {[
                ['hasPoliceClearance', 'I have a police clearance certificate'],
                ['hasMedicalReport', 'I have a medical report (less than 6 months old)'],
                ['spouseIsSACitizen', 'My spouse is a SA citizen/PR'],
                ['hasLifePartnerInSA', 'I have a life partner who is a SA citizen/PR'],
                ['hasCriminalRecord', 'I have a criminal record'],
                ['hasImmigrationViolations', 'I have previous immigration violations'],
              ].map(([field, label]) => (
                <label key={field} style={s.checkbox}>
                  <input type="checkbox" checked={form[field]} onChange={(e) => handleChange(field, e.target.checked)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div style={s.ctaBox}>
              <button className="btn btn-primary btn-lg" onClick={runEvaluation} disabled={loading}>
                {loading ? 'Evaluating...' : 'Run Eligibility Assessment'}
              </button>
              <p style={s.hint}>Your profile will be evaluated against all 22+ visa categories.</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Results */}
            <div style={s.resultHeader}>
              <h2 style={s.resultTitle}>Eligibility Assessment Results</h2>
              <p style={s.resultMeta}>
                {result.totalCategoriesEvaluated} categories evaluated |{' '}
                {result.eligible.length} eligible |{' '}
                {result.ineligible.length} ineligible
              </p>
              <button className="btn btn-outline" onClick={() => setResult(null)}>
                Run New Assessment
              </button>
            </div>

            {/* Recommended */}
            {result.recommendedPathway && (
              <div style={s.recommendedCard}>
                <div style={s.recommendedBadge}>RECOMMENDED PATHWAY</div>
                <h3 style={s.recommendedTitle}>{result.recommendedPathway.categoryName}</h3>
                <div style={s.scoreBar}>
                  <div style={{ ...s.scoreFill, width: `${result.recommendedPathway.eligibilityScore}%` }} />
                </div>
                <span style={s.scoreText}>
                  Eligibility Score: {result.recommendedPathway.eligibilityScore}%
                </span>
                <p style={s.recommendedLegal}>{result.recommendedPathway.legalReference}</p>
                <pre style={s.guidance}>{result.recommendedPathway.guidance}</pre>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/visas/${result.recommendedPathway.categoryId}`)}
                >
                  View Full Details & Apply
                </button>
              </div>
            )}

            {/* Other Eligible */}
            {result.eligible.length > 1 && (
              <div style={s.section}>
                <h3 style={s.sectionTitle}>Other Eligible Categories</h3>
                <div style={s.eligibleGrid}>
                  {result.eligible.slice(1).map((cat, i) => (
                    <div key={i} style={s.eligibleCard} onClick={() => navigate(`/visas/${cat.categoryId}`)}>
                      <div style={s.eligibleHeader}>
                        <span style={s.eligibleName}>{cat.categoryName}</span>
                        <span style={s.eligibleScore}>{cat.eligibilityScore}%</span>
                      </div>
                      <span style={s.eligibleLegal}>{cat.legalReference}</span>
                      {cat.riskFlags.length > 0 && (
                        <span style={s.riskNote}>{cat.riskFlags.length} risk flag(s)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={s.disclaimer}>
              <strong>Legal Disclaimer:</strong> This assessment is based on the Immigration Act 13 of 2002
              (as amended) and current DHA regulations. It provides guidance only. All final visa decisions
              are made by the Department of Home Affairs. Consult a registered immigration practitioner
              for personalized legal advice.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '2rem 0' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#1a5632' },
  subtitle: { color: '#6c757d', fontSize: '0.9375rem', marginTop: '0.5rem' },
  formCard: {
    background: '#fff', borderRadius: 16, padding: '2.5rem',
    border: '1px solid #e9ecef', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  groupTitle: {
    fontSize: '1rem', fontWeight: 700, color: '#1a5632',
    marginBottom: '1rem', marginTop: '1.5rem',
    paddingBottom: '0.5rem', borderBottom: '1px solid #e9ecef',
  },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  checkboxGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '0.5rem', marginBottom: '1rem',
  },
  checkbox: {
    display: 'flex', gap: '0.5rem', alignItems: 'center',
    fontSize: '0.875rem', color: '#495057', cursor: 'pointer',
    padding: '0.5rem', borderRadius: 6, background: '#f8f9fa',
  },
  ctaBox: { textAlign: 'center', marginTop: '2rem' },
  hint: { fontSize: '0.8125rem', color: '#6c757d', marginTop: '0.75rem' },
  resultHeader: {
    textAlign: 'center', marginBottom: '2rem',
    padding: '1.5rem', background: '#fff', borderRadius: 12,
    border: '1px solid #e9ecef',
  },
  resultTitle: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' },
  resultMeta: { fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' },
  recommendedCard: {
    background: 'linear-gradient(135deg, #1a5632, #2d7a4a)',
    borderRadius: 16, padding: '2rem', color: '#fff', marginBottom: '1.5rem',
  },
  recommendedBadge: {
    display: 'inline-block', padding: '0.25rem 0.75rem',
    background: 'rgba(212,168,67,0.9)', color: '#1a1a2e',
    borderRadius: 999, fontSize: '0.6875rem', fontWeight: 700,
    letterSpacing: '1px', marginBottom: '0.75rem',
  },
  recommendedTitle: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' },
  scoreBar: {
    height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 999,
    marginBottom: '0.5rem', overflow: 'hidden',
  },
  scoreFill: { height: '100%', background: '#d4a843', borderRadius: 999, transition: 'width 0.5s' },
  scoreText: { fontSize: '0.875rem', opacity: 0.9, display: 'block', marginBottom: '0.75rem' },
  recommendedLegal: { fontSize: '0.8125rem', opacity: 0.75, marginBottom: '1rem' },
  guidance: {
    background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '1rem',
    fontSize: '0.8125rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
    fontFamily: 'inherit', marginBottom: '1rem',
  },
  section: {
    background: '#fff', borderRadius: 12, padding: '1.5rem',
    border: '1px solid #e9ecef', marginBottom: '1.5rem',
  },
  sectionTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' },
  eligibleGrid: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  eligibleCard: {
    padding: '1rem', background: '#f8f9fa', borderRadius: 8,
    cursor: 'pointer', borderLeft: '3px solid #1a5632',
  },
  eligibleHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' },
  eligibleName: { fontWeight: 600, fontSize: '0.9375rem' },
  eligibleScore: { fontWeight: 700, color: '#1a5632' },
  eligibleLegal: { fontSize: '0.75rem', color: '#6c757d' },
  riskNote: { fontSize: '0.75rem', color: '#ffc107', fontWeight: 600, display: 'block', marginTop: '0.25rem' },
  disclaimer: {
    background: '#fff3cd', borderRadius: 8, padding: '1rem',
    fontSize: '0.8125rem', color: '#856404', lineHeight: 1.5,
  },
};
