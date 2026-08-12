import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  MessageSquare, 
  AlertCircle, 
  TrendingUp, 
  Check, 
  Briefcase, 
  UserCheck,
  RefreshCw,
  ArrowLeft,
  Target,
  HelpCircle,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { hiringPanelServiceInstance } from '../services/HiringPanelService';
import PremiumLoader from './PremiumLoader';

export default function HiringPanelExperience({ 
  resumeId = 'res-1', 
  userId, 
  onNavigateToJdMatch, 
  onNavigateToStudio 
}) {
  const [selectedReviewer, setSelectedReviewer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [consensusData, setConsensusData] = useState(null);

  useEffect(() => {
    fetchPanelEvaluation();
  }, [resumeId, userId]);

  const fetchPanelEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await hiringPanelServiceInstance.getLatestHiringPanelResult(userId, resumeId);
      if (!data) {
        data = await hiringPanelServiceInstance.evaluateHiringPanel(userId, resumeId);
      }
      setConsensusData(data);
    } catch (err) {
      console.warn('[HiringPanelService Fetch Note]:', err?.message || err);
      try {
        const freshData = await hiringPanelServiceInstance.evaluateHiringPanel(userId, resumeId);
        setConsensusData(freshData);
      } catch (freshErr) {
        setError(freshErr?.message || 'Failed to generate hiring panel review.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    setError(null);
    try {
      const data = await hiringPanelServiceInstance.evaluateHiringPanel(userId, resumeId);
      setConsensusData(data);
    } catch (err) {
      console.error('[HiringPanelService Error]:', err?.message || err);
      setError(err?.message || 'Hiring panel evaluation failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const reviewersMeta = [
    { persona: 'ATS Specialist', name: 'Sarah Jenkins', role: 'ATS & Compliance Specialist', avatar: '👩‍💼', accent: '#0284C7' },
    { persona: 'Technical Hiring Manager', name: 'David Chen', role: 'Senior Engineering Manager', avatar: '👨‍💻', accent: '#8B5CF6' },
    { persona: 'HR Recruiter', name: 'Emma Watson', role: 'Executive HR Recruiter', avatar: '👩‍🔬', accent: '#F59E0B' }
  ];

  const activeReviewers = (consensusData?.reviewers && consensusData.reviewers.length === 3)
    ? consensusData.reviewers.map((rev, idx) => ({
        reviewerId: rev.persona || reviewersMeta[idx].persona,
        reviewerName: reviewersMeta[idx]?.name || rev.persona,
        role: reviewersMeta[idx]?.role || rev.persona,
        avatar: reviewersMeta[idx]?.avatar || '👨‍💼',
        verdict: rev.decision,
        confidence: rev.confidence,
        score: rev.score,
        reasoning: rev.summary,
        categoryScores: rev.categoryScores || [],
        strengths: rev.strengths || [],
        weaknesses: rev.weaknesses || [],
        concerns: rev.concerns || [],
        evidence: rev.evidence || [],
        recommendations: rev.recommendations || [],
        interviewQuestions: rev.interviewQuestions || [],
        accent: reviewersMeta[idx]?.accent || '#0284C7'
      }))
    : [];

  return (
    <section id="panel" style={{ padding: '40px 20px 140px 20px', background: '#F8FAFC', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: '#E0F2FE', color: '#0369A1', fontSize: '0.8rem', fontWeight: 800, marginBottom: 14 }}>
            <Sparkles size={14} /> REAL AI HIRING COMMITTEE ENGINE
          </div>
          
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', margin: '0 0 10px 0' }}>
            Executive Hiring Committee Panel
          </h2>
          <p style={{ maxWidth: 640, margin: '0 auto', fontSize: '0.95rem', color: '#64748B', lineHeight: 1.5 }}>
            Three distinct professional personas evaluating the candidate resume using evidence-first rubric scoring.
          </p>

          <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleRunEvaluation}
              disabled={evaluating}
              style={{
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 20,
                padding: '10px 24px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <RefreshCw size={14} className={evaluating ? 'animate-spin' : ''} />
              <span>{evaluating ? 'Evaluating...' : 'Re-Run Hiring Panel'}</span>
            </button>

            {onNavigateToStudio && (
              <button 
                onClick={onNavigateToStudio}
                style={{ fontSize: '0.85rem', fontWeight: 700, padding: '10px 20px', borderRadius: 20, background: '#FFFFFF', border: '1px solid #CBD5E1', cursor: 'pointer', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={15} /> Edit Resume
              </button>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        {loading || evaluating ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <PremiumLoader 
              title="Executive Hiring Committee Meeting in Session..."
              messages={[
                "Reviewer 1 (ATS Specialist) scanning parseability & terminology...",
                "Reviewer 2 (Engineering Manager) evaluating technical depth & impact...",
                "Reviewer 3 (HR Recruiter) assessing narrative & shortlist fit...",
                "Consensus Engine aggregating committee scores & evidence..."
              ]}
              onComplete={() => {}}
            />
          </div>
        ) : error ? (
          <div style={{ maxWidth: 560, margin: '40px auto', padding: 28, background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: 20, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <AlertCircle size={36} style={{ color: '#DC2626', margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Panel Evaluation Couldn't Be Generated</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20, lineHeight: 1.5 }}>{error}</p>
            <button onClick={handleRunEvaluation} style={{ padding: '10px 24px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
              Retry Panel Evaluation
            </button>
          </div>
        ) : (
          <>
            {/* COMMITTEE CONSENSUS HERO CARD */}
            <div style={{ 
              background: '#0B192C', 
              color: '#FFFFFF', 
              borderRadius: 20, 
              padding: 32, 
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              border: '1px solid #1E293B',
              textAlign: 'left',
              marginBottom: 32,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #1E293B' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#38E8F5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    COMMITTEE DECISION CONSENSUS
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                    Final Recommendation: {consensusData?.decision}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: 20, background: consensusData?.disagreementDetected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)', border: consensusData?.disagreementDetected ? '1px solid #FDE68A' : '1px solid #A7F3D0', color: consensusData?.disagreementDetected ? '#FDE68A' : '#A7F3D0' }}>
                    {consensusData?.alignmentStatus || '3 / 3 Aligned'}
                  </span>
                  <DecisionBadge decision={consensusData?.decision} />
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 24, background: 'rgba(255, 255, 255, 0.04)', padding: 16, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                "{consensusData?.summary}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  {activeReviewers.map((rev, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1' }}>
                      <span>{rev.avatar}</span>
                      <span>{rev.reviewerId}:</span>
                      <span style={{ color: getDecisionColor(rev.verdict) }}>{rev.verdict} ({rev.score})</span>
                    </div>
                  ))}
                </div>

                {onNavigateToJdMatch && (
                  <button
                    onClick={() => onNavigateToJdMatch(resumeId)}
                    style={{
                      background: '#38E8F5',
                      color: '#032D30',
                      border: 'none',
                      borderRadius: 20,
                      padding: '12px 28px',
                      fontSize: '0.88rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 4px 14px rgba(56, 232, 245, 0.3)'
                    }}
                  >
                    <span>Proceed to JD Match</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* REVIEWER PERSONA TABS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
              {activeReviewers.map((rev, idx) => (
                <div 
                  key={rev.reviewerId || idx}
                  onClick={() => setSelectedReviewer(idx)}
                  style={{ 
                    background: '#FFFFFF',
                    border: selectedReviewer === idx ? `2px solid ${rev.accent}` : '1px solid #E2E8F0',
                    borderRadius: 20,
                    padding: 20,
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: selectedReviewer === idx ? '0 8px 24px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: '1.6rem' }}>{rev.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>{rev.reviewerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{rev.role}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9', fontSize: '0.78rem', fontWeight: 800 }}>
                    <span style={{ color: rev.accent }}>Score: {rev.score}/100</span>
                    <span style={{ color: getDecisionColor(rev.verdict) }}>{rev.verdict}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIVE REVIEWER DETAIL CARD */}
            {activeReviewers[selectedReviewer] && (
              <div style={{ 
                background: '#FFFFFF', 
                borderRadius: 20, 
                padding: 28, 
                border: `2px solid ${activeReviewers[selectedReviewer].accent}`, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 24
              }}>
                {/* PERSONA HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                      {activeReviewers[selectedReviewer].avatar}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                        {activeReviewers[selectedReviewer].reviewerName} Evaluation
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                        {activeReviewers[selectedReviewer].role}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B' }}>
                      Evidence Confidence: {activeReviewers[selectedReviewer].confidence}%
                    </span>
                    <DecisionBadge decision={activeReviewers[selectedReviewer].verdict} />
                  </div>
                </div>

                {/* CATEGORY SCORES RUBRIC BREAKDOWN */}
                {activeReviewers[selectedReviewer].categoryScores.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Award size={15} color="#0284C7" /> Evaluation Rubric Breakdown
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                      {activeReviewers[selectedReviewer].categoryScores.map((cat, cIdx) => (
                        <div key={cIdx} style={{ background: '#F8FAFC', padding: 12, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                            <span>{cat.name}</span>
                            <span style={{ color: '#0284C7' }}>{cat.score}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>{cat.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STRENGTHS VS WEAKNESSES GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={15} /> Identified Key Strengths
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeReviewers[selectedReviewer].strengths.map((str, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#ECFDF5', padding: 10, borderRadius: 10, border: '1px solid #A7F3D0', fontSize: '0.82rem', color: '#065F46', fontWeight: 600 }}>
                          <Check size={14} style={{ color: '#059669', flexShrink: 0, marginTop: 2 }} />
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={15} /> Areas for Improvement
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeReviewers[selectedReviewer].weaknesses.map((wk, wIdx) => (
                        <div key={wIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#FFFBEB', padding: 10, borderRadius: 10, border: '1px solid #FDE68A', fontSize: '0.82rem', color: '#92400E', fontWeight: 600 }}>
                          <AlertTriangle size={14} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                          <span>{wk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* EVIDENCE CLAIMS LIST */}
                {activeReviewers[selectedReviewer].evidence.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={15} color="#0284C7" /> Evidence-First Verification Claims
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeReviewers[selectedReviewer].evidence.map((ev, eIdx) => (
                        <div key={eIdx} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: '0.8rem', gap: 12 }}>
                          <span style={{ color: '#334155', fontWeight: 600, flex: 1 }}>{ev.claim}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', background: '#FFFFFF', padding: '2px 8px', borderRadius: 6, border: '1px solid #CBD5E1' }}>
                            {ev.source}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: ev.type === 'explicit' ? '#059669' : (ev.type === 'inferred' ? '#0284C7' : '#DC2626') }}>
                            [{ev.type}]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TARGETED INTERVIEW QUESTIONS */}
                {activeReviewers[selectedReviewer].interviewQuestions.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <HelpCircle size={15} color="#7C3AED" /> Recommended Targeted Interview Questions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {activeReviewers[selectedReviewer].interviewQuestions.map((q, qIdx) => (
                        <div key={qIdx} style={{ background: '#F3E8FF', padding: '12px 16px', borderRadius: 12, border: '1px solid #DDD6FE', fontSize: '0.85rem', color: '#6B21A8', fontWeight: 600, lineHeight: 1.45 }}>
                          • "{q}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}

function DecisionBadge({ decision }) {
  let bg = '#ECFDF5';
  let border = '#A7F3D0';
  let text = '#047857';

  if (decision === 'Strong Hire') {
    bg = '#ECFDF5';
    border = '#6EE7B7';
    text = '#047857';
  } else if (decision === 'Hire') {
    bg = '#F0F9FF';
    border = '#7DD3FC';
    text = '#0369A1';
  } else if (decision === 'Maybe') {
    bg = '#FFFBEB';
    border = '#FDE68A';
    text = '#B45309';
  } else if (decision === 'No Hire') {
    bg = '#FEF2F2';
    border = '#FCA5A5';
    text = '#B91C1C';
  }

  return (
    <span style={{ padding: '6px 16px', borderRadius: 20, background: bg, border: `1px solid ${border}`, color: text, fontSize: '0.82rem', fontWeight: 900 }}>
      {decision}
    </span>
  );
}

function getDecisionColor(decision) {
  if (decision === 'Strong Hire') return '#059669';
  if (decision === 'Hire') return '#0284C7';
  if (decision === 'Maybe') return '#D97706';
  return '#DC2626';
}
