import React, { useState } from 'react';
import { Sparkles, X, Check, Edit2, AlertCircle, ArrowRight } from 'lucide-react';

export interface CopilotDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  originalContent: string;
  suggestedContent: string;
  explanation?: string;
  metricsPrompt?: string;
  onAccept: (finalContent: string) => void;
}

export const CopilotDiffModal: React.FC<CopilotDiffModalProps> = ({
  isOpen,
  onClose,
  title,
  originalContent,
  suggestedContent,
  explanation,
  metricsPrompt,
  onAccept
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestedContent);

  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept(isEditing ? editedText : suggestedContent);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(11, 25, 44, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 680, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        
        {/* HEADER */}
        <div style={{ padding: '20px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 16, background: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 800, marginBottom: 4 }}>
              <Sparkles size={13} /> AI RESUME COPILOT
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              {title}
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 16, background: '#FFFFFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {explanation && (
            <div style={{ fontSize: '0.82rem', color: '#475569', background: '#F0F9FF', padding: 12, borderRadius: 10, border: '1px solid #BAE6FD', fontWeight: 600 }}>
              <span style={{ color: '#0284C7', fontWeight: 800 }}>AI Guidance: </span>{explanation}
            </div>
          )}

          {metricsPrompt && (
            <div style={{ fontSize: '0.82rem', color: '#92400E', background: '#FFFBEB', padding: 12, borderRadius: 10, border: '1px solid #FDE68A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} color="#D97706" />
              <span>{metricsPrompt}</span>
            </div>
          )}

          {/* DIFF COMPARISON */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            
            {/* ORIGINAL */}
            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: 6 }}>
                CURRENT VERSION
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                {originalContent || <span style={{ fontStyle: 'italic', color: '#94A3B8' }}>(Empty)</span>}
              </div>
            </div>

            {/* AI SUGGESTION */}
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>AI SUGGESTED IMPROVEMENT</span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Edit2 size={12} /> {isEditing ? 'Done Editing' : 'Tweak Text'}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #0284C7', fontSize: '0.85rem', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }}
                />
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#065F46', fontWeight: 600, lineHeight: 1.5 }}>
                  "{editedText}"
                </div>
              )}
            </div>

          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 10, background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Reject
          </button>

          <button
            onClick={handleAccept}
            style={{ padding: '8px 22px', borderRadius: 10, background: '#0284C7', color: '#FFFFFF', fontWeight: 900, fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
          >
            <Check size={16} /> Accept Suggestion
          </button>
        </div>

      </div>
    </div>
  );
};
