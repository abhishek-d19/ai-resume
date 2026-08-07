import React from 'react';
import { Users, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function FeatureCards() {
  return (
    <section className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(152, 119, 255, 0.15)', color: '#7E22CE', fontSize: '0.8rem', fontWeight: 800, marginBottom: 16 }}>
            <Sparkles size={14} /> CORE DIFFERENTIATOR
          </div>
          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: 'var(--color-teal-dark)', letterSpacing: '-0.03em' }}>
            HIRING PANEL PREVIEW
          </h2>
          <p style={{ maxWidth: 580, margin: '12px auto 0 auto', fontSize: '1.1rem', color: '#6B7280' }}>
            Simulate an executive interview panel reviewing your resume in real-time with multi-perspective candidate evaluation.
          </p>
        </div>

        {/* Hiring Panel Preview Card (Same Card Style, Spacing, Shadows) */}
        <div className="feature-card-yellow" style={{ background: '#F5BB27', color: '#2F2302' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(47, 35, 2, 0.15)', fontSize: '0.8rem', fontWeight: 800, marginBottom: 20 }}>
              <Users size={14} /> EXECUTIVE SIMULATION
            </div>

            <h2 className="feature-card-title">
              SIMULATED HIRING PANEL
            </h2>

            <p style={{ color: '#3E3003', fontSize: '1.15rem', marginBottom: 32, maxWidth: 480 }}>
              Get honest, actionable feedback from engineering managers, staff tech leads, and VP interviewers before you submit your application.
            </p>

            <a href="#panel" className="btn-teal-pill" style={{ background: '#2F2302', color: '#FFF' }}>
              <span>TRY HIRING PANEL</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Panel Card Review Stack */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ 
              width: '100%', 
              maxWidth: 400, 
              background: '#FFFFFF', 
              borderRadius: 24, 
              padding: 28, 
              color: 'var(--color-text-dark)',
              boxShadow: '0 25px 50px rgba(47, 35, 2, 0.25)',
              border: '2px solid rgba(47, 35, 2, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Panel Feedback
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#DCFCE7', color: '#166534' }}>
                  Active Session
                </span>
              </div>

              {/* Review 1: Sarah */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>👩</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-teal-dark)' }}>Sarah</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>(Tech Lead)</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', paddingLeft: 28, margin: 0 }}>
                  "Projects lack measurable impact."
                </p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '14px 0' }} />

              {/* Review 2: David */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>👨</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-teal-dark)' }}>David</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>(Engineering Manager)</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', paddingLeft: 28, margin: 0 }}>
                  "Backend needs improvement."
                </p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '14px 0' }} />

              {/* Review 3: Emma */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>👩</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-teal-dark)' }}>Emma</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>(Product VP)</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', paddingLeft: 28, margin: 0 }}>
                  "Communication is excellent."
                </p>
              </div>

              {/* Consensus Result Box */}
              <div style={{ background: '#032D30', color: '#FFF', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>FINAL VERDICT</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFF' }}>Consensus</div>
                </div>
                <div style={{ background: '#38E8F5', color: '#032D30', fontWeight: 900, fontSize: '1.1rem', padding: '6px 18px', borderRadius: 10 }}>
                  Hire
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
