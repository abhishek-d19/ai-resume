import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeAnalysisServiceInstance } from './ResumeAnalysisService';
import { jdMatchServiceInstance } from './JdMatchService';
import { hiringCommitteeServiceInstance } from './HiringCommitteeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  resumeRewriteOutputSchema, 
  ResumeRewriteOutput, 
  RewriteSuggestion 
} from '../features/ai/schemas/resume-rewrite.schema';
import { 
  RESUME_REWRITE_SYSTEM_PROMPT, 
  buildResumeRewriteUserPrompt 
} from '../features/ai/prompts/resume-rewrite';

export class ResumeRewriteService {
  /**
   * Generates section-by-section AI rewrite suggestions
   */
  public async generateRewriteSuggestions(
    userId: string,
    resumeId: string,
    jobDescriptionText?: string
  ): Promise<ResumeRewriteOutput> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for resume rewrite generation.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Fetch ancillary analytical context
    let analysisData: any = null;
    let jdMatchData: any = null;
    let committeeData: any = null;

    try { analysisData = await resumeAnalysisServiceInstance.getLatestAnalysis(userId, resumeId); } catch { analysisData = null; }
    try {
      if (jobDescriptionText) {
        jdMatchData = await jdMatchServiceInstance.matchJobDescription(userId, resumeId, jobDescriptionText);
      } else {
        jdMatchData = await jdMatchServiceInstance.getLatestJdMatchResult(userId, resumeId);
      }
    } catch { jdMatchData = null; }
    try { committeeData = await hiringCommitteeServiceInstance.evaluateCommittee(userId, resumeId); } catch { committeeData = null; }

    // 3. Build User Prompt
    const userPrompt = buildResumeRewriteUserPrompt({
      title: resume.title,
      analysisData,
      jdMatchData,
      committeeData,
      resumeContent: resume.content || {}
    });

    // 4. Execute AI Request with Zod Schema Validation & Deterministic Temperature
    const aiResult = await aiRequestServiceInstance.execute<ResumeRewriteOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: RESUME_REWRITE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: resumeRewriteOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 35000,
      maxRetries: 3
    });

    return aiResult.data;
  }

  /**
   * Applies approved rewrite suggestions to candidate resume state (Accept One, Accept Section, Accept All)
   */
  public async applyRewriteSuggestions(
    userId: string,
    resumeId: string,
    approvedIds: string[],
    suggestions: RewriteSuggestion[]
  ): Promise<any> {
    if (!userId || !resumeId || !Array.isArray(approvedIds)) {
      throw new ValidationError('userId, resumeId, and approvedIds array are required.');
    }

    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const content = JSON.parse(JSON.stringify(resume.content || {}));

    const approvedSet = new Set(approvedIds);
    const approvedSuggestions = suggestions.filter(s => approvedSet.has(s.id));

    if (approvedSuggestions.length === 0) {
      return resume;
    }

    // Apply approved suggestions safely to canonical JSON
    approvedSuggestions.forEach((s) => {
      if (s.section === 'summary') {
        content.summary = s.improved;
      } else if (s.section === 'personalInfo' && typeof content.personalInfo === 'object') {
        content.personalInfo.summary = s.improved;
      } else if (s.section === 'skills') {
        if (Array.isArray(content.skills)) {
          // Add or replace skills
          const newSkillItems = s.improved.split(',').map(item => ({ name: item.trim() }));
          content.skills = newSkillItems;
        }
      } else if (s.section === 'experience' && Array.isArray(content.experience)) {
        if (content.experience.length > 0 && content.experience[0].bullets) {
          content.experience[0].bullets[0] = s.improved;
        }
      } else if (s.section === 'projects' && Array.isArray(content.projects)) {
        if (content.projects.length > 0 && content.projects[0].description) {
          content.projects[0].description = s.improved;
        }
      }
    });

    // Save updated resume to database repository
    return resumeServiceInstance.updateResumeForUser(userId, resumeId, {
      content
    });
  }
}

export const resumeRewriteServiceInstance = new ResumeRewriteService();
