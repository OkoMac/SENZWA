import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { path: '/knowledge', label: 'Knowledge Hub', public: true },
    { path: '/dashboard', label: 'Dashboard', public: false },
    { path: '/visas', label: 'Visas', public: false },
    { path: '/eligibility', label: 'Eligibility', public: false },
    { path: '/tracker', label: 'Tracker', public: false },
  ];

  const visibleLinks = navLinks.filter(link => link.public || user);

  return (
    <nav style={{
      ...styles.nav,
      background: scrolled ? 'rgba(9, 9, 11, 0.92)' : 'rgba(9, 9, 11, 0.6)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    }}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoMark}>
            <span style={styles.logoLetter}>S</span>
          </div>
          <div style={styles.logoTextWrap}>
            <span style={styles.logoText}>SENZWA</span>
            <span style={styles.logoSub}>MigrateSA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={styles.center}>
          {visibleLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.navLink,
                ...(isActive(link.path) ? styles.navLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={styles.right}>
          {user ? (
            <div style={styles.userArea}>
              <div style={styles.avatar}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <button onClick={logout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={styles.authArea}>
              <Link to="/login" style={styles.signInLink}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            style={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div style={{
              ...styles.hamburgerLine,
              transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
            }} />
            <div style={{
              ...styles.hamburgerLine,
              opacity: menuOpen ? 0 : 1,
            }} />
            <div style={{
              ...styles.hamburgerLine,
              transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
            }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {visibleLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.mobileLink,
                ...(isActive(link.path) ? styles.mobileLinkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={styles.mobileDivider} />
          {user ? (
            <button onClick={logout} style={styles.mobileLogout}>
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink}>Sign In</Link>
              <Link to="/register" style={{...styles.mobileLink, color: '#d4a843', fontWeight: 600}}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoMark: {
    width: 36,
    height: 36,
    background: 'linear-gradient(135deg, #d4a843 0%, #b8922e 100%)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#09090b',
    fontWeight: 900,
    fontSize: 18,
    letterSpacing: '-0.02em',
  },
  logoTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  logoText: {
    fontWeight: 800,
    fontSize: 17,
    color: '#fafafa',
    letterSpacing: '0.08em',
  },
  logoSub: {
    fontSize: 10,
    color: '#a1a1aa',
    fontWeight: 500,
    letterSpacing: '0.06em',
    marginTop: 1,
  },
  center: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  navLink: {
    padding: '7px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: '#a1a1aa',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
  },
  navLinkActive: {
    color: '#fafafa',
    background: 'rgba(255, 255, 255, 0.08)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #d4a843 0%, #b8922e 100%)',
    color: '#09090b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  logoutBtn: {
    padding: '6px 14px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  signInLink: {
    fontSize: 13,
    fontWeight: 500,
    color: '#a1a1aa',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  menuToggle: {
    display: 'none',
    flexDirection: 'column',
    gap: 4,
    padding: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    background: '#a1a1aa',
    borderRadius: 2,
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    padding: '12px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    background: 'rgba(9, 9, 11, 0.98)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    animation: 'fadeInDown 0.2s ease',
  },
  mobileLink: {
    padding: '12px 16px',
    fontSize: 15,
    fontWeight: 500,
    color: '#a1a1aa',
    textDecoration: 'none',
    borderRadius: 10,
    transition: 'all 0.2s',
  },
  mobileLinkActive: {
    color: '#fafafa',
    background: 'rgba(255, 255, 255, 0.06)',
  },
  mobileDivider: {
    height: 1,
    background: 'rgba(255,255,255,0.06)',
    margin: '8px 0',
  },
  mobileLogout: {
    padding: '12px 16px',
    fontSize: 15,
    fontWeight: 500,
    color: '#ef4444',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: 10,
    fontFamily: 'inherit',
  },
};

// Media query handled via CSS - add this to index.css or use window.matchMedia
// For the hamburger to show on mobile, we need CSS media queries
// Since we're using inline styles, we'll detect via JS
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      nav [data-desktop-menu] { display: none !important; }
      nav [data-mobile-toggle] { display: flex !important; }
      nav [data-auth-desktop] { display: none !important; }
    }
  `;
  if (!document.getElementById('senzwa-nav-styles')) {
    style.id = 'senzwa-nav-styles';
    document.head.appendChild(style);
  }
}
