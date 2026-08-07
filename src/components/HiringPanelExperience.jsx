import React, { useState } from 'react';
import { Users, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Award, MessageSquare, AlertCircle, TrendingUp, Check, Briefcase, UserCheck } from 'lucide-react';
import EmptyState from './EmptyState';
import PremiumLoader from './PremiumLoader';
import { Badge, Card, Button, ReviewerCard } from './ui';

export default function HiringPanelExperience() {
  const [selectedReviewer, setSelectedReviewer] = useState(0);
  const [showEmptyPanel, setShowEmptyPanel] = useState(false);
  const [isLoadingPanel, setIsLoadingPanel] = useState(false);

  const reviewers = [
    {
      id: 'sarah',
      name: 'Sarah',
      role: 'HR Recruiter',
      avatar: '👩‍💼',
      confidence: '94% High Confidence',
      strengths: [
        'Clear career progression timeline',
        'Strong computer science background',
        'Clean ATS-friendly formatting'
      ],
      feedback: 'Resume communicates core qualifications effectively, but needs stronger metric density for initial 6-second recruiter scans.',
      improvements: 'Front-load metric percentages in top 3 bullet points to double recruiter callback rate.',
      verdict: 'Hire',
      accent: '#38E8F5'
    },
    {
      id: 'david',
      name: 'David',
      role: 'Engineering Manager',
      avatar: '👨‍💻',
      confidence: '92% High Confidence',
      strengths: [
        'Cross-functional team leadership',
        'Agile execution & delivery',
        'System scaling track record'
      ],
      feedback: 'Demonstrates solid leadership, but backend system scaling metrics require explicit throughput figures.',
      improvements: 'Quantify team velocity gains and API latency reductions in the senior role experience section.',
      verdict: 'Strong Hire',
      accent: '#9877FF'
    },
    {
      id: 'emma',
      name: 'Emma',
      role: 'Hiring Manager',
      avatar: '👩‍🔬',
      confidence: '98% Very High Confidence',
      strengths: [
        'Product-minded engineering choices',
        'User-centric architecture',
        'Executive communication clarity'
      ],
      feedback: 'Exceptional alignment with staff product expectations. Recommend adding business outcome figures.',
      improvements: 'Highlight customer adoption stats alongside technical feature rollouts.',
      verdict: 'Strong Hire',
      accent: '#F5BB27'
    },
    {
      id: 'alex',
      name: 'Alex',
      role: 'Senior Software Engineer',
      avatar: '👨‍🔧',
      confidence: '96% High Confidence',
      strengths: [
        'Deep React & TypeScript mastery',
        'Design system architecture',
        'Performance & TTI tuning'
      ],
      feedback: 'Strong technical stack. Ensure state management choices are articulated with clear trade-offs.',
      improvements: 'Detail bundle size optimizations and TTI metrics for flagship web applications.',
      verdict: 'Hire',
      accent: '#10B981'
    }
  ];

  return (
    <section id="panel" className="section-padding" style={{ background: '#FFFFFF', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(56, 232, 245, 0.15)', color: 'var(--color-teal-dark)', fontSize: '0.8rem', fontWeight: 800, marginBottom: 16 }}>
            <Sparkles size={14} /> SIGNATURE EXECUTIVE EXPERIENCE
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
            <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: 'var(--color-text-dark)', letterSpacing: '-0.03em', margin: 0 }}>
              GOOGLE HIRING PANEL
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#032D30', color: '#38E8F5', padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800 }}>
              <Briefcase size={14} /> Target Role: Software Engineer
            </div>
          </div>

          {/* Requirement 3: Live Meeting Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 800, padding: '4px 12px', borderRadius: 12, background: '#DCFCE7', color: '#15803D' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></span>
              LIVE MEETING ONLINE
            </span>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '4px 12px', borderRadius: 12 }}>
              Meeting Started • 4 Executive Reviewers Present
            </span>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button 
              onClick={() => setIsLoadingPanel(true)}
              className="btn-cyan-pill"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Sparkles size={14} />
              <span>Simulate Live Review</span>
            </button>

            <button 
              onClick={() => setShowEmptyPanel(!showEmptyPanel)}
              style={{ fontSize: '0.78rem', fontWeight: 700, padding: '6px 14px', borderRadius: 8, background: '#F1F5F9', border: '1px solid #CBD5E1', cursor: 'pointer', color: '#475569' }}
            >
              {showEmptyPanel ? "View Hiring Panel" : "Interactive Demo"}
            </button>
          </div>
        </div>

        {/* MAIN PANEL CONTAINER OR LOADER OR EMPTY STATE */}
        <div style={{ 
          background: '#F9FAFB', 
          borderRadius: 24, 
          border: '1px solid #E2E8F0', 
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08)',
          padding: 32,
          maxWidth: 1120,
          margin: '0 auto'
        }}>

          {isLoadingPanel ? (
            <div style={{ padding: '32px 0' }}>
              <PremiumLoader 
                title="Executive Committee Live Review"
                messages={[
                  "Sarah is reviewing your projects...",
                  "David is reviewing backend scaling metrics...",
                  "Emma is evaluating product alignment...",
                  "Alex is checking React & TypeScript architecture..."
                ]}
                onComplete={() => setIsLoadingPanel(false)}
              />
            </div>
          ) : showEmptyPanel ? (
            <div style={{ padding: '32px 0' }}>
              <EmptyState 
                icon={<UserCheck size={32} />}
                title="Run analysis to meet your hiring panel."
                description="Simulate an executive committee review with HR recruiters, engineering managers, and tech leads."
                ctaText="Run Executive Analysis"
                onCtaClick={() => setIsLoadingPanel(true)}
              />
            </div>
          ) : (
            <>

          {/* REVIEWER TABS SELECTOR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
            {reviewers.map((rev, idx) => (
              <div 
                key={rev.id}
                onClick={() => setSelectedReviewer(idx)}
                style={{ 
                  background: selectedReviewer === idx ? '#FFFFFF' : '#F1F5F9',
                  border: selectedReviewer === idx ? `2px solid ${rev.accent}` : '1px solid #E2E8F0',
                  borderRadius: 16,
                  padding: 16,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: selectedReviewer === idx ? '0 10px 25px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.4rem' }}>{rev.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-teal-dark)' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{rev.role}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: rev.accent, display: 'flex', alignItems: 'center', justifyBetween: 'space-between', paddingTop: 8, borderTop: '1px solid #E2E8F0' }}>
                  <span>Verdict: {rev.verdict}</span>
                  <CheckCircle2 size={12} />
                </div>
              </div>
            ))}
          </div>

          {/* ACTIVE REVIEWER EXECUTIVE CARD */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: 20, 
            padding: 32, 
            border: `2px solid ${reviewers[selectedReviewer].accent}`, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            textAlign: 'left',
            marginBottom: 28
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-cyan-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  {reviewers[selectedReviewer].avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 2 }}>
                    {reviewers[selectedReviewer].name}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                    {reviewers[selectedReviewer].role} • Executive Reviewer
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}>
                <ShieldCheck size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{reviewers[selectedReviewer].confidence}</span>
              </div>
            </div>

            {/* Review Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              
              {/* Key Strengths */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} /> Key Strengths
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reviewers[selectedReviewer].strengths.map((str, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', padding: '10px 14px', borderRadius: 12, border: '1px solid #DCFCE7', fontSize: '0.88rem', color: '#14532D', fontWeight: 600 }}>
                      <Check size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constructive Feedback & Suggested Improvements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={16} /> Constructive Feedback
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', fontSize: '0.9rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{reviewers[selectedReviewer].feedback}"
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={16} /> Suggested Improvements
                  </div>
                  <div style={{ background: '#FEF3C7', padding: 14, borderRadius: 12, border: '1px solid #FDE68A', fontSize: '0.9rem', color: '#78350F', fontWeight: 600, lineHeight: 1.5 }}>
                    {reviewers[selectedReviewer].improvements}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* PANEL CONSENSUS BAR */}
          <div style={{ 
            background: 'linear-gradient(135deg, #032D30, #002B2E)', 
            color: '#FFFFFF', 
            borderRadius: 20, 
            padding: 28, 
            boxShadow: '0 20px 40px rgba(3,45,48,0.25)',
            border: '2px solid #38E8F5',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38E8F5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  PANEL EXECUTIVE SUMMARY
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  Panel Consensus
                </h3>
              </div>

              {/* Decision & Recruiter Confidence Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(56,232,245,0.15)', color: '#38E8F5', border: '1px solid rgba(56,232,245,0.3)', padding: '6px 14px', borderRadius: 12, fontSize: '0.82rem', fontWeight: 800 }}>
                  Recruiter Confidence: High
                </div>

                <div style={{ background: '#38E8F5', color: '#032D30', padding: '8px 24px', borderRadius: 12, fontSize: '1.1rem', fontWeight: 900 }}>
                  Decision: Hire
                </div>
              </div>
            </div>

            {/* Top Three Priorities */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A5C9CC', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                Top Three Priorities
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 10, fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>
                  1. Front-load quantifiable metrics (+35% TTI)
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 10, fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>
                  2. Emphasize React design system architecture
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 10, fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>
                  3. Add user adoption figures to project bullets
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-cyan-pill" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
                <Sparkles size={16} />
                <span>Apply Improvements</span>
              </button>

              <button className="btn-secondary-pill" style={{ padding: '12px 28px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.15)', color: '#FFF' }}>
                <span>Version Comparison</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
          </>
          )}

        </div>
      </div>
    </section>
  );
}
