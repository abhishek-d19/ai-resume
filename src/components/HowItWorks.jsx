import React, { useState } from 'react';
import { Upload, Users, Download, CheckCircle2, FileText, ArrowRight, Check } from 'lucide-react';

export default function HowItWorks() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="section-padding" style={{ background: '#F9F9FB', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        {/* Header */}
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginBottom: 60, color: 'var(--color-text-dark)' }}>
          HOW LUMINA WORKS
        </h2>

        {/* Exactly Three Cards Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          
          {/* CARD 1: Upload Resume */}
          <div 
            onClick={() => setActiveCard(0)}
            style={{ 
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 36,
              border: activeCard === 0 ? '2px solid var(--color-cyan-primary)' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: activeCard === 0 ? '0 20px 40px rgba(0,0,0,0.08)' : '0 10px 25px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Upload size={24} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 12 }}>
                Upload Resume
              </h3>

              <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: 24 }}>
                Parse and extract core engineering metrics, technologies, and achievements instantly.
              </p>

              {/* Small Illustration Graphic */}
              <div style={{ background: '#F9FAFB', border: '1px dashed #CBD5E1', borderRadius: 16, padding: 20, textAlign: 'center', marginBottom: 24 }}>
                <FileText size={32} style={{ color: 'var(--color-teal-dark)', margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Software_Engineer_CV.pdf</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>1.2 MB • PDF Document</div>
              </div>
            </div>

            {/* State Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} />
              <span>Resume uploaded.</span>
            </div>
          </div>

          {/* CARD 2: AI Hiring Panel */}
          <div 
            onClick={() => setActiveCard(1)}
            style={{ 
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 36,
              border: activeCard === 1 ? '2px solid #9877FF' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: activeCard === 1 ? '0 20px 40px rgba(152,119,255,0.12)' : '0 10px 25px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: '#F3E8FF', color: '#7E22CE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Users size={24} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 12 }}>
                AI Hiring Panel
              </h3>

              <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: 20 }}>
                Simulate executive interviewers analyzing your resume from multiple perspectives.
              </p>

              {/* Panel Executive Feedback */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: '#F9FAFB', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>👩 Sarah</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>Strong Technical Foundation</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: '#F9FAFB', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>👨 David</span>
                  <span style={{ color: '#D97706', fontWeight: 600 }}>Needs System Metrics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: '#F9FAFB', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>👩 Emma</span>
                  <span style={{ color: '#059669', fontWeight: 600 }}>Approved</span>
                </div>
              </div>
            </div>

            {/* Badge Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '10px 16px', borderRadius: 12, background: '#F3E8FF', color: '#6B21A8', fontWeight: 800, fontSize: '0.85rem' }}>
              <span>Panel Alignment</span>
              <span style={{ background: '#7E22CE', color: '#FFF', padding: '2px 8px', borderRadius: 6 }}>Consensus</span>
            </div>
          </div>

          {/* CARD 3: Export Interview Ready Resume */}
          <div 
            onClick={() => setActiveCard(2)}
            style={{ 
              background: '#FFFFFF',
              borderRadius: 24,
              padding: 36,
              border: activeCard === 2 ? '2px solid #F5BB27' : '1px solid rgba(0,0,0,0.06)',
              boxShadow: activeCard === 2 ? '0 20px 40px rgba(245,187,39,0.15)' : '0 10px 25px rgba(0,0,0,0.03)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Download size={24} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 12 }}>
                Export Interview Ready Resume
              </h3>

              <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: 24 }}>
                Generate tailored, executive-approved resume v2 ready for high-conversion applications.
              </p>

              {/* Visual: Resume v2 */}
              <div style={{ background: 'linear-gradient(135deg, #032D30, #002B2E)', color: '#FFF', borderRadius: 16, padding: 20, textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38E8F5', textTransform: 'uppercase', marginBottom: 4 }}>
                  FINAL EXECUTIVE DRAFT
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Resume v2</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 }}>ATS Score: 98/100</div>
              </div>
            </div>

            {/* Action / Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 12, background: 'var(--color-teal-dark)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={14} style={{ color: '#38E8F5' }} /> Download
              </span>
              <span style={{ color: '#38E8F5' }}>Done.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
