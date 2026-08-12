import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Users, 
  Target, 
  TrendingUp, 
  Settings, 
  Search, 
  Command, 
  Bell, 
  ChevronRight, 
  X, 
  Layers
} from 'lucide-react';

export default function AuthenticatedAppShell({ 
  currentView = 'dashboard', 
  onNavigate, 
  children,
  onOpenCommandPalette,
  onSignOut
}) {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showAiAssistantDrawer, setShowAiAssistantDrawer] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    { sender: 'ai', text: "Hello! I'm your Lumina Career Copilot. How can I help prepare your resume or hiring panel today?" }
  ]);

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'studio', label: 'Resume Studio' },
    { id: 'panel', label: 'Hiring Panel' },
    { id: 'jdmatch', label: 'JD Match' },
    { id: 'journey', label: 'Career Journey' }
  ];

  const contextualSubNavs = {
    studio: [
      { id: 'overview', label: 'Overview' },
      { id: 'editor', label: 'Editor' },
      { id: 'history', label: 'Version History' },
      { id: 'templates', label: 'Templates' },
      { id: 'export', label: 'Export' }
    ],
    panel: [
      { id: 'review', label: 'Review' },
      { id: 'consensus', label: 'Consensus' },
      { id: 'feedback', label: 'Feedback' },
      { id: 'questions', label: 'Questions' },
      { id: 'versions', label: 'Versions' }
    ],
    jdmatch: [
      { id: 'analysis', label: 'Analysis' },
      { id: 'skills', label: 'Skills' },
      { id: 'gaps', label: 'Gaps' },
      { id: 'recommendations', label: 'Recommendations' }
    ]
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userText = aiMessage;
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setAiMessage('');

    setTimeout(() => {
      setAiChatHistory(prev => [
        ...prev, 
        { sender: 'ai', text: `Analyzing "${userText}". Recommendation: Front-load quantifiable metrics (+18% callback rate).` }
      ]);
    }, 1000);
  };

  const activeSubNavList = contextualSubNavs[currentView];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-light)', color: 'var(--color-text-dark)', fontFamily: 'var(--font-body)' }}>
      
      {/* ==================== PRIMARY TOP NAVIGATION ==================== */}
      <header className="navbar-wrapper" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container navbar-container" style={{ maxWidth: 1280, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="navbar-brand" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div className="navbar-logo-icon">
              <Layers size={18} strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--color-teal-dark)', letterSpacing: '-0.02em' }}>
              LUMINA AI
            </span>
          </div>

          {/* Primary Top Navigation Links */}
          <nav>
            <ul style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0 }}>
              {primaryNavItems.map((item) => {
                const isActive = currentView === item.id || (currentView === 'analysis' && item.id === 'studio');
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setActiveSubTab(0);
                      }}
                      style={{
                        background: isActive ? 'var(--color-cyan-light)' : 'transparent',
                        color: isActive ? 'var(--color-teal-dark)' : '#64748B',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.9rem',
                        padding: '8px 16px',
                        borderRadius: 12,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right-Side Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
            {/* Global Search / Command Palette (⌘K) */}
            <button 
              onClick={onOpenCommandPalette}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: 12,
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              <Search size={14} />
              <span>Search...</span>
              <kbd style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800, color: '#334155' }}>
                ⌘K
              </kbd>
            </button>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                aria-label="Notifications"
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-teal-dark)', position: 'relative' }}
              >
                <Bell size={18} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }}></span>
              </button>

              {showNotificationsDropdown && (
                <div style={{ position: 'absolute', top: 46, right: 0, width: 320, background: '#FFFFFF', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0', padding: 16, zIndex: 200, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--color-teal-dark)' }}>Notifications</span>
                    <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '2px 6px', borderRadius: 6, fontWeight: 800 }}>3 New</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: '0.8rem', padding: 8, background: '#F8FAFC', borderRadius: 8, borderLeft: '3px solid #10B981' }}>
                      <strong>Hiring Panel Ready:</strong> Google SWE Intern panel review complete.
                    </div>
                    <div style={{ fontSize: '0.8rem', padding: 8, background: '#F8FAFC', borderRadius: 8, borderLeft: '3px solid #38E8F5' }}>
                      <strong>AI Insight:</strong> Quantify project metrics (+18% impact).
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Button */}
            <button 
              onClick={() => setShowAiAssistantDrawer(!showAiAssistantDrawer)}
              className="btn-cyan-pill"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Sparkles size={14} />
              <span>AI Assistant</span>
            </button>

            {/* User Avatar & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div 
                onClick={() => onNavigate('settings')} 
                title="Account Settings"
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-teal-dark)', color: '#38E8F5', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', border: '2px solid #38E8F5', cursor: 'pointer' }}
              >
                AS
              </div>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  style={{
                    background: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: 10,
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ==================== LIGHTWEIGHT CONTEXTUAL SUB-NAVIGATION BAR ==================== */}
        {activeSubNavList && (
          <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '8px 0' }}>
            <div className="container" style={{ maxWidth: 1280, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
              {activeSubNavList.map((sub, idx) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(idx)}
                  style={{
                    background: activeSubTab === idx ? '#F1F5F9' : 'transparent',
                    color: activeSubTab === idx ? 'var(--color-teal-dark)' : '#64748B',
                    fontWeight: activeSubTab === idx ? 800 : 600,
                    fontSize: '0.82rem',
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ==================== RECLAIMED FULL CANVAS VIEWPORT ==================== */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg-light)', width: '100%' }}>
        {children}
      </main>

      {/* ==================== FLOATING AI ASSISTANT DRAWER ==================== */}
      {showAiAssistantDrawer && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, width: 380, height: 480, background: '#FFFFFF', borderRadius: 24, boxShadow: '0 25px 60px rgba(0,0,0,0.25)', border: '1.5px solid #38E8F5', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden' }}>
          
          {/* Drawer Header */}
          <div style={{ background: '#032D30', color: '#FFFFFF', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 800, color: '#38E8F5' }}>
              <Sparkles size={16} /> Lumina AI Career Copilot
            </div>
            <button onClick={() => setShowAiAssistantDrawer(false)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', background: '#F8FAFC' }}>
            {aiChatHistory.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: msg.sender === 'user' ? '#032D30' : '#FFFFFF', color: msg.sender === 'user' ? '#FFFFFF' : '#334155', padding: '10px 14px', borderRadius: 16, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0' }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} style={{ padding: 12, background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              placeholder="Ask Lumina AI anything..." 
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.85rem', fontFamily: 'inherit' }}
            />
            <button type="submit" className="btn-cyan-pill" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
              Send
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
