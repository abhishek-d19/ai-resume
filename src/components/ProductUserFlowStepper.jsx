import React, { useState } from 'react';
import { Play, ArrowRight, CheckCircle2, UserPlus, LayoutDashboard, Upload, FileText, Sparkles, Users, Target, Check, History, Download, Trophy, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function ProductUserFlowStepper() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const flowSteps = [
    { id: 'landing', label: 'Landing Page', icon: <Play size={12} />, anchor: '#' },
    { id: 'signup', label: 'Sign Up', icon: <UserPlus size={12} />, action: () => setShowSignUpModal(true) },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={12} />, anchor: '#' },
    { id: 'import', label: 'Import Resume', icon: <Upload size={12} />, action: () => setShowImportModal(true) },
    { id: 'studio', label: 'Resume Studio', icon: <FileText size={12} />, anchor: '#analyze' },
    { id: 'analyze', label: 'Analyze Resume', icon: <Sparkles size={12} />, anchor: '#analyze' },
    { id: 'panel', label: 'Hiring Panel', icon: <Users size={12} />, anchor: '#panel' },
    { id: 'jdmatch', label: 'JD Match', icon: <Target size={12} />, anchor: '#journey' },
    { id: 'apply', label: 'Apply Improvements', icon: <Check size={12} />, anchor: '#journey' },
    { id: 'version', label: 'Version History', icon: <History size={12} />, anchor: '#analyze' },
    { id: 'export', label: 'Export Resume', icon: <Download size={12} />, action: () => setShowExportModal(true) },
    { id: 'done', label: 'Done', icon: <Trophy size={12} />, action: () => setShowDoneModal(true) }
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
      {/* SUBTLE FLOATING DEMO PILL (Bottom-Right, Compact) */}
      <div style={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        zIndex: 900, 
        background: '#0F172A', 
        border: '1px solid #334155', 
        borderRadius: 20, 
        padding: '6px 12px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38E8F5', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Sparkles size={12} />
          <span>Step {currentStep + 1} of 12 · {flowSteps[currentStep].label}</span>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </div>

        <button 
          onClick={handleNextStep}
          style={{
            background: '#38E8F5',
            color: '#032D30',
            border: 'none',
            borderRadius: 12,
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span>Next</span>
          <ArrowRight size={10} />
        </button>
      </div>

      {/* EXPANDED FLOW POPOVER */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          bottom: 56,
          right: 16,
          zIndex: 901,
          background: '#0F172A',
          border: '1px solid #334155',
          borderRadius: 16,
          padding: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          maxWidth: 280,
          maxHeight: 320,
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #1E293B' }}>
            Demo User Flow Steps
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {flowSteps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => { handleStepClick(idx, st); setIsExpanded(false); }}
                style={{
                  background: currentStep === idx ? 'rgba(56, 232, 245, 0.15)' : 'transparent',
                  color: currentStep === idx ? '#38E8F5' : '#CBD5E1',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: '0.78rem',
                  fontWeight: currentStep === idx ? 800 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {idx < currentStep ? <CheckCircle2 size={12} color="#10B981" /> : st.icon}
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SIGN UP MODAL */}
      {showSignUpModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, width: '100%', maxWidth: 440, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowSignUpModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#F0F9FF', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <UserPlus size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Create Your Account
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>
              Join candidates elevating their interview confidence with AI intelligence.
            </p>
            <input type="email" placeholder="candidate@example.com" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 12, outline: 'none', fontSize: '0.9rem' }} />
            <input type="password" placeholder="••••••••••••" style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #CBD5E1', marginBottom: 20, outline: 'none', fontSize: '0.9rem' }} />
            <button onClick={() => { setShowSignUpModal(false); setCurrentStep(2); }} className="btn-cyan-pill" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '0.95rem' }}>
              Sign Up & Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* IMPORT RESUME MODAL */}
      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, width: '100%', maxWidth: 480, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowImportModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>

            {uploadError ? (
              <div style={{ padding: '20px 10px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <X size={26} />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991B1B', marginBottom: 4 }}>
                  Resume upload failed.
                </h3>

                <p style={{ fontSize: '0.92rem', color: '#B91C1C', marginBottom: 24 }}>
                  Please try another PDF file.
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
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                  Import Existing Resume
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 20 }}>
                  Upload your current PDF document for instant AI metric parsing.
                </p>

                <div style={{ border: '2px dashed #0EA5E9', borderRadius: 16, padding: 28, background: '#F0F9FF', marginBottom: 16, cursor: 'pointer' }}>
                  <FileText size={36} style={{ color: '#0284C7', margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>Drag and drop PDF resume here</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>Supports PDF (Max 10MB)</div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <button onClick={() => { setShowImportModal(false); setCurrentStep(4); }} className="btn-teal-pill" style={{ flex: 1, justifyContent: 'center', padding: 10, fontSize: '0.88rem' }}>
                    Upload & Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* EXPORT RESUME MODAL */}
      {showExportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, width: '100%', maxWidth: 440, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowExportModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Download size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Export PDF Resume
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>
              Your executive resume is ATS-verified and ready for submission.
            </p>
            <button onClick={() => { setShowExportModal(false); setShowDoneModal(true); setCurrentStep(11); }} className="btn-cyan-pill" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '0.95rem' }}>
              Download PDF Resume
            </button>
          </div>
        </div>
      )}

      {/* DONE COMPLETION MODAL */}
      {showDoneModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 40, width: '100%', maxWidth: 520, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', border: '1px solid #E2E8F0' }}>
            <button onClick={() => setShowDoneModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: '#F1F5F9', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
              <X size={18} />
            </button>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0F9FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trophy size={32} />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              100% INTERVIEW READY
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>
              Journey Complete!
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', marginBottom: 28, lineHeight: 1.6 }}>
              You have completed the full Lumina career flow from landing page to hiring panel approval and executive resume export.
            </p>
            <button onClick={() => { setShowDoneModal(false); setCurrentStep(0); }} className="btn-teal-pill" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: '0.95rem' }}>
              Restart Experience
            </button>
          </div>
        </div>
      )}
    </>
  );
}
