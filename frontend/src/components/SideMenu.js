import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function SideMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  useEffect(() => { onClose(); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleLogout = () => { logout(); navigate('/'); onClose(); };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      show: !user,
      items: [
        { to: '/register', label: 'Create Account' },
        { to: '/login', label: 'Sign In' },
      ],
    },
    {
      id: 'knowledge',
      title: 'Knowledge Hub',
      show: true,
      items: [
        { to: '/knowledge', label: 'Overview' },
        { to: '/knowledge', label: 'All Visa Categories', state: { tab: 'visas' } },
        { to: '/knowledge', label: 'Critical Skills List', state: { tab: 'skills' } },
        { to: '/knowledge', label: 'Country Requirements', state: { tab: 'country' } },
        { to: '/knowledge', label: 'Document Guide', state: { tab: 'docs' } },
        { to: '/knowledge', label: 'Fees & Costs', state: { tab: 'fees' } },
        { to: '/knowledge', label: 'Processing Times', state: { tab: 'times' } },
        { to: '/knowledge', label: 'DHA Offices', state: { tab: 'offices' } },
        { to: '/knowledge', label: 'Professional Bodies', state: { tab: 'bodies' } },
        { to: '/knowledge', label: 'FAQ', state: { tab: 'faq' } },
      ],
    },
    {
      id: 'tools',
      title: 'Immigration Tools',
      show: true,
      items: [
        { to: '/visas', label: 'Visa Explorer', auth: true },
        { to: '/eligibility', label: 'Eligibility Check', auth: true },
        { to: '/onboarding', label: 'Create Profile', auth: true },
      ],
    },
    {
      id: 'applications',
      title: 'My Applications',
      show: !!user,
      items: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/tracker', label: 'Application Tracker' },
      ],
    },
  ].filter(s => s.show);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '85%', maxWidth: 360,
        background: 'rgba(14,14,16,0.97)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        zIndex: 1101,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <Logo height={28} />
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#a1a1aa', fontSize: 18,
          }}>
            &times;
          </button>
        </div>

        {/* Sections */}
        <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {sections.map(section => (
            <div key={section.id} style={{ marginBottom: 4 }}>
              {/* Section Header - Dropdown Toggle */}
              <button
                onClick={() => toggle(section.id)}
                style={{
                  width: '100%', padding: '14px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <span style={{
                  fontSize: 13, fontWeight: 700, color: '#fafafa',
                  letterSpacing: '0.02em',
                }}>
                  {section.title}
                </span>
                <span style={{
                  fontSize: 12, color: '#52525b',
                  transform: expanded[section.id] ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                }}>
                  &#9662;
                </span>
              </button>

              {/* Dropdown Items */}
              <div style={{
                maxHeight: expanded[section.id] ? 600 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                {section.items.map((item, i) => {
                  const disabled = item.auth && !user;
                  return (
                    <Link
                      key={i}
                      to={disabled ? '/login' : item.to}
                      state={item.state}
                      onClick={onClose}
                      style={{
                        display: 'block',
                        padding: '12px 24px 12px 40px',
                        fontSize: 14, fontWeight: 500,
                        color: disabled ? '#3f3f46' : (location.pathname === item.to ? '#d4a843' : '#a1a1aa'),
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        borderLeft: location.pathname === item.to ? '2px solid #d4a843' : '2px solid transparent',
                      }}
                    >
                      {item.label}
                      {disabled && <span style={{ fontSize: 10, color: '#52525b', marginLeft: 8 }}>(login required)</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Account */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #d4a843, #b8922e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#09090b', fontSize: 14, fontWeight: 800, flexShrink: 0,
                }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fafafa' }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: 12, color: '#52525b' }}>{user.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} style={{
                width: '100%', padding: '12px', fontSize: 14, fontWeight: 600,
                color: '#ef4444', background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.1)',
                borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" onClick={onClose} style={{
                flex: 1, padding: '12px', fontSize: 14, fontWeight: 600,
                color: '#fafafa', textDecoration: 'none', textAlign: 'center',
                borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                Sign In
              </Link>
              <Link to="/register" onClick={onClose} style={{
                flex: 1, padding: '12px', fontSize: 14, fontWeight: 700,
                color: '#09090b', textDecoration: 'none', textAlign: 'center',
                borderRadius: 10, background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
              }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
