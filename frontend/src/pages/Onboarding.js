import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicantAPI } from '../services/api';

const STEPS = ['Personal', 'Travel', 'Background', 'Review'];

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

  const next = () => step < 3 && setStep(step + 1);
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

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Progress */}
        <div style={s.progressWrap}>
          {STEPS.map((label, i) => (
            <div key={i} style={s.progressStep}>
              <div style={{
                ...s.dot,
                background: i < step ? '#22c55e' : i === step ? '#d4a843' : 'rgba(255,255,255,0.06)',
                color: i <= step ? '#09090b' : '#52525b',
                border: i === step ? '2px solid #d4a843' : i < step ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
              }}>
                {i < step ? '\u2713' : i + 1}
              </div>
              <span style={{ ...s.dotLabel, color: i === step ? '#fafafa' : '#52525b' }}>{label}</span>
              {i < 3 && <div style={{ ...s.progressLine, background: i < step ? '#22c55e' : 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>

        <div style={s.card}>
          <h1 style={s.title}>
            {step === 0 && 'Personal Information'}
            {step === 1 && 'Travel & Purpose'}
            {step === 2 && 'Background Check'}
            {step === 3 && 'Review & Submit'}
          </h1>
          <p style={s.subtitle}>
            {step === 0 && 'Tell us about yourself so we can assess your eligibility.'}
            {step === 1 && 'What brings you to South Africa?'}
            {step === 2 && 'Required for eligibility assessment under the Immigration Act.'}
            {step === 3 && 'Please verify your information before submitting.'}
          </p>

          {error && <div style={s.error}>{error}</div>}

          {/* Step 0: Personal */}
          {step === 0 && (
            <div>
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
            </div>
          )}

          {/* Step 1: Travel */}
          {step === 1 && (
            <div>
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
            </div>
          )}

          {/* Step 2: Background */}
          {step === 2 && (
            <div>
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
              <p style={s.flagLabel}>Disqualifying Factors</p>
              <div style={s.checkRow}><input type="checkbox" checked={form.hasCriminalRecord} onChange={update('hasCriminalRecord')} id="cr" /><label htmlFor="cr" style={s.checkLabel}>I have a criminal record</label></div>
              <div style={s.checkRow}><input type="checkbox" checked={form.hasOverstayed} onChange={update('hasOverstayed')} id="os" /><label htmlFor="os" style={s.checkLabel}>I have previously overstayed a visa</label></div>
              <div style={s.checkRow}><input type="checkbox" checked={form.hasPreviousRefusal} onChange={update('hasPreviousRefusal')} id="pr" /><label htmlFor="pr" style={s.checkLabel}>I have had a visa application refused</label></div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              {[
                { label: 'Passport', value: form.passportNumber },
                { label: 'Nationality', value: form.nationality },
                { label: 'Date of Birth', value: form.dateOfBirth },
                { label: 'Purpose', value: form.purposeOfStay },
                { label: 'Duration', value: form.intendedDuration?.replace(/_/g,' ') },
                { label: 'Job Offer', value: form.hasJobOffer ? `Yes - ${form.employerName}` : 'No' },
                { label: 'Qualifications', value: form.qualifications || 'None specified' },
                { label: 'Experience', value: `${form.yearsExperience || 0} years` },
                { label: 'Financial Means', value: form.financialMeans || 'Not specified' },
                { label: 'Criminal Record', value: form.hasCriminalRecord ? 'Yes' : 'No' },
                { label: 'Overstayed', value: form.hasOverstayed ? 'Yes' : 'No' },
                { label: 'Previous Refusal', value: form.hasPreviousRefusal ? 'Yes' : 'No' },
              ].map((item, i) => (
                <div key={i} style={s.reviewRow}>
                  <span style={s.reviewLabel}>{item.label}</span>
                  <span style={s.reviewValue}>{item.value || '—'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={s.actions}>
            {step > 0 && <button className="btn btn-secondary" onClick={prev}>Back</button>}
            <div style={{ flex: 1 }} />
            {step < 3 ? (
              <button className="btn btn-primary" onClick={next}>Continue</button>
            ) : (
              <button className="btn btn-primary" onClick={submit} disabled={saving}>
                {saving ? 'Saving...' : 'Submit Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  container: { maxWidth: 600, margin: '0 auto', padding: '0 24px' },
  progressWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 },
  progressStep: { display: 'flex', alignItems: 'center', gap: 0 },
  dot: { width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all 0.3s' },
  dotLabel: { fontSize: 11, fontWeight: 600, marginLeft: 6, letterSpacing: '0.02em', whiteSpace: 'nowrap' },
  progressLine: { width: 40, height: 2, borderRadius: 2, margin: '0 8px', transition: 'background 0.3s' },
  card: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px' },
  title: { fontSize: 22, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#a1a1aa', marginBottom: 28 },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 },
  row: { display: 'flex', gap: 12 },
  checkRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
  checkLabel: { fontSize: 14, color: '#a1a1aa', cursor: 'pointer' },
  divider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' },
  flagLabel: { fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 8 },
  reviewRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  reviewLabel: { fontSize: 13, color: '#52525b', fontWeight: 500 },
  reviewValue: { fontSize: 14, color: '#fafafa', fontWeight: 600, textAlign: 'right' },
  actions: { display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' },
};
