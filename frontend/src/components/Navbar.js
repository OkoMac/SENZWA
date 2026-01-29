import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>S</span>
          <span style={styles.logoText}>SENZWA</span>
          <span style={styles.logoSub}>MigrateSA</span>
        </Link>

        {user && (
          <div style={styles.desktopMenu}>
            <Link to="/dashboard" style={{...styles.navLink, ...(isActive('/dashboard') ? styles.navLinkActive : {})}}>
              Dashboard
            </Link>
            <Link to="/visas" style={{...styles.navLink, ...(isActive('/visas') ? styles.navLinkActive : {})}}>
              Visa Categories
            </Link>
            <Link to="/eligibility" style={{...styles.navLink, ...(isActive('/eligibility') ? styles.navLinkActive : {})}}>
              Eligibility Check
            </Link>
          </div>
        )}

        <div style={styles.right}>
          {user ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>{user.firstName} {user.lastName}</span>
              <button onClick={logout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.loginLink}>Log In</Link>
              <Link to="/register" className="btn btn-primary" style={styles.registerBtn}>Get Started</Link>
            </div>
          )}
          {user && (
            <button
              style={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? '\u2715' : '\u2630'}
            </button>
          )}
        </div>
      </div>

      {menuOpen && user && (
        <div style={styles.mobileMenu}>
          <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/visas" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Visa Categories</Link>
          <Link to="/eligibility" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Eligibility Check</Link>
          <button onClick={() => { logout(); setMenuOpen(false); }} style={styles.mobileLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid #e9ecef',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    background: '#1a5632',
    color: '#fff',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: '1.125rem',
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#1a5632',
    letterSpacing: '1px',
  },
  logoSub: {
    fontSize: '0.75rem',
    color: '#6c757d',
    fontWeight: 500,
    marginLeft: '-0.25rem',
  },
  desktopMenu: {
    display: 'flex',
    gap: '0.25rem',
  },
  navLink: {
    padding: '0.5rem 1rem',
    borderRadius: 6,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#495057',
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    background: '#e8f5e9',
    color: '#1a5632',
    fontWeight: 600,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#495057',
  },
  logoutBtn: {
    padding: '0.375rem 0.75rem',
    border: '1px solid #dee2e6',
    background: '#fff',
    borderRadius: 6,
    fontSize: '0.8125rem',
    color: '#495057',
    cursor: 'pointer',
  },
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  loginLink: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#495057',
    textDecoration: 'none',
  },
  registerBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.875rem',
    borderRadius: 8,
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#495057',
    cursor: 'pointer',
  },
  mobileMenu: {
    padding: '1rem 1.5rem',
    background: '#fff',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  mobileLink: {
    padding: '0.75rem',
    fontSize: '0.9375rem',
    color: '#495057',
    textDecoration: 'none',
    borderRadius: 6,
  },
  mobileLogout: {
    padding: '0.75rem',
    fontSize: '0.9375rem',
    color: '#dc3545',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  },
};
