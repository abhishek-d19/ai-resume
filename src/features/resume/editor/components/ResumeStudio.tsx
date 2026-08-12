import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  FileSearch, 
  Trash2, 
  ShieldAlert, 
  AlertCircle, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Download,
  Edit3,
  Eye
} from 'lucide-react';
import { PersonalInfo, PersonalInfoData } from './PersonalInfo';
import { Summary } from './Summary';
import { Education, EducationItem } from './Education';
import { Experience, ExperienceItem } from './Experience';
import { Projects, ProjectItem } from './Projects';
import { Skills, SkillCategoryItem } from './Skills';
import { Certifications, CertificationItem } from './Certifications';
import { Achievements, AchievementItem } from './Achievements';
import { Languages, LanguageItem } from './Languages';
import { Links, LinkItem } from './Links';
import { resumeServiceInstance } from '../../../../services/ResumeService';
import { useResumeRestoration } from '../../restoration/hooks/useResumeRestoration';
import { useAutosave } from '../../autosave/hooks/useAutosave';
import { ResumeRestorationService } from '../../restoration/services/ResumeRestorationService';
import { ResumeExportModal } from '../../export/components/ResumeExportModal';
import { LiveResumePreviewSheet } from '../../preview/components/LiveResumePreviewSheet';

export interface CanonicalResumeSchema {
  personalInfo: PersonalInfoData;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategoryItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  links: LinkItem[];
}

export interface ResumeStudioProps {
  resumeId?: string;
  userId?: string;
  onBackToDashboard?: () => void;
  onNavigateToAnalysis?: (id: string) => void;
}

import { DEMO_CANDIDATE_UUID } from '../../../../constants/demoCandidate';

export const ResumeStudio: React.FC<ResumeStudioProps> = ({
  resumeId = DEMO_CANDIDATE_UUID,
  userId,
  onBackToDashboard,
  onNavigateToAnalysis
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // REQUIREMENT: RESUME RESTORATION HOOK
  const {
    loading,
    errorState,
    resumeTitle,
    version,
    resumeData,
    restoreResume,
    setResumeTitle,
    setResumeData
  } = useResumeRestoration({ resumeId, userId });

  // Fallback dataset to guarantee non-null render
  const dataToRender = resumeData || ResumeRestorationService.getDefaultSchema();

  // REQUIREMENT: PRODUCTION-GRADE AUTOSAVE SYSTEM
  const { saveStatus, errorMessage, retrySave } = useAutosave({
    resumeId,
    userId,
    data: dataToRender,
    initialVersion: version,
    delay: 1500
  });

  // Restore Soft-Deleted Resume Action
  const handleRestoreDeleted = async () => {
    try {
      await resumeServiceInstance.restoreResume(userId, resumeId);
      await restoreResume();
    } catch (err) {
      console.warn('[Restore Deleted Error]:', err);
    }
  };

  // State Updaters for Local State
  const updatePersonalInfo = (personalInfo: PersonalInfoData) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, personalInfo }));
  };

  const updateSummary = (summary: string) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, summary }));
  };

  const updateEducation = (education: EducationItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, education }));
  };

  const updateExperience = (experience: ExperienceItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, experience }));
  };

  const updateProjects = (projects: ProjectItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, projects }));
  };

  const updateSkills = (skills: SkillCategoryItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, skills }));
  };

  const updateCertifications = (certifications: CertificationItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, certifications }));
  };

  const updateAchievements = (achievements: AchievementItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, achievements }));
  };

  const updateLanguages = (languages: LanguageItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, languages }));
  };

  const updateLinks = (links: LinkItem[]) => {
    if (!setResumeData) return;
    setResumeData((prev: CanonicalResumeSchema) => ({ ...prev, links }));
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', background: 'var(--color-bg-light)', minHeight: '100vh' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-teal-dark)' }}>
          <RefreshCw size={20} className="spin-slow" />
          <span>Loading Professional Resume Studio...</span>
        </div>
      </div>
    );
  }

  if (errorState === 'notFound') {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: 32, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', textAlign: 'center' }}>
        <FileSearch size={40} style={{ color: '#64748B', marginBottom: 16 }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>Resume Not Found</h3>
        <p style={{ color: '#64748B', marginBottom: 24, fontSize: '0.95rem' }}>The requested resume ID ({resumeId}) does not exist in your workspace.</p>
        {onBackToDashboard && (
          <button onClick={onBackToDashboard} className="btn-cyan-pill" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  if (errorState === 'deleted') {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: 32, background: '#FEF2F2', borderRadius: 20, border: '1px solid #FCA5A5', textAlign: 'center' }}>
        <Trash2 size={40} style={{ color: '#991B1B', marginBottom: 16 }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991B1B', marginBottom: 8 }}>Resume Moved to Trash</h3>
        <p style={{ color: '#7F1D1D', marginBottom: 24, fontSize: '0.95rem' }}>This resume has been soft-deleted. Restore it to reactivate editing.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button onClick={handleRestoreDeleted} className="btn-cyan-pill" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
            <RotateCcw size={16} /> Restore Resume
          </button>
          {onBackToDashboard && (
            <button onClick={onBackToDashboard} className="btn-secondary-pill" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'sans-serif' }}>
      
      {/* TOP NAVIGATION HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '12px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Left: Back & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: '0.82rem', fontWeight: 700, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={16} />
                <span>Dashboard</span>
              </button>
            )}

            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="Resume Title..."
              style={{ border: 'none', outline: 'none', fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', background: 'transparent', width: 260 }}
            />
          </div>

          {/* Center: Mobile Responsive Tab Switcher */}
          <div className="mobile-tabs" style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
            <button
              onClick={() => setActiveTab('edit')}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'edit' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'edit' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'edit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Edit3 size={14} /> <span>Edit Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'preview' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'preview' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Eye size={14} /> <span>Live Preview</span>
            </button>
          </div>

          {/* Right: Autosave Status, Export PDF, Analyze Resume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 800,
              background: saveStatus === 'error' ? '#FEF2F2' : saveStatus === 'saving' ? '#F0F9FF' : '#F0FDF4',
              color: saveStatus === 'error' ? '#991B1B' : saveStatus === 'saving' ? '#0284C7' : '#166534',
              border: saveStatus === 'error' ? '1px solid #FCA5A5' : saveStatus === 'saving' ? '1px solid #BAE6FD' : '1px solid #DCFCE7'
            }}>
              {saveStatus === 'saving' && <RefreshCw size={14} className="animate-spin" />}
              {saveStatus === 'saved' && <span>Saved to Cloud ✓</span>}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle size={14} />
                  <span>Save error</span>
                  <button onClick={retrySave} style={{ textDecoration: 'underline', fontWeight: 900, cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>Retry</button>
                </>
              )}
              {saveStatus === 'idle' && <span>v{version}</span>}
            </div>

            <button
              onClick={() => setIsExportModalOpen(true)}
              style={{
                background: '#FFFFFF',
                color: '#0284C7',
                border: '1px solid #CBD5E1',
                borderRadius: 12,
                padding: '9px 18px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Download size={16} />
              <span>Export PDF</span>
            </button>

            {onNavigateToAnalysis && (
              <button
                onClick={() => onNavigateToAnalysis(resumeId)}
                style={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '9px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Sparkles size={16} />
                <span>Analyze Resume</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* SPLITSCREEN MAIN BODY (EDITOR LEFT + LIVE PREVIEW RIGHT) */}
      <main style={{ maxWidth: 1440, margin: '24px auto', padding: '0 20px', overflowX: 'hidden' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* LEFT COLUMN: RESUME EDITOR SECTIONS */}
          <div style={{ display: activeTab === 'edit' ? 'flex' : 'none', flexDirection: 'column', gap: 20 }} className="desktop-show">
            <PersonalInfo data={dataToRender.personalInfo} onChange={updatePersonalInfo} />
            <Summary data={dataToRender.summary} onChange={updateSummary} />
            <Experience items={dataToRender.experience} data={dataToRender.experience} onChange={updateExperience} />
            <Education items={dataToRender.education} data={dataToRender.education} onChange={updateEducation} />
            <Projects items={dataToRender.projects} data={dataToRender.projects} onChange={updateProjects} />
            <Skills items={dataToRender.skills} data={dataToRender.skills} onChange={updateSkills} fullResumeContent={dataToRender} />
            <Certifications items={dataToRender.certifications} data={dataToRender.certifications} onChange={updateCertifications} />
            <Achievements items={dataToRender.achievements} data={dataToRender.achievements} onChange={updateAchievements} />
            <Languages items={dataToRender.languages} data={dataToRender.languages} onChange={updateLanguages} />
            <Links items={dataToRender.links} data={dataToRender.links} onChange={updateLinks} />
          </div>

          {/* RIGHT COLUMN: STICKY LIVE RESUME PREVIEW SHEET */}
            <LiveResumePreviewSheet 
              data={dataToRender} 
              onUpdateContent={(updated) => setResumeData && setResumeData(updated as any)} 
            />

        </div>

      </main>

      {/* EXPORT MODAL */}
      <ResumeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        userId={userId}
        resumeId={resumeId}
        resumeTitle={resumeTitle}
        version={version}
        data={dataToRender}
      />

    </div>
  );
};

export default ResumeStudio;
