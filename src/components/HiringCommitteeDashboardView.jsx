import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft,
  Bot,
  Code,
  UserCheck
} from 'lucide-react';

export default function HiringCommitteeDashboardView({ resumeId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expandedReviewers, setExpandedReviewers] = useState({ 0: true, 1: true, 2: true });

  useEffect(() => {
    fetchCommitteeEvaluation();
  }, [resumeId]);

  const fetchCommitteeEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId || 'demo'}/hiring-committee`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData(getSampleCommitteeData());
      }
    } catch (err) {
      console.warn('Using sample committee evaluation fallback:', err);
      setData(getSampleCommitteeData());
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId || 'demo'}/hiring-committee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'mock-user-1' })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        throw new Error(json.error || 'Failed to execute hiring committee evaluation');
      }
    } catch (err) {
      setError(err.message || 'Committee evaluation failed.');
    } finally {
      setEvaluating(false);
    }
  };

  const toggleReviewer = (idx) => {
    setExpandedReviewers(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return <CommitteeSkeletonLoading onBack={onBack} />;
  }

  const committee = data || getSampleCommitteeData();
  const consensus = committee.consensus || {
    overallDecision: 'Strong Hire',
    confidence: 94,
    overallScore: 89,
    summary: 'The candidate demonstrates exceptional technical architecture depth and metric impact. All 3 reviewers reached positive hiring consensus.',
    keyStrengths: ['Proven leadership scale', 'High metric density'],
    criticalConcerns: ['Minor resume formatting keyword adjustments'],
    recommendedNextSteps: ['Schedule Technical System Design Interview'],
    interviewReadiness: 92
  };
  const reviewers = committee.reviewers || getSampleReviewers();

  return (
    <div className="min-h-screen bg-[#032D30] text-slate-100 p-4 md:p-8 font-sans selection:bg-[#38E8F5] selection:text-[#032D30]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="p-2 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-[#38E8F5]/40 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Executive Hiring Committee <Users className="w-5 h-5 text-[#38E8F5]" />
              </h1>
              <p className="text-sm text-slate-400">Independent 3-reviewer consensus (ATS Specialist, Technical Hiring Manager, HR Recruiter)</p>
            </div>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={evaluating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#38E8F5] text-[#032D30] font-semibold hover:shadow-lg hover:shadow-[#38E8F5]/20 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
            {evaluating ? 'Simulating Panel...' : 'Run Committee Panel'}
          </button>
        </div>

        {/* Top Decision Bar: Overall Hiring Decision, Confidence, Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Overall Hiring Decision */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Panel Consensus Verdict
            </span>
            <div className="my-2">
              <DecisionBadge decision={consensus.overallDecision} />
            </div>
            <p className="text-xs text-slate-400 mt-2">Final consensus decision based on 25% ATS, 45% Tech, 30% HR weighted evaluation.</p>
          </div>

          {/* Confidence Score */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#38E8F5]" /> Panel Confidence
            </span>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-5xl font-extrabold text-[#38E8F5] font-mono">
                {consensus.confidence}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
              <div className="h-full bg-[#38E8F5] transition-all duration-700" style={{ width: `${consensus.confidence}%` }} />
            </div>
          </div>

          {/* Weighted Overall Score */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-emerald-400" /> Weighted Score
            </span>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-5xl font-extrabold text-emerald-400 font-mono">
                {consensus.overallScore}
              </span>
              <span className="text-sm text-slate-500 font-medium">/ 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
              <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${consensus.overallScore}%` }} />
            </div>
          </div>

        </div>

        {/* 3 Reviewer Cards Grid: ATS Review, Technical Review, HR Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#38E8F5]" /> Independent Reviewer Audits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewers.map((rev, idx) => {
              const isExpanded = expandedReviewers[idx];
              const Icon = getReviewerIcon(rev.reviewer);
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div className="p-5 border-b border-slate-800/80">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#38E8F5]" />
                        <span className="text-xs font-bold text-slate-300">{rev.reviewer}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#38E8F5]">{rev.score}/100</span>
                    </div>

                    <div className="my-2">
                      <VerdictBadge verdict={rev.hireRecommendation || rev.verdict} />
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Top Strengths</span>
                      <ul className="mt-1 space-y-1 text-xs text-slate-300">
                        {(rev.strengths || rev.pros || []).slice(0, 2).map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-800/60 space-y-3">
                        <div>
                          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Key Concerns</span>
                          <ul className="mt-1 space-y-1 text-xs text-slate-400">
                            {(rev.concerns || rev.cons || []).map((c, i) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#38E8F5] uppercase tracking-wider">Recommendations</span>
                          <ul className="mt-1 space-y-1 text-xs text-slate-300">
                            {(rev.recommendations || []).map((r, i) => (
                              <li key={i}>• {r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleReviewer(idx)}
                    className="w-full p-3 bg-slate-950/40 border-t border-slate-800 text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
                  >
                    {isExpanded ? 'Hide Details' : 'View Full Critique'}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consensus Summary */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#032D30] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#38E8F5]" />
            <h2 className="text-lg font-bold text-white">Committee Consensus Summary</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base font-normal">
            {consensus.summary}
          </p>
        </div>

        {/* Final Insights Grid: Key Strengths, Critical Concerns, Interview Readiness, Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Key Strengths */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 shadow-xl">
            <h3 className="text-md font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Panel Strengths
            </h3>
            <ul className="space-y-2">
              {(consensus.keyStrengths || ['Proven technical architecture scale', 'High metric density across bullet points']).map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Critical Concerns */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/20 shadow-xl">
            <h3 className="text-md font-bold text-rose-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Critical Panel Concerns
            </h3>
            <ul className="space-y-2">
              {(consensus.criticalConcerns || ['Minor ATS formatting taxonomy adjustments recommended']).map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Readiness */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#38E8F5]" /> Interview Readiness Score
              </h3>
              <span className="text-xl font-extrabold text-[#38E8F5] font-mono">
                {consensus.interviewReadiness || 92}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-[#38E8F5] to-emerald-400 transition-all duration-1000" style={{ width: `${consensus.interviewReadiness || 92}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-3">High probability of advancing through live technical & hiring manager rounds.</p>
          </div>

          {/* Recommended Next Steps */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
            <h3 className="text-md font-bold text-white mb-4">Recommended Next Steps</h3>
            <ul className="space-y-2">
              {(consensus.recommendedNextSteps || ['Proceed to technical system design loop', 'Prepare leadership metric stories']).map((step, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#38E8F5]/10 text-[#38E8F5] flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

function DecisionBadge({ decision }) {
  if (decision === 'Strong Hire') return <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">Strong Hire</span>;
  if (decision === 'Hire') return <span className="px-4 py-1.5 rounded-full bg-[#38E8F5]/10 border border-[#38E8F5]/30 text-[#38E8F5] font-extrabold text-sm uppercase tracking-wider">Hire</span>;
  if (decision === 'Maybe' || decision === 'Leaning Hire') return <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm uppercase tracking-wider">Leaning Hire / Maybe</span>;
  return <span className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-sm uppercase tracking-wider">No Hire</span>;
}

function VerdictBadge({ verdict }) {
  if (verdict === 'Strong Hire') return <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">Strong Hire</span>;
  if (verdict === 'Hire') return <span className="px-3 py-1 rounded-full bg-[#38E8F5]/10 border border-[#38E8F5]/20 text-[#38E8F5] text-xs font-bold">Hire</span>;
  if (verdict === 'Maybe' || verdict === 'Leaning Hire') return <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">Leaning Hire</span>;
  return <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">No Hire</span>;
}

function getReviewerIcon(reviewer) {
  if (reviewer?.includes('ATS')) return Bot;
  if (reviewer?.includes('Technical')) return Code;
  return UserCheck;
}

function CommitteeSkeletonLoading({ onBack }) {
  return (
    <div className="min-h-screen bg-[#032D30] text-slate-100 p-8 max-w-5xl mx-auto space-y-8 animate-pulse font-sans">
      <div className="h-8 w-64 bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-3 gap-6">
        <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
    </div>
  );
}

function getSampleCommitteeData() {
  return {
    consensus: {
      overallDecision: 'Strong Hire',
      confidence: 94,
      overallScore: 89,
      summary: 'The candidate demonstrates exceptional technical architecture depth and metric impact. All 3 reviewers reached positive hiring consensus with zero blocking concerns.',
      keyStrengths: ['Proven leadership scale', 'High metric density in bullet points', 'Strong ATS taxonomy alignment'],
      criticalConcerns: ['Minor formatting taxonomy adjustments recommended'],
      recommendedNextSteps: ['Schedule Technical System Design Loop'],
      interviewReadiness: 92
    },
    reviewers: getSampleReviewers()
  };
}

function getSampleReviewers() {
  return [
    {
      reviewer: 'ATS Specialist',
      score: 92,
      hireRecommendation: 'Hire',
      strengths: ['Standard section hierarchy', 'Clean machine parseability'],
      concerns: ['Minor keyword density enrichment recommended'],
      recommendations: ['Add explicit target role in summary header']
    },
    {
      reviewer: 'Technical Hiring Manager',
      score: 88,
      hireRecommendation: 'Strong Hire',
      strengths: ['High metric impact density', 'Strong system architecture experience'],
      concerns: ['Include Docker/Kubernetes container scale details'],
      recommendations: ['Enrich project bullet latency metrics']
    },
    {
      reviewer: 'HR Recruiter',
      score: 90,
      hireRecommendation: 'Strong Hire',
      strengths: ['Clear career progression', 'Strong communication presentation'],
      concerns: ['Verify employment tenure dates'],
      recommendations: ['Highlight mentorship & leadership scale']
    }
  ];
}
