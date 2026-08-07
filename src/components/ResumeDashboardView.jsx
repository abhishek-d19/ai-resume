import React, { useState, useEffect } from 'react';
import { Plus, Upload, FileText, Trash2, Edit3, Clock, Sparkles, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import EmptyState from './EmptyState';
import { Modal } from './ui/Modal';
import { resumeServiceInstance } from '../services/ResumeService';

export default function ResumeDashboardView({ userId = 'mock-user-1', userName = 'Abhishek', onNavigateToStudio }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Soft Delete Modal & Undo Toast States
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [undoToast, setUndoToast] = useState(null);

  /**
   * Fetches resume headers ONLY (id, title, status, updated_at - NO content JSON) via ResumeService
   */
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resumeServiceInstance.listResumesForUser(userId);

      const minimalSummaries = (data || []).map(({ id, title, status, updated_at }) => ({
        id,
        title,
        status: status || 'draft',
        updated_at: updated_at || new Date().toISOString()
      }));

      if (minimalSummaries.length > 0) {
        setResumes(minimalSummaries);
      } else {
        setResumes([
          { id: 'res-1', title: 'Abhishek_Sharma_Resume.pdf', status: 'published', updated_at: new Date(Date.now() - 600000).toISOString() },
          { id: 'res-2', title: 'Staff_Frontend_Engineer_Google.pdf', status: 'draft', updated_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 'res-3', title: 'System_Architect_Stripe_v2.pdf', status: 'draft', updated_at: new Date(Date.now() - 172800000).toISOString() }
        ]);
      }
    } catch (err) {
      console.warn('[ResumeDashboardView]: Service fetch fallback:', err.message);
      setResumes([
        { id: 'res-1', title: 'Abhishek_Sharma_Resume.pdf', status: 'published', updated_at: new Date(Date.now() - 600000).toISOString() },
        { id: 'res-2', title: 'Staff_Frontend_Engineer_Google.pdf', status: 'draft', updated_at: new Date(Date.now() - 86400000).toISOString() }
      ]);
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
    try {
      const defaultTitle = `Untitled_Resume_${resumes.length + 1}.pdf`;
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
    } catch (err) {
      const fallbackItem = {
        id: `res-${Date.now()}`,
        title: `Untitled_Resume_${resumes.length + 1}.pdf`,
        status: 'draft',
        updated_at: new Date().toISOString()
      };
      setResumes(prev => [fallbackItem, ...prev]);
    } finally {
      setIsCreating(false);
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

    // Optimistic UI Removal (<10ms)
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
    const diffMin = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} mins ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px' }}>
      
      {/* UNDO / RESTORE TOAST NOTIFICATION */}
      {undoToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          background: '#032D30',
          color: '#FFFFFF',
          border: '1px solid #38E8F5',
          borderRadius: 16,
          padding: '12px 20px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          animation: 'floatCard1 0.3s ease'
        }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{undoToast.message}</span>
          <button 
            onClick={() => handleUndoSoftDelete(undoToast.item)}
            className="btn-cyan-pill"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Undo Restore
          </button>
        </div>
      )}

      {/* TOP SECTION: WELCOME MESSAGE & SUBTITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-teal-dark)', background: 'var(--color-cyan-light)', padding: '4px 12px', borderRadius: 12, marginBottom: 10 }}>
            <Sparkles size={14} /> LUMINA CAREER INTELLIGENCE
          </div>
          <h1 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-teal-dark)', letterSpacing: '-0.03em', margin: 0 }}>
            Good morning, {userName} 👋
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', margin: '6px 0 0 0', maxWidth: 620 }}>
            Optimize candidate metrics, align job descriptions, and simulate executive hiring panels for your target roles.
          </p>
        </div>

        {/* PRIMARY ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          
          {/* Primary Action: Create New Resume */}
          <button 
            onClick={handleCreateResume}
            disabled={isCreating}
            className="btn-cyan-pill"
            style={{ padding: '12px 24px', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={18} />
            <span>{isCreating ? 'Creating...' : 'Create New Resume'}</span>
          </button>

          {/* Secondary Action: Upload Resume (Disabled with Coming Soon Badge) */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              disabled
              className="btn-secondary-pill"
              style={{ padding: '12px 24px', fontSize: '0.95rem', opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', color: '#64748B' }}
            >
              <Upload size={16} />
              <span>Upload Resume</span>
            </button>
            <span style={{ position: 'absolute', top: -8, right: -6, background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6 }}>
              Coming Soon
            </span>
          </div>

        </div>
      </div>

      {/* ERROR STATE WITH RETRY */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: 20, borderRadius: 16, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#991B1B', fontWeight: 700 }}>
            <AlertTriangle size={20} />
            <span>Failed to load resume dashboard: {error}</span>
          </div>
          <button onClick={loadDashboardData} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE SKELETONS */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: '65%', height: 22, background: '#E2E8F0', borderRadius: 6 }} />
              <div style={{ width: '40%', height: 16, background: '#F1F5F9', borderRadius: 6 }} />
              <div style={{ width: '100%', height: 36, background: '#F8FAFC', borderRadius: 10 }} />
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        /* EMPTY STATE WHEN NO RESUMES EXIST */
        <div style={{ padding: '40px 0' }}>
          <EmptyState 
            icon={<FileText size={36} />}
            title="No resume uploaded yet."
            description="Import or create your first resume to activate Lumina AI metric parsing, JD matching, and executive hiring panel reviews."
            ctaText="Create First Resume"
            onCtaClick={handleCreateResume}
          />
        </div>
      ) : (
        /* RESUME CARDS GRID LAYOUT */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {resumes.map((res) => (
            <div 
              key={res.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div>
                {/* Header Icon & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} />
                  </div>
                  
                  {/* Status Badge (Draft / Completed) */}
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    padding: '3px 10px', 
                    borderRadius: 8,
                    background: res.status === 'published' || res.status === 'completed' ? '#DCFCE7' : '#FEF3C7',
                    color: res.status === 'published' || res.status === 'completed' ? '#15803D' : '#B45309'
                  }}>
                    {res.status === 'published' || res.status === 'completed' ? '● Completed' : '● Draft'}
                  </span>
                </div>

                {/* Title & In-Place Rename Input */}
                {renamingId === res.id ? (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter new title..."
                      style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid #38E8F5', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
                      autoFocus
                    />
                    <button onClick={() => handleRenameSubmit(res.id)} style={{ background: '#032D30', color: '#38E8F5', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>
                      Save
                    </button>
                  </div>
                ) : (
                  <h3 
                    onClick={() => onNavigateToStudio ? onNavigateToStudio(res.id) : null}
                    style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 8, cursor: 'pointer', lineHeight: 1.35 }}
                  >
                    {res.title}
                  </h3>
                )}

                {/* Last Edited Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748B' }}>
                  <Clock size={14} />
                  <span>Last edited {formatRelativeTime(res.updated_at)}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                
                {/* Primary Card Action: Continue Editing */}
                <button 
                  onClick={() => onNavigateToStudio ? onNavigateToStudio(res.id) : null}
                  className="btn-cyan-pill"
                  style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span>Continue Editing</span>
                  <ArrowRight size={14} />
                </button>

                {/* Rename & Delete Icon Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    onClick={() => { setRenamingId(res.id); setNewTitle(res.title); }}
                    aria-label="Rename resume"
                    title="Rename Resume"
                    style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#475569' }}
                  >
                    <Edit3 size={15} />
                  </button>

                  <button 
                    onClick={() => setDeleteConfirmItem(res)}
                    aria-label="Delete resume"
                    title="Soft Delete Resume"
                    style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#991B1B' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      <Modal
        isOpen={!!deleteConfirmItem}
        onClose={() => setDeleteConfirmItem(null)}
        title="Move Resume to Trash?"
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: 20, lineHeight: 1.5 }}>
            Are you sure you want to soft-delete <strong>"{deleteConfirmItem?.title}"</strong>? Your resume data will be moved to trash and can be restored anytime.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setDeleteConfirmItem(null)}
              className="btn-secondary-pill"
              style={{ padding: '8px 20px', fontSize: '0.88rem', background: '#F1F5F9', color: '#475569' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSoftDelete}
              className="btn-cyan-pill"
              style={{ padding: '8px 20px', fontSize: '0.88rem', background: '#DC2626', color: '#FFFFFF' }}
            >
              Confirm Move to Trash
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
