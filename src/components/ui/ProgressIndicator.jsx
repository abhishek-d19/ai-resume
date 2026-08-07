import React from 'react';

export function ProgressIndicator({ percent = 0, label, subtext, style = {} }) {
  return (
    <div style={{ textAlign: 'left', width: '100%', ...style }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-teal-dark)' }}>
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}

      <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${percent}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #9877FF, #38E8F5)', 
            transition: 'width 0.6s ease' 
          }} 
        />
      </div>

      {subtext && (
        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
