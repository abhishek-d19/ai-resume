import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Award,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Check,
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Cpu,
  Trophy,
  Globe,
  BarChart3,
  Target,
  MessageSquare
} from 'lucide-react';

import { resumeAnalysisServiceInstance } from '../services/ResumeAnalysisService';

export default function ResumeAnalysisDashboardView({ resumeId = 'res-1', userId, onBack, onNext }) {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expandedRecs, setExpandedRecs] = useState({});
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [statusStep, setStatusStep] = useState('Evaluating content...');

  useEffect(() => {
    fetchAnalysis();
  }, [resumeId, userId]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      let analysisData = await resumeAnalysisServiceInstance.getLatestAnalysis(userId, resumeId);
      if (!analysisData) {
        const result = await resumeAnalysisServiceInstance.analyzeResume(userId, resumeId, undefined, false);
        analysisData = result.analysis;
      }
      setData(analysisData);
    } catch (err) {
      console.error('[ResumeAnalysisService Error]:', err.message);
      setError(err.message || 'Failed to load resume analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async (forceReRun = true) => {
    if (analyzing) return;
    setAnalyzing(true);
    setError(null);
    setStatusStep('Extracting resume content...');

    const t1 = setTimeout(() => setStatusStep('Evaluating content & metrics...'), 1200);
    const t2 = setTimeout(() => setStatusStep('Building intelligence report...'), 2800);

    try {
      const result = await resumeAnalysisServiceInstance.analyzeResume(userId, resumeId, undefined, forceReRun);
      setData(result.analysis);
    } catch (err) {
      console.error('[ResumeAnalysisService Generate Error]:', err.message);
      setError(err.message || 'Analysis generation failed.');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setAnalyzing(false);
    }
  };

  const toggleRecommendation = (idx) => {
    setExpandedRecs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return <AnalysisLoadingExperience onBack={onBack} statusStep="Loading stored analysis..." />;
  }

  if (error && !data) {
    const isBillingError = error.includes('AI_BILLING_LIMIT_REACHED');
    const isRateLimit = error.includes('AI_RATE_LIMITED');
    const isTimeout = error.includes('AI_TIMEOUT');

    const displayMsg = isBillingError
      ? 'AI analysis is temporarily unavailable because the AI service has reached its usage limit. Please try again later.'
      : isRateLimit
      ? 'Too many analysis requests were made. Please wait a moment and try again.'
      : isTimeout
      ? 'The AI analysis request timed out. Please try again.'
      : error;

    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 36, maxWidth: 560, width: '100%', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <AlertTriangle size={24} />
          </div>
          
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
            {isBillingError ? 'AI Usage Limit Reached' : isRateLimit ? 'Rate Limit Exceeded' : 'Analysis Failed'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 16, lineHeight: 1.5 }}>
            {displayMsg}
          </p>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: '0.82rem', fontFamily: 'monospace' }}>
            <div style={{ marginBottom: 6 }}><strong>Pipeline Stage:</strong> {isBillingError ? 'PROVIDER_BILLING_CHECK' : 'AI_PROVIDER_EXECUTION'}</div>
            <div style={{ marginBottom: 6 }}><strong>Resume ID:</strong> {resumeId}</div>
            <div style={{ marginBottom: 6 }}><strong>Provider:</strong> OpenAI</div>
            <div style={{ marginBottom: 6 }}><strong>Model:</strong> gpt-4o-mini</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowTechDetails(!showTechDetails)}
              style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
            >
              {showTechDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showTechDetails ? 'Hide technical details' : 'View technical details'}
            </button>

            {showTechDetails && (
              <div style={{ marginTop: 10, background: '#0F172A', color: '#38BDF8', padding: 14, borderRadius: 10, fontSize: '0.75rem', fontFamily: 'monospace', overflowX: 'auto', maxHeight: 180 }}>
                {JSON.stringify({
                  errorCode: isBillingError ? 'AI_BILLING_LIMIT_REACHED' : isRateLimit ? 'AI_RATE_LIMITED' : 'AI_PROVIDER_ERROR',
                  message: error,
                  resumeId,
                  provider: 'openai',
                  model: 'gpt-4o-mini',
                  stage: 'AI_EXECUTION'
                }, null, 2)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            {onBack && (
              <button 
                onClick={onBack}
                style={{ padding: '10px 20px', borderRadius: 12, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Back to Resume
              </button>
            )}
            <button 
              onClick={() => handleRunAnalysis(true)}
              disabled={analyzing}
              style={{ padding: '10px 24px', borderRadius: 12, background: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', border: 'none', cursor: 'pointer', opacity: analyzing ? 0.6 : 1 }}
            >
              {analyzing ? 'Analyzing...' : 'Retry Analysis'}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 36, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>No Analysis Available</h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24, lineHeight: 1.5 }}>
            {analyzing ? statusStep : "Run Lumina AI's deep resume intelligence scan to generate your executive audit report."}
          </p>
          <button 
            onClick={() => handleRunAnalysis(true)}
            disabled={analyzing}
            style={{ padding: '12px 28px', borderRadius: 12, background: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer', opacity: analyzing ? 0.6 : 1 }}
          >
            {analyzing ? 'Analyzing Resume...' : 'Generate Analysis'}
          </button>
        </div>
      </main>
    );
  }

  const analysis = data;
  const overallScore = analysis.overallScore || 0;
  const atsScore = analysis.atsScore || Math.round(overallScore * 0.94);
  const sectionScores = analysis.sectionScores || {};

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Header */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', sticky: 'top', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {onBack && (
            <button 
              onClick={onBack}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', border: 'none', padding: '8px 14px', borderRadius: 10, color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              Resume Intelligence Audit <Sparkles size={20} color="#0284C7" />
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Executive Career Copilot • Candidate Quality Audit</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => handleRunAnalysis(true)}
            disabled={analyzing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0284C7', padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: analyzing ? 0.6 : 1 }}
          >
            <RefreshCw size={14} className={analyzing ? 'animate-spin' : ''} />
            {analyzing ? statusStep : 'Re-Run Audit'}
          </button>

          {onNext && (
            <button 
              onClick={onNext}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0284C7', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Next Step <ArrowRight size={16} />
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px 24px' }}>
        {/* Overall Score Header */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 28, marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'center' }}>
          {/* Overall Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderRight: '1px solid #E2E8F0', paddingRight: 24 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: overallScore >= 75 ? '#F0FDF4' : overallScore >= 50 ? '#FEFCE8' : '#FEF2F2', border: `3px solid ${overallScore >= 75 ? '#22C55E' : overallScore >= 50 ? '#EAB308' : '#EF4444'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: overallScore >= 75 ? '#15803D' : overallScore >= 50 ? '#A16207' : '#B91C1C', lineHeight: 1 }}>{overallScore}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>/ 100</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Score</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 4px 0' }}>
                {overallScore >= 80 ? 'Strong Candidate' : overallScore >= 60 ? 'Competitive Tier' : overallScore >= 40 ? 'Moderate Impact' : 'Needs Optimization'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                {analysis.executiveSummary || 'Executive audit complete.'}
              </p>
            </div>
          </div>

          {/* ATS Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderRight: '1px solid #E2E8F0', paddingRight: 24 }}>
            <div style={{ width: 84, height: 84, borderRadius: 20, background: '#F0F9FF', border: '1px solid #BAE6FD', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284C7', lineHeight: 1 }}>{atsScore}%</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>ATS Match</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Parseability</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 4px 0' }}>
                {atsScore >= 80 ? 'ATS Compatible' : 'Parseable with Gaps'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                Standard header hierarchy and clean machine readability.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Identified Strengths</span>
              <span style={{ fontWeight: 800, color: '#15803D' }}>{analysis.strengths?.length || 0} Highlights</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Areas for Growth</span>
              <span style={{ fontWeight: 800, color: '#B91C1C' }}>{analysis.weaknesses?.length || 0} Flags</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Actionable Recommendations</span>
              <span style={{ fontWeight: 800, color: '#0284C7' }}>{analysis.recommendations?.length || 0} Actions</span>
            </div>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Left Column: Strengths & Weaknesses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={18} color="#16A34A" /> Key Strengths Identified
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {analysis.strengths && analysis.strengths.length > 0 ? (
                  analysis.strengths.map((str, idx) => (
                    <div key={idx} style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 12, padding: 14, fontSize: '0.85rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Check size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{str}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>No major strengths identified.</p>
                )}
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="#DC2626" /> Critical Areas for Improvement
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
                  analysis.weaknesses.map((weak, idx) => (
                    <div key={idx} style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 12, padding: 14, fontSize: '0.85rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <AlertTriangle size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{weak}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>No major weaknesses detected.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations & Section Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="#0284C7" /> Strategic Recommendations
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {analysis.recommendations && analysis.recommendations.length > 0 ? (
                  analysis.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 12, padding: 14, fontSize: '0.85rem', color: '#0369A1', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => toggleRecommendation(idx)}>
                        <span>{rec}</span>
                        {expandedRecs[idx] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                      {expandedRecs[idx] && (
                        <p style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #E0F2FE', fontSize: '0.8rem', color: '#0284C7', fontWeight: 400 }}>
                          Updating this section improves ATS match score and executive recruiter scanability.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>No recommendations provided.</p>
                )}
              </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={18} color="#6366F1" /> Section Score Breakdown
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(sectionScores).map(([key, score]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 10 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 120, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: score >= 75 ? '#22C55E' : score >= 50 ? '#EAB308' : '#EF4444', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: score >= 75 ? '#15803D' : score >= 50 ? '#A16207' : '#B91C1C', width: 36, textAlign: 'right' }}>
                        {score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisLoadingExperience({ onBack, statusStep }) {
  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <RefreshCw size={32} className="animate-spin" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Analyzing Resume Intelligence</h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 20, lineHeight: 1.5 }}>
          {statusStep || 'Lumina AI is scanning header structure, keyword density, quantified experience metrics, and ATS compatibility...'}
        </p>
      </div>
    </main>
  );
}
