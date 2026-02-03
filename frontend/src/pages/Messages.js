import React, { useState, useRef, useEffect } from 'react';
import Logo from '../components/Logo';

const AI_RESPONSES = {
  default: "I'm Senzwa AI, your immigration assistant. I can help you understand visa categories, check eligibility requirements, explain document needs, and guide you through the application process. What would you like to know?",
  visa: "South Africa offers 22+ visa categories including work visas (General Work, Critical Skills, Intra-Company Transfer), business visas, study visas, family visas, and permanent residence options. Would you like details on a specific category?",
  critical: "The Critical Skills Work Visa (Section 19(4)) is for professionals with skills on the Critical Skills List. Key requirements: relevant qualification, professional body registration (e.g., ECSA for engineers, HPCSA for medical), and SAQA evaluation. No job offer needed upfront. Valid for up to 5 years.",
  documents: "Common documents required across most visa categories: valid passport (6+ months), passport photos, police clearance certificates, medical/radiological reports, proof of financial means, and proof of accommodation. Specific visas require additional documents like employment contracts or SAQA evaluations.",
  fees: "DHA visa application fees vary by category. Temporary residence visas range from R425-R1,520. Permanent residence applications are R1,520. Additional costs include VFS service fees, courier charges, and professional body registration fees. All fees are subject to change.",
  timeline: "Processing times vary: Tourist visas (5-10 working days), Work visas (4-8 weeks), Critical Skills (8-12 weeks), Permanent Residence (8-24 months). These are estimates - actual times depend on DHA office workload and application completeness.",
  eligibility: "I can help assess your eligibility. Key factors include: nationality, qualifications, work experience, financial status, family ties to SA, and criminal record. Use our Eligibility Check tool for a comprehensive AI-powered assessment across all visa categories.",
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('critical skill') || lower.includes('scarce skill')) return AI_RESPONSES.critical;
  if (lower.includes('visa') || lower.includes('permit') || lower.includes('category')) return AI_RESPONSES.visa;
  if (lower.includes('document') || lower.includes('passport') || lower.includes('paper')) return AI_RESPONSES.documents;
  if (lower.includes('fee') || lower.includes('cost') || lower.includes('price') || lower.includes('pay')) return AI_RESPONSES.fees;
  if (lower.includes('time') || lower.includes('how long') || lower.includes('process') || lower.includes('wait')) return AI_RESPONSES.timeline;
  if (lower.includes('eligible') || lower.includes('qualify') || lower.includes('can i')) return AI_RESPONSES.eligibility;
  return AI_RESPONSES.default;
}

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: "Welcome to Senzwa AI. I'm here to help you navigate South African immigration. Ask me about visa categories, eligibility, documents, fees, or processing times.", time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (directText) => {
    const text = (directText || input).trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, from: 'ai', text: getAIResponse(text), time: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const suggestions = [
    'What visa do I need?',
    'Critical Skills list',
    'Required documents',
    'Processing times',
  ];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.aiAvatar}>
            <Logo height={20} variant="icon" />
          </div>
          <div>
            <div style={s.headerTitle}>Senzwa AI</div>
            <div style={s.headerStatus}>
              <span style={s.statusDot} />
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={s.messagesArea}>
        <div style={s.messagesInner}>
          {messages.map(msg => (
            <div key={msg.id} style={{ ...s.msgRow, justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={msg.from === 'user' ? s.userBubble : s.aiBubble}>
                <p style={s.msgText}>{msg.text}</p>
                <span style={s.msgTime}>
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ ...s.msgRow, justifyContent: 'flex-start' }}>
              <div style={s.aiBubble}>
                <div style={s.typingDots}>
                  <span style={{ ...s.dot, animationDelay: '0s' }} />
                  <span style={{ ...s.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...s.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick suggestions */}
      {messages.length <= 2 && (
        <div style={s.suggestions}>
          {suggestions.map((sug, i) => (
            <button key={i} onClick={() => send(sug)} style={s.sugBtn}>
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={s.inputArea}>
        <div style={s.inputRow}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Senzwa AI..."
            style={s.input}
          />
          <button onClick={send} disabled={!input.trim()} style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#09090b' },
  header: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(24px) saturate(200%)',
    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerInner: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', maxWidth: 700, margin: '0 auto' },
  aiAvatar: {
    width: 40, height: 40, borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.05))',
    border: '1px solid rgba(212,168,67,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 15, fontWeight: 700, color: '#fafafa' },
  headerStatus: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#52525b' },
  statusDot: { width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' },
  messagesArea: { flex: 1, overflowY: 'auto', paddingTop: 80, paddingBottom: 140 },
  messagesInner: { maxWidth: 700, margin: '0 auto', padding: '16px 16px' },
  msgRow: { display: 'flex', marginBottom: 12 },
  userBubble: {
    maxWidth: '80%', padding: '12px 16px', borderRadius: '18px 18px 4px 18px',
    background: 'linear-gradient(135deg, #d4a843, #b8922e)',
    color: '#09090b',
  },
  aiBubble: {
    maxWidth: '80%', padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
    background: 'rgba(26,26,29,0.8)', backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  msgText: { fontSize: 14, lineHeight: 1.6, margin: 0 },
  msgTime: { fontSize: 10, opacity: 0.6, display: 'block', marginTop: 4, textAlign: 'right' },
  typingDots: { display: 'flex', gap: 4, padding: '4px 0' },
  dot: {
    width: 6, height: 6, borderRadius: '50%', background: '#a1a1aa',
    animation: 'typingBounce 1.2s ease-in-out infinite',
  },
  suggestions: {
    position: 'fixed', bottom: 80, left: 0, right: 0,
    display: 'flex', gap: 8, padding: '8px 16px',
    overflowX: 'auto', maxWidth: 700, margin: '0 auto',
  },
  sugBtn: {
    flexShrink: 0, padding: '8px 16px', fontSize: 13, fontWeight: 600,
    color: '#d4a843', background: 'rgba(212,168,67,0.08)',
    border: '1px solid rgba(212,168,67,0.2)', borderRadius: 999,
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  inputArea: {
    position: 'fixed', bottom: 60, left: 0, right: 0,
    background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '12px 16px',
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
  },
  inputRow: { display: 'flex', gap: 10, maxWidth: 700, margin: '0 auto', alignItems: 'center' },
  input: {
    flex: 1, padding: '12px 18px', fontSize: 14, fontFamily: 'inherit',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 999, color: '#fafafa', outline: 'none',
    transition: 'all 0.2s',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4a843, #e0b94f)',
    border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', flexShrink: 0,
  },
};
