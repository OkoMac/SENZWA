import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicantAPI } from '../services/api';
import Logo from '../components/Logo';

const STEPS = [
  { label: 'Welcome', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { label: 'Personal', icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z' },
  { label: 'Travel', icon: 'M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' },
  { label: 'Background', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Review', icon: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3' },
];

const NATIONALITIES = ['Afghan','Albanian','Algerian','American','Angolan','Argentine','Australian','Bangladeshi','Belgian','Brazilian','British','Burundian','Cameroonian','Canadian','Chinese','Colombian','Congolese','Cuban','Dutch','Egyptian','Ethiopian','Filipino','French','German','Ghanaian','Greek','Guatemalan','Haitian','Indian','Indonesian','Iranian','Iraqi','Irish','Israeli','Italian','Ivorian','Jamaican','Japanese','Jordanian','Kenyan','Lebanese','Lesotho','Liberian','Libyan','Malawian','Malaysian','Mexican','Moroccan','Mozambican','Namibian','Nigerian','Pakistani','Palestinian','Peruvian','Polish','Portuguese','Romanian','Russian','Rwandan','Saudi','Senegalese','Sierra Leonean','Somali','South Korean','Spanish','Sri Lankan','Sudanese','Swazi','Swedish','Swiss','Syrian','Taiwanese','Tanzanian','Thai','Togolese','Tunisian','Turkish','Ugandan','Ukrainian','Venezuelan','Vietnamese','Zambian','Zimbabwean'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    passportNumber: '', nationality: '', countryOfOrigin: '', dateOfBirth: '', gender: '',
    purposeOfStay: '', intendedDuration: '', hasJobOffer: false, employerName: '',
    qualifications: '', fieldOfStudy: '', yearsExperience: '',
    hasCriminalRecord: false, hasOverstayed: false, hasPreviousRefusal: false,
    medicalConditions: '', financialMeans: '',
  });

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  const next = () => step < 4 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      const data = {
        ...form,
        qualifications: form.qualifications ? form.qualifications.split(',').map(q => ({ name: q.trim(), level: 'degree' })) : [],
        employmentHistory: form.hasJobOffer ? [{ employer: form.employerName, current: true }] : [],
        yearsExperience: parseInt(form.yearsExperience) || 0,
      };
      await applicantAPI.create(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  // Progress percentage for the ring
  const progressPct = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Progress indicator */}
        <div style={s.progressWrap}>
          {STEPS.map((st, i) => (
            <div key={i} style={s.progressStep}>
              <div style={{
                ...s.dot,
                background: i < step ? '#22c55e' : i === step ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                border: i < step ? '2px solid #22c55e' : i === step ? '2px solid #d4a843' : '2px solid rgba(255,255,255,0.08)',
              }}>
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={i === step ? '#d4a843' : '#52525b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={st.icon}/></svg>
                )}
              </div>
              <span style={{ ...s.dotLabel, color: i === step ? '#fafafa' : i < step ? '#22c55e' : '#3f3f46' }}>{st.label}</span>
              {i < STEPS.length - 1 && <div style={{ ...s.progressLine, background: i < step ? '#22c55e' : 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div style={s.card}>
            <div style={s.welcomeCenter}>
              <Logo height={44} />
              <div style={s.welcomeBadge}>MigrateSA Onboarding</div>
              <h1 style={s.welcomeTitle}>Let's build your<br/><span style={{ color: '#d4a843' }}>immigration profile</span></h1>
              <p style={s.welcomeSub}>
                We'll ask a few questions about your background, purpose of travel,
                and qualifications. This helps our AI assess your eligibility across
                all 22+ South African visa categories.
              </p>

              <div style={s.featureGrid}>
                {[
                  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'POPIA Compliant', desc: 'Your data is encrypted' },
                  { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', label: 'AI-Powered', desc: 'Instant eligibility check' },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: '3 Minutes', desc: 'Quick and painless' },
                ].map((f, i) => (
                  <div key={i} style={s.featureItem}>
                    <div style={s.featureIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                    </div>
                    <div>
                      <div style={s.featureLabel}>{f.label}</div>
                      <div style={s.featureDesc}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.actions}>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary btn-lg" onClick={next} style={{ minWidth: 180 }}>
                Begin Profile Setup
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Personal */}
        {step === 1 && (
          <div style={s.card}>
            <div style={s.stepHeader}>
              <div style={s.stepRing}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#d4a843" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPct * 1.257} 125.7`}
                    transform="rotate(-90 24 24)" />
                </svg>
                <span style={s.stepRingText}>{step}/4</span>
              </div>
              <div>
                <h1 style={s.title}>Personal Information</h1>
                <p style={s.subtitle}>Tell us about yourself so we can assess your eligibility.</p>
              </div>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <div className="input-group"><label>Passport Number</label><input placeholder="e.g. AB1234567" value={form.passportNumber} onChange={update('passportNumber')} required /></div>
            <div style={s.row}>
              <div className="input-group" style={{flex:1}}><label>Nationality</label>
                <select value={form.nationality} onChange={update('nationality')}>
                  <option value="">Select nationality</option>
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="input-group" style={{flex:1}}><label>Country of Origin</label>
                <select value={form.countryOfOrigin} onChange={update('countryOfOrigin')}>
                  <option value="">Select country</option>
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={s.row}>
              <div className="input-group" style={{flex:1}}><label>Date of Birth</label><input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} /></div>
              <div className="input-group" style={{flex:1}}><label>Gender</label>
                <select value={form.gender} onChange={update('gender')}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={s.actions}>
              <button className="btn btn-secondary" onClick={prev}>Back</button>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 2: Travel */}
        {step === 2 && (
          <div style={s.card}>
            <div style={s.stepHeader}>
              <div style={s.stepRing}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#d4a843" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPct * 1.257} 125.7`}
                    transform="rotate(-90 24 24)" />
                </svg>
                <span style={s.stepRingText}>{step}/4</span>
              </div>
              <div>
                <h1 style={s.title}>Travel & Purpose</h1>
                <p style={s.subtitle}>What brings you to South Africa?</p>
              </div>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <div className="input-group"><label>Purpose of Stay</label>
              <select value={form.purposeOfStay} onChange={update('purposeOfStay')}>
                <option value="">Select purpose</option>
                {['Tourism','Business','Work','Study','Medical Treatment','Retirement','Join Family','Remote Work','Investment','Asylum'].map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
              </select>
            </div>
            <div className="input-group"><label>Intended Duration</label>
              <select value={form.intendedDuration} onChange={update('intendedDuration')}>
                <option value="">Select duration</option>
                {['Less than 90 days','3-6 months','6-12 months','1-3 years','3-5 years','Permanent'].map(d => <option key={d} value={d.toLowerCase().replace(/\s/g,'_')}>{d}</option>)}
              </select>
            </div>
            <div style={s.checkRow}>
              <input type="checkbox" checked={form.hasJobOffer} onChange={update('hasJobOffer')} id="job" />
              <label htmlFor="job" style={s.checkLabel}>I have a confirmed job offer in South Africa</label>
            </div>
            {form.hasJobOffer && (
              <div className="input-group"><label>Employer Name</label><input placeholder="Company name" value={form.employerName} onChange={update('employerName')} /></div>
            )}

            <div style={s.actions}>
              <button className="btn btn-secondary" onClick={prev}>Back</button>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={next}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Background */}
        {step === 3 && (
          <div style={s.card}>
            <div style={s.stepHeader}>
              <div style={s.stepRing}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#d4a843" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPct * 1.257} 125.7`}
                    transform="rotate(-90 24 24)" />
                </svg>
                <span style={s.stepRingText}>{step}/4</span>
              </div>
              <div>
                <h1 style={s.title}>Background Check</h1>
                <p style={s.subtitle}>Required for eligibility assessment under the Immigration Act.</p>
              </div>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <div className="input-group"><label>Qualifications (comma-separated)</label><input placeholder="e.g. BSc Computer Science, MBA" value={form.qualifications} onChange={update('qualifications')} /></div>
            <div style={s.row}>
              <div className="input-group" style={{flex:1}}><label>Field of Study</label><input placeholder="e.g. Engineering" value={form.fieldOfStudy} onChange={update('fieldOfStudy')} /></div>
              <div className="input-group" style={{flex:1}}><label>Years of Experience</label><input type="number" placeholder="0" value={form.yearsExperience} onChange={update('yearsExperience')} /></div>
            </div>
            <div className="input-group"><label>Financial Means</label>
              <select value={form.financialMeans} onChange={update('financialMeans')}>
                <option value="">Select range</option>
                {['Under R50,000','R50,000 - R200,000','R200,000 - R500,000','R500,000 - R1,000,000','Over R1,000,000','R12,000,000+ (Financially Independent)'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={s.divider} />
            <p style={s.flagLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Disqualifying Factors
            </p>
            <div style={s.checkRow}><input type="checkbox" checked={form.hasCriminalRecord} onChange={update('hasCriminalRecord')} id="cr" /><label htmlFor="cr" style={s.checkLabel}>I have a criminal record</label></div>
            <div style={s.checkRow}><input type="checkbox" checked={form.hasOverstayed} onChange={update('hasOverstayed')} id="os" /><label htmlFor="os" style={s.checkLabel}>I have previously overstayed a visa</label></div>
            <div style={s.checkRow}><input type="checkbox" checked={form.hasPreviousRefusal} onChange={update('hasPreviousRefusal')} id="pr" /><label htmlFor="pr" style={s.checkLabel}>I have had a visa application refused</label></div>

            <div style={s.actions}>
              <button className="btn btn-secondary" onClick={prev}>Back</button>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={next}>Review Profile</button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div style={s.card}>
            <div style={s.stepHeader}>
              <div style={s.stepRing}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="125.7 125.7"
                    transform="rotate(-90 24 24)" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute' }}><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h1 style={s.title}>Review & Submit</h1>
                <p style={s.subtitle}>Please verify your information before submitting.</p>
              </div>
            </div>

            {error && <div style={s.error}>{error}</div>}

            <div style={s.reviewSection}>
              <div style={s.reviewSectionLabel}>Personal Details</div>
              {[
                { label: 'Passport', value: form.passportNumber },
                { label: 'Nationality', value: form.nationality },
                { label: 'Date of Birth', value: form.dateOfBirth },
                { label: 'Gender', value: form.gender },
              ].map((item, i) => (
                <div key={i} style={s.reviewRow}>
                  <span style={s.reviewLabel}>{item.label}</span>
                  <span style={s.reviewValue}>{item.value || '\u2014'}</span>
                </div>
              ))}
            </div>

            <div style={s.reviewSection}>
              <div style={s.reviewSectionLabel}>Travel & Purpose</div>
              {[
                { label: 'Purpose', value: form.purposeOfStay },
                { label: 'Duration', value: form.intendedDuration?.replace(/_/g,' ') },
                { label: 'Job Offer', value: form.hasJobOffer ? `Yes \u2013 ${form.employerName}` : 'No' },
              ].map((item, i) => (
                <div key={i} style={s.reviewRow}>
                  <span style={s.reviewLabel}>{item.label}</span>
                  <span style={s.reviewValue}>{item.value || '\u2014'}</span>
                </div>
              ))}
            </div>

            <div style={s.reviewSection}>
              <div style={s.reviewSectionLabel}>Background</div>
              {[
                { label: 'Qualifications', value: form.qualifications || 'None specified' },
                { label: 'Experience', value: `${form.yearsExperience || 0} years` },
                { label: 'Financial Means', value: form.financialMeans || 'Not specified' },
                { label: 'Criminal Record', value: form.hasCriminalRecord ? 'Yes' : 'No', warn: form.hasCriminalRecord },
                { label: 'Overstayed', value: form.hasOverstayed ? 'Yes' : 'No', warn: form.hasOverstayed },
                { label: 'Previous Refusal', value: form.hasPreviousRefusal ? 'Yes' : 'No', warn: form.hasPreviousRefusal },
              ].map((item, i) => (
                <div key={i} style={s.reviewRow}>
                  <span style={s.reviewLabel}>{item.label}</span>
                  <span style={{ ...s.reviewValue, color: item.warn ? '#f59e0b' : '#fafafa' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={s.actions}>
              <button className="btn btn-secondary" onClick={prev}>Back</button>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary btn-lg" onClick={submit} disabled={saving}>
                {saving ? 'Saving...' : 'Submit Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  container: { maxWidth: 600, margin: '0 auto', padding: '0 24px' },
  progressWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 },
  progressStep: { display: 'flex', alignItems: 'center', gap: 0 },
  dot: {
    width: 34, height: 34, borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all 0.3s',
  },
  dotLabel: { fontSize: 10, fontWeight: 600, marginLeft: 4, letterSpacing: '0.02em', whiteSpace: 'nowrap' },
  progressLine: { width: 28, height: 2, borderRadius: 2, margin: '0 4px', transition: 'background 0.3s' },
  card: {
    background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px',
  },
  stepHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 },
  stepRing: { position: 'relative', width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepRingText: { position: 'absolute', fontSize: 12, fontWeight: 800, color: '#d4a843' },
  title: { fontSize: 22, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#a1a1aa' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 },
  row: { display: 'flex', gap: 12 },
  checkRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
  checkLabel: { fontSize: 14, color: '#a1a1aa', cursor: 'pointer' },
  divider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' },
  flagLabel: { fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 8 },
  // Welcome step
  welcomeCenter: { textAlign: 'center', padding: '8px 0 24px' },
  welcomeBadge: {
    display: 'inline-block', padding: '5px 14px', marginTop: 20, marginBottom: 20,
    background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)',
    borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#d4a843',
    letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  welcomeTitle: { fontSize: 28, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 },
  welcomeSub: { fontSize: 14, color: '#a1a1aa', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 28px' },
  featureGrid: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340, margin: '0 auto', textAlign: 'left' },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  featureIcon: {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  featureLabel: { fontSize: 13, fontWeight: 700, color: '#fafafa' },
  featureDesc: { fontSize: 12, color: '#52525b', marginTop: 1 },
  // Review step
  reviewSection: { marginBottom: 20 },
  reviewSectionLabel: {
    fontSize: 11, fontWeight: 700, color: '#52525b', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: 8, paddingBottom: 6,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  reviewRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  reviewLabel: { fontSize: 13, color: '#52525b', fontWeight: 500 },
  reviewValue: { fontSize: 14, color: '#fafafa', fontWeight: 600, textAlign: 'right', textTransform: 'capitalize' },
  actions: { display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' },
};
