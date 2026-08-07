import React from 'react';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

export default function FooterCTA({ navigateToView }) {
  return (
    <section className="container" style={{ padding: '60px 0 0 0' }}>
      <div className="footer-cta-wrapper">
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(56, 232, 245, 0.15)', color: '#38E8F5', fontSize: '0.8rem', fontWeight: 800, marginBottom: 24 }}>
          <Sparkles size={14} /> YOUR AI CAREER COPILOT IS READY
        </div>

        {/* Requirement 10: Emotional Close Headline */}
        <h2 className="footer-cta-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}>
          Ready to meet your Hiring Panel?
        </h2>

        {/* Requirement 10: Subheadline */}
        <p style={{ color: '#A5C9CC', fontSize: '1.25rem', maxWidth: 580, margin: '0 auto 40px auto', lineHeight: 1.5 }}>
          Your next interview starts with one upload.
        </p>

        {/* Dual Primary & Secondary CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigateToView ? navigateToView('studio') : null} 
            className="btn-cyan-pill" 
            style={{ padding: '16px 36px', fontSize: '1.05rem', cursor: 'pointer' }}
          >
            <Play size={16} fill="currentColor" />
            <span>Analyze My Resume</span>
          </button>

          <button 
            onClick={() => navigateToView ? navigateToView('panel') : null} 
            className="btn-secondary-pill" 
            style={{ padding: '16px 36px', fontSize: '1.05rem', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' }}
          >
            <span>Watch Live Demo</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
