import React, { useState } from 'react';
import { Target, ArrowLeftRight, CheckCircle2, AlertTriangle, Sparkles, Check, ArrowRight, FileText, Briefcase } from 'lucide-react';
import EmptyState from './EmptyState';
import PremiumLoader from './PremiumLoader';

export default function JDMatchEngine() {
  const [changesApplied, setChangesApplied] = useState(false);
  const [showEmptyJdMatch, setShowEmptyJdMatch] = useState(false);
  const [isLoadingJdMatch, setIsLoadingJdMatch] = useState(false);

  const matchingAreas = [
    { title: 'React & TypeScript Architecture', score: '98% Match' },
    { title: 'Design Systems & Component Libraries', score: '96% Match' },
    { title: 'Frontend Performance & TTI Tuning', score: '94% Match' }
  ];

  const missingSkills = [
    { skill: 'Distributed Caching (Redis/Memcached)', impact: 'Medium Gap' },
    { skill: 'GraphQL Federation Schema Specs', impact: 'Low Gap' }
  ];

  const suggestions = [
    { text: 'Add Redis caching metrics to Senior Engineer project bullet.', impact: '+4% Match Score' },
    { text: 'Highlight GraphQL schema federation experience in Skills section.', impact: '+2% Match Score' }
  ];

  const skillComparisons = [
    { name: 'React & TypeScript', percent: 95, status: 'Matched', variant: 'matched' },
    { name: 'Node.js Backend', percent: 35, status: 'Missing', variant: 'missing' },
    { name: 'AWS & Cloud Architecture', percent: 80, status: 'Matched', variant: 'matched' },
    { name: 'Docker & Containerization', percent: 55, status: 'Improve', variant: 'improve' }
  ];

  return (
    <section id="journey" className="section-padding" style={{ background: '#F9F9FB', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(152, 119, 255, 0.15)', color: '#7E22CE', fontSize: '0.8rem', fontWeight: 800, marginBottom: 16 }}>
            <Sparkles size={14} /> ROLE COMPETENCY ALIGNMENT
          </div>
          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: 'var(--color-teal-dark)', letterSpacing: '-0.03em' }}>
            JD MATCH ENGINE
          </h2>
          <p style={{ maxWidth: 580, margin: '12px auto 0 auto', fontSize: '1.1rem', color: '#6B7280' }}>
            Compare target job descriptions against your resume to identify skill coverage, fill gaps, and apply instant changes.
          </p>

          <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button 
              onClick={() => setIsLoadingJdMatch(true)}
              className="btn-cyan-pill"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Sparkles size={14} />
              <span>Simulate JD Alignment Scan</span>
            </button>

            <button 
              onClick={() => setShowEmptyJdMatch(!showEmptyJdMatch)}
              style={{ fontSize: '0.78rem', fontWeight: 700, padding: '6px 14px', borderRadius: 8, background: '#F1F5F9', border: '1px solid #CBD5E1', cursor: 'pointer', color: '#475569' }}
            >
              {showEmptyJdMatch ? "View JD Match Engine" : "Watch Analysis"}
            </button>
          </div>
        </div>

        {/* MAIN ENGINE WORKSPACE OR LOADER OR EMPTY STATE */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: 24, 
          border: '1px solid #E2E8F0', 
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08)',
          padding: 32,
          maxWidth: 1060,
          margin: '0 auto',
          textAlign: 'left'
        }}>

          {isLoadingJdMatch ? (
            <div style={{ padding: '32px 0' }}>
              <PremiumLoader 
                title="Job Description Alignment Scanner"
                messages={[
                  "Comparing against job description...",
                  "Analyzing skill coverage & missing keywords...",
                  "Generating AI alignment suggestions..."
                ]}
                onComplete={() => setIsLoadingJdMatch(false)}
              />
            </div>
          ) : showEmptyJdMatch ? (
            <div style={{ padding: '32px 0' }}>
              <EmptyState 
                icon={<Target size={32} />}
                title="Paste a job description."
                description="Compare target role job descriptions against your resume to identify skill coverage and missing keywords."
                ctaText="Paste Job Description"
                onCtaClick={() => setIsLoadingJdMatch(true)}
              />
            </div>
          ) : (
            <>

          {/* STEP 1: JOB DESCRIPTION ←→ RESUME COMPARISON HEADER */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 16, alignItems: 'center', marginBottom: 32 }}>
            
            {/* Left Box: Job Description */}
            <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 20, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                <Briefcase size={14} /> TARGET JOB DESCRIPTION
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-teal-dark)' }}>
                Senior Software Engineer @ Google
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>
                Requirements: React, TypeScript, Distributed Systems, Performance, GraphQL
              </div>
            </div>

            {/* Center Arrow Bridge */}
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-teal-dark)', color: '#38E8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 4px 12px rgba(3,45,48,0.25)' }}>
              <ArrowLeftRight size={20} />
            </div>

            {/* Right Box: Resume */}
            <div style={{ background: '#F8FAFC', borderRadius: 16, padding: 20, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                <FileText size={14} /> CANDIDATE RESUME
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-teal-dark)' }}>
                Abhishek_Sharma_Resume_v2.pdf
              </div>
              <div style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700, marginTop: 4 }}>
                ✓ Parsed & Ready for Alignment
              </div>
            </div>

          </div>

          {/* REQUIREMENT 6: ANIMATED SKILL COMPARISON BARS */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} style={{ color: '#10B981' }} /> COMPETENCY COVERAGE & ALIGNMENT
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 8, background: '#DCFCE7', color: '#15803D' }}>
                High Role Alignment
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {skillComparisons.map((sc, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-teal-dark)' }}>{sc.name}</span>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 800, 
                      padding: '2px 8px', 
                      borderRadius: 6,
                      background: sc.variant === 'matched' ? '#DCFCE7' : sc.variant === 'missing' ? '#FEE2E2' : '#FEF3C7',
                      color: sc.variant === 'matched' ? '#15803D' : sc.variant === 'missing' ? '#991B1B' : '#B45309'
                    }}>
                      {sc.status}
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${sc.percent}%`, 
                        height: '100%', 
                        background: sc.variant === 'matched' ? 'linear-gradient(90deg, #10B981, #38E8F5)' : sc.variant === 'missing' ? '#EF4444' : '#F59E0B',
                        borderRadius: 4,
                        transition: 'width 0.8s ease'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: MISSING SKILLS */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} /> Missing Skills
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {missingSkills.map((ms, idx) => (
                <div key={idx} style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: 12, border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#78350F' }}>{ms.skill}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#F59E0B', color: '#FFF', padding: '2px 8px', borderRadius: 6 }}>{ms.impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: SUGGESTIONS */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} style={{ color: '#38E8F5' }} /> AI Alignment Suggestions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {suggestions.map((sug, idx) => (
                <div key={idx} style={{ background: 'var(--color-cyan-light)', padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(56,232,245,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-teal-dark)' }}>
                    {idx + 1}. {sug.text}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'var(--color-teal-dark)', color: '#38E8F5', padding: '3px 10px', borderRadius: 8 }}>
                    {sug.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 5: APPLY CHANGES ACTION BUTTON */}
          <div style={{ paddingTop: 20, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-teal-dark)' }}>
                {changesApplied ? "✓ Alignment Changes Applied to Resume v2" : "Ready to Apply AI Suggestions?"}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                {changesApplied ? "Target match score increased from 94% to 98%." : "One-click auto-sync will enrich missing skill keywords."}
              </div>
            </div>

            <button 
              onClick={() => setChangesApplied(true)} 
              className="btn-cyan-pill" 
              style={{ padding: '14px 32px', fontSize: '0.95rem' }}
            >
              {changesApplied ? <Check size={16} /> : <Sparkles size={16} />}
              <span>{changesApplied ? "CHANGES APPLIED" : "APPLY CHANGES"}</span>
            </button>
          </div>
          </>
          )}
        </div>

      </div>
    </section>
  );
}
