import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const navLinks = [
    { path: '/knowledge', label: 'Knowledge Hub', show: true },
    { path: '/dashboard', label: 'Dashboard', show: !!user },
    { path: '/visas', label: 'Visas', show: !!user },
    { path: '/eligibility', label: 'Eligibility', show: !!user },
    { path: '/tracker', label: 'Tracker', show: !!user },
  ].filter(l => l.show);

  return (
    <>
      {/* Main Nav Bar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(9,9,11,0.92)' : 'rgba(9,9,11,0.6)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64,
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Logo height={isMobile ? 30 : 34} />
          </Link>

          {/* Desktop Nav Tabs - pill container */}
          {!isMobile && (
            <div style={{
              display: 'flex', gap: 2, alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12, padding: 3,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} style={{
                  padding: '8px 18px', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
                  color: isActive(link.path) ? '#fafafa' : '#71717a',
                  background: isActive(link.path) ? 'rgba(212,168,67,0.15)' : 'transparent',
                  borderBottom: isActive(link.path) ? '2px solid #d4a843' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {!isMobile && (
              <>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'linear-gradient(135deg, #d4a843, #b8922e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#09090b', fontSize: 12, fontWeight: 800,
                    }}>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <button onClick={handleLogout} style={{
                      padding: '7px 16px', borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#a1a1aa', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link to="/login" style={{
                      fontSize: 13, fontWeight: 600, color: '#a1a1aa',
                      textDecoration: 'none', padding: '8px 14px',
                      borderRadius: 8,
                    }}>
                      Sign In
                    </Link>
                    <Link to="/register" style={{
                      fontSize: 13, fontWeight: 700, color: '#09090b',
                      textDecoration: 'none', padding: '8px 20px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
                      boxShadow: '0 0 20px rgba(212,168,67,0.2)',
                    }}>
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Hamburger */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 5,
                  padding: 8, background: 'none', border: 'none',
                  cursor: 'pointer', zIndex: 1001,
                }}
              >
                <span style={{
                  width: 22, height: 2, borderRadius: 2, display: 'block',
                  background: menuOpen ? '#d4a843' : '#fafafa',
                  transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }} />
                <span style={{
                  width: 22, height: 2, borderRadius: 2, display: 'block',
                  background: '#fafafa',
                  transition: 'all 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }} />
                <span style={{
                  width: 22, height: 2, borderRadius: 2, display: 'block',
                  background: menuOpen ? '#d4a843' : '#fafafa',
                  transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9,9,11,0.97)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          zIndex: 998,
          paddingTop: 80,
          overflowY: 'auto',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'none' : 'translateY(-10px)',
        }}>
          <div style={{ padding: '20px 24px' }}>
            {/* Section label */}
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#52525b',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '8px 16px', marginBottom: 4,
            }}>
              Navigation
            </div>

            {/* Mobile Nav Links */}
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '16px 16px', borderRadius: 14,
                  fontSize: 17, fontWeight: 600,
                  color: isActive(link.path) ? '#fafafa' : '#a1a1aa',
                  background: isActive(link.path) ? 'rgba(212,168,67,0.08)' : 'transparent',
                  borderLeft: isActive(link.path) ? '3px solid #d4a843' : '3px solid transparent',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  marginBottom: 2,
                  animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span style={{ fontSize: 10, color: '#d4a843', fontWeight: 700, letterSpacing: '0.1em' }}>ACTIVE</span>
                )}
              </Link>
            ))}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0 20px' }} />

            {/* Mobile Auth */}
            {user ? (
              <div style={{ animation: 'fadeInUp 0.3s ease 0.2s both' }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#52525b',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '8px 16px', marginBottom: 8,
                }}>
                  Account
                </div>
                <div style={{
                  padding: 16, borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg, #d4a843, #b8922e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#09090b', fontSize: 16, fontWeight: 800, flexShrink: 0,
                  }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fafafa' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: 13, color: '#52525b', marginTop: 2 }}>{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} style={{
                  width: '100%', padding: '14px 16px', fontSize: 15, fontWeight: 600,
                  color: '#ef4444', background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.12)',
                  borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'center',
                }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeInUp 0.3s ease 0.15s both' }}>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                  padding: '14px 20px', fontSize: 16, fontWeight: 600,
                  color: '#fafafa', textDecoration: 'none',
                  borderRadius: 12, textAlign: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                  padding: '14px 20px', fontSize: 16, fontWeight: 700,
                  color: '#09090b', textDecoration: 'none',
                  borderRadius: 12, textAlign: 'center',
                  background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
                  boxShadow: '0 4px 24px rgba(212,168,67,0.25)',
                }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
