import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <img src="/logo-dark.svg" alt="Senzwa MigrateSA" style={{ height: 52, margin: '0 auto 32px', display: 'block' }} />
          <div style={styles.heroBadge}>
            AI-Powered Immigration Platform
          </div>
          <h1 style={styles.heroTitle}>
            Migration into<br />
            South Africa,{' '}
            <span style={styles.heroGold}>simplified.</span>
          </h1>
          <p style={styles.heroSub}>
            Intelligent visa pathway selection, real-time document validation,
            and structured application compilation. Built on the Immigration Act 13 of 2002.
          </p>
          <div style={styles.heroCTA}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Your Journey
            </Link>
            <Link to="/knowledge" className="btn btn-secondary btn-lg">
              Explore Knowledge Hub
            </Link>
          </div>
          <div style={styles.heroStats}>
            {[
              { num: '22+', label: 'Visa Categories' },
              { num: '80+', label: 'Critical Skills' },
              { num: '24/7', label: 'AI Guidance' },
            ].map((s, i) => (
              <div key={i} style={styles.stat}>
                <span style={styles.statNum}>{s.num}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionLabel}>THE PROBLEM</div>
          <h2 style={styles.sectionTitle}>
            A broken system needs<br />intelligent solutions
          </h2>
          <div style={styles.grid3}>
            {[
              { title: 'For Applicants', desc: 'Fragmented information, complex legal requirements, and high rejection rates due to incorrect documentation.', icon: '01' },
              { title: 'For Service Providers', desc: 'Manual screening of every application, repetitive validation tasks, and limited scalability.', icon: '02' },
              { title: 'For Government', desc: 'Poorly prepared applications, inconsistent data quality, and unnecessary processing delays.', icon: '03' },
            ].map((item, i) => (
              <div key={i} style={styles.problemCard}>
                <div style={styles.problemNum}>{item.icon}</div>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...styles.section, background: 'var(--bg-elevated)' }}>
        <div className="container">
          <div style={styles.sectionLabel}>HOW IT WORKS</div>
          <h2 style={styles.sectionTitle}>Five steps from confusion to clarity</h2>
          <div style={styles.stepsContainer}>
            {[
              { step: '01', title: 'Onboarding', desc: 'Tell us about yourself - nationality, purpose of stay, qualifications, and circumstances.' },
              { step: '02', title: 'AI Assessment', desc: 'Our rules engine evaluates all visa categories against South African immigration law.' },
              { step: '03', title: 'Document Compilation', desc: 'Dynamic checklists specific to your visa category with real-time validation.' },
              { step: '04', title: 'WhatsApp Guidance', desc: 'Get guided through the entire process via WhatsApp with reminders and updates.' },
              { step: '05', title: 'Structured Output', desc: 'Fully compiled, validated application package formatted to DHA/VFS standards.' },
            ].map((item, i) => (
              <div key={i} style={styles.stepItem}>
                <div style={styles.stepLeft}>
                  <div style={styles.stepNum}>{item.step}</div>
                  {i < 4 && <div style={styles.stepLine} />}
                </div>
                <div style={styles.stepRight}>
                  <h3 style={styles.stepTitle}>{item.title}</h3>
                  <p style={styles.stepDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionLabel}>COMPLETE COVERAGE</div>
          <h2 style={styles.sectionTitle}>Every DHA category, fully supported</h2>
          <div style={styles.grid4}>
            {[
              { title: 'Temporary Residence', items: ['Tourist Visa', 'Business Visa', 'Study Visa', 'Medical Treatment', 'Remote Work', 'Retired Person', 'Exchange Visa'], color: '#3b82f6' },
              { title: 'Work & Business', items: ['General Work Visa', 'Critical Skills Visa', 'Intra-Company Transfer', 'Corporate Visa', 'Business & Investment'], color: '#22c55e' },
              { title: 'Family & Relationship', items: ["Relative's Visa", 'Spousal Visa', 'Life Partner Visa'], color: '#d4a843' },
              { title: 'Permanent Residence', items: ['Section 26 (Direct)', 'Work-based PR', 'Business-based PR', 'Financially Independent', 'Extraordinary Skills'], color: '#a855f7' },
            ].map((group, i) => (
              <div key={i} style={styles.coverageCard}>
                <div style={{ ...styles.coverageDot, background: group.color }} />
                <h3 style={styles.coverageTitle}>{group.title}</h3>
                <ul style={styles.coverageList}>
                  {group.items.map((item, j) => (
                    <li key={j} style={styles.coverageItem}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountability */}
      <section style={{ ...styles.section, background: 'var(--bg-elevated)' }}>
        <div className="container">
          <div style={styles.sectionLabel}>ACCOUNTABILITY</div>
          <h2 style={styles.sectionTitle}>
            Every action logged.{' '}
            <span style={styles.heroGold}>Every decision documented.</span>
          </h2>
          <div style={styles.grid3}>
            {[
              { title: 'Complete Audit Trails', desc: 'Timestamped logs of every interaction, upload, validation, and communication throughout the process.' },
              { title: 'Clear Responsibility', desc: 'AI guides. Applicants submit. Service providers process. Government adjudicates. No ambiguity.' },
              { title: 'Trust & Transparency', desc: 'Reduced corruption risk, legal defensibility, and improved public trust in the immigration process.' },
            ].map((item, i) => (
              <div key={i} style={styles.accountCard}>
                <h3 style={styles.accountTitle}>{item.title}</h3>
                <p style={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={styles.ctaTitle}>Ready to start your migration journey?</h2>
          <p style={styles.ctaSub}>Migration made clear. Lawfully guided. Accountable by design.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link to="/knowledge" className="btn btn-outline btn-lg">Browse Knowledge Hub</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={styles.footerTop}>
            <div>
              <img src="/logo-dark.svg" alt="Senzwa" style={{ height: 32, marginBottom: 8 }} />
              <p style={styles.footerText}>The Intelligent Infrastructure for Migration into South Africa</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={styles.footerText}>Based on the Immigration Act 13 of 2002</p>
              <p style={styles.footerText}>POPIA and GDPR Compliant</p>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <span style={styles.footerMuted}>&copy; 2026 Senzwa. All rights reserved.</span>
            <span style={styles.footerDisclaimer}>Senzwa provides guidance only. Final visa decisions are made by the Department of Home Affairs.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  hero: { position: 'relative', padding: '120px 24px 100px', textAlign: 'center', overflow: 'hidden', background: '#09090b' },
  heroGlow: { position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(212,168,67,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  heroContent: { position: 'relative', maxWidth: 720, margin: '0 auto' },
  heroBadge: { display: 'inline-block', padding: '6px 16px', background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 9999, fontSize: 12, fontWeight: 600, color: '#d4a843', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 32 },
  heroTitle: { fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fafafa', marginBottom: 24 },
  heroGold: { color: '#d4a843' },
  heroSub: { fontSize: 17, lineHeight: 1.7, color: '#a1a1aa', maxWidth: 540, margin: '0 auto 40px' },
  heroCTA: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 },
  heroStats: { display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: 32, fontWeight: 800, color: '#d4a843', letterSpacing: '-0.02em' },
  statLabel: { fontSize: 12, fontWeight: 500, color: '#52525b', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 4 },
  section: { padding: '100px 0' },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#d4a843', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.15, color: '#fafafa', marginBottom: 56 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  problemCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px 28px' },
  problemNum: { fontSize: 13, fontWeight: 700, color: '#d4a843', letterSpacing: '0.05em', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#fafafa', marginBottom: 10 },
  cardDesc: { fontSize: 14, lineHeight: 1.7, color: '#a1a1aa' },
  stepsContainer: { maxWidth: 600, margin: '0 auto' },
  stepItem: { display: 'flex', gap: 24, position: 'relative' },
  stepLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 },
  stepNum: { width: 48, height: 48, borderRadius: 14, background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#d4a843', flexShrink: 0 },
  stepLine: { width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0', minHeight: 24 },
  stepRight: { paddingBottom: 40 },
  stepTitle: { fontSize: 17, fontWeight: 700, color: '#fafafa', marginBottom: 6 },
  stepDesc: { fontSize: 14, lineHeight: 1.6, color: '#a1a1aa' },
  coverageCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '24px 20px' },
  coverageDot: { width: 8, height: 8, borderRadius: '50%', marginBottom: 14 },
  coverageTitle: { fontSize: 16, fontWeight: 700, color: '#fafafa', marginBottom: 14 },
  coverageList: { listStyle: 'none', padding: 0, margin: 0 },
  coverageItem: { padding: '6px 0', fontSize: 13, color: '#a1a1aa', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  accountCard: { background: '#1a1a1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px 28px' },
  accountTitle: { fontSize: 18, fontWeight: 700, color: '#fafafa', marginBottom: 10 },
  ctaSection: { padding: '100px 0', background: '#09090b' },
  ctaTitle: { fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#fafafa', marginBottom: 16 },
  ctaSub: { fontSize: 16, color: '#a1a1aa', marginBottom: 36, lineHeight: 1.6 },
  footer: { background: '#111113', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 24px' },
  footerTop: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 },
  footerLogo: { fontSize: 18, fontWeight: 800, color: '#fafafa', letterSpacing: '0.08em', marginBottom: 8 },
  footerText: { fontSize: 13, color: '#52525b', lineHeight: 1.6 },
  footerBottom: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  footerMuted: { fontSize: 12, color: '#3f3f46' },
  footerDisclaimer: { fontSize: 11, color: '#3f3f46', fontStyle: 'italic' },
};
