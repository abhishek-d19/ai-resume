import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, UserPlus, LayoutDashboard, Upload, FileText, Sparkles, Users, Target, Check, History, Download, Trophy, X, ShieldCheck } from 'lucide-react';

export default function ProductUserFlowStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const flowSteps = [
    { id: 'landing', label: 'Landing Page', icon: <Play size={14} />, anchor: '#' },
    { id: 'signup', label: 'Sign Up', icon: <UserPlus size={14} />, action: () => setShowSignUpModal(true) },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} />, anchor: '#' },
    { id: 'import', label: 'Import Resume', icon: <Upload size={14} />, action: () => setShowImportModal(true) },
    { id: 'studio', label: 'Resume Studio', icon: <FileText size={14} />, anchor: '#analyze' },
    { id: 'analyze', label: 'Analyze Resume', icon: <Sparkles size={14} />, anchor: '#analyze' },
    { id: 'panel', label: 'Hiring Panel', icon: <Users size={14} />, anchor: '#panel' },
    { id: 'jdmatch', label: 'JD Match', icon: <Target size={14} />, anchor: '#journey' },
    { id: 'apply', label: 'Apply Improvements', icon: <Check size={14} />, anchor: '#journey' },
    { id: 'version', label: 'Version History', icon: <History size={14} />, anchor: '#analyze' },
    { id: 'export', label: 'Export Resume', icon: <Download size={14} />, action: () => setShowExportModal(true) },
    { id: 'done', label: 'Done', icon: <Trophy size={14} />, action: () => setShowDoneModal(true) }
  ];

  const handleStepClick = (idx, step) => {
    setCurrentStep(idx);
    if (step.action) {
      step.action();
    } else if (step.anchor) {
      const el = document.querySelector(step.anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    const nextIdx = (currentStep + 1) % flowSteps.length;
    handleStepClick(nextIdx, flowSteps[nextIdx]);
  };

  return (
    <>
      {/* FLOATING STEPPER CONTROL BAR */}
      <div style={{ 
        position: 'fixed', 
        bottom: 24, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 900, 
        background: 'rgba(3, 45, 48, 0.94)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid #38E8F5', 
        borderRadius: 24, 
        padding: '10px 20px', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        maxWidth: '92vw',
        overflowX: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38E8F5', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', paddingRight: 10, borderRight: '1px solid rgba(255,255,255,0.15)' }}>
          <Sparkles size={14} /> USER FLOW ({currentStep + 1}/12)
        </div>

        {/* Horizontal Flow Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', padding: '4px 0' }}>
          {flowSteps.map((st, idx) => (
            <React.Fragment key={st.id}>
              <button
                onClick={() => handleStepClick(idx, st)}
                style={{ 
                  background: currentStep === idx ? '#38E8F5' : idx < currentStep ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
                  color: currentStep === idx ? '#032D30' : idx < currentStep ? '#10B981' : '#E2E8F0',
                  border: currentStep === idx ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {idx < currentStep ? <CheckCircle2 size={12} /> : st.icon}
                <span>{st.label}</span>
              </button>

              {idx < flowSteps.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>↓</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Step Action Button */}
        <button 
          onClick={handleNextStep}
          className="btn-cyan-pill"
          style={{ padding: '6px 14px', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 6 }}
        >
          <span>Next Step</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* SIGN UP MODAL */}
      {showSignUpModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(3,45,48,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, width: '100%', maxWidth: 440, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowSignUpModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <UserPlus size={24} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>
              Create Your Account
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 24 }}>
              Join 300,000+ students and candidates elevating their interview confidence.
            </p>
            <input type="email" placeholder="student@university.edu" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 12, outline: 'none', fontSize: '0.9rem' }} />
            <input type="password" placeholder="••••••••••••" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 20, outline: 'none', fontSize: '0.9rem' }} />
            <button onClick={() => { setShowSignUpModal(false); setCurrentStep(2); }} className="btn-cyan-pill" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '0.95rem' }}>
              Sign Up & Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* IMPORT RESUME MODAL */}
      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(3,45,48,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, width: '100%', maxWidth: 480, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowImportModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>

            {uploadError ? (
              <div style={{ padding: '20px 10px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <X size={26} />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991B1B', marginBottom: 4 }}>
                  Resume upload failed.
                </h3>

                <p style={{ fontSize: '0.95rem', color: '#B91C1C', marginBottom: 24 }}>
                  Try another PDF.
                </p>

                <button 
                  onClick={() => setUploadError(false)} 
                  className="btn-cyan-pill" 
                  style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '0.95rem' }}
                >
                  <Upload size={16} />
                  <span>Upload Again</span>
                </button>
              </div>
            ) : (
              <>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Upload size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>
                  Import Existing Resume
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 20 }}>
                  Upload your current PDF or Word document for instant AI metric parsing.
                </p>

                <div style={{ border: '2px dashed #38E8F5', borderRadius: 16, padding: 28, background: 'var(--color-cyan-light)', marginBottom: 16, cursor: 'pointer' }}>
                  <FileText size={36} style={{ color: 'var(--color-teal-dark)', margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-teal-dark)' }}>Drag and drop resume here</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>Supports PDF, DOCX (Max 10MB)</div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <button onClick={() => { setShowImportModal(false); setCurrentStep(4); }} className="btn-teal-pill" style={{ flex: 1, justifyContent: 'center', padding: 10, fontSize: '0.88rem' }}>
                    Upload & Continue
                  </button>
                  <button onClick={() => setUploadError(true)} style={{ padding: '8px 12px', fontSize: '0.78rem', background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
                    Simulate Error
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* EXPORT RESUME MODAL */}
      {showExportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(3,45,48,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, width: '100%', maxWidth: 440, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowExportModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Download size={24} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>
              Export PDF Resume v2
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 24 }}>
              Your executive resume v2 is ATS-verified and ready for high-conversion submission.
            </p>
            <button onClick={() => { setShowExportModal(false); setShowDoneModal(true); setCurrentStep(11); }} className="btn-cyan-pill" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '0.95rem' }}>
              Download PDF Resume v2
            </button>
          </div>
        </div>
      )}

      {/* DONE COMPLETION MODAL */}
      {showDoneModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(3,45,48,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 40, width: '100%', maxWidth: 520, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', border: '2px solid #38E8F5' }}>
            <button onClick={() => setShowDoneModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#38E8F5', color: '#032D30', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 0 30px rgba(56,232,245,0.6)' }}>
              <Trophy size={32} />
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              100% INTERVIEW READY
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 12 }}>
              Journey Complete!
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: 28, lineHeight: 1.6 }}>
              You have completed the full Lumina career flow from initial landing page to hiring panel approval and executive resume export.
            </p>
            <button onClick={() => { setShowDoneModal(false); setCurrentStep(0); }} className="btn-teal-pill" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '1rem' }}>
              Restart Experience
            </button>
          </div>
        </div>
      )}
    </>
  );
}
