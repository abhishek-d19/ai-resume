import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeAnalysisServiceInstance } from './ResumeAnalysisService';
import { jdMatchServiceInstance } from './JdMatchService';
import { hiringCommitteeServiceInstance } from './HiringCommitteeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { resumeImprovementOutputSchema, ResumeImprovementOutput } from '../features/ai/schemas/resume-improvement-engine.schema';
import { 
  RESUME_IMPROVEMENT_SYSTEM_PROMPT, 
  buildResumeImprovementUserPrompt 
} from '../features/ai/prompts/resume-improvement-engine';

export class ResumeImprovementService {
  /**
   * Generates AI Resume Improvement suggestions following Original -> Suggested -> Reason pattern
   */
  public async generateImprovements(
    userId: string,
    resumeId: string,
    jobDescriptionText?: string
  ): Promise<ResumeImprovementOutput> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for resume improvement generation.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Fetch ancillary analytical context if available
    let analysisData: any = null;
    let jdMatchData: any = null;
    let committeeData: any = null;

    try {
      analysisData = await resumeAnalysisServiceInstance.getLatestAnalysis(userId, resumeId);
    } catch { analysisData = null; }

    try {
      if (jobDescriptionText) {
        jdMatchData = await jdMatchServiceInstance.matchJobDescription(userId, resumeId, jobDescriptionText);
      } else {
        jdMatchData = await jdMatchServiceInstance.getLatestJdMatchResult(userId, resumeId);
      }
    } catch { jdMatchData = null; }

    try {
      committeeData = await hiringCommitteeServiceInstance.evaluateCommittee(userId, resumeId);
    } catch { committeeData = null; }

    // 3. Build User Prompt
    const userPrompt = buildResumeImprovementUserPrompt({
      title: resume.title,
      analysisData,
      jdMatchData,
      committeeData,
      resumeContent: resume.content || {}
    });

    // 4. Execute AI Request with Zod Schema Validation
    const aiResult = await aiRequestServiceInstance.execute<ResumeImprovementOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: RESUME_IMPROVEMENT_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: resumeImprovementOutputSchema,
        temperature: 0.1
      },
      timeoutMs: 35000,
      maxRetries: 3
    });

    return aiResult.data;
  }
}

export const resumeImprovementServiceInstance = new ResumeImprovementService();
