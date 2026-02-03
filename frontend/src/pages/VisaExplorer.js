import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visaAPI } from '../services/api';

const FALLBACK_GROUPS = [
  { id: 'temporary_residence', name: 'Temporary Residence' },
  { id: 'work_permit', name: 'Work Permits' },
  { id: 'family', name: 'Family & Relationships' },
  { id: 'permanent_residence', name: 'Permanent Residence' },
];

const FALLBACK_CATEGORIES = [
  { id: 'tourist_visa', name: 'Tourist Visa', description: 'For visitors entering South Africa for tourism, leisure, or short-term visits.', category: 'temporary_residence', maxDuration: '90 days', legalReference: 'Section 11(1)' },
  { id: 'business_visa', name: 'Business Visa', description: 'For attending meetings, conferences, or negotiating contracts in South Africa.', category: 'temporary_residence', maxDuration: '90 days', legalReference: 'Section 11(2)' },
  { id: 'study_visa', name: 'Study Visa', description: 'For full-time study at a registered South African educational institution.', category: 'temporary_residence', maxDuration: 'Duration of study', legalReference: 'Section 13' },
  { id: 'medical_treatment_visa', name: 'Medical Treatment Visa', description: 'For persons seeking medical treatment in South Africa.', category: 'temporary_residence', maxDuration: '6 months', legalReference: 'Section 18' },
  { id: 'retired_person_visa', name: 'Retired Person Visa', description: 'For retirees with a proven monthly income or savings.', category: 'temporary_residence', maxDuration: '4 years', legalReference: 'Section 20' },
  { id: 'exchange_visa', name: 'Exchange Visa', description: 'For cultural, economic, or social exchange programme participants.', category: 'temporary_residence', maxDuration: '12 months', legalReference: 'Section 14' },
  { id: 'general_work_visa', name: 'General Work Visa', description: 'For foreigners with a confirmed job offer from a South African employer.', category: 'work_permit', maxDuration: '5 years', legalReference: 'Section 19(2)' },
  { id: 'critical_skills_visa', name: 'Critical Skills Work Visa', description: 'For professionals with skills on the Critical Skills List published by the Minister.', category: 'work_permit', maxDuration: '5 years', legalReference: 'Section 19(4)' },
  { id: 'intra_company_transfer', name: 'Intra-Company Transfer Visa', description: 'For employees transferred to a South African branch of their existing employer.', category: 'work_permit', maxDuration: '4 years', legalReference: 'Section 19(3)' },
  { id: 'corporate_visa', name: 'Corporate Visa', description: 'For companies employing foreign workers in bulk under a single visa.', category: 'work_permit', maxDuration: '3 years', legalReference: 'Section 21' },
  { id: 'business_investment_visa', name: 'Business & Investment Visa', description: 'For entrepreneurs establishing or investing in a business in South Africa.', category: 'work_permit', maxDuration: '3 years', legalReference: 'Section 15' },
  { id: 'relatives_visa', name: "Relative's Visa", description: 'For family members of South African citizens or permanent residents.', category: 'family', maxDuration: '2 years', legalReference: 'Section 18(1)' },
  { id: 'spousal_visa', name: 'Spousal Visa', description: 'For spouses of South African citizens or permanent residents.', category: 'family', maxDuration: '2 years', legalReference: 'Section 18(2)' },
  { id: 'life_partner_visa', name: 'Life Partner Visa', description: 'For life partners in a permanent relationship with a South African citizen or PR holder.', category: 'family', maxDuration: '2 years', legalReference: 'Section 18(3)' },
  { id: 'direct_residence_s26a', name: 'Direct Residence (Section 26(a))', description: 'Permanent residence based on five years of work visa status.', category: 'permanent_residence', maxDuration: 'Permanent', legalReference: 'Section 26(a)' },
  { id: 'direct_residence_s26b', name: 'Direct Residence (Section 26(b))', description: 'Permanent residence for spouses of South African citizens after five years.', category: 'permanent_residence', maxDuration: 'Permanent', legalReference: 'Section 26(b)' },
  { id: 'extraordinary_skills_pr', name: 'Extraordinary Skills PR', description: 'For individuals with exceptional skills or qualifications.', category: 'permanent_residence', maxDuration: 'Permanent', legalReference: 'Section 27(b)' },
  { id: 'financially_independent_pr', name: 'Financially Independent PR', description: 'For applicants who can prove a net worth of R12 million or more.', category: 'permanent_residence', maxDuration: 'Permanent', legalReference: 'Section 27(g)' },
];

export default function VisaExplorer() {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, grpRes] = await Promise.all([visaAPI.getCategories(), visaAPI.getGroups()]);
        setCategories(catRes.data.categories || []);
        setGroups(grpRes.data.groups || []);
      } catch {
        setCategories(FALLBACK_CATEGORIES);
        setGroups(FALLBACK_GROUPS);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}><div className="spinner" /></div>;

  const groupColors = {
    temporary_residence: '#3b82f6',
    work_permit: '#22c55e',
    family: '#d4a843',
    permanent_residence: '#a855f7',
    refugee: '#ef4444',
  };

  const filtered = categories.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchGroup = activeGroup === 'all' || c.category === activeGroup;
    return matchSearch && matchGroup;
  });

  return (
    <div style={s.page}>
      <div className="container">
        <div style={s.header}>
          <h1 style={s.title}>Visa Categories</h1>
          <p style={s.subtitle}>Explore all South African visa and permit types. Each category includes full eligibility criteria, required documents, and application guidance.</p>
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <div style={s.searchBox}>
            <svg style={s.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search visa categories..." value={search} onChange={(e) => setSearch(e.target.value)} style={s.searchInput} />
          </div>
        </div>

        {/* Group Summary Cards */}
        {!search && activeGroup === 'all' && (
          <div style={s.groupGrid}>
            {groups.map(g => {
              const count = categories.filter(c => c.category === g.id).length;
              const color = groupColors[g.id] || '#52525b';
              return (
                <button key={g.id} onClick={() => setActiveGroup(g.id)} style={s.groupCard}>
                  <div style={{ ...s.groupDot, background: color }} />
                  <span style={s.groupName}>{g.name}</span>
                  <span style={{ ...s.groupCount, color }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={s.filters}>
          <button style={{ ...s.filterBtn, ...(activeGroup === 'all' ? s.filterActive : {}) }} onClick={() => setActiveGroup('all')}>
            All ({categories.length})
          </button>
          {groups.map(g => {
            const count = categories.filter(c => c.category === g.id).length;
            return (
              <button key={g.id} style={{ ...s.filterBtn, ...(activeGroup === g.id ? { ...s.filterActive, background: (groupColors[g.id] || '#52525b') + '20', color: groupColors[g.id] || '#fafafa', borderColor: (groupColors[g.id] || '#52525b') + '40' } : {}) }} onClick={() => setActiveGroup(g.id)}>
                {g.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Results */}
        <p style={s.resultCount}>{filtered.length} visa {filtered.length === 1 ? 'category' : 'categories'} found</p>

        <div style={s.grid}>
          {filtered.map(cat => (
            <Link key={cat.id} to={`/visas/${cat.id}`} style={s.card}>
              <div style={s.cardTop}>
                <div style={{ ...s.cardDot, background: groupColors[cat.category] || '#52525b' }} />
                <span style={{ ...s.cardBadge, background: (groupColors[cat.category] || '#52525b') + '18', color: groupColors[cat.category] || '#a1a1aa' }}>
                  {cat.maxDuration}
                </span>
              </div>
              <h3 style={s.cardTitle}>{cat.name}</h3>
              <p style={s.cardDesc}>{cat.description}</p>
              <div style={s.cardFooter}>
                <span style={s.cardLegal}>{cat.legalReference}</span>
                <span style={s.cardArrow}>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={s.empty}>
            <p style={s.emptyText}>No visa categories match your search.</p>
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setActiveGroup('all'); }}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { paddingTop: 88, paddingBottom: 48, minHeight: '100vh' },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#a1a1aa', lineHeight: 1.6, maxWidth: 600 },
  searchWrap: { marginBottom: 20 },
  searchBox: { position: 'relative' },
  searchIcon: { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  searchInput: { width: '100%', padding: '14px 18px 14px 44px', background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15, color: '#fafafa', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' },
  groupGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 16 },
  groupCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(16px) saturate(180%)', WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', textAlign: 'left' },
  groupDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  groupName: { fontSize: 13, fontWeight: 600, color: '#fafafa', flex: 1 },
  groupCount: { fontSize: 14, fontWeight: 800 },
  filters: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 },
  filterBtn: { padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  filterActive: { background: 'rgba(212,168,67,0.12)', color: '#d4a843', borderColor: 'rgba(212,168,67,0.3)' },
  resultCount: { fontSize: 13, color: '#52525b', marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 },
  card: { background: 'rgba(26,26,29,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 0.3s ease' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardDot: { width: 8, height: 8, borderRadius: '50%' },
  cardBadge: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: '#fafafa' },
  cardDesc: { fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, flex: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' },
  cardLegal: { fontSize: 11, color: '#52525b', fontStyle: 'italic' },
  cardArrow: { fontSize: 16, color: '#d4a843' },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyText: { fontSize: 15, color: '#52525b', marginBottom: 16 },
};
