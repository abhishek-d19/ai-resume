import { CanonicalResumeSchema } from '../../editor/components/ResumeStudio';
import { resumeServiceInstance, NotFoundError } from '../../../../services/ResumeService';

export interface RestorationResult {
  title: string;
  version: number;
  updated_at: string;
  deleted_at: string | null;
  data: CanonicalResumeSchema;
}

export class ResumeRestorationService {
  /**
   * Returns canonical ATS-ready resume schema empty defaults.
   * Stored values default to empty strings/arrays so placeholders do NOT persist fake data.
   */
  public static getDefaultSchema(): CanonicalResumeSchema {
    return {
      personalInfo: {
        fullName: '',
        headline: '',
        email: '',
        phone: '',
        location: ''
      },
      summary: '',
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      languages: [],
      links: []
    };
  }

  /**
   * Sanitizes and validates canonical JSON payload to prevent corrupted state crashes
   * Preserves real extracted candidate data from PDF parsing or user input.
   */
  public static sanitizeResumeContent(rawContent: any): CanonicalResumeSchema {
    const defaultSchema = this.getDefaultSchema();
    if (!rawContent || typeof rawContent !== 'object') {
      return defaultSchema;
    }

    const pi = rawContent.personalInfo || rawContent.basics || {};
    const personalInfo = {
      fullName: pi.fullName || pi.name || pi.full_name || '',
      headline: pi.headline || pi.title || pi.label || pi.role || '',
      email: pi.email || '',
      phone: pi.phone || pi.phone_number || pi.phoneNumber || '',
      location: pi.location || pi.address || pi.city || ''
    };

    const summaryText = typeof rawContent.summary === 'string'
      ? rawContent.summary
      : (typeof rawContent.objective === 'string' ? rawContent.objective : '');

    const rawEdu = Array.isArray(rawContent.education) ? rawContent.education : [];
    const sanitizedEdu = rawEdu.map((edu: any, idx: number) => ({
      id: edu?.id || `edu-${idx}-${Date.now()}`,
      institution: edu?.institution || edu?.school || edu?.university || '',
      degree: edu?.degree || edu?.qualification || '',
      fieldOfStudy: edu?.fieldOfStudy || edu?.field || edu?.major || '',
      startDate: edu?.startDate || edu?.start_date || '',
      endDate: edu?.endDate || edu?.end_date || '',
      gpa: edu?.gpa || ''
    }));

    const rawExp = Array.isArray(rawContent.experience) ? rawContent.experience : (Array.isArray(rawContent.work) ? rawContent.work : []);
    const sanitizedExp = rawExp.map((exp: any, idx: number) => ({
      id: exp?.id || `exp-${idx}-${Date.now()}`,
      company: exp?.company || exp?.organization || exp?.employer || '',
      role: exp?.role || exp?.position || exp?.title || exp?.jobTitle || '',
      location: exp?.location || '',
      startDate: exp?.startDate || exp?.start_date || '',
      endDate: exp?.endDate || exp?.end_date || '',
      isCurrent: Boolean(exp?.isCurrent || exp?.is_current),
      bullets: Array.isArray(exp?.bullets)
        ? exp.bullets
        : (Array.isArray(exp?.highlights)
            ? exp.highlights
            : (typeof exp?.description === 'string' && exp.description ? [exp.description] : ['']))
    }));

    const rawProj = Array.isArray(rawContent.projects) ? rawContent.projects : [];
    const sanitizedProj = rawProj.map((proj: any, idx: number) => ({
      id: proj?.id || `proj-${idx}-${Date.now()}`,
      name: proj?.name || proj?.title || '',
      description: proj?.description || proj?.summary || '',
      techStack: proj?.techStack || proj?.technologies || proj?.keywords ? (Array.isArray(proj.keywords) ? proj.keywords.join(', ') : String(proj.keywords || '')) : '',
      bullets: Array.isArray(proj?.bullets) ? proj.bullets : (Array.isArray(proj?.highlights) ? proj.highlights : [])
    }));

    const rawSkills = Array.isArray(rawContent.skills) ? rawContent.skills : [];
    const sanitizedSkills = rawSkills.map((sk: any, idx: number) => ({
      id: sk?.id || `skill-${idx}-${Date.now()}`,
      category: sk?.category || sk?.name || 'Skills',
      skills: typeof sk?.skills === 'string'
        ? sk.skills
        : (Array.isArray(sk?.skills) ? sk.skills.join(', ') : (Array.isArray(sk?.keywords) ? sk.keywords.join(', ') : ''))
    }));

    const rawCerts = Array.isArray(rawContent.certifications) ? rawContent.certifications : (Array.isArray(rawContent.certificates) ? rawContent.certificates : []);
    const sanitizedCerts = rawCerts.map((cert: any, idx: number) => ({
      id: cert?.id || `cert-${idx}-${Date.now()}`,
      name: cert?.name || cert?.title || '',
      issuer: cert?.issuer || cert?.authority || '',
      date: cert?.date || cert?.issueDate || ''
    }));

    const rawAchieve = Array.isArray(rawContent.achievements) ? rawContent.achievements : (Array.isArray(rawContent.awards) ? rawContent.awards : []);
    const sanitizedAchieve = rawAchieve.map((ach: any, idx: number) => ({
      id: ach?.id || `ach-${idx}-${Date.now()}`,
      title: ach?.title || ach?.name || '',
      description: ach?.description || ach?.summary || ''
    }));

    const rawLang = Array.isArray(rawContent.languages) ? rawContent.languages : [];
    const sanitizedLang = rawLang.map((lang: any, idx: number) => ({
      id: lang?.id || `lang-${idx}-${Date.now()}`,
      language: lang?.language || lang?.name || '',
      proficiency: lang?.proficiency || lang?.fluency || ''
    }));

    const rawLinks = Array.isArray(rawContent.links) ? rawContent.links : (Array.isArray(rawContent.profiles) ? rawContent.profiles : []);
    const sanitizedLinks = rawLinks.map((lk: any, idx: number) => ({
      id: lk?.id || `link-${idx}-${Date.now()}`,
      label: lk?.label || lk?.network || lk?.name || '',
      url: lk?.url || lk?.link || ''
    }));

    return {
      personalInfo,
      summary: summaryText,
      education: sanitizedEdu,
      experience: sanitizedExp,
      projects: sanitizedProj,
      skills: sanitizedSkills,
      certifications: sanitizedCerts,
      achievements: sanitizedAchieve,
      languages: sanitizedLang,
      links: sanitizedLinks
    };
  }

  /**
   * Fetches latest resume version from ResumeService
   */
  public static async fetchLatestResume(userId: string, resumeId: string): Promise<RestorationResult> {
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    if (!resume) {
      throw new NotFoundError(`Resume ${resumeId} not found`);
    }

    const sanitizedData = this.sanitizeResumeContent(resume.content);

    return {
      title: resume.title || 'Untitled_Resume.pdf',
      version: resume.version || 1,
      updated_at: resume.updated_at,
      deleted_at: resume.deleted_at,
      data: sanitizedData
    };
  }
}
