import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicantAPI } from '../services/api';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Bangladesh','Botswana',
  'Brazil','Cameroon','Canada','China','Colombia','Congo (DRC)','Egypt','Ethiopia','France',
  'Germany','Ghana','India','Indonesia','Iran','Iraq','Italy','Japan','Kenya','Lesotho',
  'Malawi','Malaysia','Mexico','Morocco','Mozambique','Namibia','Netherlands','Nigeria',
  'Pakistan','Philippines','Poland','Portugal','Russia','Rwanda','Saudi Arabia','Senegal',
  'Somalia','South Korea','Spain','Sri Lanka','Sudan','Eswatini','Sweden','Syria','Tanzania',
  'Thailand','Tunisia','Turkey','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Vietnam','Zambia','Zimbabwe',
];

const PURPOSES = [
  { value: 'tourism', label: 'Tourism / Leisure' },
  { value: 'business_visit', label: 'Business Visit' },
  { value: 'family_visit', label: 'Family / Personal Visit' },
  { value: 'work', label: 'Employment / Work' },
  { value: 'study', label: 'Study / Education' },
  { value: 'business', label: 'Start / Invest in Business' },
  { value: 'medical', label: 'Medical Treatment' },
  { value: 'remote_work', label: 'Remote Work' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'family_reunion', label: 'Family Reunification' },
  { value: 'permanent_residence', label: 'Permanent Residence' },
  { value: 'refugee', label: 'Refugee / Asylum' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    passportNumber: '', nationality: '', countryOfOrigin: '', dateOfBirth: '',
    gender: '', maritalStatus: '', purposeOfStay: '', intendedDuration: '',
    qualifications: [], employmentHistory: [], financialStanding: {},
    familyTiesInSA: null,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await applicantAPI.create(form);
      navigate('/eligibility');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Tell Us About Yourself</h1>
          <p style={styles.subtitle}>This information helps us guide you to the right visa pathway.</p>
        </div>

        {/* Progress */}
        <div style={styles.progress}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={styles.progressItem}>
              <div style={{
                ...styles.progressDot,
                background: s <= step ? '#1a5632' : '#dee2e6',
                color: s <= step ? '#fff' : '#6c757d',
              }}>{s}</div>
              <span style={{
                ...styles.progressLabel,
                color: s <= step ? '#1a5632' : '#adb5bd',
                fontWeight: s === step ? 700 : 400,
              }}>
                {['Personal', 'Travel', 'Background', 'Review'][s - 1]}
              </span>
            </div>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div>
            <h2 style={styles.stepTitle}>Personal Information</h2>
            <div className="input-group">
              <label>Passport Number</label>
              <input name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="e.g. A12345678" required />
            </div>
            <div className="input-group">
              <label>Nationality</label>
              <select name="nationality" value={form.nationality} onChange={handleChange} required>
                <option value="">Select your nationality</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Country of Origin</label>
              <select name="countryOfOrigin" value={form.countryOfOrigin} onChange={handleChange} required>
                <option value="">Select country of origin</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.row}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Marital Status</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
                <option value="">Select</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="life_partner">Life Partner</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Travel Intent */}
        {step === 2 && (
          <div>
            <h2 style={styles.stepTitle}>Travel & Stay Details</h2>
            <div className="input-group">
              <label>Purpose of Stay in South Africa</label>
              <select name="purposeOfStay" value={form.purposeOfStay} onChange={handleChange} required>
                <option value="">Select your purpose</option>
                {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Intended Duration of Stay</label>
              <select name="intendedDuration" value={form.intendedDuration} onChange={handleChange} required>
                <option value="">Select duration</option>
                <option value="less_than_30">Less than 30 days</option>
                <option value="30_to_90">30 to 90 days</option>
                <option value="90_to_180">3 to 6 months</option>
                <option value="6_to_12_months">6 to 12 months</option>
                <option value="1_to_3_years">1 to 3 years</option>
                <option value="3_to_5_years">3 to 5 years</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div className="input-group">
              <label>Do you have family ties in South Africa?</label>
              <select
                value={form.familyTiesInSA?.relationship || ''}
                onChange={(e) => setForm({
                  ...form,
                  familyTiesInSA: e.target.value ? { relationship: e.target.value } : null,
                })}
              >
                <option value="">No family ties</option>
                <option value="spouse">Spouse in SA</option>
                <option value="life_partner">Life partner in SA</option>
                <option value="parent">Parent in SA</option>
                <option value="child">Child in SA</option>
                <option value="sibling">Sibling in SA</option>
                <option value="other_relative">Other relative in SA</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Background */}
        {step === 3 && (
          <div>
            <h2 style={styles.stepTitle}>Qualifications & Background</h2>
            <div className="input-group">
              <label>Highest Qualification</label>
              <select
                value={form.qualifications?.[0]?.level || ''}
                onChange={(e) => setForm({
                  ...form,
                  qualifications: e.target.value ? [{ level: e.target.value }] : [],
                })}
              >
                <option value="">Select qualification</option>
                <option value="high_school">High School / Matric</option>
                <option value="diploma">Diploma / Certificate</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="honours">Honours Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="doctorate">Doctorate / PhD</option>
                <option value="professional">Professional Qualification</option>
              </select>
            </div>
            <div className="input-group">
              <label>Do you have a job offer in South Africa?</label>
              <select
                value={form.hasJobOffer ? 'yes' : 'no'}
                onChange={(e) => setForm({ ...form, hasJobOffer: e.target.value === 'yes' })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="input-group">
              <label>Monthly Income (ZAR equivalent)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={form.financialStanding?.monthlyIncome || ''}
                onChange={(e) => setForm({
                  ...form,
                  financialStanding: {
                    ...form.financialStanding,
                    monthlyIncome: parseInt(e.target.value) || 0,
                    annualIncome: (parseInt(e.target.value) || 0) * 12,
                  },
                })}
              />
            </div>
            <div className="input-group">
              <label>Do you have a criminal record?</label>
              <select
                value={form.hasCriminalRecord ? 'yes' : 'no'}
                onChange={(e) => setForm({ ...form, hasCriminalRecord: e.target.value === 'yes' })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h2 style={styles.stepTitle}>Review Your Information</h2>
            <p style={{ marginBottom: '1.5rem', color: '#6c757d', fontSize: '0.875rem' }}>
              Please review the information below before proceeding to eligibility assessment.
            </p>
            <div style={styles.reviewGrid}>
              {[
                ['Passport', form.passportNumber],
                ['Nationality', form.nationality],
                ['Country of Origin', form.countryOfOrigin],
                ['Date of Birth', form.dateOfBirth],
                ['Gender', form.gender],
                ['Marital Status', form.maritalStatus],
                ['Purpose of Stay', form.purposeOfStay],
                ['Duration', form.intendedDuration],
                ['Family in SA', form.familyTiesInSA?.relationship || 'None'],
                ['Qualification', form.qualifications?.[0]?.level || 'Not specified'],
                ['Job Offer', form.hasJobOffer ? 'Yes' : 'No'],
                ['Criminal Record', form.hasCriminalRecord ? 'Yes' : 'No'],
              ].map(([label, value], idx) => (
                <div key={idx} style={styles.reviewItem}>
                  <span style={styles.reviewLabel}>{label}</span>
                  <span style={styles.reviewValue}>{value || 'Not provided'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={styles.nav}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={prevStep}>Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < 4 ? (
            <button className="btn btn-primary" onClick={nextStep}>Continue</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save & Check Eligibility'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    padding: '2rem',
    background: '#f8f9fa',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '2.5rem',
    maxWidth: 640,
    margin: '0 auto',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 800, color: '#1a5632' },
  subtitle: { color: '#6c757d', fontSize: '0.875rem', marginTop: '0.25rem' },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e9ecef',
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.375rem',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8125rem',
    fontWeight: 700,
  },
  progressLabel: { fontSize: '0.75rem' },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem 1rem',
    borderRadius: 8,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  stepTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#212529',
  },
  row: { display: 'flex', gap: '1rem' },
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  reviewItem: {
    padding: '0.75rem',
    background: '#f8f9fa',
    borderRadius: 8,
  },
  reviewLabel: {
    display: 'block',
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  reviewValue: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#212529',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e9ecef',
  },
};
