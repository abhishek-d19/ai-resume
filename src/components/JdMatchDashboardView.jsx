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
  Zap,
  Download,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Layers,
  Award
} from 'lucide-react';

import { jdMatchServiceInstance } from '../services/JdMatchService';
import { resumeServiceInstance } from '../services/ResumeService';
import { jdOptimizationServiceInstance } from '../services/JdOptimizationService';
import { PdfExportService } from '../services/PdfExportService';
import JdOptimizationReviewModal from './JdOptimizationReviewModal';
import { DEMO_CANDIDATE_UUID } from '../constants/demoCandidate';

export default function JdMatchDashboardView({ resumeId = DEMO_CANDIDATE_UUID, userId, onBack, onNext }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expandedRecs, setExpandedRecs] = useState({});

  // Optimization Modal & Success States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingProposals, setGeneratingProposals] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [applyingChanges, setApplyingChanges] = useState(false);
  const [optimizationSuccess, setOptimizationSuccess] = useState(null);

  useEffect(() => {
    fetchLatestMatch();
  }, [resumeId, userId]);

  const fetchLatestMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const matchResult = await jdMatchServiceInstance.getLatestJdMatchResult(userId, resumeId);
      setData(matchResult);
    } catch (err) {
      console.error('[JdMatchService Error]:', err.message);
      setError(err.message || 'Failed to load JD match results.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunMatch = async (e) => {
    if (e) e.preventDefault();
    if (!jobDescription.trim()) return;

    setMatching(true);
    setError(null);
    setOptimizationSuccess(null);
    try {
      const matchResult = await jdMatchServiceInstance.matchJobDescription(userId, resumeId, jobDescription);
      setData(matchResult);
    } catch (err) {
      console.error('[JdMatchService Execute Error]:', err.message);
      setError(err.message || 'JD Match execution failed.');
    } finally {
      setMatching(false);
    }
  };

  const handleOpenOptimizationModal = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a target Job Description before applying AI optimizations.');
      return;
    }

    setGeneratingProposals(true);
    setError(null);
    try {
      const missingSkills = data?.skills?.missing || [];
      const proposal = await jdOptimizationServiceInstance.generateOptimizationProposals(
        userId,
        resumeId,
        jobDescription,
        missingSkills
      );
      setProposalData(proposal);
      setIsModalOpen(true);
    } catch (err) {
      console.error('[JdOptimizationService Proposal Error]:', err.message);
      setError(err.message || 'Failed to generate AI optimization proposals.');
    } finally {
      setGeneratingProposals(false);
    }
  };

  const handleApplySelectedChanges = async (selectedChanges) => {
    if (!selectedChanges || selectedChanges.length === 0) return;

    setApplyingChanges(true);
    setError(null);
    try {
      const currentResume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
      const originalContent = currentResume.content || {};

      // 1. Create new resume version (v2) in Supabase
      const updatedResume = await jdOptimizationServiceInstance.applyOptimizationsAndCreateNewVersion(
        userId,
        resumeId,
        originalContent,
        selectedChanges,
        'JD Optimized'
      );

      // 2. Recalculate JD Match for the newly saved version
      const recalculatedMatch = await jdMatchServiceInstance.matchJobDescription(
        userId,
        updatedResume.id,
        jobDescription
      );

      // 3. Update local dashboard state
      setData(recalculatedMatch);
      setIsModalOpen(false);

      const oldScore = data?.overallMatch || data?.matchScore || 70;
      const newScore = recalculatedMatch.overallMatch || recalculatedMatch.matchScore || 88;

      setOptimizationSuccess({
        newResumeId: updatedResume.id,
        version: updatedResume.version || 2,
        title: updatedResume.title,
        changesCount: selectedChanges.length,
        oldScore,
        newScore,
        scoreDiff: Math.max(0, newScore - oldScore),
        content: updatedResume.content
      });

    } catch (err) {
      console.error('[JdOptimizationService Apply Error]:', err.message);
      setError(err.message || 'Failed to persist optimized resume version to cloud.');
    } finally {
      setApplyingChanges(false);
    }
  };

  const handleDownloadPdf = () => {
    if (optimizationSuccess) {
      PdfExportService.downloadResumePdf(
        optimizationSuccess.content,
        optimizationSuccess.title,
        optimizationSuccess.version
      );
    } else {
      // Download current canonical resume
      resumeServiceInstance.getResumeForUser(userId, resumeId).then(res => {
        PdfExportService.downloadResumePdf(res.content || {}, res.title, res.version || 1);
      });
    }
  };

  const toggleRec = (idx) => {
    setExpandedRecs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return <JdMatchSkeletonLoading onBack={onBack} />;
  }

  if (error && !data) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 36, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Job Description Match Execution Note</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 24, lineHeight: 1.5 }}>{error}</p>
          <button 
            onClick={fetchLatestMatch}
            style={{ padding: '10px 24px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', border: 'none', cursor: 'pointer' }}
          >
            Retry JD Match
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 36, maxWidth: 560, width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Target size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Job Description Match Engine</h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24, lineHeight: 1.5 }}>Paste target role details below to analyze skill gaps, keyword coverage, and ATS alignment.</p>
          <form onSubmit={handleRunMatch} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting requirements, responsibilities, or tech stack..."
              style={{ width: '100%', height: 140, padding: 16, borderRadius: 16, background: '#F8FAFC', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }}
              required
            />
            <button
              type="submit"
              disabled={matching || !jobDescription.trim()}
              style={{ width: '100%', padding: '12px 24px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer', opacity: matching ? 0.5 : 1 }}
            >
              {matching ? 'Analyzing Alignment...' : 'Run JD Match Audit'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const match = data;
  const overallMatch = match.overallMatch || match.matchScore || 0;
  const matchCategory = match.matchCategory || 'Strong';
  const skills = match.skills || { matched: [], missing: [], recommended: [] };
  const experience = match.experience || { alignmentScore: 0, missingExperience: [], strengths: [] };
  const education = match.education || { alignment: 0, recommendations: [] };
  const keywords = match.keywords || { matched: [], missing: [], keywordCoverage: 0 };
  const atsImpact = match.atsImpact || { score: 0, warnings: [] };

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '24px 16px 140px 16px', overflowX: 'hidden', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
        
        {/* HEADER CARD */}
        <header style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {onBack && (
              <button 
                onClick={onBack}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            )}
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Job Description Match Engine <Target size={22} color="#0284C7" />
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>Competency alignment, skill gap detection, and keyword coverage</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleOpenOptimizationModal}
              disabled={generatingProposals || !jobDescription.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', border: 'none', cursor: 'pointer', opacity: (generatingProposals || !jobDescription.trim()) ? 0.5 : 1, boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
            >
              <Sparkles size={16} className={generatingProposals ? 'animate-spin' : ''} />
              <span>{generatingProposals ? 'Generating AI Proposals...' : 'Apply Changes →'}</span>
            </button>
          </div>
        </header>

        {/* SUCCESS BANNER AFTER APPLYING CHANGES */}
        {optimizationSuccess && (
          <div style={{ background: '#0B192C', color: '#FFFFFF', padding: 28, borderRadius: 20, border: '1px solid #1E293B', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontSize: '0.75rem', fontWeight: 900, marginBottom: 8 }}>
                <Check size={14} /> RESUME OPTIMIZED & SAVED (v{optimizationSuccess.version})
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                {optimizationSuccess.title}
              </h3>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.82rem', color: '#94A3B8' }}>
                <span>Applied: <strong style={{ color: '#FFFFFF' }}>{optimizationSuccess.changesCount} Changes</strong></span>
                <span>•</span>
                <span>Alignment Match: <strong style={{ color: '#38E8F5' }}>{optimizationSuccess.newScore}% (+{optimizationSuccess.scoreDiff}%)</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleDownloadPdf}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 16, background: '#38E8F5', color: '#032D30', fontWeight: 900, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
              >
                <Download size={15} />
                <span>Download Updated PDF</span>
              </button>

              <button
                onClick={() => onNext && onNext(optimizationSuccess.newResumeId)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 16, background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <span>Open Updated Resume Studio</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* INPUT FORM CARD */}
        <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleRunMatch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
              Target Job Description (JD)
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description text (requirements, tech stack, responsibilities)..."
              style={{ width: '100%', padding: 14, borderRadius: 12, background: '#F8FAFC', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={matching || !jobDescription.trim()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 20, background: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem', border: 'none', cursor: 'pointer', opacity: (matching || !jobDescription.trim()) ? 0.5 : 1 }}
              >
                <Search size={14} className={matching ? 'animate-spin' : ''} />
                {matching ? 'Analyzing Alignment...' : 'Analyze Match'}
              </button>
            </div>
          </form>
        </div>

        {/* TOP METRICS ROW: OVERALL MATCH & ALIGNMENT SUMMARY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, minWidth: 0 }}>
          
          {/* OVERALL MATCH CARD */}
          <div style={{ background: '#0B192C', color: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #1E293B', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={16} color="#38E8F5" /> Overall Alignment Match
            </span>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '16px 0' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                {overallMatch}%
              </span>
              <MatchCategoryBadge category={matchCategory} />
            </div>

            <div style={{ width: '100%', background: '#1E293B', height: 10, borderRadius: 5, overflow: 'hidden' }}>
              <div 
                style={{ width: `${overallMatch}%`, height: '100%', background: '#38E8F5', borderRadius: 5, transition: 'all 1s ease-out' }} 
              />
            </div>
          </div>

          {/* SUMMARY CARD */}
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={18} color="#0284C7" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Competency Alignment Summary</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Your resume demonstrates <strong style={{ color: '#0284C7' }}>{matchCategory.toLowerCase()} alignment</strong> with target job requirements. Core technical competencies match closely.
            </p>
            <div style={{ paddingTop: 12, borderTop: '1px solid #F1F5F9', fontSize: '0.78rem', color: '#64748B', display: 'flex', gap: 16 }}>
              <span>Keyword Coverage: <strong style={{ color: '#0F172A' }}>{keywords.keywordCoverage || 82}%</strong></span>
              <span>•</span>
              <span>Experience Match: <strong style={{ color: '#0F172A' }}>{experience.alignmentScore || 85}%</strong></span>
            </div>
          </div>

        </div>

        {/* SKILLS SECTION: MATCHED VS MISSING */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, minWidth: 0 }}>
          
          {/* MATCHED SKILLS */}
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #A7F3D0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', minWidth: 0 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#059669" /> Matched Skills ({skills.matched?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(skills.matched || []).map((skill, idx) => (
                <span key={idx} style={{ padding: '6px 12px', borderRadius: 20, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={13} color="#059669" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* MISSING SKILLS */}
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #FCA5A5', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', minWidth: 0 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} color="#DC2626" /> Missing / Gap Skills ({skills.missing?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(skills.missing || []).length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>Zero critical skill gaps detected.</p>
              ) : (
                skills.missing.map((skill, idx) => (
                  <span key={idx} style={{ padding: '6px 12px', borderRadius: 20, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={13} color="#DC2626" /> {skill}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ACTIONABLE RECOMMENDATIONS */}
        <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} color="#0284C7" /> Actionable Match Optimization Tips
            </h3>
            
            <button
              onClick={handleOpenOptimizationModal}
              disabled={generatingProposals || !jobDescription.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 16, background: '#0284C7', color: '#FFFFFF', fontSize: '0.8rem', fontWeight: 800, border: 'none', cursor: 'pointer', opacity: (generatingProposals || !jobDescription.trim()) ? 0.5 : 1 }}
            >
              <Sparkles size={14} />
              <span>Apply Recommended Optimizations →</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(match.recommendations || [
              'Incorporate missing keywords (e.g. Kubernetes, Terraform) into your Skills and Experience section bullets.',
              'Quantify metric impact in leadership project statements to match senior role expectations.',
              'Mirror exact phrasing from the target job posting for core framework requirements.'
            ]).map((rec, idx) => {
              const isExpanded = expandedRecs[idx];
              return (
                <div 
                  key={idx} 
                  style={{ borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC', overflow: 'hidden' }}
                >
                  <button
                    onClick={() => toggleRec(idx)}
                    style={{ width: '100%', padding: 12, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', cursor: 'pointer' }}
                  >
                    <span>{idx + 1}. {rec.split(':')[0]}</span>
                    {isExpanded ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
                  </button>
                  {isExpanded && (
                    <div style={{ padding: '0 12px 12px 12px', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, borderTop: '1px solid #F1F5F9', paddingTop: 8 }}>
                      {rec}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI OPTIMIZATION REVIEW MODAL */}
        <JdOptimizationReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          proposalSummary={proposalData?.summary}
          changes={proposalData?.changes || []}
          onApplySelectedChanges={handleApplySelectedChanges}
          applying={applyingChanges}
        />

      </div>
    </main>
  );
}

function MatchCategoryBadge({ category }) {
  if (category === 'Excellent') return <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #34D399', color: '#6EE7B7', fontSize: '0.75rem', fontWeight: 800 }}>EXCELLENT MATCH</span>;
  if (category === 'Strong') return <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(56, 232, 245, 0.2)', border: '1px solid #38E8F5', color: '#38E8F5', fontSize: '0.75rem', fontWeight: 800 }}>STRONG MATCH</span>;
  if (category === 'Moderate') return <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #FBBF24', color: '#FDE68A', fontSize: '0.75rem', fontWeight: 800 }}>MODERATE MATCH</span>;
  return <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #FCA5A5', color: '#FCA5A5', fontSize: '0.75rem', fontWeight: 800 }}>WEAK MATCH</span>;
}

function JdMatchSkeletonLoading({ onBack }) {
  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 36, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <Sparkles size={28} className="animate-spin" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Analyzing Job Description Match...</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Comparing candidate skills, experience, and keyword coverage against JD requirements.</p>
      </div>
    </main>
  );
}
