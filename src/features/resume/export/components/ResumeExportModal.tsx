import React, { useState } from 'react';
import { 
  Download, 
  X, 
  FileText, 
  Sparkles, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { 
  resumeExportServiceInstance, 
  CanonicalResumeData, 
  ExportPdfOptions 
} from '../../services/ResumeExportService';

export interface ResumeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  resumeId?: string;
  resumeTitle?: string;
  version?: number;
  data: CanonicalResumeData;
}

import { DEMO_CANDIDATE_UUID } from '../../../../constants/demoCandidate';

export const ResumeExportModal: React.FC<ResumeExportModalProps> = ({
  isOpen,
  onClose,
  userId = 'usr_demo',
  resumeId = DEMO_CANDIDATE_UUID,
  resumeTitle = 'Candidate Resume',
  version = 1,
  data
}) => {
  const [template, setTemplate] = useState<'executive' | 'modern' | 'classic' | 'minimalist'>('executive');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    setSuccess(false);
    try {
      const options: ExportPdfOptions = {
        template,
        paperSize,
        title: resumeTitle,
        version
      };

      await resumeExportServiceInstance.exportAndDownloadPdf(
        userId,
        resumeId,
        data,
        options
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('[ResumeExportModal Error]:', err);
      setError('Unable to generate your PDF. Your resume is safely saved. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const personal = data.personalInfo || {};
  const fullName = personal.fullName || 'Candidate Name';
  const email = personal.email || '';
  const phone = personal.phone || '';
  const location = personal.location || '';
  const summary = data.summary || '';
  const experiences = data.experience ?? [];
  const education = data.education ?? [];
  const skills = data.skills ?? [];
  const projects = data.projects ?? [];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(11, 25, 44, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 1040, height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        
        {/* MODAL HEADER */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: '#E0F2FE', color: '#0369A1', fontSize: '0.75rem', fontWeight: 800, marginBottom: 4 }}>
              <Sparkles size={13} /> ATS-SAFE VECTOR PDF EXPORTER
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Export Resume to PDF
            </h2>
          </div>

          <button 
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 18, background: '#FFFFFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* MAIN BODY: CONTROL SIDEBAR + LIVE PREVIEW */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT CONTROLS PANEL */}
          <div style={{ width: 340, borderRight: '1px solid #E2E8F0', padding: 24, background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20, overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* TEMPLATE SELECTION */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>
                  Resume Template
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'executive', name: 'Executive' },
                    { id: 'modern', name: 'Modern' },
                    { id: 'classic', name: 'Classic' },
                    { id: 'minimalist', name: 'Minimalist' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id as any)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: template === t.id ? '2px solid #0284C7' : '1px solid #CBD5E1',
                        background: template === t.id ? '#F0F9FF' : '#FFFFFF',
                        color: template === t.id ? '#0369A1' : '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* PAPER SIZE SELECTION */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em', display: 'block', marginBottom: 10 }}>
                  Paper Format Size
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { id: 'a4', name: 'A4 (210 × 297 mm)' },
                    { id: 'letter', name: 'US Letter (8.5 × 11 in)' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPaperSize(p.id as any)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: paperSize === p.id ? '2px solid #0284C7' : '1px solid #CBD5E1',
                        background: paperSize === p.id ? '#F0F9FF' : '#FFFFFF',
                        color: paperSize === p.id ? '#0369A1' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ATS COMPLIANCE BADGE */}
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontSize: '0.78rem', fontWeight: 900, marginBottom: 4 }}>
                  <ShieldCheck size={16} /> 100% ATS-Safe Vector PDF
                </div>
                <p style={{ fontSize: '0.75rem', color: '#065F46', margin: 0, lineHeight: 1.45 }}>
                  Selectable, searchable vector text formatted cleanly for Workday, Greenhouse, Lever, and Taleo ATS screening software.
                </p>
              </div>

              {/* SUCCESS / ERROR ALERTS */}
              {success && (
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: 12, color: '#166534', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={16} /> PDF Downloaded Successfully!
                </div>
              )}

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12, padding: 12, color: '#991B1B', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

            </div>

            {/* DOWNLOAD BUTTON */}
            <div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 8px 20px rgba(14, 165, 233, 0.35)',
                  opacity: downloading ? 0.6 : 1
                }}
              >
                {downloading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                <span>{downloading ? 'Generating Vector PDF...' : 'Download PDF Document'}</span>
              </button>
            </div>

          </div>

          {/* RIGHT LIVE PRINTABLE PREVIEW CONTAINER */}
          <div style={{ flex: 1, background: '#E2E8F0', padding: 24, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            
            {/* PAPER SHEET SIMULATION */}
            <div 
              style={{ 
                background: '#FFFFFF', 
                width: paperSize === 'letter' ? 620 : 600, 
                minHeight: 800, 
                padding: '40px 48px', 
                borderRadius: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                color: '#0F172A',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontSize: '11px',
                lineHeight: 1.5
              }}
            >
              {/* PREVIEW HEADER */}
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: template === 'modern' ? '#0284C7' : '#0B192C', margin: '0 0 4px 0' }}>
                {fullName}
              </h1>
              <div style={{ fontSize: '10px', color: '#64748B', marginBottom: 16, borderBottom: '2px solid #0284C7', paddingBottom: 8 }}>
                {[email, phone, location].filter(Boolean).join('  |  ')}
              </div>

              {/* SUMMARY */}
              {summary && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginBottom: 6 }}>
                    Professional Summary
                  </div>
                  <div style={{ color: '#334155', fontSize: '11px' }}>{summary}</div>
                </div>
              )}

              {/* SKILLS */}
              {skills.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginBottom: 6 }}>
                    Technical Skills
                  </div>
                  <div style={{ color: '#1E293B', fontSize: '10.5px' }}>
                    {skills.map(s => typeof s === 'string' ? s : (s.name || s.category || '')).filter(Boolean).join('  •  ')}
                  </div>
                </div>
              )}

              {/* EXPERIENCE */}
              {experiences.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginBottom: 8 }}>
                    Professional Experience
                  </div>
                  {experiences.map((exp, idx) => (
                    <div key={idx} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11.5px', color: '#0F172A' }}>
                        <span>{exp.role || exp.title || 'Role'} — {exp.company || 'Company'}</span>
                        <span style={{ color: '#64748B', fontWeight: 400, fontSize: '10px' }}>{exp.dates || exp.duration || ''}</span>
                      </div>
                      {Array.isArray(exp.bulletPoints || exp.bullets) && (
                        <ul style={{ margin: '4px 0 0 16px', padding: 0, color: '#334155' }}>
                          {(exp.bulletPoints || exp.bullets || []).map((b: string, bIdx: number) => (
                            <li key={bIdx} style={{ marginBottom: 2 }}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* PROJECTS */}
              {projects.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginBottom: 8 }}>
                    Key Projects
                  </div>
                  {projects.map((proj, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: '11px', color: '#0F172A' }}>{proj.name || proj.title}</div>
                      <div style={{ color: '#334155' }}>{proj.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* EDUCATION */}
              {education.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 4, marginBottom: 8 }}>
                    Education
                  </div>
                  {education.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '11px', color: '#0F172A' }}>
                      <span>{edu.degree} — {edu.institution || edu.school}</span>
                      <span style={{ color: '#64748B', fontWeight: 400, fontSize: '10px' }}>{edu.year || edu.dates}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
