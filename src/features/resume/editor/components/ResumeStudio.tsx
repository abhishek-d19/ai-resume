import React from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  FileSearch, 
  Trash2, 
  ShieldAlert, 
  AlertCircle, 
  RotateCcw, 
  WifiOff, 
  AlertTriangle
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
}

export const ResumeStudio: React.FC<ResumeStudioProps> = ({
  resumeId = 'res-1',
  userId = 'mock-user-1',
  onBackToDashboard
}) => {
  // REQUIREMENT: RESUME RESTORATION HOOK (Loads latest database snapshot & preserves state across refresh)
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

  // REQUIREMENT: PRODUCTION-GRADE AUTOSAVE SYSTEM
  const { saveStatus, errorMessage, retrySave } = useAutosave({
    resumeId,
    userId,
    data: resumeData,
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

  // Render Error & Loading States
  if (loading || !resumeData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-teal-dark)' }}>
          <RefreshCw size={20} className="spin-slow" />
          <span>Restoring latest saved resume version from database...</span>
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

  if (errorState === 'unauthorized') {
    return (
      <div style={{ maxWidth: 640, margin: '60px auto', padding: 32, background: '#FEF2F2', borderRadius: 20, border: '1px solid #FCA5A5', textAlign: 'center' }}>
        <ShieldAlert size={40} style={{ color: '#991B1B', marginBottom: 16 }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991B1B', marginBottom: 8 }}>Unauthorized Access</h3>
        <p style={{ color: '#7F1D1D', marginBottom: 24, fontSize: '0.95rem' }}>You do not have permission to view or edit this resume.</p>
        {onBackToDashboard && (
          <button onClick={onBackToDashboard} className="btn-cyan-pill" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-light)' }}>
      
      {/* TOP NAVIGATION BAR */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '12px 24px' }}>
        <div className="container" style={{ maxWidth: 1280, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Left: Back to Dashboard & Editable Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-teal-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={16} />
                <span>Back to Dashboard</span>
              </button>
            )}

            {/* Editable Title */}
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="Resume Title..."
              style={{ border: 'none', outline: 'none', fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-teal-dark)', background: 'transparent', width: 280 }}
            />
          </div>

          {/* Right: SAVE STATUS STATE MACHINE BADGES */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            
            {saveStatus === 'idle' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#F1F5F9', color: '#64748B' }}>
                Idle
              </span>
            )}

            {saveStatus === 'editing' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#FEF3C7', color: '#B45309' }}>
                Editing...
              </span>
            )}

            {saveStatus === 'saving' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#E0F2FE', color: '#0369A1', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={12} className="spin-slow" /> Saving...
              </span>
            )}

            {saveStatus === 'saved' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#DCFCE7', color: '#166534', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                ✓ Saved
              </span>
            )}

            {saveStatus === 'offline' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#FEF3C7', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <WifiOff size={12} /> Offline
              </span>
            )}

            {saveStatus === 'conflict' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} /> Version Conflict
              </span>
            )}

            {saveStatus === 'error' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={12} /> Save Error
                </span>
                <button 
                  onClick={retrySave}
                  style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#032D30', color: '#38E8F5', border: 'none', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            )}

            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)' }}>
              Version {version}
            </span>
          </div>

        </div>
      </header>

      {/* OPTIMISTIC CONCURRENCY / ERROR WARNING BOX */}
      {errorMessage && (
        <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FCA5A5', padding: '10px 24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN SCROLLABLE RESUME EDITOR CANVAS */}
      <main style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px' }}>
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <PersonalInfo data={resumeData.personalInfo} onChange={updatePersonalInfo} />

        {/* SECTION 2: EXECUTIVE SUMMARY */}
        <Summary summary={resumeData.summary} onChange={updateSummary} />

        {/* SECTION 3: EDUCATION */}
        <Education items={resumeData.education} onChange={updateEducation} />

        {/* SECTION 4: EXPERIENCE */}
        <Experience items={resumeData.experience} onChange={updateExperience} />

        {/* SECTION 5: PROJECTS */}
        <Projects items={resumeData.projects} onChange={updateProjects} />

        {/* SECTION 6: SKILLS */}
        <Skills items={resumeData.skills} onChange={updateSkills} />

        {/* SECTION 7: CERTIFICATIONS */}
        <Certifications items={resumeData.certifications} onChange={updateCertifications} />

        {/* SECTION 8: ACHIEVEMENTS */}
        <Achievements items={resumeData.achievements} onChange={updateAchievements} />

        {/* SECTION 9: LANGUAGES */}
        <Languages items={resumeData.languages} onChange={updateLanguages} />

        {/* SECTION 10: LINKS */}
        <Links items={resumeData.links} onChange={updateLinks} />

      </main>

    </div>
  );
};
