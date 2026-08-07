import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export function Timeline({ steps = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {steps.map((st, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: st.completed ? '#DCFCE7' : st.active ? 'var(--color-cyan-light)' : '#F1F5F9', color: st.completed ? '#15803D' : st.active ? 'var(--color-teal-dark)' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: '0.8rem' }}>
            {st.completed ? <CheckCircle2 size={16} /> : idx + 1}
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-teal-dark)' }}>
              {st.title}
            </div>
            {st.description && (
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 2 }}>
                {st.description}
              </div>
            )}
          </div>
          {st.time && (
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {st.time}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
