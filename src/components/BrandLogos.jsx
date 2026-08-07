import React from 'react';
import { Globe, ShieldCheck, Zap, Award, Target, Star } from 'lucide-react';

export default function BrandLogos() {
  const brands = [
    { name: 'Google', icon: <Target size={20} /> },
    { name: 'Microsoft', icon: <Zap size={20} /> },
    { name: 'Amazon', icon: <Globe size={20} /> },
    { name: 'Adobe', icon: <Award size={20} /> },
    { name: 'Atlassian', icon: <ShieldCheck size={20} /> },
    { name: 'Stripe', icon: <Star size={20} /> },
  ];

  return (
    <section style={{ padding: '48px 0', background: '#F9F9FB', borderTop: '1px solid #F3F4F6', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280' }}>
          Trusted by students targeting
        </p>
      </div>

      <div style={{ width: '100%', overflow: 'hidden', marginBottom: 24 }}>
        <div className="logo-marquee-track">
          {brands.concat(brands).map((b, idx) => (
            <div key={idx} className="brand-logo-item">
              {b.icon}
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.2rem', color: 'var(--color-teal-dark)' }}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-teal-dark)', letterSpacing: '-0.01em' }}>
          One platform. Every stage of your career.
        </p>
      </div>
    </section>
  );
}
