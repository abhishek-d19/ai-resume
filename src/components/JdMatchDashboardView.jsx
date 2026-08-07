import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Key, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Search,
  Zap
} from 'lucide-react';

export default function JdMatchDashboardView({ resumeId, onBack }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expandedRecs, setExpandedRecs] = useState({});

  useEffect(() => {
    fetchLatestMatch();
  }, [resumeId]);

  const fetchLatestMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId || 'demo'}/jd-match`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setData(getSampleJdMatch());
      }
    } catch (err) {
      console.warn('Using sample JD match fallback:', err);
      setData(getSampleJdMatch());
    } finally {
      setLoading(false);
    }
  };

  const handleRunMatch = async (e) => {
    if (e) e.preventDefault();
    if (!jobDescription.trim()) return;

    setMatching(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId || 'demo'}/jd-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'mock-user-1',
          jobDescriptionText: jobDescription
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        throw new Error(json.error || 'Failed to run JD match');
      }
    } catch (err) {
      setError(err.message || 'JD Match execution failed.');
    } finally {
      setMatching(false);
    }
  };

  const toggleRec = (idx) => {
    setExpandedRecs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return <JdMatchSkeletonLoading onBack={onBack} />;
  }

  const match = data || getSampleJdMatch();
  const overallMatch = match.overallMatch || match.matchScore || 86;
  const matchCategory = match.matchCategory || 'Strong';
  const skills = match.skills || { matched: ['React', 'TypeScript', 'Node.js', 'GraphQL'], missing: ['Kubernetes', 'Terraform'], recommended: ['Docker'] };
  const experience = match.experience || { alignmentScore: 85, missingExperience: [], strengths: ['Senior leadership scale'] };
  const education = match.education || { alignment: 95, recommendations: [] };
  const keywords = match.keywords || { matched: ['Architecture', 'API Design'], missing: ['DevOps'], keywordCoverage: 82 };
  const atsImpact = match.atsImpact || { score: 90, warnings: [] };

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
                Job Description Match Engine <Target className="w-5 h-5 text-[#38E8F5]" />
              </h1>
              <p className="text-sm text-slate-400">Competency alignment, skill gap detection, and keyword coverage</p>
            </div>
          </div>
        </div>

        {/* Input Textarea to Run Match against New Job Description */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <form onSubmit={handleRunMatch} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Paste Target Job Description (JD)
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting requirements, responsibilities, or tech stack..."
              className="w-full p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#38E8F5]/60 transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={matching || !jobDescription.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#38E8F5] text-[#032D30] font-semibold hover:shadow-lg hover:shadow-[#38E8F5]/20 disabled:opacity-40 transition"
              >
                <Search className={`w-4 h-4 ${matching ? 'animate-spin' : ''}`} />
                {matching ? 'Analyzing Alignment...' : 'Analyze Match'}
              </button>
            </div>
          </form>
        </div>

        {/* Top Score Cards: Overall Match & Match Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Overall Match % */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38E8F5]/5 rounded-full blur-3xl group-hover:bg-[#38E8F5]/10 transition" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Target className="w-4 h-4 text-[#38E8F5]" /> Overall Alignment Match
            </span>

            <div className="flex items-baseline gap-4 my-2">
              <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                {overallMatch}%
              </span>
              <MatchCategoryBadge category={matchCategory} />
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-[#38E8F5] to-emerald-400 transition-all duration-1000 ease-out" 
                style={{ width: `${overallMatch}%` }}
              />
            </div>
          </div>

          {/* Top Score Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#032D30] border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#38E8F5]" />
              <h3 className="text-md font-bold text-white">Competency Alignment Summary</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Your resume demonstrates <strong className="text-[#38E8F5] font-semibold">{matchCategory.toLowerCase()} alignment</strong> with the target job requirements. Core technical competencies and experience scale match the requisition closely.
            </p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <span>Keyword Coverage: <strong className="text-white font-mono">{keywords.keywordCoverage || 82}%</strong></span>
              <span>•</span>
              <span>Experience Match: <strong className="text-white font-mono">{experience.alignmentScore || 85}%</strong></span>
            </div>
          </div>

        </div>

        {/* Skills Section: Matched vs Missing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Matched Skills */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 shadow-xl">
            <h3 className="text-md font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Matched Skills ({skills.matched?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {(skills.matched || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/20 shadow-xl">
            <h3 className="text-md font-bold text-rose-400 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" /> Missing / Gap Skills ({skills.missing?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {(skills.missing || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">Zero critical skill gaps detected.</p>
              ) : (
                skills.missing.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> {skill}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Progress Bars: Keyword Coverage, Experience Match, Education Match, ATS Optimization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Keyword Coverage */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#38E8F5]" /> Keyword Coverage
              </span>
              <span className="text-xs font-mono font-bold text-[#38E8F5]">{keywords.keywordCoverage || 82}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-[#38E8F5] transition-all duration-700" style={{ width: `${keywords.keywordCoverage || 82}%` }} />
            </div>
          </div>

          {/* Experience Match */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" /> Experience Alignment
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{experience.alignmentScore || 85}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all duration-700" style={{ width: `${experience.alignmentScore || 85}%` }} />
            </div>
          </div>

          {/* Education Match */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" /> Education Alignment
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{education.alignment || 95}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${education.alignment || 95}%` }} />
            </div>
          </div>

          {/* ATS Optimization */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> ATS Parseability Impact
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">{atsImpact.score || 90}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-amber-400 transition-all duration-700" style={{ width: `${atsImpact.score || 90}%` }} />
            </div>
          </div>

        </div>

        {/* Expandable Recommendations Accordion */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#38E8F5]" /> Actionable Match Optimization Tips
          </h3>
          <div className="space-y-3">
            {(match.recommendations || [
              'Incorporate missing keywords (e.g. Kubernetes, Terraform) into your Skills and Experience section bullets.',
              'Quantify metric impact in leadership project statements to match senior role expectations.',
              'Mirror exact phrasing from the target job posting for core framework requirements.'
            ]).map((rec, idx) => {
              const isExpanded = expandedRecs[idx];
              return (
                <div 
                  key={idx} 
                  className="rounded-xl bg-slate-950/40 border border-slate-800/80 overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleRec(idx)}
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

      </div>
    </div>
  );
}

function MatchCategoryBadge({ category }) {
  if (category === 'Excellent') return <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">Excellent Match</span>;
  if (category === 'Strong') return <span className="px-3.5 py-1 rounded-full bg-[#38E8F5]/10 border border-[#38E8F5]/20 text-[#38E8F5] text-xs font-bold uppercase tracking-wider">Strong Match</span>;
  if (category === 'Moderate') return <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">Moderate Match</span>;
  return <span className="px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">Weak Match</span>;
}

function JdMatchSkeletonLoading({ onBack }) {
  return (
    <div className="min-h-screen bg-[#032D30] text-slate-100 p-8 max-w-5xl mx-auto space-y-8 animate-pulse font-sans">
      <div className="h-8 w-64 bg-slate-800 rounded-lg" />
      <div className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-44 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="h-44 bg-slate-900 rounded-2xl border border-slate-800" />
      </div>
      <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800" />
    </div>
  );
}

function getSampleJdMatch() {
  return {
    overallMatch: 86,
    matchCategory: 'Strong',
    skills: {
      matched: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js', 'Tailwind CSS'],
      missing: ['Kubernetes', 'Terraform'],
      recommended: ['Docker', 'AWS ECS']
    },
    experience: {
      alignmentScore: 85,
      missingExperience: ['Direct Kubernetes cluster management'],
      strengths: ['Proven senior engineering leadership and micro-frontend architecture scale.']
    },
    education: {
      alignment: 95,
      recommendations: []
    },
    keywords: {
      matched: ['System Architecture', 'API Integration', 'Performance Optimization'],
      missing: ['Infrastructure-as-Code'],
      keywordCoverage: 82
    },
    recommendations: [
      'Incorporate missing keywords (e.g. Kubernetes, Terraform) into your Skills and Experience section bullets.',
      'Quantify metric impact in leadership project statements to match senior role expectations.',
      'Mirror exact phrasing from the target job posting for core framework requirements.'
    ],
    atsImpact: {
      score: 90,
      warnings: []
    }
  };
}
