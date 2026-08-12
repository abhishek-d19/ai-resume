import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  X, 
  RotateCcw,
  ShieldCheck,
  Trash2,
  Plus
} from 'lucide-react';
import { resumeServiceInstance } from '../services/ResumeService';

export default function ResumeUploadModalView({ 
  userId, 
  isOpen, 
  onClose, 
  onUploadComplete, 
  initialFile = null,
  onCreateManualResume
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [stepIndex, setStepIndex] = useState(0); // 0: Idle/Selected, 1: Uploading, 2: Parsing, 3: Success/Opening Studio
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialFile) {
      validateAndSelectFile(initialFile);
    }
  }, [initialFile]);

  if (!isOpen) return null;

  const steps = [
    { label: 'Uploading resume PDF to server...' },
    { label: 'Extracting PDF text into canonical schema...' },
    { label: 'Saving resume into database...' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSelectFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file) => {
    setError(null);

    if (!file) {
      setError('Please select a PDF resume.');
      return;
    }

    // 1. MIME / Extension Validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && file.type !== 'application/pdf') {
      setError('Only PDF files are supported. Please upload a .pdf document.');
      return;
    }

    // 2. File Size Limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Your resume must be smaller than 10MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;

    setError(null);
    setStepIndex(1); // Uploading...

    try {
      // Step 1: Send PDF File to Server Upload Endpoint using FormData (Server performs parsing)
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId || '');

      setStepIndex(2); // Parsing server-side...

      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: {
          'x-user-id': userId || ''
        },
        body: formData
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server PDF processing failed (${res.status})`);
      }

      setStepIndex(3); // Saving to database...

      // Step 2: Browser executes the database INSERT via Supabase Client (Direct Postgres Connection)
      const title = json.title || selectedFile.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      const createdResume = await resumeServiceInstance.createResume({
        userId,
        title,
        content: json.canonicalContent || {}
      });

      console.log('[Upload Diagnostic]: Database INSERT committed resume UUID:', createdResume.id);

      await new Promise(r => setTimeout(r, 200));

      if (onUploadComplete) {
        onUploadComplete(createdResume);
      }
    } catch (err) {
      console.error('[ResumeUploadModal Error]:', err.message);
      setError(err.message || "We couldn't extract text from this PDF. You can continue editing manually.");
      setStepIndex(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setStepIndex(0);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: '#FFFFFF',
        width: '100%',
        maxWidth: 580,
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* HEADER BAR */}
        <div style={{
          padding: '24px 28px 18px 28px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F0F9FF', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>Upload PDF Resume</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>ATS Parsing & Canonical JSON Structuring</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div style={{ padding: '24px 28px' }}>

          {/* ERROR ALERT BANNER */}
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 14,
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12
            }}>
              <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.86rem', color: '#991B1B', lineHeight: 1.45 }}>
                {error}
              </div>
            </div>
          )}

          {/* ACTIVE PROCESSING STEP STAGE */}
          {stepIndex > 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: '#F0F9FF', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Loader2 size={32} className="animate-spin" />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                {steps[stepIndex - 1]?.label || 'Processing resume...'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Please wait while Lumina processes and structures your document.
              </p>
            </div>
          ) : selectedFile ? (
            /* FILE SELECTED CONFIRMATION VIEW */
            <div>
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', wordBreak: 'break-all' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      {formatFileSize(selectedFile.size)} • PDF Document
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  style={{ background: 'none', border: 'none', color: '#EF4444', padding: 6, cursor: 'pointer', borderRadius: 8 }}
                  title="Remove file"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* MODAL ACTION FOOTER */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  onClick={onClose}
                  style={{
                    background: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    borderRadius: 12,
                    padding: '10px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleStartUpload}
                  style={{
                    background: '#0EA5E9',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 24px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                  }}
                >
                  <span>Upload PDF →</span>
                </button>
              </div>
            </div>
          ) : (
            /* DROPZONE INPUT VIEW */
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed #0EA5E9' : '2px dashed #CBD5E1',
                  background: isDragging ? '#F0F9FF' : '#F8FAFC',
                  borderRadius: 20,
                  padding: '40px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: 20
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="application/pdf,.pdf" 
                  onChange={handleFileSelect} 
                />

                <div style={{ width: 56, height: 56, borderRadius: 18, background: '#FFFFFF', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
                  <Upload size={26} />
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                  Click to choose file or drag & drop PDF
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>
                  Supports single PDF file up to 10MB
                </p>
              </div>

              {/* MODAL FOOTER FOR UNSELECTED STATE */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                {onCreateManualResume ? (
                  <button
                    onClick={() => {
                      onClose();
                      onCreateManualResume();
                    }}
                    style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={15} /> Or create resume manually
                  </button>
                ) : <div />}

                <button
                  onClick={onClose}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: 10,
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
