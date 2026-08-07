import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsGrid() {
  return (
    <section className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="container">
        
        <div className="testimonials-header">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--color-text-dark)', marginBottom: 16 }}>
            TRUSTED BY CANDIDATES WHO<br />
            <span style={{ color: 'var(--color-teal-dark)' }}>LAND TOP INTERVIEWS</span>
          </h2>
          <p style={{ maxWidth: 580, margin: '0 auto' }}>
            Empowering students and job seekers to transform resume feedback into interview confidence.
          </p>
        </div>

        <div className="testimonials-grid">
          {/* Metric Stat Box Column */}
          <div className="testimonial-stat-box" style={{ background: '#F9F9FB' }}>
            <div>
              <div style={{ display: 'flex', gap: 4, color: '#F5BB27', marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <div className="stat-number">10k+</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 12 }}>
                Successful Interviews
              </div>
              <p style={{ fontSize: '0.95rem', color: '#6B7280' }}>
                Students targeting Google, Microsoft, Amazon, Adobe, Atlassian, and Stripe.
              </p>
            </div>

            <div style={{ paddingTop: 24, borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-teal-dark)' }}>Candidate Satisfaction</span>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-teal-dark)' }}>4.9 / 5.0</span>
            </div>
          </div>

          {/* 4 Colorful Testimonial Cards (Same Layout, Shadows, Spacing) */}
          <div className="testimonial-cards-subgrid">
            
            {/* Card 1: Dark Brown */}
            <div className="test-card test-card-brown">
              <div>
                <Quote size={24} style={{ opacity: 0.5, marginBottom: 12 }} />
                <p style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5 }}>
                  "I landed my first internship."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5BB27', color: '#2F0D02', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  AY
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Alex Y.</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Software Engineering Intern</div>
                </div>
              </div>
            </div>

            {/* Card 2: Light Lavender */}
            <div className="test-card test-card-lavender">
              <div>
                <Quote size={24} style={{ opacity: 0.5, marginBottom: 12 }} />
                <p style={{ color: '#0C0F0F', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5 }}>
                  "I finally understood why recruiters rejected me."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#9877FF', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  MP
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Maya P.</div>
                  <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>Computer Science Graduate</div>
                </div>
              </div>
            </div>

            {/* Card 3: Dark Green */}
            <div className="test-card test-card-green">
              <div>
                <Quote size={24} style={{ opacity: 0.5, marginBottom: 12 }} />
                <p style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5 }}>
                  "The Hiring Panel felt like real interview feedback."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#38E8F5', color: '#032D30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  JL
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Jordan L.</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Frontend Candidate</div>
                </div>
              </div>
            </div>

            {/* Card 4: Light Peach */}
            <div className="test-card test-card-peach">
              <div>
                <Quote size={24} style={{ opacity: 0.5, marginBottom: 12 }} />
                <p style={{ color: '#0C0F0F', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5 }}>
                  "Lumina transformed my resume and confidence completely."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2F0D02', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                  SK
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Sam K.</div>
                  <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>Systems Engineering Applicant</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
