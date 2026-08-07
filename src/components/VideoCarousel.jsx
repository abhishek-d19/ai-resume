import React from 'react';
import { ShieldCheck, Target, Clock, ArrowRight, TrendingUp } from 'lucide-react';

export default function VideoCarousel() {
  return (
    <section className="section-padding" style={{ background: '#FFFFFF', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--color-text-dark)', marginBottom: 12 }}>
            CAREER CONFIDENCE & MISSIONS
          </h2>
          <p style={{ maxWidth: 540, margin: '0 auto', fontSize: '1.1rem', color: '#6B7280' }}>
            Daily targeted micro-missions designed to elevate candidate confidence and engineering impact.
          </p>
        </div>

        {/* Stats & Mission Box Grid (Same Card Style, Shadows, Spacing) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          
          {/* Box 1: Career Confidence */}
          <div style={{ 
            background: 'linear-gradient(135deg, #032D30, #002B2E)', 
            color: '#FFF', 
            borderRadius: 24, 
            padding: 36, 
            boxShadow: '0 20px 40px rgba(3,45,48,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid #38E8F5'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 12, background: 'rgba(56, 232, 245, 0.15)', color: '#38E8F5' }}>
                  CORE METRIC
                </span>
                <ShieldCheck size={24} style={{ color: '#38E8F5' }} />
              </div>

              <div style={{ fontSize: '0.9rem', color: '#A5C9CC', fontWeight: 700, marginBottom: 8 }}>
                Career Confidence
              </div>

              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 12 }}>
                High
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
              <TrendingUp size={16} /> 100% Interview Ready Confidence
            </div>
          </div>

          {/* Box 2: Today's Mission */}
          <div style={{ 
            background: '#FFFFFF', 
            color: 'var(--color-text-dark)', 
            borderRadius: 24, 
            padding: 36, 
            boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 12, background: 'rgba(152, 119, 255, 0.15)', color: '#7E22CE' }}>
                  DAILY FOCUS
                </span>
                <Target size={24} style={{ color: '#7E22CE' }} />
              </div>

              <div style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>
                Today's Mission
              </div>

              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-teal-dark)', lineHeight: 1.1, marginBottom: 12 }}>
                Improve React Project
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-teal-dark)', fontWeight: 700 }}>
              <span>Action: Executive Metric Diff</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Box 3: Estimated Time */}
          <div style={{ 
            background: '#FFFFFF', 
            color: 'var(--color-text-dark)', 
            borderRadius: 24, 
            padding: 36, 
            boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 12, background: 'rgba(245, 187, 39, 0.2)', color: '#B45309' }}>
                  TIME COMMITMENT
                </span>
                <Clock size={24} style={{ color: '#D97706' }} />
              </div>

              <div style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>
                Estimated Time
              </div>

              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-teal-dark)', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 12 }}>
                6 min
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#6B7280' }}>
              Optimized for busy engineers & students
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
