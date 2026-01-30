import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { path: '/knowledge', label: 'Knowledge Hub', show: true },
    { path: '/dashboard', label: 'Dashboard', show: !!user },
    { path: '/visas', label: 'Visas', show: !!user },
    { path: '/eligibility', label: 'Eligibility', show: !!user },
    { path: '/tracker', label: 'Tracker', show: !!user },
  ].filter(l => l.show);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(9,9,11,0.95)' : 'rgba(9,9,11,0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo-dark.svg" alt="Senzwa" style={{ height: 36, width: 'auto' }} />
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: isActive(link.path) ? '#fafafa' : '#a1a1aa',
                  background: isActive(link.path) ? 'rgba(255,255,255,0.08)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.2s ease',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'linear-gradient(135deg, #d4a843, #b8922e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#09090b', fontSize: 13, fontWeight: 700,
                    }}>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <button onClick={handleLogout} style={{
                      padding: '7px 16px', background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                      color: '#a1a1aa', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#a1a1aa', textDecoration: 'none' }}>
                      Sign In
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-sm">
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
                  padding: 8, background: 'none', border: 'none', cursor: 'pointer',
                  zIndex: 1001,
                }}
              >
                <div style={{
                  width: 22, height: 2, background: menuOpen ? '#d4a843' : '#fafafa',
                  borderRadius: 2, transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                }} />
                <div style={{
                  width: 22, height: 2, background: '#fafafa',
                  borderRadius: 2, transition: 'all 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }} />
                <div style={{
                  width: 22, height: 2, background: menuOpen ? '#d4a843' : '#fafafa',
                  borderRadius: 2, transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9,9,11,0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 999,
          paddingTop: 80,
          animation: 'fadeIn 0.25s ease',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '16px 20px', borderRadius: 12,
                  fontSize: 18, fontWeight: 600,
                  color: isActive(link.path) ? '#fafafa' : '#a1a1aa',
                  background: isActive(link.path) ? 'rgba(255,255,255,0.06)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.2s',
                  display: 'block',
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

            {user ? (
              <>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'linear-gradient(135deg, #d4a843, #b8922e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#09090b', fontSize: 15, fontWeight: 700,
                  }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fafafa' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: 13, color: '#52525b' }}>{user.email}</div>
                  </div>
                </div>
                <button onClick={handleLogout} style={{
                  padding: '16px 20px', fontSize: 16, fontWeight: 600,
                  color: '#ef4444', background: 'none', border: 'none',
                  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                  borderRadius: 12,
                }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                  padding: '16px 20px', fontSize: 18, fontWeight: 600,
                  color: '#fafafa', textDecoration: 'none', display: 'block',
                  borderRadius: 12,
                }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                  margin: '4px 20px', padding: '14px 24px', fontSize: 16, fontWeight: 700,
                  color: '#09090b', textDecoration: 'none', display: 'block',
                  borderRadius: 12, textAlign: 'center',
                  background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
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
