import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [countryResult, setCountryResult] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [expandedSkillCat, setExpandedSkillCat] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [overview, categories, skills, times, fees, offices, bodies, faq, exempt] = await Promise.all([
        fetchJSON('/knowledge/overview'),
        fetchJSON('/knowledge/visa-categories'),
        fetchJSON('/knowledge/critical-skills'),
        fetchJSON('/knowledge/processing-times'),
        fetchJSON('/knowledge/fees'),
        fetchJSON('/knowledge/dha-offices'),
        fetchJSON('/knowledge/professional-bodies'),
        fetchJSON('/knowledge/faq'),
        fetchJSON('/knowledge/visa-exempt-countries'),
      ]);
      setData({ overview, categories, skills, times, fees, offices, bodies, faq, exempt });
    } catch (err) {
      console.error('Failed to load knowledge base', err);
    }
    setLoading(false);
  }

  async function fetchJSON(path) {
    const res = await fetch(`${API}${path}`);
    return res.json();
  }

  async function lookupCountry() {
    if (!countryInput.trim()) return;
    try {
      const res = await fetch(`${API}/knowledge/country/${encodeURIComponent(countryInput.trim())}`);
      setCountryResult(await res.json());
    } catch {
      setCountryResult({ error: 'Lookup failed' });
    }
  }

  if (loading) return <div style={s.loading}>Loading Knowledge Hub...</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'visas', label: 'All Visa Types' },
    { id: 'criticalskills', label: 'Critical Skills' },
    { id: 'country', label: 'Country Check' },
    { id: 'documents', label: 'Documents Guide' },
    { id: 'fees', label: 'Fees & Costs' },
    { id: 'processing', label: 'Processing Times' },
    { id: 'offices', label: 'Offices & Centres' },
    { id: 'profbodies', label: 'Professional Bodies' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Immigration Knowledge Hub</h1>
          <p style={s.subtitle}>
            Everything you need to know about South African immigration - all in one place.
            You never need to leave Senzwa for information.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={s.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={s.content}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'visas' && renderVisas()}
          {activeTab === 'criticalskills' && renderCriticalSkills()}
          {activeTab === 'country' && renderCountryCheck()}
          {activeTab === 'documents' && renderDocumentsGuide()}
          {activeTab === 'fees' && renderFees()}
          {activeTab === 'processing' && renderProcessingTimes()}
          {activeTab === 'offices' && renderOffices()}
          {activeTab === 'profbodies' && renderProfBodies()}
          {activeTab === 'faq' && renderFAQ()}
        </div>
      </div>
    </div>
  );

  // === OVERVIEW TAB ===
  function renderOverview() {
    const o = data.overview || {};
    return (
      <div>
        <div style={s.statsGrid}>
          {[
            { label: 'Visa Categories', value: o.visaCategories || 0, color: '#1a5632' },
            { label: 'Critical Skills', value: o.totalCriticalSkills || 0, color: '#002395' },
            { label: 'Exempt Countries', value: o.exemptCountries || 0, color: '#d4a843' },
            { label: 'DHA/VFS Offices', value: o.dhaOffices || 0, color: '#17a2b8' },
            { label: 'Professional Bodies', value: o.professionalBodies || 0, color: '#6f42c1' },
            { label: 'FAQ Answers', value: o.totalFAQs || 0, color: '#28a745' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={s.section}>
          <h2 style={s.sectionTitle}>What You'll Find Here</h2>
          <div style={s.featureGrid}>
            {[
              { title: 'All Visa Types', desc: 'Complete details for every DHA visa and permit category including eligibility, documents, fees, and legal references.', tab: 'visas' },
              { title: 'Critical Skills List', desc: 'Full list of occupations on the Critical Skills List with OFO codes, qualification requirements, and professional body details.', tab: 'criticalskills' },
              { title: 'Country-Specific Requirements', desc: 'Check your country\'s visa exemption status, yellow fever requirements, document legalization process, and more.', tab: 'country' },
              { title: 'Document Requirements', desc: 'Comprehensive guide to every document type - what it is, where to get it, how old it can be, and tips for preparation.', tab: 'documents' },
              { title: 'Fees & Costs', desc: 'Complete fee schedule including DHA fees, VFS charges, SAQA evaluation costs, and other expenses.', tab: 'fees' },
              { title: 'Processing Times', desc: 'Expected processing times for every visa category with tips for avoiding delays.', tab: 'processing' },
              { title: 'Offices & Centres', desc: 'Find VFS Global centres, DHA offices, and Refugee Reception Offices with addresses and operating hours.', tab: 'offices' },
              { title: 'Professional Bodies', desc: 'Complete list of South African professional registration bodies with websites and registration timelines.', tab: 'profbodies' },
              { title: 'FAQ', desc: 'Answers to the most common immigration questions - from documents to processes to legal requirements.', tab: 'faq' },
            ].map((feat, i) => (
              <div key={i} style={s.featureCard} onClick={() => setActiveTab(feat.tab)}>
                <h3 style={s.featureTitle}>{feat.title}</h3>
                <p style={s.featureDesc}>{feat.desc}</p>
                <span style={s.featureLink}>Explore &rarr;</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.legalBox}>
          <strong>Legal Basis:</strong> All information is grounded in the Immigration Act 13 of 2002 (as amended), Immigration Regulations 2014, DHA Policy Directives, and the Refugees Act 130 of 1998.
          <br /><br />
          <strong>Disclaimer:</strong> Senzwa provides guidance only. All final visa decisions are made by the Department of Home Affairs. Information is updated regularly but applicants should verify current requirements with DHA or VFS Global.
        </div>
      </div>
    );
  }

  // === ALL VISA TYPES TAB ===
  function renderVisas() {
    const cats = data.categories?.categories || [];
    const groups = data.categories?.groups || [];

    const filtered = search
      ? cats.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
        )
      : cats;

    const groupColors = {
      temporary_residence: '#17a2b8',
      work_permit: '#1a5632',
      family: '#d4a843',
      permanent_residence: '#002395',
      refugee: '#6c757d',
    };

    return (
      <div>
        <input
          type="text"
          placeholder="Search all visa categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />

        {groups.map((group) => {
          const groupCats = filtered.filter((c) => c.category === group.id);
          if (groupCats.length === 0) return null;

          return (
            <div key={group.id} style={s.section}>
              <h2 style={{ ...s.sectionTitle, color: groupColors[group.id] || '#212529' }}>
                {group.name} ({groupCats.length})
              </h2>
              <p style={s.sectionDesc}>{group.description}</p>

              {groupCats.map((cat) => (
                <div key={cat.id} style={s.visaCard}>
                  <div style={s.visaCardHeader}>
                    <h3 style={s.visaCardTitle}>{cat.name}</h3>
                    <span style={{
                      ...s.badge,
                      background: (groupColors[cat.category] || '#6c757d') + '18',
                      color: groupColors[cat.category] || '#6c757d',
                    }}>
                      {cat.maxDuration}
                    </span>
                  </div>
                  <p style={s.visaCardDesc}>{cat.description}</p>
                  <div style={s.visaCardLegal}>{cat.legalReference}</div>

                  <div style={s.visaSection}>
                    <h4 style={s.visaSectionTitle}>Eligibility Requirements</h4>
                    <ul style={s.list}>
                      {cat.eligibility.requirements.map((req, i) => (
                        <li key={i} style={s.listItem}><span style={s.checkIcon}>&#10003;</span> {req}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={s.visaSection}>
                    <h4 style={{ ...s.visaSectionTitle, color: '#c4342d' }}>Disqualifying Factors</h4>
                    <ul style={s.list}>
                      {cat.eligibility.disqualifiers.map((d, i) => (
                        <li key={i} style={s.listItem}><span style={s.xIcon}>&#10007;</span> {d}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={s.visaSection}>
                    <h4 style={s.visaSectionTitle}>Required Documents</h4>
                    <div style={s.docGrid}>
                      {cat.requiredDocuments.map((doc, i) => (
                        <div key={i} style={{
                          ...s.docItem,
                          borderLeft: doc.required ? '3px solid #1a5632' : '3px solid #ced4da',
                        }}>
                          <div style={s.docName}>
                            {doc.name}
                            {doc.required && <span style={s.requiredBadge}>REQUIRED</span>}
                            {!doc.required && <span style={s.optionalBadge}>OPTIONAL</span>}
                          </div>
                          <div style={s.docDesc}>{doc.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={s.visaSection}>
                    <h4 style={{ ...s.visaSectionTitle, color: '#856404' }}>Common Rejection Reasons</h4>
                    <ul style={s.list}>
                      {cat.commonRejectionReasons.map((r, i) => (
                        <li key={i} style={s.listItem}><span style={s.warnIcon}>&#9888;</span> {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={s.visaCardFooter}>
                    <span style={s.feeInfo}>Application Fee: {cat.fees?.application || 'See fee schedule'}</span>
                    <Link to={`/eligibility`} style={s.ctaLink}>Check Your Eligibility &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // === CRITICAL SKILLS TAB ===
  function renderCriticalSkills() {
    const skillData = data.skills || { categories: [] };
    const filtered = search
      ? {
          ...skillData,
          categories: skillData.categories
            .map((cat) => ({
              ...cat,
              skills: cat.skills.filter(
                (sk) =>
                  sk.title.toLowerCase().includes(search.toLowerCase()) ||
                  sk.ofoCode.includes(search) ||
                  sk.qualificationRequired.toLowerCase().includes(search.toLowerCase())
              ),
            }))
            .filter((cat) => cat.skills.length > 0),
        }
      : skillData;

    return (
      <div>
        <div style={s.infoBox}>
          <strong>What is the Critical Skills List?</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            The Critical Skills List identifies occupations in critical demand in South Africa. Foreign nationals with
            skills on this list may apply for a Critical Skills Work Visa under Section 19(4) of the Immigration Act.
            Unlike the General Work Visa, a job offer is NOT required at the time of application, but you must find
            employment within 12 months of the visa being issued.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by job title, OFO code, or qualification..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />

        <p style={s.resultCount}>
          Showing {filtered.categories?.reduce((sum, c) => sum + c.skills.length, 0) || 0} skills across {filtered.categories?.length || 0} categories
        </p>

        {filtered.categories?.map((cat, ci) => (
          <div key={ci} style={s.section}>
            <button
              style={s.skillCatHeader}
              onClick={() => setExpandedSkillCat(expandedSkillCat === ci ? null : ci)}
            >
              <h3 style={s.skillCatTitle}>{cat.category} ({cat.skills.length} skills)</h3>
              <span style={s.expandIcon}>{expandedSkillCat === ci ? '\u25B2' : '\u25BC'}</span>
            </button>

            {(expandedSkillCat === ci || search) && (
              <div style={s.skillTable}>
                <div style={s.skillTableHeader}>
                  <span style={{ flex: 1 }}>OFO Code</span>
                  <span style={{ flex: 2 }}>Job Title</span>
                  <span style={{ flex: 3 }}>Qualification Required</span>
                  <span style={{ flex: 2 }}>Professional Body</span>
                  <span style={{ flex: 1 }}>Min. Experience</span>
                </div>
                {cat.skills.map((sk, si) => (
                  <div key={si} style={s.skillTableRow}>
                    <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8125rem' }}>{sk.ofoCode}</span>
                    <span style={{ flex: 2, fontWeight: 600 }}>{sk.title}</span>
                    <span style={{ flex: 3, fontSize: '0.8125rem' }}>{sk.qualificationRequired}</span>
                    <span style={{ flex: 2, fontSize: '0.8125rem', color: '#1a5632' }}>{sk.professionalBody}</span>
                    <span style={{ flex: 1, fontSize: '0.8125rem' }}>{sk.minExperience}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // === COUNTRY CHECK TAB ===
  function renderCountryCheck() {
    return (
      <div>
        <div style={s.infoBox}>
          <strong>Country-Specific Requirements</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            Enter your country of origin or nationality to see visa exemption status, yellow fever requirements,
            document legalization requirements, and country-specific notes.
          </p>
        </div>

        <div style={s.searchRow}>
          <input
            type="text"
            placeholder="Enter your country (e.g. Nigeria, India, United Kingdom)..."
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookupCountry()}
            style={{ ...s.searchInput, flex: 1, marginBottom: 0 }}
          />
          <button onClick={lookupCountry} className="btn btn-primary" style={{ height: 48 }}>Check Country</button>
        </div>

        {countryResult && !countryResult.error && (
          <div style={s.countryResults}>
            <h3 style={s.countryName}>{countryResult.country}</h3>

            <div style={s.countryGrid}>
              <div style={{
                ...s.countryCard,
                borderLeft: `4px solid ${countryResult.visaExemption.exempt ? '#28a745' : '#dc3545'}`,
              }}>
                <h4 style={s.countryCardTitle}>Visa Exemption Status</h4>
                <div style={{
                  ...s.statusBadge,
                  background: countryResult.visaExemption.exempt ? '#d4edda' : '#f8d7da',
                  color: countryResult.visaExemption.exempt ? '#155724' : '#721c24',
                }}>
                  {countryResult.visaExemption.exempt
                    ? `VISA EXEMPT - ${countryResult.visaExemption.duration}`
                    : 'VISA REQUIRED'}
                </div>
                <p style={s.countryCardText}>
                  {countryResult.visaExemption.exempt
                    ? `Citizens can visit South Africa for up to ${countryResult.visaExemption.duration} without a visa for tourism or short business visits.`
                    : 'Citizens must obtain a visa before traveling to South Africa for any purpose.'}
                </p>
              </div>

              <div style={{
                ...s.countryCard,
                borderLeft: `4px solid ${countryResult.yellowFever.required ? '#ffc107' : '#28a745'}`,
              }}>
                <h4 style={s.countryCardTitle}>Yellow Fever Certificate</h4>
                <div style={{
                  ...s.statusBadge,
                  background: countryResult.yellowFever.required ? '#fff3cd' : '#d4edda',
                  color: countryResult.yellowFever.required ? '#856404' : '#155724',
                }}>
                  {countryResult.yellowFever.required ? 'REQUIRED' : 'NOT REQUIRED'}
                </div>
                <p style={s.countryCardText}>{countryResult.yellowFever.details}</p>
              </div>

              <div style={{
                ...s.countryCard,
                borderLeft: '4px solid #17a2b8',
              }}>
                <h4 style={s.countryCardTitle}>Document Legalization</h4>
                <div style={{
                  ...s.statusBadge,
                  background: '#d1ecf1',
                  color: '#0c5460',
                }}>
                  {countryResult.documentLegalization.apostilleCountry ? 'APOSTILLE ACCEPTED' : 'EMBASSY LEGALIZATION REQUIRED'}
                </div>
                <p style={s.countryCardText}>{countryResult.documentLegalization.process}</p>
              </div>

              {countryResult.sadc.isMember && (
                <div style={{ ...s.countryCard, borderLeft: '4px solid #6f42c1' }}>
                  <h4 style={s.countryCardTitle}>SADC Member State</h4>
                  <p style={s.countryCardText}>
                    This country is a member of the Southern African Development Community (SADC).
                    Special bilateral movement protocols may apply.
                  </p>
                </div>
              )}

              {countryResult.countryNotes && (
                <div style={{ ...s.countryCard, borderLeft: '4px solid #d4a843', gridColumn: '1 / -1' }}>
                  <h4 style={s.countryCardTitle}>Country-Specific Notes</h4>
                  {countryResult.countryNotes.notes && (
                    <p style={s.countryCardText}>{countryResult.countryNotes.notes}</p>
                  )}
                  {countryResult.countryNotes.specialDispensation && (
                    <p style={{ ...s.countryCardText, fontWeight: 600, color: '#1a5632' }}>
                      Special Dispensation: {countryResult.countryNotes.specialDispensation}
                    </p>
                  )}
                  {countryResult.countryNotes.additionalRequirements && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong style={{ fontSize: '0.8125rem' }}>Additional Requirements:</strong>
                      <ul style={{ ...s.list, marginTop: '0.25rem' }}>
                        {countryResult.countryNotes.additionalRequirements.map((r, i) => (
                          <li key={i} style={s.listItem}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {countryResult.countryNotes.commonVisaTypes && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong style={{ fontSize: '0.8125rem' }}>Commonly Applied Visa Types:</strong>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {countryResult.countryNotes.commonVisaTypes.map((v, i) => (
                          <span key={i} style={s.visaTag}>{v.replace(/_/g, ' ')}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visa Exempt Countries List */}
        {data.exempt && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Visa-Exempt Countries</h3>
            <div style={s.exemptSection}>
              <h4 style={s.exemptTitle}>90-Day Exemption ({data.exempt.exempt90Days?.length || 0} countries)</h4>
              <div style={s.countryTags}>
                {data.exempt.exempt90Days?.map((c, i) => (
                  <span key={i} style={s.countryTag}>{c}</span>
                ))}
              </div>
            </div>
            <div style={s.exemptSection}>
              <h4 style={s.exemptTitle}>30-Day Exemption ({data.exempt.exempt30Days?.length || 0} countries)</h4>
              <div style={s.countryTags}>
                {data.exempt.exempt30Days?.map((c, i) => (
                  <span key={i} style={s.countryTag}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // === DOCUMENTS GUIDE TAB ===
  function renderDocumentsGuide() {
    const docGuide = [
      {
        type: 'Passport',
        description: 'Your primary identity and travel document',
        requirements: ['Must be valid for at least 30 days beyond your intended stay', 'Must have at least 2 blank pages for stamps', 'Must be machine-readable (old handwritten passports may not be accepted)', 'Certified copy required for submission'],
        tips: ['Apply for renewal at least 6 months before expiry', 'Keep a certified copy separate from your passport', 'Some visa types require validity for the full duration of the visa'],
        where: 'Your country\'s passport office or embassy',
        validity: 'Varies by country (typically 5-10 years)',
      },
      {
        type: 'Police Clearance Certificate',
        description: 'Criminal record check from law enforcement authorities',
        requirements: ['Must not be older than 6 months at time of application', 'Required from country of origin', 'Required from ANY country where you lived for 12+ months since age 18', 'Original certificate required (not certified copy)'],
        tips: ['Start early - some countries take 4-8 weeks to issue', 'FBI clearance accepted for US citizens', 'SA police clearance (SAPS) costs ZAR 91 and takes 2-4 weeks', 'Some countries offer expedited processing for a fee'],
        where: 'National police authority in your country or country of residence',
        validity: '6 months from date of issue',
      },
      {
        type: 'Medical Report',
        description: 'Health examination confirming you are not a public health risk',
        requirements: ['Must be completed by a registered medical practitioner', 'Must not be older than 6 months at time of application', 'Must be on the prescribed DHA form (BI-811)', 'Must confirm TB screening, general health assessment'],
        tips: ['Use the official DHA medical report form', 'Get this done AFTER all other documents are ready (to avoid expiry)', 'Keep a copy for your records'],
        where: 'Any registered medical practitioner (GP) in your country',
        validity: '6 months from date of examination',
      },
      {
        type: 'Radiological Report (Chest X-Ray)',
        description: 'Chest X-ray to screen for tuberculosis',
        requirements: ['Must not be older than 6 months at time of application', 'Must be on prescribed DHA form', 'Must be performed by a registered radiologist', 'Required for most temporary residence and all permanent residence applications'],
        tips: ['Can often be done at the same facility as your medical exam', 'Pregnant women may request exemption with medical motivation', 'Results should be interpreted by a radiologist, not just an X-ray technician'],
        where: 'Radiology department of a hospital or medical imaging centre',
        validity: '6 months from date of examination',
      },
      {
        type: 'SAQA Evaluation',
        description: 'Evaluation of your foreign qualification against the South African NQF',
        requirements: ['Required for all work visas, critical skills visas, and permanent residence', 'Submit original qualification or certified copy to SAQA', 'Qualification must be from a recognized institution', 'Process takes 4-8 weeks', 'Fee: approximately ZAR 1,080'],
        tips: ['Apply online at www.saqa.org.za', 'Include English translations of qualifications', 'SAQA does NOT determine professional registration - that\'s separate', 'Some qualifications may not have direct NQF equivalents'],
        where: 'South African Qualifications Authority (SAQA) - online application',
        validity: 'Does not expire once issued',
      },
      {
        type: 'Proof of Financial Means',
        description: 'Evidence that you can financially sustain yourself during your stay',
        requirements: ['Bank statements typically for the last 3-6 months', 'Must show sufficient balance for intended stay duration', 'Statements must be from a recognized financial institution', 'For work visas: employment contract showing salary is sufficient'],
        tips: ['Ensure your name and account details are clearly visible', 'Get the bank to stamp/certify the statements', 'For visitor visas: show funds covering accommodation + daily expenses + return travel', 'Scholarship letters or sponsor undertakings are alternative proof for students'],
        where: 'Your bank or financial institution',
        validity: 'Statements should be recent (within 3 months)',
      },
      {
        type: 'Passport-Size Photographs',
        description: 'Recent photographs for your application',
        requirements: ['Two recent passport-size photographs (some categories require four)', 'White background', 'Face clearly visible, no glasses, no head coverings (unless religious)', 'Must match your current appearance'],
        tips: ['Get extra copies made - you may need them later', 'Follow the exact specifications from VFS/DHA', 'Digital copies may also be required for online portions'],
        where: 'Any photo studio or pharmacy with photo services',
        validity: 'Must reflect current appearance (taken within 6 months)',
      },
      {
        type: 'Marriage Certificate',
        description: 'Proof of legal marriage for spousal visa applications',
        requirements: ['Unabridged marriage certificate if married in South Africa', 'Foreign marriage certificate with apostille or embassy legalization', 'Must be recognized under South African law', 'English translation required if in another language'],
        tips: ['SA marriages: order unabridged certificate from DHA (not the short-form card)', 'Foreign marriages: check if your marriage type is recognized in SA', 'Same-sex marriages legally recognized in South Africa since 2006', 'Polygamous marriages may have additional requirements'],
        where: 'DHA (SA marriages) or relevant civil authority in country of marriage',
        validity: 'Does not expire, but marriage must be current/valid',
      },
    ];

    return (
      <div>
        <div style={s.infoBox}>
          <strong>Document Preparation Guide</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            This guide covers every document type commonly required for South African visa applications.
            Each entry explains what the document is, where to get it, validity periods, and practical tips.
          </p>
        </div>

        {docGuide.map((doc, i) => (
          <div key={i} style={s.docGuideCard}>
            <h3 style={s.docGuideTitle}>{doc.type}</h3>
            <p style={s.docGuideDesc}>{doc.description}</p>

            <div style={s.docGuideRow}>
              <div style={s.docGuideCol}>
                <h4 style={s.docGuideSub}>Requirements</h4>
                <ul style={s.list}>
                  {doc.requirements.map((r, j) => (
                    <li key={j} style={s.listItem}>{r}</li>
                  ))}
                </ul>
              </div>
              <div style={s.docGuideCol}>
                <h4 style={s.docGuideSub}>Tips</h4>
                <ul style={s.list}>
                  {doc.tips.map((t, j) => (
                    <li key={j} style={{ ...s.listItem, color: '#1a5632' }}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={s.docGuideMeta}>
              <span><strong>Where to get it:</strong> {doc.where}</span>
              <span><strong>Validity:</strong> {doc.validity}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // === FEES TAB ===
  function renderFees() {
    const feeData = data.fees || {};
    return (
      <div>
        <div style={s.infoBox}>
          <strong>Complete Fee Schedule</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            All fees in South African Rand (ZAR). Fees are subject to change. Always confirm current fees with DHA or VFS Global before submitting your application.
          </p>
        </div>

        <div style={s.feeTable}>
          <div style={s.feeTableHeader}>
            <span style={{ flex: 2 }}>Fee Type</span>
            <span style={{ flex: 1, textAlign: 'right' }}>Amount (ZAR)</span>
            <span style={{ flex: 3 }}>Notes</span>
          </div>
          {Object.entries(feeData.dhaFees || {}).map(([key, fee]) => (
            <div key={key} style={s.feeTableRow}>
              <span style={{ flex: 2, fontWeight: 600, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
              <span style={{ flex: 1, textAlign: 'right', fontWeight: 700, color: '#1a5632' }}>
                {fee.amount === 0 ? 'FREE' : `R ${fee.amount.toLocaleString()}`}
              </span>
              <span style={{ flex: 3, fontSize: '0.8125rem', color: '#6c757d' }}>{fee.notes}</span>
            </div>
          ))}
        </div>

        {feeData.notes && (
          <div style={{ ...s.infoBox, marginTop: '1rem' }}>
            <strong>Important Notes:</strong>
            <ul style={s.list}>
              {feeData.notes.map((n, i) => (
                <li key={i} style={s.listItem}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // === PROCESSING TIMES TAB ===
  function renderProcessingTimes() {
    const times = data.times?.processingTimes || [];
    const groupColors = {
      temporary_residence: '#17a2b8',
      work_permit: '#1a5632',
      family: '#d4a843',
      permanent_residence: '#002395',
      refugee: '#6c757d',
    };

    return (
      <div>
        <div style={s.infoBox}>
          <strong>Expected Processing Times</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            Processing times are estimates based on typical DHA and VFS processing. Actual times may vary based on
            application completeness, current processing volumes, and other factors. These are working days/weeks unless stated otherwise.
          </p>
        </div>

        <div style={s.timeTable}>
          <div style={s.timeTableHeader}>
            <span style={{ flex: 2 }}>Visa Category</span>
            <span style={{ flex: 1 }}>Standard Processing</span>
            <span style={{ flex: 1 }}>Expedited</span>
            <span style={{ flex: 2 }}>Notes</span>
          </div>
          {times.map((t, i) => (
            <div key={i} style={{
              ...s.timeTableRow,
              borderLeft: `3px solid ${groupColors[t.visaCategoryGroup] || '#6c757d'}`,
            }}>
              <span style={{ flex: 2, fontWeight: 600 }}>{t.visaCategoryName}</span>
              <span style={{ flex: 1, color: '#1a5632', fontWeight: 600 }}>{t.standard}</span>
              <span style={{ flex: 1, color: t.expedited === 'Not available' ? '#6c757d' : '#d4a843' }}>
                {t.expedited}
              </span>
              <span style={{ flex: 2, fontSize: '0.8125rem', color: '#6c757d' }}>{t.notes}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // === OFFICES TAB ===
  function renderOffices() {
    const offices = data.offices?.offices || [];
    const typeColors = {
      vfs_centre: '#1a5632',
      dha_office: '#002395',
      refugee_office: '#d4a843',
    };
    const typeLabels = {
      vfs_centre: 'VFS Global Centre',
      dha_office: 'DHA Office',
      refugee_office: 'Refugee Reception Office',
    };

    return (
      <div>
        <div style={s.infoBox}>
          <strong>Where to Submit Your Application</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            Visa applications within South Africa are submitted at VFS Global centres. Applications from outside SA
            are submitted at the SA Embassy/Consulate or VFS centre in your country. Asylum/refugee applications
            are made at Refugee Reception Offices.
          </p>
        </div>

        {['vfs_centre', 'dha_office', 'refugee_office'].map((type) => {
          const typeOffices = offices.filter((o) => o.type === type);
          if (typeOffices.length === 0) return null;

          return (
            <div key={type} style={s.section}>
              <h3 style={{ ...s.sectionTitle, color: typeColors[type] }}>
                {typeLabels[type]} ({typeOffices.length})
              </h3>
              <div style={s.officeGrid}>
                {typeOffices.map((office, i) => (
                  <div key={i} style={{ ...s.officeCard, borderTop: `3px solid ${typeColors[type]}` }}>
                    <h4 style={s.officeName}>{office.name}</h4>
                    <div style={s.officeDetail}><strong>Address:</strong> {office.address}</div>
                    <div style={s.officeDetail}><strong>Province:</strong> {office.province}</div>
                    <div style={s.officeDetail}><strong>Hours:</strong> {office.operatingHours}</div>
                    <div style={s.officeDetail}>
                      <strong>Services:</strong>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {office.services.map((sv, j) => (
                          <span key={j} style={s.serviceTag}>{sv}</span>
                        ))}
                      </div>
                    </div>
                    {office.notes && <div style={s.officeNote}>{office.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // === PROFESSIONAL BODIES TAB ===
  function renderProfBodies() {
    const bodies = data.bodies?.bodies || [];
    return (
      <div>
        <div style={s.infoBox}>
          <strong>Professional Registration Bodies</strong>
          <p style={{ margin: '0.5rem 0 0' }}>
            Many visa categories (especially work visas and critical skills) require registration with a South African
            professional body. This confirms your foreign qualifications and professional standing are recognized in SA.
            Registration should be done BEFORE or during your visa application.
          </p>
        </div>

        <div style={s.bodyGrid}>
          {bodies.map((body, i) => (
            <div key={i} style={s.bodyCard}>
              <div style={s.bodyCode}>{body.code}</div>
              <h4 style={s.bodyName}>{body.name}</h4>
              <div style={s.bodyDetail}><strong>Registration Time:</strong> {body.registrationTime}</div>
              <div style={s.bodyDetail}>
                <strong>Fields:</strong>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {body.fields.map((f, j) => (
                    <span key={j} style={s.fieldTag}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // === FAQ TAB ===
  function renderFAQ() {
    const faqData = data.faq || { categories: [] };
    const filtered = search
      ? {
          ...faqData,
          categories: faqData.categories
            .map((cat) => ({
              ...cat,
              questions: cat.questions.filter(
                (q) =>
                  q.q.toLowerCase().includes(search.toLowerCase()) ||
                  q.a.toLowerCase().includes(search.toLowerCase())
              ),
            }))
            .filter((cat) => cat.questions.length > 0),
        }
      : faqData;

    return (
      <div>
        <input
          type="text"
          placeholder="Search frequently asked questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />

        {filtered.categories?.map((cat, ci) => (
          <div key={ci} style={s.section}>
            <h3 style={s.sectionTitle}>{cat.category}</h3>
            {cat.questions.map((faq, qi) => {
              const faqId = `${ci}-${qi}`;
              return (
                <div key={qi} style={s.faqItem}>
                  <button
                    style={s.faqQuestion}
                    onClick={() => setExpandedFAQ(expandedFAQ === faqId ? null : faqId)}
                  >
                    <span>{faq.q}</span>
                    <span style={s.expandIcon}>{expandedFAQ === faqId ? '\u25B2' : '\u25BC'}</span>
                  </button>
                  {expandedFAQ === faqId && (
                    <div style={s.faqAnswer}>
                      <p style={{ margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
                      {faq.legalRef && (
                        <div style={s.faqLegalRef}>
                          Legal Reference: {faq.legalRef}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

// === STYLES ===
const s = {
  page: { padding: '2rem 0', minHeight: 'calc(100vh - 64px)' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' },
  loading: { textAlign: 'center', padding: '4rem', color: '#6c757d' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#1a5632' },
  subtitle: { color: '#6c757d', fontSize: '0.9375rem', marginTop: '0.5rem', maxWidth: 700, margin: '0.5rem auto 0' },

  // Tab bar
  tabBar: {
    display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '2rem',
    background: '#f8f9fa', padding: '0.5rem', borderRadius: 12,
  },
  tab: {
    padding: '0.5rem 0.875rem', border: 'none', borderRadius: 8,
    background: 'transparent', fontSize: '0.8125rem', fontWeight: 500,
    color: '#495057', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
  },
  tabActive: { background: '#1a5632', color: '#fff', fontWeight: 600 },

  content: {},

  // Stats
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem', marginBottom: '2rem',
  },
  statCard: {
    background: '#fff', borderRadius: 12, padding: '1.5rem', textAlign: 'center',
    border: '1px solid #e9ecef',
  },
  statValue: { fontSize: '2rem', fontWeight: 800 },
  statLabel: { fontSize: '0.8125rem', color: '#6c757d', marginTop: '0.25rem' },

  // Sections
  section: { marginBottom: '2rem' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#212529' },
  sectionDesc: { fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' },

  // Search
  searchInput: {
    width: '100%', padding: '0.75rem 1rem', border: '1px solid #dee2e6',
    borderRadius: 10, fontSize: '0.9375rem', marginBottom: '1.5rem', fontFamily: 'inherit',
  },
  searchRow: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'stretch' },
  resultCount: { fontSize: '0.8125rem', color: '#6c757d', marginBottom: '1rem' },

  // Feature grid
  featureGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem',
  },
  featureCard: {
    background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e9ecef',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  featureTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' },
  featureDesc: { fontSize: '0.8125rem', color: '#6c757d', lineHeight: 1.6, marginBottom: '0.75rem' },
  featureLink: { fontSize: '0.8125rem', fontWeight: 600, color: '#1a5632' },

  // Info/Legal boxes
  infoBox: {
    background: '#e8f5e9', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem',
    fontSize: '0.875rem', lineHeight: 1.6, border: '1px solid #c8e6c9',
  },
  legalBox: {
    background: '#f8f9fa', borderRadius: 10, padding: '1.25rem', marginTop: '2rem',
    fontSize: '0.8125rem', color: '#6c757d', lineHeight: 1.6, border: '1px solid #e9ecef',
  },

  // Visa cards
  visaCard: {
    background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e9ecef',
    marginBottom: '1.5rem',
  },
  visaCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' },
  visaCardTitle: { fontSize: '1.125rem', fontWeight: 700 },
  visaCardDesc: { fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem', lineHeight: 1.6 },
  visaCardLegal: { fontSize: '0.75rem', color: '#adb5bd', fontStyle: 'italic', marginBottom: '1rem' },
  visaSection: { marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f3f5' },
  visaSectionTitle: { fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' },
  visaCardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e9ecef',
  },
  feeInfo: { fontSize: '0.8125rem', fontWeight: 600, color: '#495057' },
  ctaLink: { fontSize: '0.8125rem', fontWeight: 600, color: '#1a5632', textDecoration: 'none' },
  badge: {
    display: 'inline-block', padding: '0.25rem 0.625rem', borderRadius: 999,
    fontSize: '0.6875rem', fontWeight: 600,
  },

  // Lists
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '0.25rem 0', fontSize: '0.8125rem', lineHeight: 1.6, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' },
  checkIcon: { color: '#28a745', fontWeight: 700, flexShrink: 0 },
  xIcon: { color: '#dc3545', fontWeight: 700, flexShrink: 0 },
  warnIcon: { color: '#ffc107', flexShrink: 0 },

  // Document items
  docGrid: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  docItem: { padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: 6 },
  docName: { fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  docDesc: { fontSize: '0.75rem', color: '#6c757d', marginTop: '0.125rem' },
  requiredBadge: {
    fontSize: '0.5625rem', fontWeight: 700, color: '#155724', background: '#d4edda',
    padding: '0.125rem 0.375rem', borderRadius: 999, textTransform: 'uppercase',
  },
  optionalBadge: {
    fontSize: '0.5625rem', fontWeight: 700, color: '#856404', background: '#fff3cd',
    padding: '0.125rem 0.375rem', borderRadius: 999, textTransform: 'uppercase',
  },

  // Skills table
  skillCatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
    background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 8, padding: '1rem',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  skillCatTitle: { fontSize: '1rem', fontWeight: 700, margin: 0 },
  expandIcon: { fontSize: '0.75rem', color: '#6c757d' },
  skillTable: { marginTop: '0.5rem' },
  skillTableHeader: {
    display: 'flex', gap: '1rem', padding: '0.75rem 1rem', background: '#1a5632',
    color: '#fff', borderRadius: '8px 8px 0 0', fontSize: '0.75rem', fontWeight: 600,
  },
  skillTableRow: {
    display: 'flex', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f3f5',
    fontSize: '0.8125rem', alignItems: 'center',
  },

  // Country check
  countryResults: { marginTop: '1.5rem' },
  countryName: { fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' },
  countryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' },
  countryCard: { background: '#fff', borderRadius: 10, padding: '1.25rem', border: '1px solid #e9ecef' },
  countryCardTitle: { fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' },
  countryCardText: { fontSize: '0.8125rem', color: '#495057', lineHeight: 1.6 },
  statusBadge: {
    display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: 999,
    fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem',
  },
  visaTag: {
    padding: '0.125rem 0.5rem', background: '#e8f5e9', color: '#1a5632',
    borderRadius: 999, fontSize: '0.6875rem', fontWeight: 500, textTransform: 'capitalize',
  },
  exemptSection: { marginBottom: '1.5rem' },
  exemptTitle: { fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' },
  countryTags: { display: 'flex', gap: '0.375rem', flexWrap: 'wrap' },
  countryTag: {
    padding: '0.25rem 0.625rem', background: '#f1f3f5', borderRadius: 999,
    fontSize: '0.75rem', color: '#495057',
  },

  // Fees table
  feeTable: { background: '#fff', borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' },
  feeTableHeader: {
    display: 'flex', gap: '1rem', padding: '0.75rem 1rem', background: '#1a5632',
    color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
  },
  feeTableRow: {
    display: 'flex', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f3f5',
    fontSize: '0.875rem', alignItems: 'center',
  },

  // Time table
  timeTable: { background: '#fff', borderRadius: 12, border: '1px solid #e9ecef', overflow: 'hidden' },
  timeTableHeader: {
    display: 'flex', gap: '1rem', padding: '0.75rem 1rem', background: '#1a5632',
    color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
  },
  timeTableRow: {
    display: 'flex', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f3f5',
    fontSize: '0.875rem', alignItems: 'center',
  },

  // Office grid
  officeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  officeCard: { background: '#fff', borderRadius: 10, padding: '1.25rem', border: '1px solid #e9ecef' },
  officeName: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' },
  officeDetail: { fontSize: '0.8125rem', color: '#495057', marginBottom: '0.375rem' },
  officeNote: { fontSize: '0.75rem', color: '#6c757d', fontStyle: 'italic', marginTop: '0.5rem' },
  serviceTag: {
    padding: '0.125rem 0.5rem', background: '#e8f5e9', color: '#1a5632',
    borderRadius: 999, fontSize: '0.625rem', fontWeight: 500,
  },

  // Professional bodies
  bodyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  bodyCard: { background: '#fff', borderRadius: 10, padding: '1.25rem', border: '1px solid #e9ecef' },
  bodyCode: {
    display: 'inline-block', padding: '0.125rem 0.5rem', background: '#1a5632', color: '#fff',
    borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, marginBottom: '0.5rem',
  },
  bodyName: { fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem' },
  bodyDetail: { fontSize: '0.8125rem', color: '#495057', marginBottom: '0.375rem' },
  fieldTag: {
    padding: '0.125rem 0.5rem', background: '#f1f3f5', color: '#495057',
    borderRadius: 999, fontSize: '0.625rem',
  },

  // FAQ
  faqItem: { marginBottom: '0.5rem' },
  faqQuestion: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
    padding: '1rem', background: '#fff', border: '1px solid #e9ecef', borderRadius: 8,
    fontSize: '0.9375rem', fontWeight: 600, color: '#212529', cursor: 'pointer',
    textAlign: 'left', fontFamily: 'inherit',
  },
  faqAnswer: {
    padding: '1rem', background: '#f8f9fa', borderRadius: '0 0 8px 8px',
    border: '1px solid #e9ecef', borderTop: 'none', fontSize: '0.875rem', color: '#495057',
  },
  faqLegalRef: {
    marginTop: '0.75rem', fontSize: '0.75rem', color: '#adb5bd', fontStyle: 'italic',
  },

  // Document guide
  docGuideCard: {
    background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e9ecef',
    marginBottom: '1rem',
  },
  docGuideTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' },
  docGuideDesc: { fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' },
  docGuideRow: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  docGuideCol: { flex: 1, minWidth: 250 },
  docGuideSub: { fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem' },
  docGuideMeta: {
    display: 'flex', gap: '2rem', marginTop: '1rem', paddingTop: '0.75rem',
    borderTop: '1px solid #f1f3f5', fontSize: '0.8125rem', color: '#495057', flexWrap: 'wrap',
  },
};
