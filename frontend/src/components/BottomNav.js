import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { to: user ? '/dashboard' : '/', label: 'Home', icon: HomeIcon, match: ['/', '/dashboard'] },
    { to: '/knowledge', label: 'Knowledge', icon: BookIcon, match: ['/knowledge'] },
    { to: '/visas', label: 'Explore', icon: CompassIcon, match: ['/visas'] },
    { to: '/eligibility', label: 'Eligibility', icon: CheckIcon, match: ['/eligibility'] },
    { to: '/tracker', label: 'Track', icon: ClipboardIcon, match: ['/tracker'] },
  ];

  const isActive = (match) => match.some(m => path === m || (m !== '/' && path.startsWith(m)));

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
      background: 'rgba(9,9,11,0.85)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        maxWidth: 500, margin: '0 auto', height: 60,
      }}>
        {tabs.map(tab => {
          const active = isActive(tab.match);
          const needsAuth = ['/dashboard', '/visas', '/eligibility', '/tracker'].includes(tab.to);
          if (needsAuth && !user && tab.to !== '/') return null;

          return (
            <Link key={tab.to} to={tab.to} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              textDecoration: 'none', padding: '6px 12px',
              transition: 'all 0.2s ease',
            }}>
              <tab.icon color={active ? '#d4a843' : '#52525b'} size={22} />
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? '#d4a843' : '#52525b',
                letterSpacing: '0.02em',
              }}>
                {tab.label}
              </span>
              {active && <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: '#d4a843', marginTop: -1,
              }} />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function HomeIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BookIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function CompassIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function CheckIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ClipboardIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}
