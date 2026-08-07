import React from 'react';

export function StatCard({ label, value, subtext, icon, accentColor = '#38E8F5', style = {} }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        textAlign: 'left',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        {icon && <div style={{ color: accentColor }}>{icon}</div>}
      </div>

      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 4 }}>
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
