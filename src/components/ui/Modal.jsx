import React from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 560 }) {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        background: 'rgba(3, 45, 48, 0.85)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
    >
      <div style={{
        background: '#FFFFFF',
        borderRadius: 24,
        padding: 36,
        width: '100%',
        maxWidth: maxWidth,
        textAlign: 'left',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        border: '1px solid #E2E8F0'
      }}>
        <button 
          onClick={onClose}
          aria-label="Close dialog"
          style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer', color: '#64748B' }}
        >
          <X size={18} />
        </button>

        {title && (
          <h3 id="modal-title" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 16 }}>
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>
  );
}
