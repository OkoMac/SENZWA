import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { knowledgeAPI } from '../services/api';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'visas', label: 'All Visas' },
  { id: 'skills', label: 'Critical Skills' },
  { id: 'country', label: 'Country Check' },
  { id: 'docs', label: 'Documents' },
  { id: 'fees', label: 'Fees' },
  { id: 'times', label: 'Processing Times' },
  { id: 'offices', label: 'Offices' },
  { id: 'bodies', label: 'Professional Bodies' },
  { id: 'faq', label: 'FAQ' },
];

export default function KnowledgeHub() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    loadTab(tab);
  }, [tab]);

  async function loadTab(t) {
    if (data[t]) return;
    setLoading(true);
    try {
      let result;
      switch (t) {
        case 'overview': result = await knowledgeAPI.getOverview(); break;
        case 'visas': result = await knowledgeAPI.getVisaCategories(); break;
        case 'skills': result = await knowledgeAPI.getCriticalSkills(); break;
        case 'fees': result = await knowledgeAPI.getFees(); break;
        case 'times': result = await knowledgeAPI.getProcessingTimes(); break;
        case 'offices': result = await knowledgeAPI.getDHAOffices(); break;
        case 'bodies': result = await knowledgeAPI.getProfessionalBodies(); break;
        case 'faq': result = await knowledgeAPI.getFAQ(); break;
        default: result = { data: {} };
      }
      setData(prev => ({ ...prev, [t]: result.data }));
    } catch {}
    setLoading(false);
  }

  async function lookupCountry() {
    if (!countryInput.trim()) return;
    setLoading(true);
    try {
      const res = await knowledgeAPI.getCountryRequirements(countryInput);
      setCountryData(res.data);
    } catch { setCountryData({ error: 'Country not found' }); }
    setLoading(false);
  }

  const Loader = () => <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div style={s.page}>
      <div className="container">
        <h1 style={s.title}>Knowledge Hub</h1>
        <p style={s.subtitle}>Complete self-service reference for South African immigration. Everything you need, in one place.</p>

        {/* Tabs */}
        <div style={s.tabs}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ ...s.tabBtn, ...(tab === t.id ? s.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && !data[tab] ? <Loader /> : (
          <div>
            {/* Overview */}
            {tab === 'overview' && data.overview && (
              <div>
                <div style={s.statsGrid}>
                  {[
                    { n: data.overview.totalVisaCategories || '22+', l: 'Visa Categories' },
                    { n: data.overview.totalCriticalSkills || '80+', l: 'Critical Skills' },
                    { n: '130+', l: 'Countries Covered' },
                    { n: '13', l: 'Professional Bodies' },
                  ].map((st, i) => (
                    <div key={i} style={s.statCard}><span style={s.statNum}>{st.n}</span><span style={s.statLabel}>{st.l}</span></div>
                  ))}
                </div>
                <div style={s.quickLinks}>
                  {TABS.slice(1).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={s.quickBtn}>{t.label}<span style={s.quickArrow}>&rarr;</span></button>
                  ))}
                </div>
              </div>
            )}

            {/* All Visas */}
            {tab === 'visas' && data.visas && (
              <div>
                <input type="text" placeholder="Search visa categories..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                <div style={s.visaGrid}>
                  {(data.visas.categories || []).filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                    <Link key={c.id} to={`/visas/${c.id}`} style={s.visaCard}>
                      <h3 style={s.visaName}>{c.name}</h3>
                      <p style={s.visaDesc}>{c.description}</p>
                      <div style={s.visaMeta}><span style={s.visaDur}>{c.maxDuration}</span><span style={s.visaRef}>{c.legalReference}</span></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Skills */}
            {tab === 'skills' && data.skills && (
              <div>
                <input type="text" placeholder="Search skills (e.g. Software, Nurse, Civil)..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                {(data.skills.categories || []).map(cat => {
                  const filtered = (cat.skills || []).filter(sk => !search || sk.title.toLowerCase().includes(search.toLowerCase()) || sk.ofoCode?.includes(search));
                  if (!filtered.length && search) return null;
                  return (
                    <div key={cat.category} style={s.skillSection}>
                      <h3 style={s.skillCat}>{cat.category} <span style={s.skillCount}>({filtered.length})</span></h3>
                      <div style={s.skillList}>
                        {filtered.map((sk, i) => (
                          <div key={i} style={s.skillRow}>
                            <div style={s.skillInfo}>
                              <span style={s.skillTitle}>{sk.title}</span>
                              <span style={s.skillOfo}>OFO: {sk.ofoCode}</span>
                            </div>
                            <div style={s.skillRight}>
                              <span style={s.skillQual}>{sk.qualificationRequired}</span>
                              {sk.professionalBody && <span style={s.skillBody}>{sk.professionalBody}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Country Check */}
            {tab === 'country' && (
              <div>
                <div style={s.countrySearch}>
                  <input type="text" placeholder="Enter country name (e.g. Nigeria, India, UK)..." value={countryInput} onChange={e => setCountryInput(e.target.value)} style={s.searchInput} onKeyDown={e => e.key === 'Enter' && lookupCountry()} />
                  <button className="btn btn-primary" onClick={lookupCountry}>Check</button>
                </div>
                {countryData && !countryData.error && (
                  <div style={s.countryResults}>
                    <h3 style={s.countryName}>{countryData.country}</h3>
                    <div style={s.countryGrid}>
                      <div style={s.countryItem}>
                        <span style={s.countryLabel}>Visa Exempt</span>
                        <span style={{ ...s.countryValue, color: countryData.visaExempt ? '#22c55e' : '#ef4444' }}>{countryData.visaExempt ? `Yes (${countryData.exemptDays} days)` : 'No'}</span>
                      </div>
                      <div style={s.countryItem}>
                        <span style={s.countryLabel}>Yellow Fever</span>
                        <span style={{ ...s.countryValue, color: countryData.yellowFeverRequired ? '#f59e0b' : '#22c55e' }}>{countryData.yellowFeverRequired ? 'Required' : 'Not Required'}</span>
                      </div>
                      <div style={s.countryItem}>
                        <span style={s.countryLabel}>Apostille</span>
                        <span style={s.countryValue}>{countryData.apostilleCountry ? 'Apostille accepted' : 'Legalization required'}</span>
                      </div>
                    </div>
                    {countryData.notes && <div style={s.countryNotes}><h4 style={s.noteTitle}>Country Notes</h4><p style={s.noteText}>{typeof countryData.notes === 'string' ? countryData.notes : JSON.stringify(countryData.notes)}</p></div>}
                  </div>
                )}
                {countryData?.error && <p style={s.muted}>{countryData.error}</p>}
              </div>
            )}

            {/* Documents Guide */}
            {tab === 'docs' && (
              <div style={s.docsGrid}>
                {[
                  { name: 'Valid Passport', desc: 'Must have at least 2 blank pages and be valid for 30 days beyond intended stay.', tip: 'Ensure passport is not damaged or altered.' },
                  { name: 'Police Clearance Certificate', desc: 'From every country lived in for 12+ months in the last 10 years.', tip: 'Must be less than 6 months old at time of submission.' },
                  { name: 'Medical Report', desc: 'Standard medical examination from a registered medical practitioner.', tip: 'Use DHA-approved forms. Must be recent.' },
                  { name: 'Radiological Report', desc: 'Chest X-ray for tuberculosis screening from an approved facility.', tip: 'Required for all applicants over 12 years old.' },
                  { name: 'Proof of Financial Means', desc: 'Bank statements, employment contract, or sponsor letter proving financial capacity.', tip: '3-6 months of bank statements recommended.' },
                  { name: 'Passport Photos', desc: 'Two recent passport-sized photographs with white background.', tip: '35mm x 45mm, taken within last 6 months.' },
                  { name: 'SAQA Evaluation', desc: 'South African Qualifications Authority evaluation of foreign qualifications.', tip: 'Apply early - can take 8-12 weeks.' },
                  { name: 'Yellow Fever Certificate', desc: 'Required if travelling from or transiting through a yellow fever endemic area.', tip: 'Must be vaccinated at least 10 days before arrival.' },
                ].map((doc, i) => (
                  <div key={i} style={s.docCard}>
                    <h3 style={s.docTitle}>{doc.name}</h3>
                    <p style={s.docDesc}>{doc.desc}</p>
                    <div style={s.docTip}><span style={s.tipLabel}>TIP:</span> {doc.tip}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Fees */}
            {tab === 'fees' && data.fees && (
              <div>
                {Object.entries(data.fees.fees || data.fees || {}).map(([category, items]) => {
                  if (!items || typeof items !== 'object') return null;
                  const entries = Array.isArray(items) ? items : Object.entries(items).map(([k, v]) => ({ name: k.replace(/_/g, ' '), amount: v }));
                  return (
                    <div key={category} style={s.feeSection}>
                      <h3 style={s.feeCat}>{category.replace(/_/g, ' ')}</h3>
                      <div style={s.feeList}>
                        {entries.map((fee, i) => (
                          <div key={i} style={s.feeRow}>
                            <span style={s.feeName}>{fee.name || fee.type}</span>
                            <span style={s.feeAmount}>{fee.amount || fee.fee}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Processing Times */}
            {tab === 'times' && data.times && (
              <div style={s.timesList}>
                {(data.times.processingTimes || Object.entries(data.times).map(([k, v]) => ({ category: k, ...v }))).map((item, i) => (
                  <div key={i} style={s.timeRow}>
                    <span style={s.timeCat}>{(item.category || item.name || '').replace(/_/g, ' ')}</span>
                    <div style={s.timeValues}>
                      <span style={s.timeStd}>{item.standard || item.standardDays || '—'}</span>
                      {item.expedited && <span style={s.timeExp}>{item.expedited}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Offices */}
            {tab === 'offices' && data.offices && (
              <div>
                {Object.entries(data.offices.offices || data.offices || {}).map(([type, offices]) => {
                  if (!Array.isArray(offices)) return null;
                  return (
                    <div key={type} style={s.officeSection}>
                      <h3 style={s.officeSectionTitle}>{type.replace(/_/g, ' ')}</h3>
                      <div style={s.officeGrid}>
                        {offices.map((o, i) => (
                          <div key={i} style={s.officeCard}>
                            <h4 style={s.officeName}>{o.name || o.city}</h4>
                            <p style={s.officeAddr}>{o.address}</p>
                            {o.hours && <p style={s.officeHours}>{o.hours}</p>}
                            {o.phone && <p style={s.officePhone}>{o.phone}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Professional Bodies */}
            {tab === 'bodies' && data.bodies && (
              <div style={s.bodiesGrid}>
                {(data.bodies.bodies || data.bodies || []).map((body, i) => (
                  <div key={i} style={s.bodyCard}>
                    <h3 style={s.bodyName}>{body.name}</h3>
                    <p style={s.bodyAbbr}>{body.abbreviation}</p>
                    <p style={s.bodyField}>{body.field || body.fields?.join(', ')}</p>
                    {body.registrationTime && <span style={s.bodyTime}>{body.registrationTime}</span>}
                    {body.website && <a href={body.website} target="_blank" rel="noopener noreferrer" style={s.bodyLink}>Visit Website &rarr;</a>}
                  </div>
                ))}
              </div>
            )}

            {/* FAQ */}
            {tab === 'faq' && data.faq && (
              <div>
                <input type="text" placeholder="Search frequently asked questions..." value={search} onChange={e => setSearch(e.target.value)} style={s.searchInput} />
                {(data.faq.categories || []).map(cat => {
                  const filtered = (cat.questions || []).filter(q => !search || q.question.toLowerCase().includes(search.toLowerCase()) || q.answer.toLowerCase().includes(search.toLowerCase()));
                  if (!filtered.length) return null;
                  return (
                    <div key={cat.category} style={s.faqSection}>
                      <h3 style={s.faqCat}>{cat.category}</h3>
                      {filtered.map((q, i) => {
                        const key = `${cat.category}-${i}`;
                        const open = expandedFaq === key;
                        return (
                          <div key={i} style={s.faqItem} onClick={() => setExpandedFaq(open ? null : key)}>
                            <div style={s.faqQuestion}>
                              <span style={s.faqQ}>{q.question}</span>
                              <span style={s.faqToggle}>{open ? '\u2212' : '+'}</span>
                            </div>
                            {open && (
                              <div style={s.faqAnswer}>
                                <p style={s.faqA}>{q.answer}</p>
                                {q.legalReference && <span style={s.faqRef}>{q.legalReference}</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  title: { fontSize: 32, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 28, maxWidth: 600 },
  tabs: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 32, padding: '4px', background: '#111113', borderRadius: 12 },
  tabBtn: { padding: '8px 14px', background: 'transparent', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  tabActive: { background: '#1a1a1d', color: '#d4a843' },
  searchInput: { width: '100%', padding: '14px 18px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15, color: '#fafafa', fontFamily: 'inherit', outline: 'none', marginBottom: 20 },
  muted: { color: '#52525b', fontSize: 14, textAlign: 'center', padding: 40 },

  // Overview
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 },
  statCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' },
  statNum: { display: 'block', fontSize: 28, fontWeight: 800, color: '#d4a843', letterSpacing: '-0.02em' },
  statLabel: { display: 'block', fontSize: 12, color: '#52525b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  quickLinks: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 },
  quickBtn: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', fontSize: 14, fontWeight: 600, color: '#fafafa', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' },
  quickArrow: { color: '#d4a843', fontSize: 16 },

  // Visas
  visaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  visaCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 18px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.2s' },
  visaName: { fontSize: 15, fontWeight: 700, color: '#fafafa' },
  visaDesc: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, flex: 1 },
  visaMeta: { display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' },
  visaDur: { fontSize: 11, color: '#d4a843', fontWeight: 600 },
  visaRef: { fontSize: 11, color: '#52525b', fontStyle: 'italic' },

  // Skills
  skillSection: { marginBottom: 28 },
  skillCat: { fontSize: 16, fontWeight: 700, color: '#d4a843', marginBottom: 12 },
  skillCount: { fontSize: 13, color: '#52525b', fontWeight: 400 },
  skillList: { display: 'flex', flexDirection: 'column', gap: 6 },
  skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', flexWrap: 'wrap', gap: 8 },
  skillInfo: { display: 'flex', flexDirection: 'column' },
  skillTitle: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  skillOfo: { fontSize: 11, color: '#52525b' },
  skillRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 },
  skillQual: { fontSize: 12, color: '#a1a1aa' },
  skillBody: { fontSize: 11, color: '#d4a843' },

  // Country
  countrySearch: { display: 'flex', gap: 12, marginBottom: 24 },
  countryResults: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 },
  countryName: { fontSize: 22, fontWeight: 700, color: '#fafafa', marginBottom: 16 },
  countryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 },
  countryItem: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px' },
  countryLabel: { display: 'block', fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  countryValue: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  countryNotes: { marginTop: 12, padding: 16, background: 'rgba(212,168,67,0.06)', borderRadius: 10, border: '1px solid rgba(212,168,67,0.1)' },
  noteTitle: { fontSize: 13, fontWeight: 700, color: '#d4a843', marginBottom: 6 },
  noteText: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6 },

  // Documents
  docsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  docCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 20px' },
  docTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa', marginBottom: 8 },
  docDesc: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 12 },
  docTip: { fontSize: 12, color: '#d4a843', background: 'rgba(212,168,67,0.06)', padding: '8px 12px', borderRadius: 8, lineHeight: 1.5 },
  tipLabel: { fontWeight: 700 },

  // Fees
  feeSection: { marginBottom: 24 },
  feeCat: { fontSize: 16, fontWeight: 700, color: '#fafafa', marginBottom: 10, textTransform: 'capitalize' },
  feeList: { display: 'flex', flexDirection: 'column', gap: 4 },
  feeRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 },
  feeName: { fontSize: 13, color: '#a1a1aa', textTransform: 'capitalize' },
  feeAmount: { fontSize: 14, fontWeight: 700, color: '#d4a843' },

  // Times
  timesList: { display: 'flex', flexDirection: 'column', gap: 6 },
  timeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 },
  timeCat: { fontSize: 14, fontWeight: 600, color: '#fafafa', textTransform: 'capitalize', flex: 1 },
  timeValues: { display: 'flex', gap: 12, alignItems: 'center' },
  timeStd: { fontSize: 13, color: '#a1a1aa' },
  timeExp: { fontSize: 12, color: '#22c55e', fontWeight: 600 },

  // Offices
  officeSection: { marginBottom: 28 },
  officeSectionTitle: { fontSize: 16, fontWeight: 700, color: '#fafafa', marginBottom: 12, textTransform: 'capitalize' },
  officeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 },
  officeCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 18px' },
  officeName: { fontSize: 14, fontWeight: 700, color: '#fafafa', marginBottom: 6 },
  officeAddr: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.5 },
  officeHours: { fontSize: 12, color: '#52525b', marginTop: 6 },
  officePhone: { fontSize: 12, color: '#d4a843', marginTop: 4 },

  // Bodies
  bodiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
  bodyCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 20px' },
  bodyName: { fontSize: 14, fontWeight: 700, color: '#fafafa', marginBottom: 2 },
  bodyAbbr: { fontSize: 13, fontWeight: 600, color: '#d4a843', marginBottom: 6 },
  bodyField: { fontSize: 13, color: '#a1a1aa', marginBottom: 8 },
  bodyTime: { display: 'block', fontSize: 12, color: '#52525b', marginBottom: 6 },
  bodyLink: { fontSize: 13, fontWeight: 600, color: '#d4a843', textDecoration: 'none' },

  // FAQ
  faqSection: { marginBottom: 28 },
  faqCat: { fontSize: 16, fontWeight: 700, color: '#d4a843', marginBottom: 12 },
  faqItem: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 6, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s' },
  faqQuestion: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' },
  faqQ: { fontSize: 14, fontWeight: 600, color: '#fafafa' },
  faqToggle: { fontSize: 18, color: '#d4a843', fontWeight: 300 },
  faqAnswer: { padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' },
  faqA: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.7, paddingTop: 12 },
  faqRef: { display: 'block', fontSize: 11, color: '#52525b', fontStyle: 'italic', marginTop: 8 },
};
