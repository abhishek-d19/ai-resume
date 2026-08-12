import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle, AlertTriangle, Layers, Zap } from 'lucide-react';
import { CanonicalResumeSchema } from '../../editor/components/ResumeStudio';
import { resumeCopilotServiceInstance } from '../../../../services/ResumeCopilotService';

export interface LiveResumePreviewSheetProps {
  data: CanonicalResumeSchema;
  onUpdateContent?: (updatedData: CanonicalResumeSchema) => void;
  selectedTemplate?: 'executive' | 'modern' | 'clean';
}

export const LiveResumePreviewSheet: React.FC<LiveResumePreviewSheetProps> = ({ 
  data, 
  onUpdateContent,
  selectedTemplate = 'executive' 
}) => {
  const [template, setTemplate] = useState<'executive' | 'modern' | 'clean'>(selectedTemplate);
  const [compressing, setCompressing] = useState(false);

  const personal = data?.personalInfo || {};
  const fullName = personal.fullName || 'Candidate Name';
  const email = personal.email || '';
  const phone = personal.phone || '';
  const location = personal.location || '';
  const headline = personal.headline || '';
  const summary = data?.summary || '';
  const experiences = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications : [];

  // ESTIMATE CONTENT HEIGHT & PAGE COUNT (A4 Standard: ~1000-1100 vertical height units)
  const charCount = 
    fullName.length + 
    summary.length + 
    experiences.reduce((acc, e) => acc + (e.role?.length || 0) + (e.company?.length || 0) + (e.bullets?.join('')?.length || 0), 0) +
    projects.reduce((acc, p) => acc + (p.name?.length || 0) + (p.description?.length || 0), 0) +
    skills.reduce((acc, s) => acc + (typeof s === 'string' ? s.length : (s.skills?.length || 0)), 0);

  const pageCountEstimate = Number((Math.max(1, charCount / 1650)).toFixed(1));
  const isOverflow = pageCountEstimate > 1.1 && pageCountEstimate < 1.8;
  const isMultiPage = pageCountEstimate >= 1.8;

  const handleOptimizeToOnePage = async () => {
    if (!onUpdateContent) return;
    setCompressing(true);
    try {
      const compressed = await resumeCopilotServiceInstance.compressContentForOnePage(data);
      onUpdateContent(compressed as CanonicalResumeSchema);
    } catch (err) {
      console.warn('[1-Page Compression Error]:', err);
    } finally {
      setCompressing(false);
    }
  };

  // Template Specific Styling Tokens
  const primaryColor = template === 'modern' ? '#0284C7' : template === 'clean' ? '#334155' : '#0B192C';
  const accentBorder = template === 'modern' ? '2px solid #0284C7' : template === 'clean' ? '1px solid #CBD5E1' : '2px solid #0B192C';
  const headerFont = template === 'executive' ? 'Georgia, serif' : 'Helvetica Neue, sans-serif';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'center' }}>
      
      {/* PREVIEW TOOLBAR & PAGE COUNT INDICATOR */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '10px 20px', width: '100%', maxWidth: 640, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        
        {/* TEMPLATE PICKER */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'executive', name: 'Executive Minimal' },
            { id: 'modern', name: 'Modern Technical' },
            { id: 'clean', name: 'Clean Professional' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as any)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 800,
                border: template === t.id ? '1px solid #0284C7' : '1px solid #E2E8F0',
                background: template === t.id ? '#F0F9FF' : '#FFFFFF',
                color: template === t.id ? '#0369A1' : '#64748B',
                cursor: 'pointer'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* PAGE COUNT BADGE & 1-PAGE OPTIMIZER CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 900, 
            padding: '4px 10px', 
            borderRadius: 12, 
            background: isOverflow ? '#FFFBEB' : (isMultiPage ? '#F1F5F9' : '#ECFDF5'),
            border: isOverflow ? '1px solid #FDE68A' : (isMultiPage ? '1px solid #CBD5E1' : '1px solid #A7F3D0'),
            color: isOverflow ? '#D97706' : (isMultiPage ? '#475569' : '#047857'),
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            {isOverflow ? <AlertTriangle size={13} /> : (isMultiPage ? <Layers size={13} /> : <CheckCircle size={13} />)}
            <span>{isOverflow ? `${pageCountEstimate} PAGES (SLIGHT OVERFLOW)` : (isMultiPage ? `${pageCountEstimate} PAGES` : '1 PAGE (OPTIMAL FIT)')}</span>
          </span>

          {isOverflow && onUpdateContent && (
            <button
              onClick={handleOptimizeToOnePage}
              disabled={compressing}
              style={{ padding: '4px 12px', borderRadius: 12, background: '#0284C7', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, opacity: compressing ? 0.5 : 1 }}
            >
              <Zap size={12} />
              <span>{compressing ? 'Optimizing...' : 'Optimize to 1 Page'}</span>
            </button>
          )}
        </div>

      </div>

      {/* A4 PROPORTIONAL PRINT SHEET (Aspect Ratio ~ 1 : 1.414) */}
      <div 
        style={{ 
          background: '#FFFFFF', 
          width: '100%', 
          maxWidth: 640, 
          minHeight: 880, 
          padding: '40px 44px', 
          borderRadius: 4, 
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          color: '#0F172A',
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: '10.5px',
          lineHeight: 1.5,
          position: 'relative'
        }}
      >
        {/* HEADER */}
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: primaryColor, fontFamily: headerFont, margin: '0 0 2px 0', letterSpacing: '-0.02em' }}>
          {fullName}
        </h1>

        {headline && (
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', marginBottom: 6 }}>
            {headline}
          </div>
        )}

        <div style={{ fontSize: '9px', color: '#64748B', marginBottom: 16, borderBottom: accentBorder, paddingBottom: 6 }}>
          {[email, phone, location].filter(Boolean).join('  |  ')}
        </div>

        {/* SUMMARY */}
        {summary && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 5 }}>
              Professional Summary
            </div>
            <div style={{ color: '#334155', fontSize: '10px', lineHeight: 1.5 }}>{summary}</div>
          </div>
        )}

        {/* TECHNICAL COMPETENCIES */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 5 }}>
              Technical Competencies
            </div>
            <div style={{ color: '#1E293B', fontSize: '9.5px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {skills.map((sk: any, idx: number) => {
                const text = typeof sk === 'string' ? sk : (sk.skills || sk.category || sk.name || '');
                if (!text) return null;
                return (
                  <span key={idx} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>
                    {text}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* WORK EXPERIENCE */}
        {experiences.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 6 }}>
              Professional Experience
            </div>
            {experiences.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 10, pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10.5px', color: '#0F172A' }}>
                  <span>{exp.role || exp.title || 'Role'} — {exp.company || 'Company'}</span>
                  <span style={{ color: '#64748B', fontWeight: 500, fontSize: '9.5px' }}>
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.isCurrent) ? '–' : ''} {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div style={{ fontSize: '9px', color: '#64748B', fontStyle: 'italic', marginBottom: 3 }}>
                    {exp.location}
                  </div>
                )}
                {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                  <ul style={{ margin: '3px 0 0 14px', padding: 0, color: '#334155' }}>
                    {exp.bullets.map((b: string, bIdx: number) => (
                      b ? <li key={bIdx} style={{ marginBottom: 2 }}>{b}</li> : null
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* KEY PROJECTS */}
        {projects.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 6 }}>
              Key Projects
            </div>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: 8, pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10px', color: '#0F172A' }}>
                  <span>{proj.name}</span>
                  {proj.techStack && <span style={{ color: '#64748B', fontWeight: 400, fontSize: '9px' }}>({proj.techStack})</span>}
                </div>
                {proj.description && <div style={{ color: '#334155', fontSize: '9.5px', marginTop: 2 }}>{proj.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 6 }}>
              Education
            </div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10px', color: '#0F172A', marginBottom: 3 }}>
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} — {edu.institution || edu.school}</span>
                <span style={{ color: '#64748B', fontWeight: 400, fontSize: '9px' }}>{edu.startDate} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 5 }}>
              Certifications
            </div>
            <ul style={{ margin: '3px 0 0 14px', padding: 0, color: '#334155' }}>
              {certifications.map((c: any, idx: number) => {
                const text = typeof c === 'string' ? c : (c.name || c.title || '');
                if (!text) return null;
                return <li key={idx} style={{ marginBottom: 2 }}>{text} {c.issuer ? `(${c.issuer})` : ''}</li>;
              })}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};
