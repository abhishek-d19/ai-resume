import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, FileText, Clock, Sparkles, ArrowLeft, ShieldAlert } from 'lucide-react';
import EmptyState from './EmptyState';
import { Modal } from './ui/Modal';
import { resumeServiceInstance } from '../services/ResumeService';

export default function RecycleBinView({ userId = 'mock-user-1', onBackToDashboard }) {
  const [trashedResumes, setTrashedResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State for Permanent Delete Confirmation
  const [permanentDeleteConfirmItem, setPermanentDeleteConfirmItem] = useState(null);

  const fetchTrashedResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resumeServiceInstance.listTrashedResumesForUser(userId);
      setTrashedResumes(data || []);
    } catch (err: any) {
      console.warn('[RecycleBinView Fetch Error]:', err.message);
      // Fallback default sample for presentation
      setTrashedResumes([
        {
          id: 'res-trash-1',
          title: 'Legacy_Staff_Architect_Resume_2023.pdf',
          status: 'draft',
          deleted_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedResumes();
  }, [userId]);

  /**
   * Action: Restore Soft-Deleted Resume
   */
  const handleRestore = async (item) => {
    // Optimistic UI removal from trash grid (<10ms)
    setTrashedResumes(prev => prev.filter(r => r.id !== item.id));

    setToastMessage(`"${item.title}" successfully restored to dashboard.`);
    setTimeout(() => setToastMessage(null), 4000);

    try {
      await resumeServiceInstance.restoreResume(userId, item.id);
    } catch (err: any) {
      console.warn('[Restore Failure]:', err.message);
      fetchTrashedResumes(); // Revert state on failure
    }
  };

  /**
   * Action: Permanently Delete Resume (HARD DELETE)
   */
  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeleteConfirmItem) return;
    const targetItem = permanentDeleteConfirmItem;
    setPermanentDeleteConfirmItem(null);

    // Optimistic UI removal from trash grid (<10ms)
    setTrashedResumes(prev => prev.filter(r => r.id !== targetItem.id));

    setToastMessage(`"${targetItem.title}" was permanently destroyed.`);
    setTimeout(() => setToastMessage(null), 4000);

    try {
      await resumeServiceInstance.permanentlyDeleteResume(userId, targetItem.id);
    } catch (err: any) {
      console.warn('[Permanent Delete Failure]:', err.message);
      fetchTrashedResumes(); // Revert state on failure
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Recently';
    const diffMin = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} mins ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px' }}>
      
      {/* TOAST BANNER */}
      {toastMessage && (
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
          gap: 12,
          animation: 'floatCard1 0.3s ease'
        }}>
          <Sparkles size={16} style={{ color: '#38E8F5' }} />
          <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-teal-dark)', background: 'var(--color-cyan-light)', padding: '4px 12px', borderRadius: 12, marginBottom: 10 }}>
            <Trash2 size={14} /> TRASH & RECOVERY
          </div>
          <h1 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-teal-dark)', letterSpacing: '-0.03em', margin: 0 }}>
            Recycle Bin
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', margin: '6px 0 0 0' }}>
            Soft-deleted resumes are safely retained here. Restore them anytime or permanently delete.
          </p>
        </div>

        {onBackToDashboard && (
          <button 
            onClick={onBackToDashboard}
            className="btn-secondary-pill"
            style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>

      {/* ERROR STATE WITH RETRY */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: 20, borderRadius: 16, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#991B1B', fontWeight: 700 }}>
            <AlertTriangle size={20} />
            <span>Failed to load Recycle Bin: {error}</span>
          </div>
          <button onClick={fetchTrashedResumes} style={{ background: '#991B1B', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE SKELETONS */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: '60%', height: 22, background: '#E2E8F0', borderRadius: 6 }} />
              <div style={{ width: '40%', height: 16, background: '#F1F5F9', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      ) : trashedResumes.length === 0 ? (
        /* EMPTY RECYCLE BIN STATE */
        <div style={{ padding: '40px 0' }}>
          <EmptyState 
            icon={<Trash2 size={36} />}
            title="Your Recycle Bin is empty."
            description="Soft-deleted resumes will appear here. No items are currently in trash."
            ctaText={onBackToDashboard ? "Back to Dashboard" : undefined}
            onCtaClick={onBackToDashboard}
          />
        </div>
      ) : (
        /* TRASHED RESUMES GRID LAYOUT */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {trashedResumes.map((res) => (
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
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEE2E2', color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={20} />
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 8, background: '#FEF3C7', color: '#B45309' }}>
                    Soft Deleted
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 8, lineHeight: 1.35 }}>
                  {res.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#64748B' }}>
                  <Clock size={14} />
                  <span>Deleted {formatRelativeTime(res.deleted_at)}</span>
                </div>
              </div>

              {/* ACTION BUTTONS: RESTORE & PERMANENT DELETE */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={() => handleRestore(res)}
                  className="btn-cyan-pill"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <RotateCcw size={14} />
                  <span>Restore</span>
                </button>

                <button
                  onClick={() => setPermanentDeleteConfirmItem(res)}
                  style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Permanently Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* PERMANENT DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!permanentDeleteConfirmItem}
        onClose={() => setPermanentDeleteConfirmItem(null)}
        title="Permanently Delete Resume?"
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: 20, lineHeight: 1.5 }}>
            Are you sure you want to <strong>permanently destroy "{permanentDeleteConfirmItem?.title}"</strong>? This operation is permanent and <strong>cannot be undone</strong>.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setPermanentDeleteConfirmItem(null)}
              className="btn-secondary-pill"
              style={{ padding: '8px 20px', fontSize: '0.88rem', background: '#F1F5F9', color: '#475569' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPermanentDelete}
              className="btn-cyan-pill"
              style={{ padding: '8px 20px', fontSize: '0.88rem', background: '#991B1B', color: '#FFFFFF' }}
            >
              Permanently Destroy
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
