import React from 'react';
import { Command, Sparkles, Download, Save, Search } from 'lucide-react';

export default function KeyboardShortcutsFooterBar({ onOpenCommandPalette, onSave, onExport, onAnalyze }) {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 24, 
      right: 24, 
      zIndex: 890, 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8 
    }}>
      <button 
        onClick={onOpenCommandPalette} 
        style={{ 
          background: 'rgba(3, 45, 48, 0.92)', 
          backdropFilter: 'blur(12px)', 
          border: '1px solid #38E8F5', 
          borderRadius: 20, 
          padding: '8px 16px', 
          color: '#38E8F5', 
          fontSize: '0.8rem', 
          fontWeight: 800, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          transition: 'all 0.2s ease'
        }}
      >
        <Command size={14} />
        <span>Shortcuts</span>
        <kbd style={{ background: '#38E8F5', color: '#032D30', padding: '2px 6px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 900 }}>
          ⌘K
        </kbd>
      </button>
    </div>
  );
}
