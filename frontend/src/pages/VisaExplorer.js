import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visaAPI } from '../services/api';

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
      } catch {}
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
          <input type="text" placeholder="Search visa categories..." value={search} onChange={(e) => setSearch(e.target.value)} style={s.searchInput} />
        </div>

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
  searchInput: { width: '100%', padding: '14px 18px', background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15, color: '#fafafa', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' },
  filters: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 },
  filterBtn: { padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#a1a1aa', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  filterActive: { background: 'rgba(212,168,67,0.12)', color: '#d4a843', borderColor: 'rgba(212,168,67,0.3)' },
  resultCount: { fontSize: 13, color: '#52525b', marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 },
  card: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '22px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 0.25s ease' },
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
