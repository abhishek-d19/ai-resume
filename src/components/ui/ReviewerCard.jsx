import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from './Badge';

export function ReviewerCard({ reviewer, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected ? 'var(--color-cyan-light)' : '#FFFFFF',
        border: isSelected ? `2px solid ${reviewer.accent || 'var(--color-cyan-primary)'}` : '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 16,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? '0 10px 25px rgba(56,232,245,0.15)' : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>{reviewer.avatar}</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--color-teal-dark)' }}>{reviewer.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{reviewer.role}</div>
          </div>
        </div>
        <Badge variant={isSelected ? 'dark' : 'cyan'}>{reviewer.verdict}</Badge>
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: reviewer.accent || '#10B981', marginTop: 4 }}>
        {reviewer.confidence}
      </div>
    </div>
  );
}
