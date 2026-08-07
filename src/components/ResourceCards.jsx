import React from 'react';
import { ArrowRight, FileText, CheckCircle2, Users, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

export default function ResourceCards() {
  const steps = [
    { title: "Resume v1", desc: "Initial upload & baseline parsing", icon: <FileText size={20} />, badge: "STEP 1" },
    { title: "ATS Review", desc: "Keyword & parser compliance scan", icon: <CheckCircle2 size={20} />, badge: "STEP 2" },
    { title: "Hiring Panel", desc: "Simulated executive committee feedback", icon: <Users size={20} />, badge: "STEP 3" },
    { title: "Resume v2", desc: "AI metric density rewrite & boost", icon: <ShieldCheck size={20} />, badge: "STEP 4" },
    { title: "Interview Ready", desc: "Approved with 100% confidence", icon: <Trophy size={20} />, badge: "DESTINATION" }
  ];

  return (
    <section className="section-padding" style={{ background: '#F9F9FB', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(56, 232, 245, 0.15)', color: 'var(--color-teal-dark)', fontSize: '0.8rem', fontWeight: 800, marginBottom: 16 }}>
            <Sparkles size={14} /> SYSTEMATIC TIMELINE
          </div>
          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: 'var(--color-text-dark)', letterSpacing: '-0.03em' }}>
            CAREER JOURNEY
          </h2>
          <p style={{ maxWidth: 540, margin: '12px auto 0 auto', fontSize: '1.1rem', color: '#6B7280' }}>
            A structured, 5-stage transformation pipeline from draft resume to high-converting interview readiness.
          </p>
        </div>

        {/* Timeline Flow Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, position: 'relative' }}>
          {steps.map((st, idx) => (
            <div 
              key={idx}
              style={{ 
                background: idx === 4 ? 'linear-gradient(135deg, #032D30, #002B2E)' : '#FFFFFF',
                color: idx === 4 ? '#FFFFFF' : 'var(--color-text-dark)',
                borderRadius: 20,
                padding: 24,
                border: idx === 4 ? '2px solid #38E8F5' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: idx === 4 ? '0 20px 40px rgba(3,45,48,0.25)' : '0 10px 25px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    padding: '3px 8px', 
                    borderRadius: 8, 
                    background: idx === 4 ? '#38E8F5' : 'var(--color-cyan-light)', 
                    color: idx === 4 ? '#032D30' : 'var(--color-teal-dark)' 
                  }}>
                    {st.badge}
                  </span>
                  <div style={{ color: idx === 4 ? '#38E8F5' : 'var(--color-teal-dark)' }}>{st.icon}</div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: idx === 4 ? '#FFFFFF' : 'var(--color-teal-dark)' }}>
                  {st.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: idx === 4 ? '#9CA3AF' : '#6B7280', margin: 0, lineHeight: 1.4 }}>
                  {st.desc}
                </p>
              </div>

              {idx < 4 && (
                <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'var(--color-teal-dark)' }}>
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
