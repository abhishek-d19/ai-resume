import { resumeServiceInstance, NotFoundError, ForbiddenError } from '../../../../services/ResumeService';
import { RestorationResult } from '../types/restoration';
import { CanonicalResumeSchema } from '../../editor/components/ResumeStudio';

export class ResumeRestorationService {
  /**
   * Default Fallback Schema ensuring zero undefined field crashes
   */
  public static getDefaultSchema(): CanonicalResumeSchema {
    return {
      personalInfo: {
        fullName: 'Abhishek Sharma',
        headline: 'Senior Software Engineer & Design Systems Architect',
        email: 'abhishek@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA'
      },
      summary: 'Senior Engineer specializing in design systems, micro-frontends, and performance optimization with 6+ years of enterprise experience.',
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016',
          endDate: '2020'
        }
      ],
      experience: [
        {
          id: 'exp-1',
          company: 'Lumina AI',
          role: 'Senior Frontend Engineer',
          location: 'San Francisco, CA',
          startDate: '2024',
          endDate: 'Present',
          bullets: [
            'Architected distributed multi-tenant design system scaling across 14 enterprise web applications, reducing bundle size by 35%.',
            'Engineered real-time AI prompt transformation engine, reducing TTI by 42% for 300,000+ active enterprise users.',
            'Led cross-functional team of 6 engineers to launch automated token pipeline directly into GitHub CI/CD.'
          ]
        }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'Tokens Studio Infrastructure',
          description: 'Multi-platform design token extraction and distribution engine.',
          techStack: 'TypeScript, React, Vite, Node.js'
        }
      ],
      skills: [
        {
          id: 'skill-1',
          category: 'Frontend & Systems Architecture',
          skillsList: 'React 19, TypeScript, Next.js, WebGL, Design Systems, State Machines'
        },
        {
          id: 'skill-2',
          category: 'Backend & Cloud Infrastructure',
          skillsList: 'Node.js, PostgreSQL, Supabase, GraphQL, Docker, Redis'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Professional',
          issuer: 'Amazon Web Services',
          issueDate: '2024'
        }
      ],
      achievements: [
        {
          id: 'ach-1',
          title: 'Global Engineering Innovation Award',
          description: 'Recognized for building automated design token extraction pipeline.',
          date: '2024'
        }
      ],
      languages: [
        { id: 'lang-1', language: 'English', proficiency: 'Native / Fluent' },
        { id: 'lang-2', language: 'German', proficiency: 'Professional Working' }
      ],
      links: [
        { id: 'link-1', platform: 'Portfolio', url: 'https://abhishek.dev' },
        { id: 'link-2', platform: 'GitHub', url: 'https://github.com/abhishek' },
        { id: 'link-3', platform: 'LinkedIn', url: 'https://linkedin.com/in/abhishek' }
      ]
    };
  }

  /**
   * Sanitizes and validates canonical JSON payload to prevent corrupted state crashes
   */
  public static sanitizeResumeContent(rawContent: any): CanonicalResumeSchema {
    const defaultSchema = this.getDefaultSchema();
    if (!rawContent || typeof rawContent !== 'object') {
      return defaultSchema;
    }

    return {
      personalInfo: { ...defaultSchema.personalInfo, ...(rawContent.personalInfo || rawContent.basics || {}) },
      summary: typeof rawContent.summary === 'string' ? rawContent.summary : defaultSchema.summary,
      education: Array.isArray(rawContent.education) ? rawContent.education : defaultSchema.education,
      experience: Array.isArray(rawContent.experience) ? rawContent.experience : defaultSchema.experience,
      projects: Array.isArray(rawContent.projects) ? rawContent.projects : defaultSchema.projects,
      skills: Array.isArray(rawContent.skills) ? rawContent.skills : defaultSchema.skills,
      certifications: Array.isArray(rawContent.certifications) ? rawContent.certifications : defaultSchema.certifications,
      achievements: Array.isArray(rawContent.achievements) ? rawContent.achievements : defaultSchema.achievements,
      languages: Array.isArray(rawContent.languages) ? rawContent.languages : defaultSchema.languages,
      links: Array.isArray(rawContent.links) ? rawContent.links : defaultSchema.links
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
