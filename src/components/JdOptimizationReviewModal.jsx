import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  RefreshCw,
  Layers,
  FileText,
  User,
  Briefcase,
  Code,
  GraduationCap
} from 'lucide-react';
import { JdOptimizationChange } from '../features/ai/schemas/jd-optimization.schema';

export default function JdOptimizationReviewModal({
  isOpen,
  onClose,
  proposalSummary,
  changes = [],
  onApplySelectedChanges,
  applying = false
}) {
  const [selectedIds, setSelectedIds] = useState({});

  useEffect(() => {
    if (changes && changes.length > 0) {
      // Default: HIGH and MEDIUM selected, LOW unselected
      const initialSelected = {};
      changes.forEach((change) => {
        initialSelected[change.id] = change.priority === 'high' || change.priority === 'medium';
      });
      setSelectedIds(initialSelected);
    }
  }, [changes]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;
  const highCount = changes.filter(c => c.priority === 'high').length;
  const medCount = changes.filter(c => c.priority === 'medium').length;
  const lowCount = changes.filter(c => c.priority === 'low').length;

  const handleApply = () => {
    const selectedChanges = changes.filter(c => selectedIds[c.id]);
    onApplySelectedChanges(selectedChanges);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(11, 25, 44, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        
        {/* MODAL HEADER */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 800, marginBottom: 6 }}>
              <Sparkles size={13} /> AI RESUME OPTIMIZATION
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Review Recommended Optimization Changes
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Review the changes Lumina recommends for this role before applying them to a new resume version.
            </p>
          </div>

          <button 
            onClick={onClose}
            disabled={applying}
            style={{ width: 36, height: 36, borderRadius: 18, background: '#FFFFFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* PROPOSAL STRATEGY SUMMARY BANNER */}
        <div style={{ padding: '16px 28px', background: '#0B192C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: '0.85rem', color: '#CBD5E1', flex: 1, minWidth: 260 }}>
            <span style={{ color: '#38E8F5', fontWeight: 900 }}>Strategy: </span>
            {proposalSummary || `${changes.length} targeted improvements generated to maximize ATS alignment.`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', fontWeight: 800 }}>
            <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #FCA5A5', color: '#FCA5A5' }}>
              {highCount} High Impact
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #FDE68A', color: '#FDE68A' }}>
              {medCount} Medium Impact
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 12, background: 'rgba(100, 116, 139, 0.2)', border: '1px solid #94A3B8', color: '#94A3B8' }}>
              {lowCount} Low Impact
            </span>
          </div>
        </div>

        {/* CHANGES SCROLLABLE LIST */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {changes.map((change) => {
            const isSelected = Boolean(selectedIds[change.id]);
            return (
              <div 
                key={change.id}
                onClick={() => toggleSelect(change.id)}
                style={{
                  border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                  borderRadius: 16,
                  padding: 20,
                  background: isSelected ? '#FFFFFF' : '#F8FAFC',
                  boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* CARD HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(change.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: 18, height: 18, accentColor: '#0284C7', cursor: 'pointer' }}
                    />
                    <PriorityBadge priority={change.priority} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {getSectionIcon(change.section)} {formatSectionName(change.section)}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase' }}>
                    {change.type}
                  </span>
                </div>

                {/* REASON */}
                <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 12, fontWeight: 600 }}>
                  <span style={{ color: '#0284C7', fontWeight: 800 }}>Why: </span>{change.reason}
                </div>

                {/* BEFORE / AFTER DIFF PANELS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  
                  {/* BEFORE PANEL */}
                  <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: 4 }}>
                      BEFORE (ORIGINAL)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                      {change.before ? `"${change.before}"` : <span style={{ fontStyle: 'italic', color: '#94A3B8' }}>(Section item absent in original)</span>}
                    </div>
                  </div>

                  {/* AFTER PANEL */}
                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', marginBottom: 4 }}>
                      AFTER (PROPOSED)
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600, lineHeight: 1.45 }}>
                      "{change.after}"
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
            Selected: <span style={{ color: '#0284C7', fontWeight: 900 }}>{selectedCount}</span> of {changes.length} changes
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onClose}
              disabled={applying}
              style={{ padding: '10px 20px', borderRadius: 12, background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              disabled={applying || selectedCount === 0}
              style={{
                padding: '10px 28px',
                borderRadius: 12,
                background: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                opacity: (applying || selectedCount === 0) ? 0.5 : 1
              }}
            >
              {applying ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{applying ? 'Applying Improvements...' : `Apply ${selectedCount} Selected Changes →`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  if (priority === 'high') {
    return <span style={{ padding: '3px 10px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '0.7rem', fontWeight: 900 }}>HIGH IMPACT</span>;
  }
  if (priority === 'medium') {
    return <span style={{ padding: '3px 10px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706', fontSize: '0.7rem', fontWeight: 900 }}>MEDIUM IMPACT</span>;
  }
  return <span style={{ padding: '3px 10px', borderRadius: 12, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#64748B', fontSize: '0.7rem', fontWeight: 900 }}>LOW IMPACT</span>;
}

function formatSectionName(key) {
  const names = {
    personalInfo: 'Personal Info',
    summary: 'Professional Summary',
    education: 'Education',
    experience: 'Work Experience',
    projects: 'Key Projects',
    skills: 'Technical Skills',
    certifications: 'Certifications',
    achievements: 'Achievements',
    languages: 'Languages'
  };
  return names[key] || key;
}

function getSectionIcon(key) {
  switch (key) {
    case 'summary': return <FileText size={14} color="#0284C7" />;
    case 'skills': return <Zap size={14} color="#0284C7" />;
    case 'experience': return <Briefcase size={14} color="#0284C7" />;
    case 'projects': return <Code size={14} color="#0284C7" />;
    case 'education': return <GraduationCap size={14} color="#0284C7" />;
    default: return <Layers size={14} color="#0284C7" />;
  }
}
