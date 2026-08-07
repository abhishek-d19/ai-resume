import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: "Student",
      price: "$0",
      period: "Free forever",
      description: "Essential AI resume parsing and baseline metric extraction for students.",
      features: [
        "Full Resume Parsing & Skill Extraction",
        "1 Simulated Hiring Panel Review / mo",
        "ATS Keyword Compatibility Score",
        "Basic Bullet Point Suggestions"
      ],
      popular: false,
      cta: "GET STARTED FREE",
      buttonStyle: "btn-secondary-pill"
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Unlimited AI Hiring Panel simulations, JD match, and executive rewrites.",
      features: [
        "Unlimited AI Hiring Panel Simulations",
        "Executive Bullet Metric Rewrite Engine",
        "Target Role JD Match Analysis",
        "Export Resume v2 (ATS Verified)",
        "Daily 6-min Career Missions"
      ],
      popular: true,
      cta: "START PRO TRIAL",
      buttonStyle: "btn-cyan-pill"
    },
    {
      name: "University",
      price: "Custom",
      period: "per institution",
      description: "Enterprise platform for career centers, bootcamps, and universities.",
      features: [
        "Cohort & Student Analytics Dashboard",
        "Custom Institutional Hiring Panels",
        "Dedicated Career Advisor Portal",
        "SSO & Bulk Student Onboarding",
        "Priority Support & SLA"
      ],
      popular: false,
      cta: "CONTACT SALES",
      buttonStyle: "btn-teal-pill"
    }
  ];

  return (
    <section id="pricing" className="section-padding" style={{ background: '#F9F9FB', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(56, 232, 245, 0.15)', color: 'var(--color-teal-dark)', fontSize: '0.8rem', fontWeight: 800, marginBottom: 16 }}>
            <Sparkles size={14} /> TRANSPARENT PRICING
          </div>
          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: 'var(--color-text-dark)', letterSpacing: '-0.03em' }}>
            INVEST IN YOUR CAREER
          </h2>
          <p style={{ maxWidth: 540, margin: '12px auto 0 auto', fontSize: '1.1rem', color: '#6B7280' }}>
            Choose the right plan to unlock interview readiness and executive resume confidence.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
          {plans.map((p, idx) => (
            <div 
              key={idx}
              style={{ 
                background: p.popular ? '#032D30' : '#FFFFFF',
                color: p.popular ? '#FFFFFF' : 'var(--color-text-dark)',
                borderRadius: 24,
                padding: 36,
                border: p.popular ? '2px solid #38E8F5' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: p.popular ? '0 25px 50px rgba(3,45,48,0.25)' : '0 10px 25px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.3s ease'
              }}
            >
              <div>
                {p.popular && (
                  <span style={{ position: 'absolute', top: -14, right: 24, background: '#38E8F5', color: '#032D30', fontSize: '0.75rem', fontWeight: 900, padding: '4px 14px', borderRadius: 12, textTransform: 'uppercase' }}>
                    MOST POPULAR
                  </span>
                )}

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: p.popular ? '#FFFFFF' : 'var(--color-teal-dark)' }}>
                  {p.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                  <span style={{ fontSize: '2.75rem', fontWeight: 900, color: p.popular ? '#38E8F5' : 'var(--color-teal-dark)' }}>
                    {p.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: p.popular ? '#9CA3AF' : '#6B7280' }}>
                    {p.period}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: p.popular ? '#D1D5DB' : '#6B7280', marginBottom: 28, lineHeight: 1.5 }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: p.popular ? '#E5E7EB' : '#374151' }}>
                      <Check size={16} style={{ color: p.popular ? '#38E8F5' : '#10B981', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a 
                href="#signup" 
                className={p.buttonStyle} 
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  padding: '14px', 
                  fontSize: '0.9rem' 
                }}
              >
                <span>{p.cta}</span>
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
