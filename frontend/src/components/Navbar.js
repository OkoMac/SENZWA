import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import SideMenu from './SideMenu';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLanding = location.pathname === '/';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(9,9,11,0.92)' : (isLanding ? 'transparent' : 'rgba(9,9,11,0.6)'),
        backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Logo height={28} />
          </Link>

          {/* Right: Search + Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/knowledge" style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'all 0.2s',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', gap: 4,
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{ width: 16, height: 1.5, background: '#fafafa', borderRadius: 2, display: 'block' }} />
              <span style={{ width: 12, height: 1.5, background: '#a1a1aa', borderRadius: 2, display: 'block' }} />
              <span style={{ width: 16, height: 1.5, background: '#fafafa', borderRadius: 2, display: 'block' }} />
            </button>
          </div>
        </div>
      </nav>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
