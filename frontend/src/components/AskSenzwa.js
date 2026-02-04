import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Hide on pages that have their own chat or are immersive
const HIDDEN_PATHS = ['/messages', '/onboarding', '/login', '/register'];

export default function AskSenzwa() {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_PATHS.some(p => location.pathname.startsWith(p))) return null;
  if (location.pathname.startsWith('/applications/')) return null;

  return (
    <button
      onClick={() => navigate('/messages')}
      aria-label="Ask Senzwa AI"
      style={s.fab}
    >
      <div style={s.pulse} />
      <div style={s.inner}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
    </button>
  );
}

const s = {
  fab: {
    position: 'fixed', bottom: 84, right: 20, zIndex: 800,
    width: 52, height: 52, borderRadius: '50%',
    background: 'transparent', border: 'none', padding: 0,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  pulse: {
    position: 'absolute', inset: -4,
    borderRadius: '50%',
    background: 'rgba(212,168,67,0.15)',
    animation: 'glow 3s ease-in-out infinite',
  },
  inner: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
    boxShadow: '0 4px 20px rgba(212,168,67,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
};
