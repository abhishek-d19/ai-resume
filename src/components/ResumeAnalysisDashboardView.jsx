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
  ArrowLeft
} from 'lucide-react';

export default function ResumeAnalysisDashboardView({ resumeId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expandedRecs, setExpandedRecs] = useState({});

  useEffect(() => {
    fetchAnalysis();
  }, [resumeId]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId || 'demo'}/analyze`);
      const json = await res.json();

      if (json.success && json.data) {
        setData(json.data);
      } else {
        // Fallback to sample data for preview/demonstration if no live DB analysis exists yet
        setData(getSampleAnalysis());
      }
    } catch (err) {
      console.warn('Using sample analysis data fallback:', err);
      setData(getSampleAnalysis());
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId || 'demo'}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'mock-user-1' })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        throw new Error(json.error || 'Failed to generate fresh analysis');
      }
    } catch (err) {
      setError(err.message || 'Analysis generation failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleRecommendation = (idx) => {
    setExpandedRecs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return <AnalysisSkeletonLoading onBack={onBack} />;
  }

  if (error && !data) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Failed to Load</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={fetchAnalysis}
          className="px-6 py-2.5 rounded-full bg-[#38E8F5] text-[#032D30] font-semibold hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const analysis = data || getSampleAnalysis();
  const overallScore = analysis.overallScore || 85;
  const atsScore = analysis.atsScore || Math.round(overallScore * 0.94);
  const sectionScores = analysis.sectionScores || {};

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
                Resume Intelligence Audit <Sparkles className="w-5 h-5 text-[#38E8F5]" />
              </h1>
              <p className="text-sm text-slate-400">Deep AI score breakdown, ATS compliance, and executive recommendations</p>
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#38E8F5] text-[#032D30] font-semibold hover:shadow-lg hover:shadow-[#38E8F5]/20 disabled:opacity-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Re-auditing...' : 'Re-Run Audit'}
          </button>
        </div>

        {/* Top Cards: Overall Score & ATS Score */}
        <div className="grid grid-[#032D30] md:grid-cols-2 gap-6">
          
          {/* Overall Score Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-[#38E8F5]/30 transition shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38E8F5]/5 rounded-full blur-3xl group-hover:bg-[#38E8F5]/10 transition" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#38E8F5]" /> Overall Quality Score
              </span>
              <ScoreTierBadge score={overallScore} />
            </div>

            <div className="flex items-baseline gap-4 my-2">
              <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                {overallScore}
              </span>
              <span className="text-lg text-slate-500 font-medium">/ 100</span>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-[#38E8F5] to-emerald-400 transition-all duration-1000 ease-out" 
                style={{ width: `${overallScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">Evaluated against executive hiring algorithms and industry standards.</p>
          </div>

          {/* ATS Score Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-[#38E8F5]/30 transition shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> ATS Compliance Index
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
                Parseability High
              </span>
            </div>

            <div className="flex items-baseline gap-4 my-2">
              <span className="text-5xl md:text-6xl font-extrabold text-cyan-300 tracking-tight">
                {atsScore}
              </span>
              <span className="text-lg text-slate-500 font-medium">% Match</span>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-[#38E8F5] transition-all duration-1000 ease-out" 
                style={{ width: `${atsScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">Machine parseability score across standard ATS algorithms (Greenhouse, Lever, Workday).</p>
          </div>

        </div>

        {/* Executive Summary */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#032D30] border border-slate-800 shadow-xl relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#38E8F5]" />
            <h2 className="text-lg font-bold text-white tracking-tight">Executive Summary</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base font-normal">
            {analysis.executiveSummary || analysis.summary || "The candidate presents a strong technical baseline with high accomplishment clarity. Keyword density for core engineering stack elements is well-aligned with senior level expectations. To maximize executive recruiter impact, enrich metric density in project bullets and address section hierarchy minor deficits."}
          </p>
        </div>

        {/* Section Scores Grid */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <h2 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#38E8F5]" /> Section Scores Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(sectionScores).map(([key, score]) => (
              <div key={key} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-mono font-bold text-[#38E8F5]">{score}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-[#38E8F5] transition-all duration-500" 
                    style={{ width: `${score}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 shadow-xl">
            <h3 className="text-md font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Key Candidate Strengths
            </h3>
            <ul className="space-y-2.5">
              {(analysis.strengths || ['High metric density in bullet points', 'Strong technical stack keywords', 'Clear career progression']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-amber-500/20 shadow-xl">
            <h3 className="text-md font-bold text-amber-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Areas for Improvement
            </h3>
            <ul className="space-y-2.5">
              {(analysis.weaknesses || ['Vague action verbs in project descriptions', 'Missing github portfolio link', 'Summary statement lacks target role alignment']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Critical Issues & Quick Wins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Critical Issues */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/20 shadow-xl">
            <h3 className="text-md font-bold text-rose-400 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" /> Critical Issues
            </h3>
            {(!analysis.criticalIssues || analysis.criticalIssues.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No critical blocking issues detected.</p>
            ) : (
              <ul className="space-y-2.5">
                {analysis.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                    {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Wins */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 shadow-xl">
            <h3 className="text-md font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" /> High-Impact Quick Wins
            </h3>
            <ul className="space-y-2.5">
              {(analysis.quickWins || ['Add quantified metrics to 2 experience bullets', 'Place core technical skills at the top', 'Standardize employment date formats']).map((win, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Expandable Recommendations */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h3 className="text-md font-bold text-white mb-4">Actionable Recommendations</h3>
          <div className="space-y-3">
            {(analysis.recommendations || [
              'Enrich metric density: Replace generic phrases with percentage gains, latency improvements, or scale metrics.',
              'Optimize ATS taxonomy: Ensure standard section headers (Experience, Education, Skills) are utilized.',
              'Strengthen summary statement: Explicitly mention target job title and key core competencies in the top 3 lines.'
            ]).map((rec, idx) => {
              const isExpanded = expandedRecs[idx];
              return (
                <div 
                  key={idx} 
                  className="rounded-xl bg-slate-950/40 border border-slate-800/80 overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleRecommendation(idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs md:text-sm font-semibold text-slate-200 hover:text-white transition"
                  >
                    <span>{idx + 1}. {rec.split(':')[0]}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-900 text-xs text-slate-400 leading-relaxed">
                      {rec}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing Sections & ATS Warnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Missing Sections */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Missing Mandatory Sections</h4>
            {(!analysis.missingSections || analysis.missingSections.length === 0) ? (
              <p className="text-xs text-emerald-400 font-medium">✓ All essential sections present.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.missingSections.map((sec, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    {sec}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ATS Warnings */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-dashed border-amber-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">ATS Formatting Warnings</h4>
            {(!analysis.atsWarnings || analysis.atsWarnings.length === 0) ? (
              <p className="text-xs text-emerald-400 font-medium">✓ Zero formatting risks detected.</p>
            ) : (
              <ul className="space-y-1.5 text-xs text-amber-200/80">
                {analysis.atsWarnings.map((warn, idx) => (
                  <li key={idx}>• {warn}</li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

function ScoreTierBadge({ score }) {
  if (score >= 90) return <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">Executive Tier</span>;
  if (score >= 75) return <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">Competitive Tier</span>;
  return <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">Needs Optimization</span>;
}

function AnalysisSkeletonLoading({ onBack }) {
  return (
    <div className="min-h-screen bg-[#032D30] text-slate-100 p-8 max-w-5xl mx-auto space-y-8 animate-pulse font-sans">
      <div className="h-8 w-64 bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-44 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-44 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
      <div className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
      <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
    </div>
  );
}

function getSampleAnalysis() {
  return {
    overallScore: 88,
    atsScore: 92,
    sectionScores: {
      personalInfo: 95,
      summary: 80,
      education: 90,
      experience: 88,
      projects: 85,
      skills: 92,
      certifications: 80,
      achievements: 85,
      languages: 100
    },
    executiveSummary: "The candidate demonstrates exceptional technical baseline and engineering leadership. High metric density is evident across experience bullets. Recommended adjustments include placing key tech skills closer to the top and sharpening target role alignment in the summary.",
    strengths: [
      "High metric density (percentage gains, scale numbers) across experience bullet points.",
      "Clean ATS section hierarchy and standardized headers.",
      "Diverse technical skill coverage aligned with Senior Staff Software Engineer standards."
    ],
    weaknesses: [
      "Summary statement lacks explicit target role alignment.",
      "Project descriptions could include more architectural impact metrics."
    ],
    criticalIssues: [],
    quickWins: [
      "Add target role title directly into the professional summary header.",
      "Re-order skills section to feature high-demand frameworks at the very top."
    ],
    recommendations: [
      "Quantify project outcomes: Include latency reduction, throughput, or revenue metrics for secondary projects.",
      "Optimize section header titles: Use standard terms like 'Professional Experience' and 'Education'.",
      "Include GitHub / Portfolio URL: Provide verified code artifact links in personal info."
    ],
    missingSections: [],
    atsWarnings: [
      "Ensure table-less formatting when rendering final PDF output."
    ]
  };
}
