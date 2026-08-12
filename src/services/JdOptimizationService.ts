import { resumeServiceInstance, ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  jdOptimizationOutputSchema, 
  JdOptimizationOutput, 
  JdOptimizationChange 
} from '../features/ai/schemas/jd-optimization.schema';
import { 
  JD_OPTIMIZATION_SYSTEM_PROMPT, 
  buildJdOptimizationUserPrompt 
} from '../features/ai/prompts/jd-optimization';

export class JdOptimizationService {
  /**
   * Generates AI-powered structured resume optimization proposals for a target Job Description
   */
  public async generateOptimizationProposals(
    userId: string,
    resumeId: string,
    jobDescription: string,
    missingSkills: string[] = []
  ): Promise<JdOptimizationOutput> {
    if (!userId || !resumeId || !jobDescription) {
      throw new ValidationError('userId, resumeId, and jobDescription are required.');
    }

    // 1. Fetch Candidate Canonical Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const userPrompt = buildJdOptimizationUserPrompt(
      resume.title || 'Candidate Resume',
      resume.content || {},
      jobDescription,
      missingSkills
    );

    // 2. Call AI Request Service with Zod Schema Validation
    const aiResult = await aiRequestServiceInstance.execute<JdOptimizationOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: JD_OPTIMIZATION_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: jdOptimizationOutputSchema,
        temperature: 0.2
      },
      timeoutMs: 35000,
      maxRetries: 2
    });

    return aiResult.data;
  }

  /**
   * Pure Function: Applies selected changes to canonical resume JSON without mutating original
   */
  public applyJDOptimizations(
    originalCanonicalResume: Record<string, any>,
    selectedChanges: JdOptimizationChange[]
  ): Record<string, any> {
    if (!originalCanonicalResume || typeof originalCanonicalResume !== 'object') {
      return {};
    }

    // Deep clone canonical resume object
    const updated = JSON.parse(JSON.stringify(originalCanonicalResume));

    selectedChanges.forEach((change) => {
      const { section, type, after } = change;

      if (section === 'summary') {
        if (after && after.trim()) {
          updated.summary = after.trim();
        }
      } else if (section === 'skills') {
        if (!Array.isArray(updated.skills)) {
          updated.skills = [];
        }
        if (type === 'add' || type === 'rewrite') {
          // Normalize skill additions
          const newSkill = after.trim();
          if (newSkill && !updated.skills.some((s: any) => (typeof s === 'string' ? s : s.name)?.toLowerCase() === newSkill.toLowerCase())) {
            updated.skills.push(newSkill);
          }
        }
      } else if (section === 'experience') {
        if (Array.isArray(updated.experience) && updated.experience.length > 0) {
          // Apply bullet point rewrite or addition to first/relevant experience item
          const firstExp = updated.experience[0];
          if (!Array.isArray(firstExp.bulletPoints)) {
            firstExp.bulletPoints = Array.isArray(firstExp.bullets) ? firstExp.bullets : [];
          }
          if (type === 'rewrite' && change.before && firstExp.bulletPoints.length > 0) {
            const matchIdx = firstExp.bulletPoints.findIndex((b: string) => b.includes(change.before.substring(0, 20)));
            if (matchIdx !== -1) {
              firstExp.bulletPoints[matchIdx] = after;
            } else {
              firstExp.bulletPoints.unshift(after);
            }
          } else if (type === 'add') {
            firstExp.bulletPoints.unshift(after);
          }
        }
      } else if (section === 'projects') {
        if (Array.isArray(updated.projects) && updated.projects.length > 0) {
          const firstProj = updated.projects[0];
          if (type === 'rewrite' && after) {
            firstProj.description = after;
          }
        }
      }
    });

    return updated;
  }

  /**
   * Applies selected changes, creates a NEW resume version in Supabase, and returns the updated entity
   */
  public async applyOptimizationsAndCreateNewVersion(
    userId: string,
    resumeId: string,
    originalCanonicalResume: Record<string, any>,
    selectedChanges: JdOptimizationChange[],
    targetTitle?: string
  ): Promise<any> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    // 1. Generate updated canonical content
    const updatedContent = this.applyJDOptimizations(originalCanonicalResume, selectedChanges);

    // 2. Fetch current resume to inspect current version
    const existing = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const newVersion = (existing.version || 1) + 1;
    const newTitle = targetTitle ? `${existing.title} (${targetTitle})` : `${existing.title} (JD Optimized v${newVersion})`;

    // 3. Persist new version to Supabase
    const updatedResume = await resumeServiceInstance.updateResume({
      userId,
      resumeId,
      title: newTitle,
      content: updatedContent,
      incrementVersion: true
    });

    return updatedResume;
  }
}

export const jdOptimizationServiceInstance = new JdOptimizationService();
