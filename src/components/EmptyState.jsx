import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function EmptyState({ icon, title, description, ctaText, onCtaClick, accentColor = "#38E8F5" }) {
  return (
    <div style={{ 
      background: '#FFFFFF', 
      borderRadius: 24, 
      padding: '48px 32px', 
      textAlign: 'center', 
      border: '1px dashed #CBD5E1', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      maxWidth: 520,
      margin: '0 auto'
    }}>
      {/* Illustration Badge */}
      <div style={{ 
        width: 72, 
        height: 72, 
        borderRadius: 24, 
        background: 'var(--color-cyan-light)', 
        color: 'var(--color-teal-dark)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 20px auto',
        boxShadow: '0 10px 25px rgba(56, 232, 245, 0.25)',
        border: '1px solid rgba(56, 232, 245, 0.4)'
      }}>
        {icon}
      </div>

      {/* Message Title */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8, letterSpacing: '-0.02em' }}>
        {title}
      </h3>

      {/* Helpful Explanation */}
      <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: 28, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 28px auto' }}>
        {description}
      </p>

      {/* Single Clear CTA */}
      <button 
        onClick={onCtaClick} 
        className="btn-cyan-pill" 
        style={{ padding: '12px 28px', fontSize: '0.9rem' }}
      >
        <Sparkles size={16} />
        <span>{ctaText}</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
