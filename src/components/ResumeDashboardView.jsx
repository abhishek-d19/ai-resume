import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, FileText, Trash2, Edit3, Clock, Sparkles, AlertCircle, RotateCcw, ArrowRight, FileUp, CheckCircle2, ChevronRight, BarChart3, Target, Users2, ShieldCheck, RefreshCw } from 'lucide-react';
import ResumeUploadModalView from './ResumeUploadModalView';
import { Modal } from './ui/Modal';
import { resumeServiceInstance } from '../services/ResumeService';

export default function ResumeDashboardView({ userId, userName = 'Candidate', onNavigateToStudio }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const fileInputRef = useRef(null);

  // Soft Delete Modal & Undo Toast States
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [undoToast, setUndoToast] = useState(null);

  const [metrics, setMetrics] = useState({
    resumeCount: 0,
    recentResume: null,
    recentAnalysisScore: null,
    recentJdMatchScore: null,
    recentHiringPanelDecision: null
  });

  const firstName = userName ? userName.split(' ')[0] : 'Candidate';

  /**
   * Fetches real resume headers & dynamic analytics from Supabase tables
   */
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listData, metricsData] = await Promise.all([
        resumeServiceInstance.listResumesForUser(userId),
        resumeServiceInstance.getDashboardMetrics(userId)
      ]);

      const summaries = (listData || []).map(({ id, title, status, updated_at }) => ({
        id,
        title,
        status: status || 'draft',
        updated_at: updated_at || new Date().toISOString()
      }));

      setResumes(summaries);
      setMetrics(metricsData);
    } catch (err) {
      console.error('[ResumeDashboardView Fetch Error]:', err.message);
      setError('Something went wrong while loading your dashboard. Please try again.');
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  /**
   * Action: Create New Resume via ResumeService
   */
  const handleCreateResume = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const defaultTitle = `Executive Resume ${resumes.length + 1}`;
      const created = await resumeServiceInstance.createResume({
        userId,
        title: defaultTitle
      });

      setResumes(prev => [{
        id: created.id,
        title: created.title,
        status: created.status || 'draft',
        updated_at: created.updated_at
      }, ...prev]);

      if (onNavigateToStudio) {
        onNavigateToStudio(created.id);
      }
    } catch (err) {
      console.error('[Create Resume Error]:', err?.message || err);
      setError(`Failed to create resume in database: ${err?.message || 'Please check your connection and try again.'}`);
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Action: Trigger upload modal or hidden file input
   */
  const handleTriggerUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedUploadFile(files[0]);
      setIsUploadModalOpen(true);
    }
  };

  /**
   * Action: Rename Resume Title via ResumeService
   */
  const handleRenameSubmit = async (id) => {
    if (!newTitle.trim()) return;
    try {
      const updated = await resumeServiceInstance.updateResume({
        userId,
        resumeId: id,
        title: newTitle.trim(),
        incrementVersion: false
      });

      setResumes(prev => prev.map(r => r.id === id ? { ...r, title: updated.title, updated_at: updated.updated_at } : r));
    } catch (err) {
      console.error('[Rename Error]:', err.message);
      setResumes(prev => prev.map(r => r.id === id ? { ...r, title: newTitle.trim(), updated_at: new Date().toISOString() } : r));
    } finally {
      setRenamingId(null);
      setNewTitle('');
    }
  };

  /**
   * Action: Confirm Soft Delete with Optimistic UI Update
   */
  const handleConfirmSoftDelete = async () => {
    if (!deleteConfirmItem) return;
    const targetItem = deleteConfirmItem;
    setDeleteConfirmItem(null);

    setResumes(prev => prev.filter(r => r.id !== targetItem.id));

    setUndoToast({
      message: `"${targetItem.title}" moved to trash.`,
      item: targetItem
    });

    try {
      await resumeServiceInstance.deleteResume(userId, targetItem.id);
    } catch (err) {
      console.warn("Soft delete sync fallback:", err.message);
    }
  };

  /**
   * Action: Undo / Restore Soft Delete
   */
  const handleUndoSoftDelete = async (targetItem) => {
    setUndoToast(null);
    setResumes(prev => [targetItem, ...prev]);

    try {
      await resumeServiceInstance.restoreResume(userId, targetItem.id);
    } catch (err) {
      console.warn("Restore sync fallback:", err.message);
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Recently';
    const diffMin = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const handleUploadSuccess = (createdResume) => {
    setIsUploadModalOpen(false);
    setSelectedUploadFile(null);
    if (createdResume && createdResume.id) {
      console.log('[Dashboard Upload Diagnostic]: Received database resume UUID:', createdResume.id);
      setResumes(prev => [{
        id: createdResume.id,
        title: createdResume.title,
        status: createdResume.status || 'draft',
        updated_at: createdResume.updated_at || new Date().toISOString()
      }, ...prev]);

      if (onNavigateToStudio) {
        onNavigateToStudio(createdResume.id);
      }
    }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 72px)', color: '#0F172A', paddingBottom: 60 }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="application/pdf,.pdf" 
        onChange={handleFileSelect} 
      />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 24px' }}>

        {/* DISMISSIBLE ERROR BANNER */}
        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 16,
            padding: '14px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertCircle size={20} color="#DC2626" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#991B1B' }}>Couldn't load your resumes</div>
                <div style={{ fontSize: '0.82rem', color: '#B91C1C' }}>{error}</div>
              </div>
            </div>
            <button 
              onClick={loadDashboardData}
              style={{
                background: '#FFFFFF',
                border: '1px solid #FCA5A5',
                borderRadius: 10,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#991B1B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* WELCOME HERO HEADER */}
        <header style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 20, color: '#0284C7', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
            <Sparkles size={13} />
            <span>Good morning, {firstName}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', tracking: '-0.02em', lineHeight: 1.2, margin: 0 }}>
                Build a resume that gets noticed.
              </h1>
              <p style={{ fontSize: '0.98rem', color: '#64748B', marginTop: 6, margin: '6px 0 0 0', maxWidth: 640 }}>
                Create, analyze, and optimize your resume with AI-powered hiring intelligence.
              </p>
            </div>
          </div>
        </header>

        {/* PRIMARY ACTIONS GRID (2 Columns Desktop / 1 Column Mobile) */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 36 }}>
          
          {/* CARD 1: Create New Resume */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '28px 24px',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Plus size={22} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Create New Resume
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                Start fresh with our ATS-ready canonical structure and real-time AI bullet optimization.
              </p>
            </div>

            <button
              onClick={handleCreateResume}
              disabled={isCreating}
              style={{
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: isCreating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
                width: 'fit-content'
              }}
            >
              <span>{isCreating ? 'Creating Resume...' : 'Create Resume →'}</span>
            </button>
          </div>

          {/* CARD 2: Upload Resume */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '28px 24px',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F0F9FF', border: '1px solid #E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <FileUp size={22} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Upload Resume
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                Import your existing PDF file and let Lumina structure and score it automatically.
              </p>
            </div>

            <button
              onClick={handleTriggerUpload}
              style={{
                background: '#0EA5E9',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '12px 20px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
                width: 'fit-content'
              }}
            >
              <span>Upload PDF →</span>
            </button>
          </div>

        </section>

        {/* DATA-DRIVEN "YOUR NEXT STEP" BANNER */}
        <section style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 20,
          padding: '24px 28px',
          color: '#FFFFFF',
          marginBottom: 36,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(56, 232, 245, 0.15)', color: '#38E8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38E8F5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                Your Next Step
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>
                {resumes.length === 0 
                  ? "Upload or create your first resume to begin AI optimization."
                  : metrics.recentAnalysisScore 
                    ? "Your resume is analyzed! Run a JD Match audit against a target job posting."
                    : "Your resume is ready for its first AI ATS & Competency Audit."
                }
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (resumes.length === 0) {
                handleTriggerUpload();
              } else if (onNavigateToStudio) {
                onNavigateToStudio(resumes[0].id);
              }
            }}
            style={{
              background: '#38E8F5',
              color: '#032D30',
              border: 'none',
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            <span>
              {resumes.length === 0 ? "Upload Resume →" : metrics.recentAnalysisScore ? "Match a Job →" : "Analyze Resume →"}
            </span>
          </button>
        </section>

        {/* QUICK INSIGHTS GRID (Rendered when resumes exist) */}
        {resumes.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
              Quick Insights
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Resumes</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', marginTop: 4 }}>{resumes.length}</div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>AI Analyses</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0EA5E9', marginTop: 4 }}>
                  {metrics.recentAnalysisScore !== null ? '1' : '0'}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>JD Matches</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0D9488', marginTop: 4 }}>
                  {metrics.recentJdMatchScore !== null ? '1' : '0'}
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '18px 20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Avg ATS Score</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: metrics.recentAnalysisScore ? '#166534' : '#64748B', marginTop: 4 }}>
                  {metrics.recentAnalysisScore ? `${metrics.recentAnalysisScore}%` : 'N/A'}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RESUMES OVERVIEW / EMPTY STATE */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Your Resumes
            </h3>
            {resumes.length > 0 && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0EA5E9', cursor: 'pointer' }}>
                View All →
              </span>
            )}
          </div>

          {loading ? (
            /* SKELETON LOADING GRID */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, height: 160, opacity: 0.6, animation: 'pulse 1.5s infinite' }}>
                  <div style={{ width: '60%', height: 18, background: '#E2E8F0', borderRadius: 6, marginBottom: 12 }} />
                  <div style={{ width: '40%', height: 14, background: '#F1F5F9', borderRadius: 6, marginBottom: 24 }} />
                  <div style={{ width: '100%', height: 36, background: '#F8FAFC', borderRadius: 10 }} />
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            /* EMPTY STATE CARD */
            <div style={{
              background: '#FFFFFF',
              border: '1px border-dashed #CBD5E1',
              borderRadius: 20,
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <FileText size={28} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                No resumes yet
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: 420, margin: '0 auto 24px auto' }}>
                Create your first resume or upload an existing PDF to get started with Lumina AI.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={handleCreateResume}
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Plus size={16} />
                  <span>Create Resume</span>
                </button>

                <button
                  onClick={handleTriggerUpload}
                  style={{
                    background: '#FFFFFF',
                    color: '#0F172A',
                    border: '1px solid #CBD5E1',
                    borderRadius: 12,
                    padding: '10px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Upload size={16} />
                  <span>Upload PDF</span>
                </button>
              </div>
            </div>
          ) : (
            /* RESUMES GRID */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
              {resumes.map(resume => (
                <div 
                  key={resume.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 16,
                    padding: 20,
                    boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                      
                      {renamingId === resume.id ? (
                        <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                          <input 
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(resume.id)}
                            autoFocus
                            style={{ flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #38E8F5', fontSize: '0.9rem', outline: 'none' }}
                          />
                          <button onClick={() => handleRenameSubmit(resume.id)} style={{ padding: '4px 8px', background: '#0F172A', color: '#FFF', borderRadius: 6, border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Save</button>
                        </div>
                      ) : (
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, wordBreak: 'break-word' }}>
                          {resume.title}
                        </h4>
                      )}

                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 8,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: resume.status === 'analyzed' ? '#F0FDF4' : '#F1F5F9',
                        color: resume.status === 'analyzed' ? '#166534' : '#475569',
                        border: resume.status === 'analyzed' ? '1px solid #DCFCE7' : '1px solid #E2E8F0'
                      }}>
                        {resume.status === 'analyzed' ? 'AI Verified' : 'Draft'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748B', marginBottom: 20 }}>
                      <Clock size={12} />
                      <span>Updated {formatRelativeTime(resume.updated_at)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                    <button
                      onClick={() => onNavigateToStudio && onNavigateToStudio(resume.id)}
                      style={{
                        background: '#F8FAFC',
                        color: '#0F172A',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>Continue Editing</span>
                      <ArrowRight size={13} />
                    </button>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button 
                        onClick={() => { setRenamingId(resume.id); setNewTitle(resume.title); }}
                        title="Rename"
                        style={{ background: 'none', border: 'none', padding: 6, color: '#64748B', cursor: 'pointer', borderRadius: 6 }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmItem(resume)}
                        title="Delete"
                        style={{ background: 'none', border: 'none', padding: 6, color: '#EF4444', cursor: 'pointer', borderRadius: 6 }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* SOFT DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <Modal isOpen={Boolean(deleteConfirmItem)} onClose={() => setDeleteConfirmItem(null)} title="Delete Resume">
          <div style={{ padding: '8px 0' }}>
            <p style={{ fontSize: '0.92rem', color: '#475569', marginBottom: 24, lineHeight: 1.5 }}>
              Are you sure you want to move <strong>"{deleteConfirmItem.title}"</strong> to trash?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={() => setDeleteConfirmItem(null)}
                style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSoftDelete}
                style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#EF4444', color: '#FFF', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Move to Trash
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RESUME UPLOAD MODAL */}
      {isUploadModalOpen && (
        <ResumeUploadModalView 
          userId={userId}
          isOpen={isUploadModalOpen}
          initialFile={selectedUploadFile}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedUploadFile(null);
          }}
          onUploadComplete={handleUploadSuccess}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* UNDO TOAST NOTIFICATION */}
      {undoToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: 14,
          padding: '12px 20px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{undoToast.message}</span>
          <button 
            onClick={() => handleUndoSoftDelete(undoToast.item)}
            style={{ background: '#38E8F5', color: '#032D30', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <RotateCcw size={12} /> Undo
          </button>
        </div>
      )}

    </div>
  );
}
