import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicantAPI, applicationAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [appRes, appsRes] = await Promise.allSettled([
          applicantAPI.getMe(),
          applicationAPI.list(),
        ]);
        if (appRes.status === 'fulfilled') setApplicant(appRes.value.data.applicant);
        if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data.applications || []);
      } catch { /* ignored */ }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading your dashboard...</div>;
  }

  const statusColors = {
    draft: '#6c757d', documents_pending: '#ffc107', under_review: '#17a2b8',
    compiled: '#002395', submitted: '#1a5632', approved: '#28a745', rejected: '#dc3545',
  };

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Welcome Banner */}
        <div style={styles.welcome}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome, {user.firstName}!</h1>
            <p style={styles.welcomeText}>
              {applicant
                ? 'Your migration journey is underway. Here is your dashboard.'
                : 'Complete your profile to start your migration journey.'}
            </p>
          </div>
          {!applicant && (
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/onboarding')}>
              Complete Profile
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div style={styles.actions}>
          <div style={styles.actionCard} onClick={() => navigate('/eligibility')}>
            <div style={styles.actionIcon}>&#x2714;</div>
            <h3 style={styles.actionTitle}>Check Eligibility</h3>
            <p style={styles.actionDesc}>AI-powered visa pathway assessment</p>
          </div>
          <div style={styles.actionCard} onClick={() => navigate('/visas')}>
            <div style={styles.actionIcon}>&#x1F4CB;</div>
            <h3 style={styles.actionTitle}>Explore Visas</h3>
            <p style={styles.actionDesc}>Browse all 22+ visa categories</p>
          </div>
          <div style={styles.actionCard} onClick={() => navigate('/onboarding')}>
            <div style={styles.actionIcon}>&#x1F464;</div>
            <h3 style={styles.actionTitle}>My Profile</h3>
            <p style={styles.actionDesc}>Update your applicant information</p>
          </div>
        </div>

        {/* Applications */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>You haven't started any applications yet.</p>
              <p style={styles.emptyHint}>
                Begin by checking your <Link to="/eligibility" style={styles.link}>eligibility</Link> or
                exploring <Link to="/visas" style={styles.link}>visa categories</Link>.
              </p>
            </div>
          ) : (
            <div style={styles.appGrid}>
              {applications.map((app) => (
                <div key={app.id} style={styles.appCard} onClick={() => navigate(`/applications/${app.id}`)}>
                  <div style={styles.appHeader}>
                    <span style={styles.appCategory}>{app.visaCategoryId}</span>
                    <span style={{
                      ...styles.appStatus,
                      background: statusColors[app.status] + '20',
                      color: statusColors[app.status],
                    }}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={styles.appMeta}>
                    <span>ID: {app.id.slice(0, 8)}</span>
                    <span>Created: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  {app.eligibilityScore !== null && (
                    <div style={styles.appScore}>
                      Eligibility: {app.eligibilityScore}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Summary */}
        {applicant && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Profile Summary</h2>
            <div style={styles.profileGrid}>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Nationality</span>
                <span style={styles.profileValue}>{applicant.nationality}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Purpose of Stay</span>
                <span style={styles.profileValue}>{applicant.purposeOfStay}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Passport</span>
                <span style={styles.profileValue}>{applicant.passportNumber}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Status</span>
                <span style={styles.profileValue}>{applicant.onboardingComplete ? 'Complete' : 'Incomplete'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '2rem 0' },
  loading: { textAlign: 'center', padding: '4rem', color: '#6c757d' },
  welcome: {
    background: 'linear-gradient(135deg, #1a5632, #2d7a4a)',
    borderRadius: 16,
    padding: '2rem 2.5rem',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
  },
  welcomeTitle: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  welcomeText: { fontSize: '0.9375rem', opacity: 0.85 },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  actionCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '1.5rem',
    border: '1px solid #e9ecef',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  actionIcon: { fontSize: '2rem', marginBottom: '0.75rem' },
  actionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' },
  actionDesc: { fontSize: '0.8125rem', color: '#6c757d' },
  section: { marginBottom: '2rem' },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 700 },
  empty: {
    background: '#fff',
    borderRadius: 12,
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  },
  emptyText: { fontSize: '1.0625rem', fontWeight: 600, color: '#495057', marginBottom: '0.5rem' },
  emptyHint: { fontSize: '0.875rem', color: '#6c757d' },
  link: { color: '#1a5632', fontWeight: 600 },
  appGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  appCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '1.5rem',
    border: '1px solid #e9ecef',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s',
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  appCategory: { fontSize: '0.9375rem', fontWeight: 600 },
  appStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: 999,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  appMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem',
    color: '#6c757d',
  },
  appScore: {
    marginTop: '0.75rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#1a5632',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  profileItem: {
    background: '#fff',
    borderRadius: 8,
    padding: '1rem',
    border: '1px solid #e9ecef',
  },
  profileLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.25rem',
  },
  profileValue: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#212529',
  },
};
