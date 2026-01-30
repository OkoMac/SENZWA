import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Hide bottom nav on secondary screens (onboarding, application builder, document upload, visa detail)
const HIDDEN_PATTERNS = ['/onboarding', '/applications/', '/visas/'];

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Hide on secondary screens per spec
  if (HIDDEN_PATTERNS.some(p => path.startsWith(p) && path !== '/visas')) return null;
  // Also hide on login/register
  if (['/login', '/register'].includes(path)) return null;

  const tabs = [
    { to: user ? '/dashboard' : '/', label: 'Home', icon: HomeIcon, match: ['/', '/dashboard'] },
    { to: '/tracker', label: 'Applications', icon: FolderIcon, match: ['/tracker'] },
    { to: '/knowledge', label: 'Knowledge', icon: BookIcon, match: ['/knowledge'] },
    { to: '/messages', label: 'Messages', icon: ChatIcon, match: ['/messages'] },
    { to: user ? '/profile' : '/login', label: 'Profile', icon: UserIcon, match: ['/profile'] },
  ];

  const isActive = (match) => match.some(m => path === m || (m !== '/' && path.startsWith(m)));

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
      background: 'rgba(9,9,11,0.88)',
      backdropFilter: 'blur(28px) saturate(200%)',
      WebkitBackdropFilter: 'blur(28px) saturate(200%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        maxWidth: 500, margin: '0 auto', height: 62,
      }}>
        {tabs.map(tab => {
          const active = isActive(tab.match);
          return (
            <Link key={tab.label} to={tab.to} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              textDecoration: 'none', padding: '6px 12px',
              transition: 'all 0.2s ease',
              minWidth: 56,
            }}>
              <div style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {active && <div style={{
                  position: 'absolute', inset: -6,
                  background: 'rgba(212,168,67,0.1)',
                  borderRadius: 12,
                }} />}
                <tab.icon color={active ? '#d4a843' : '#52525b'} size={22} />
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? '#d4a843' : '#52525b',
                letterSpacing: '0.02em',
              }}>
                {tab.label}
              </span>
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

function FolderIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
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

function ChatIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function UserIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
