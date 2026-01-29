import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visaAPI } from '../services/api';

export default function VisaExplorer() {
  const [data, setData] = useState({ groups: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await visaAPI.getCategories();
        setData(res.data);
      } catch { /* fallback to empty */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading visa categories...</div>;
  }

  const filtered = data.categories.filter((cat) => {
    const matchGroup = filter === 'all' || cat.category === filter;
    const matchSearch = !search || cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  const groupColors = {
    temporary_residence: '#17a2b8',
    work_permit: '#1a5632',
    family: '#d4a843',
    permanent_residence: '#002395',
    refugee: '#6c757d',
  };

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>South African Visa Categories</h1>
          <p style={styles.subtitle}>
            Complete coverage of all Department of Home Affairs immigration categories.
            Based on the Immigration Act 13 of 2002 (as amended).
          </p>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search visa categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.filterTabs}>
            <button
              style={{ ...styles.filterTab, ...(filter === 'all' ? styles.filterTabActive : {}) }}
              onClick={() => setFilter('all')}
            >All ({data.categories.length})</button>
            {data.groups.map((g) => (
              <button
                key={g.id}
                style={{ ...styles.filterTab, ...(filter === g.id ? styles.filterTabActive : {}) }}
                onClick={() => setFilter(g.id)}
              >{g.name} ({g.categories.length})</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {filtered.map((cat) => (
            <Link key={cat.id} to={`/visas/${cat.id}`} style={styles.card}>
              <div style={styles.cardBadge}>
                <span style={{
                  ...styles.badge,
                  background: (groupColors[cat.category] || '#6c757d') + '15',
                  color: groupColors[cat.category] || '#6c757d',
                }}>
                  {cat.category.replace(/_/g, ' ')}
                </span>
              </div>
              <h3 style={styles.cardTitle}>{cat.name}</h3>
              <p style={styles.cardDesc}>{cat.description}</p>
              <div style={styles.cardMeta}>
                <span style={styles.metaItem}>Duration: {cat.maxDuration}</span>
                <span style={styles.metaItem}>Fee: {cat.fees?.application || 'Varies'}</span>
              </div>
              <div style={styles.cardLegal}>{cat.legalReference}</div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={styles.empty}>
            <p>No visa categories match your search. Try different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '2rem 0' },
  loading: { textAlign: 'center', padding: '4rem', color: '#6c757d' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#1a5632' },
  subtitle: { color: '#6c757d', fontSize: '0.9375rem', marginTop: '0.5rem', maxWidth: 600, margin: '0.5rem auto 0' },
  filters: { marginBottom: '2rem' },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #dee2e6',
    borderRadius: 10,
    fontSize: '0.9375rem',
    marginBottom: '1rem',
    fontFamily: 'inherit',
  },
  filterTabs: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterTab: {
    padding: '0.375rem 0.875rem',
    border: '1px solid #dee2e6',
    borderRadius: 999,
    background: '#fff',
    fontSize: '0.8125rem',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  filterTabActive: {
    background: '#1a5632',
    color: '#fff',
    borderColor: '#1a5632',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1rem',
  },
  card: {
    display: 'block',
    background: '#fff',
    borderRadius: 12,
    padding: '1.5rem',
    border: '1px solid #e9ecef',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s',
  },
  cardBadge: { marginBottom: '0.75rem' },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    borderRadius: 999,
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: '#212529',
    marginBottom: '0.5rem',
  },
  cardDesc: {
    fontSize: '0.8125rem',
    color: '#6c757d',
    lineHeight: 1.5,
    marginBottom: '0.75rem',
  },
  cardMeta: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  metaItem: {
    fontSize: '0.75rem',
    color: '#495057',
    fontWeight: 500,
  },
  cardLegal: {
    fontSize: '0.6875rem',
    color: '#adb5bd',
    fontStyle: 'italic',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6c757d',
  },
};
