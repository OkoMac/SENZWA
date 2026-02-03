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
  work: "South Africa has several work visa options: (1) General Work Visa - requires a confirmed job offer and proof no SA citizen can fill the role; (2) Critical Skills Visa - for professionals on the Critical Skills List, no job offer required; (3) Intra-Company Transfer - for employees being transferred within a multinational; (4) Corporate Visa - for companies bringing in multiple foreign workers.",
  business: "The Business Visa (Section 15) requires: minimum investment of R5 million, a detailed business plan, proof the business will benefit SA, registration with CIPC, and a letter from the DTI. The investment threshold may be reduced if the business is in a special economic zone or strategic sector.",
  study: "The Study Visa (Section 13) requires: acceptance letter from an accredited SA institution, proof of sufficient funds to cover tuition and living costs, medical insurance, and a police clearance. Students can work up to 20 hours/week during term time with an endorsement from DHA.",
  family: "Family visas include: Relative's Visa (Section 18) for dependents of SA citizens/PR holders, Spousal Visa for married partners, and Life Partner Visa for unmarried partners in a committed relationship. Requirements include proof of relationship (marriage certificate, affidavit), and the SA-based family member's status documents.",
  spousal: "The Spousal Visa (Section 11(6)) requires: marriage certificate, spouse's SA ID or valid visa/PR, joint affidavit of relationship, proof of joint assets or shared financial responsibility, and police clearance. Processing is typically 4-8 weeks. DHA may interview both parties to verify the relationship is genuine.",
  permanent: "Permanent Residence (PR) options include: Section 26(a) - work-based PR after 5 years on a work visa; Section 26(b) - spouse of SA citizen (after 5 years of marriage); Section 27(b) - extraordinary skills; Section 27(c) - business/investment (R5M+ investment); Section 27(d) - financially independent (R12M+ net worth). PR grants the right to live and work in SA indefinitely.",
  retired: "The Retired Persons Visa (Section 10) requires: proof of a guaranteed income of at least R37,000/month (or equivalent), medical insurance valid in SA, police clearance certificate, and a valid passport. This visa is renewable every 4 years. Popular among retirees from Europe and the UK seeking a warm climate.",
  tourist: "Tourist visas vary by nationality. Many countries (UK, US, EU, Australia) get 90-day visa-free entry. Others need a visa applied for at the nearest SA embassy. Required documents typically include: return ticket, proof of accommodation, proof of sufficient funds, and travel medical insurance. Extensions of up to 90 days are possible.",
  asylum: "Asylum seekers must apply in person at a Refugee Reception Office within 5 days of entering SA. You'll receive a Section 22 permit allowing you to work and study while your claim is processed. South Africa follows the 1951 UN Refugee Convention. Processing can take years due to backlogs, but permits are renewable.",
  remote: "Remote workers can enter on a tourist visa (90 days visa-free for eligible countries) or apply for a visitor's visa. South Africa does not have a dedicated digital nomad visa yet, though proposals have been discussed. For stays over 90 days, consider a business visa or the new proposed remote work endorsement.",
  dha: "DHA (Department of Home Affairs) offices handle all visa applications within South Africa. Key offices: Pretoria (head office), Cape Town, Johannesburg, Durban, Port Elizabeth, Bloemfontein. Applications from outside SA go through VFS Global centres in your home country. The DHA website is www.dha.gov.za.",
  vfs: "VFS Global manages visa applications for SA from outside the country. They operate in 90+ countries. Services include appointment booking, document submission, biometric capture, and courier delivery. VFS charges a separate service fee on top of DHA fees. Book appointments early as slots fill quickly.",
  saqa: "SAQA (South African Qualifications Authority) evaluates foreign qualifications to determine their SA equivalence. Required for most work visas and permanent residence. Apply online at www.saqa.org.za. Processing takes 4-8 weeks. You'll need certified copies of your degree certificates, transcripts, and ID.",
  professional: "Professional body registration is required for regulated professions in SA. Key bodies: ECSA (engineering), HPCSA (health professionals), SACNASP (natural scientists), LSSA (law), SACAA (aviation), SACAP (architecture). Registration requirements vary but typically include: SAQA evaluation, proof of qualification, work experience, and competency assessments.",
  police: "Police clearance certificates are required from every country you've lived in for 12+ months in the past 10 years. In SA, apply through SAPS Criminal Record Centre. Processing: 2-4 weeks domestically, 4-12 weeks for foreign clearances. FBI clearances (US) take 12-18 weeks. Plan ahead as expired clearances (older than 6 months) are not accepted.",
  medical: "Medical and radiological reports are required for most visa applications. Must be done by a registered medical practitioner and radiologist. The medical report certifies you're free from contagious diseases. The radiological (chest X-ray) report screens for tuberculosis. Both must be dated within 6 months of your application. DHA Form BI-811 is used.",
  invest: "Investment-based visas include: Business Visa (R5M minimum investment), and Section 27(c) PR for established businesses. The financially independent PR (Section 27(d)) requires R12M+ net worth. SA offers incentives through the DTI, special economic zones, and sector-specific programmes. The Johannesburg Stock Exchange is Africa's largest.",
  appeal: "If your visa is refused, you can: (1) Appeal the decision within 10 working days by submitting DHA Form BI-1740; (2) Apply for a special dispensation from the Director-General; (3) Reapply with improved documentation addressing the reasons for refusal. Common rejection reasons include incomplete documents, insufficient funds, and failure to meet specific visa criteria.",
  renewal: "Visa renewals should be submitted at least 60 days before expiry. Apply at your nearest DHA office within SA. Required: current visa, passport, completed BI-1739 form, and documents supporting the visa category. If your renewal is submitted before expiry, you can remain in SA legally until a decision is made, even if your current visa expires.",
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('critical skill') || lower.includes('scarce skill')) return AI_RESPONSES.critical;
  if (lower.includes('spous') || lower.includes('married') || lower.includes('husband') || lower.includes('wife')) return AI_RESPONSES.spousal;
  if (lower.includes('family') || lower.includes('relative') || lower.includes('partner') || lower.includes('dependent')) return AI_RESPONSES.family;
  if (lower.includes('permanent') || lower.includes(' pr ') || lower.match(/\bpr\b/)) return AI_RESPONSES.permanent;
  if (lower.includes('retire') || lower.includes('pension')) return AI_RESPONSES.retired;
  if (lower.includes('tourist') || lower.includes('visit') || lower.includes('holiday') || lower.includes('travel')) return AI_RESPONSES.tourist;
  if (lower.includes('study') || lower.includes('student') || lower.includes('university') || lower.includes('college')) return AI_RESPONSES.study;
  if (lower.includes('business') || lower.includes('entrepreneur') || lower.includes('start a company')) return AI_RESPONSES.business;
  if (lower.includes('asylum') || lower.includes('refugee')) return AI_RESPONSES.asylum;
  if (lower.includes('remote') || lower.includes('digital nomad') || lower.includes('freelance')) return AI_RESPONSES.remote;
  if (lower.includes('work') || lower.includes('employ') || lower.includes('job')) return AI_RESPONSES.work;
  if (lower.includes('invest') || (lower.includes('financial') && lower.includes('independent'))) return AI_RESPONSES.invest;
  if (lower.includes('saqa') || (lower.includes('qualification') && lower.includes('evaluat'))) return AI_RESPONSES.saqa;
  if (lower.includes('professional bod') || lower.includes('ecsa') || lower.includes('hpcsa') || lower.includes('registration')) return AI_RESPONSES.professional;
  if (lower.includes('police clearance') || lower.includes('criminal record') || lower.includes('background check')) return AI_RESPONSES.police;
  if (lower.includes('medical') || lower.includes('x-ray') || lower.includes('radiolog') || lower.includes('health report')) return AI_RESPONSES.medical;
  if (lower.includes('dha') || lower.includes('home affairs') || lower.includes('office')) return AI_RESPONSES.dha;
  if (lower.includes('vfs') || lower.includes('embassy') || lower.includes('consulate')) return AI_RESPONSES.vfs;
  if (lower.includes('appeal') || lower.includes('refuse') || lower.includes('reject') || lower.includes('denied')) return AI_RESPONSES.appeal;
  if (lower.includes('renew') || lower.includes('extend') || lower.includes('expir')) return AI_RESPONSES.renewal;
  if (lower.includes('document') || lower.includes('passport') || lower.includes('paper')) return AI_RESPONSES.documents;
  if (lower.includes('fee') || lower.includes('cost') || lower.includes('price') || lower.includes('pay') || lower.includes('how much')) return AI_RESPONSES.fees;
  if (lower.includes('time') || lower.includes('how long') || lower.includes('process') || lower.includes('wait') || lower.includes('duration')) return AI_RESPONSES.timeline;
  if (lower.includes('eligible') || lower.includes('qualify') || lower.includes('can i')) return AI_RESPONSES.eligibility;
  if (lower.includes('visa') || lower.includes('permit') || lower.includes('category')) return AI_RESPONSES.visa;
  return AI_RESPONSES.default;
}

function getSuggestions(lastResponse) {
  if (!lastResponse) return ['What visa do I need?', 'Critical Skills list', 'Required documents', 'Processing times'];
  if (lastResponse === AI_RESPONSES.critical) return ['SAQA evaluation', 'Professional bodies', 'Processing times', 'Required documents'];
  if (lastResponse === AI_RESPONSES.work) return ['Critical Skills visa', 'General Work requirements', 'SAQA evaluation', 'Fees & costs'];
  if (lastResponse === AI_RESPONSES.business) return ['Investment requirements', 'Required documents', 'Fees & costs', 'Processing times'];
  if (lastResponse === AI_RESPONSES.permanent) return ['Work-based PR', 'Financially independent PR', 'Spousal visa', 'Processing times'];
  if (lastResponse === AI_RESPONSES.family || lastResponse === AI_RESPONSES.spousal) return ['Required documents', 'Processing times', 'Permanent residence', 'Appeal process'];
  if (lastResponse === AI_RESPONSES.documents) return ['Police clearance', 'Medical reports', 'SAQA evaluation', 'Fees & costs'];
  if (lastResponse === AI_RESPONSES.fees) return ['Processing times', 'VFS Global centres', 'Required documents', 'DHA offices'];
  if (lastResponse === AI_RESPONSES.appeal) return ['Visa renewal', 'Required documents', 'DHA offices', 'Eligibility check'];
  if (lastResponse === AI_RESPONSES.study) return ['Study visa documents', 'Fees & costs', 'Work while studying', 'Permanent residence'];
  if (lastResponse === AI_RESPONSES.tourist) return ['Visa-free countries', 'Required documents', 'Remote work in SA', 'Extend my stay'];
  return ['Visa categories', 'Required documents', 'Fees & costs', 'Processing times'];
}

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: "Welcome to Senzwa AI. I'm here to help you navigate South African immigration. Ask me about visa categories, eligibility, documents, fees, or processing times.", time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState(null);
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
      const response = getAIResponse(text);
      const aiMsg = { id: Date.now() + 1, from: 'ai', text: response, time: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setLastAIResponse(response);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const suggestions = getSuggestions(lastAIResponse);

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

      {/* Quick suggestions - show after each AI response */}
      {!typing && (
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
          <button onClick={() => send()} disabled={!input.trim()} style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.4 }}>
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
