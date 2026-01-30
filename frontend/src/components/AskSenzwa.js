import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AskSenzwa() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on messages page (already there) and on auth pages
  const hide = ['/messages', '/login', '/register'].includes(location.pathname);
  if (hide) return null;

  return (
    <button
      onClick={() => navigate('/messages')}
      aria-label="Ask Senzwa AI"
      style={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        zIndex: 800,
        width: 52,
        height: 52,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
        border: 'none',
        boxShadow: '0 4px 24px rgba(212,168,67,0.3), 0 0 40px rgba(212,168,67,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    </button>
  );
}
