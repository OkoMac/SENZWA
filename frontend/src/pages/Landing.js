import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            Powered by South African Immigration Law
          </div>
          <h1 style={styles.heroTitle}>
            The Intelligent Infrastructure for{' '}
            <span style={styles.heroHighlight}>Migration into South Africa</span>
          </h1>
          <p style={styles.heroSubtitle}>
            AI-guided visa pathway selection, dynamic document validation, and structured
            application compilation. Migration made clear, lawfully guided, and accountable by design.
          </p>
          <div style={styles.heroCTA}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Your Journey
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Check Eligibility
            </Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>22+</span>
              <span style={styles.statLabel}>Visa Categories</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>60%</span>
              <span style={styles.statLabel}>Error Reduction</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>24/7</span>
              <span style={styles.statLabel}>AI Guidance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>A Broken System Needs Intelligent Solutions</h2>
          <p style={styles.sectionSubtitle}>
            The current South African immigration process is fragmented, manual, and opaque.
          </p>
          <div style={styles.problemGrid}>
            {[
              { title: 'For Applicants', desc: 'Fragmented information, complex legal requirements, high rejection rates due to incorrect documentation.' },
              { title: 'For Service Providers', desc: 'Manual screening of every application, repetitive validation, limited scalability.' },
              { title: 'For Government', desc: 'Poorly prepared applications, inconsistent data quality, unnecessary resubmissions.' },
            ].map((item, idx) => (
              <div key={idx} style={styles.problemCard}>
                <h3 style={styles.problemTitle}>{item.title}</h3>
                <p style={styles.problemDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, background: '#fff' }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How Senzwa Works</h2>
          <p style={styles.sectionSubtitle}>Five steps from confusion to clarity</p>
          <div style={styles.stepsGrid}>
            {[
              { step: '1', title: 'Intelligent Onboarding', desc: 'Register and tell us about yourself: nationality, purpose of stay, qualifications, and circumstances.' },
              { step: '2', title: 'AI Visa Pathway Selection', desc: 'Our rules engine evaluates all visa categories against South African immigration law and recommends the best pathway.' },
              { step: '3', title: 'Document Compilation', desc: 'Dynamic checklists specific to your visa category, nationality, and circumstances. Real-time validation as you upload.' },
              { step: '4', title: 'WhatsApp Engagement', desc: 'Get guided through the entire process via WhatsApp. Reminders, updates, and plain-language explanations.' },
              { step: '5', title: 'Structured Output', desc: 'Fully compiled, validated application package formatted to DHA/VFS standards with complete audit trails.' },
            ].map((item, idx) => (
              <div key={idx} style={styles.stepCard}>
                <div style={styles.stepNumber}>{item.step}</div>
                <h3 style={styles.stepTitle}>{item.title}</h3>
                <p style={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Coverage */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Complete Home Affairs Coverage</h2>
          <p style={styles.sectionSubtitle}>
            Every Department of Home Affairs immigration category, fully supported.
          </p>
          <div style={styles.coverageGrid}>
            {[
              { title: 'Temporary Residence', items: ['Tourist Visa', 'Business Visa', 'Study Visa', 'Medical Treatment', 'Remote Work', 'Retired Person', 'Exchange Visa'] },
              { title: 'Work & Business', items: ['General Work Visa', 'Critical Skills Visa', 'Intra-Company Transfer', 'Corporate Visa', 'Business & Investment'] },
              { title: 'Family & Relationship', items: ["Relative's Visa", 'Spousal Visa', 'Life Partner Visa'] },
              { title: 'Permanent Residence', items: ['Section 26 (Direct)', 'Work-based PR', 'Business-based PR', 'Financially Independent', 'Extraordinary Skills'] },
            ].map((group, idx) => (
              <div key={idx} style={styles.coverageCard}>
                <h3 style={styles.coverageTitle}>{group.title}</h3>
                <ul style={styles.coverageList}>
                  {group.items.map((item, i) => (
                    <li key={i} style={styles.coverageItem}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountability */}
      <section style={{ ...styles.section, background: '#1a5632', color: '#fff' }}>
        <div className="container">
          <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Radical Accountability</h2>
          <p style={{ ...styles.sectionSubtitle, color: 'rgba(255,255,255,0.8)' }}>
            Every action logged. Every decision documented. Every stakeholder protected.
          </p>
          <div style={styles.accountGrid}>
            {[
              { title: 'Complete Audit Trails', desc: 'Timestamped logs of every interaction, document upload, validation result, and communication.' },
              { title: 'Clear Responsibility', desc: 'AI guides. Applicants submit. Service providers process. Government adjudicates.' },
              { title: 'Trust Through Transparency', desc: 'Reduced corruption risk, legal defensibility, and improved public trust.' },
            ].map((item, idx) => (
              <div key={idx} style={styles.accountCard}>
                <h3 style={styles.accountTitle}>{item.title}</h3>
                <p style={styles.accountDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...styles.section, textAlign: 'center' }}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Ready to Start Your Migration Journey?</h2>
          <p style={styles.sectionSubtitle}>
            Migration made clear. Lawfully guided. Accountable by design.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerContent}>
            <div>
              <div style={styles.footerLogo}>SENZWA MigrateSA</div>
              <p style={styles.footerText}>
                The Intelligent Infrastructure for Migration into South Africa
              </p>
            </div>
            <div style={styles.footerLinks}>
              <p style={styles.footerText}>
                Based on the Immigration Act 13 of 2002 (as amended)
              </p>
              <p style={styles.footerText}>
                POPIA and GDPR Compliant
              </p>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.footerCopy}>&copy; 2026 Senzwa. All rights reserved.</p>
            <p style={styles.footerDisclaimer}>
              Senzwa provides guidance only. All final visa decisions are made by the Department of Home Affairs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a5632 0%, #0e3a21 60%, #1a1a2e 100%)',
    color: '#fff',
    padding: '5rem 1.5rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: 800,
    margin: '0 auto',
  },
  heroBadge: {
    display: 'inline-block',
    padding: '0.375rem 1rem',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    fontSize: '0.8125rem',
    fontWeight: 500,
    marginBottom: '1.5rem',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: '1.25rem',
  },
  heroHighlight: {
    color: '#d4a843',
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '2rem',
    maxWidth: 640,
    margin: '0 auto 2rem',
  },
  heroCTA: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#d4a843',
  },
  statLabel: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 500,
  },
  section: {
    padding: '5rem 0',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '0.75rem',
    color: '#212529',
  },
  sectionSubtitle: {
    fontSize: '1.0625rem',
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: 600,
    margin: '0 auto 3rem',
  },
  problemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  problemCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '2rem',
    border: '1px solid #e9ecef',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  problemTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    color: '#c4342d',
  },
  problemDesc: {
    fontSize: '0.9375rem',
    color: '#6c757d',
    lineHeight: 1.6,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  stepCard: {
    textAlign: 'center',
    padding: '1.5rem',
  },
  stepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    background: '#1a5632',
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  stepTitle: {
    fontSize: '1.0625rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  stepDesc: {
    fontSize: '0.875rem',
    color: '#6c757d',
    lineHeight: 1.5,
  },
  coverageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  coverageCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '1.5rem',
    border: '1px solid #e9ecef',
  },
  coverageTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a5632',
  },
  coverageList: {
    listStyle: 'none',
    padding: 0,
  },
  coverageItem: {
    padding: '0.375rem 0',
    fontSize: '0.875rem',
    color: '#495057',
    borderBottom: '1px solid #f1f3f5',
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  accountCard: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '2rem',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  accountTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
  },
  accountDesc: {
    fontSize: '0.9375rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
  },
  footer: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '3rem 0 1.5rem',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '2rem',
  },
  footerLogo: {
    fontSize: '1.25rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
  },
  footerText: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
  },
  footerLinks: {},
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  footerCopy: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.5)',
  },
  footerDisclaimer: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
  },
};
