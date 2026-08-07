import React, { useState, useEffect } from 'react';
import { Search, FileText, Sparkles, Download, History, Users, Target, Check, Command, X } from 'lucide-react';

export default function CommandPaletteModal({ isOpen, onClose, navigateToView, onSave, onExport, onAnalyze }) {
  const [query, setQuery] = useState('');
  const [activeToast, setActiveToast] = useState(null);

  const actions = [
    {
      id: 'search',
      title: 'Open Search / Command Palette',
      shortcut: '⌘ K',
      icon: <Search size={16} />,
      perform: () => {}
    },
    {
      id: 'save',
      title: 'Save Resume to Cloud',
      shortcut: '⌘ S',
      icon: <Check size={16} />,
      perform: () => {
        if (onSave) onSave();
        triggerToast("✓ Resume saved to cloud (⌘S)");
      }
    },
    {
      id: 'export',
      title: 'Export PDF Resume',
      shortcut: '⌘ E',
      icon: <Download size={16} />,
      perform: () => {
        if (onExport) onExport();
        triggerToast("📄 Opening PDF Export (⌘E)...");
      }
    },
    {
      id: 'analyze',
      title: 'Analyze Resume (AI Metric Scanner)',
      shortcut: '⌘ ⇧ A',
      icon: <Sparkles size={16} />,
      perform: () => {
        if (onAnalyze) onAnalyze();
        triggerToast("✨ Running AI Metric Scan (⌘⇧A)...");
      }
    },
    {
      id: 'studio',
      title: 'Open Resume Studio Workspace',
      shortcut: 'G S',
      icon: <FileText size={16} />,
      perform: () => {
        if (navigateToView) navigateToView('studio');
      }
    },
    {
      id: 'panel',
      title: 'Meet Executive Hiring Panel',
      shortcut: 'G P',
      icon: <Users size={16} />,
      perform: () => {
        if (navigateToView) navigateToView('panel');
      }
    },
    {
      id: 'jdmatch',
      title: 'Open JD Match Alignment Engine',
      shortcut: 'G J',
      icon: <Target size={16} />,
      perform: () => {
        if (navigateToView) navigateToView('jdmatch');
      }
    }
  ];

  const triggerToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const filteredActions = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.shortcut.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 1100, 
      background: 'rgba(3, 45, 48, 0.85)', 
      backdropFilter: 'blur(16px)', 
      display: 'flex', 
      alignItems: 'flex-start', 
      justifyContent: 'center', 
      paddingTop: '12vh', 
      paddingLeft: 20, 
      paddingRight: 20 
    }}>
      
      {activeToast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#032D30', color: '#38E8F5', border: '1px solid #38E8F5', padding: '12px 20px', borderRadius: 16, fontWeight: 800, fontSize: '0.85rem', zIndex: 1200, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          {activeToast}
        </div>
      )}

      <div style={{ 
        background: '#FFFFFF', 
        borderRadius: 24, 
        width: '100%', 
        maxWidth: 640, 
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', 
        overflow: 'hidden', 
        border: '1.5px solid #38E8F5',
        textAlign: 'left'
      }}>
        
        {/* Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <Search size={20} style={{ color: '#64748B' }} />
          <input 
            type="text" 
            autoFocus
            placeholder="Type a command or search shortcuts (⌘K)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-teal-dark)', fontFamily: 'inherit' }}
          />
          <button onClick={onClose} style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', padding: 6, cursor: 'pointer', color: '#64748B' }}>
            <X size={16} />
          </button>
        </div>

        {/* Action List */}
        <div style={{ padding: 12, maxHeight: 380, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px' }}>
            Keyboard Shortcuts & Commands
          </div>

          {filteredActions.map((act) => (
            <div 
              key={act.id}
              onClick={() => {
                act.perform();
                onClose();
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 16px', 
                borderRadius: 12, 
                cursor: 'pointer', 
                transition: 'all 0.15s ease',
                background: '#FFFFFF',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-cyan-light)';
                e.currentTarget.style.borderColor = 'rgba(56,232,245,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--color-teal-dark)' }}>{act.icon}</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-teal-dark)' }}>{act.title}</span>
              </div>

              <kbd style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 6, padding: '3px 8px', fontSize: '0.75rem', fontWeight: 800, color: '#475569', fontFamily: 'monospace' }}>
                {act.shortcut}
              </kbd>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 24px', background: '#F1F5F9', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B' }}>
          <span>Navigation: Use <kbd style={{ background: '#FFF', padding: '2px 6px', borderRadius: 4, border: '1px solid #CBD5E1' }}>esc</kbd> to exit</span>
          <span style={{ fontWeight: 700, color: 'var(--color-teal-dark)' }}>Pro Tip: Press ⌘+K anywhere to launch</span>
        </div>

      </div>
    </div>
  );
}
