import { resumeServiceInstance, ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { atsKeywordOutputSchema, AtsKeywordOutput } from '../features/ai/schemas/ats-keyword-optimization.schema';
import { 
  ATS_KEYWORD_SYSTEM_PROMPT, 
  buildAtsKeywordUserPrompt 
} from '../features/ai/prompts/ats-keyword-optimization';

export class AtsKeywordService {
  /**
   * Performs ATS Keyword Frequency & Placement Optimization Audit
   */
  public async analyzeKeywords(
    userId: string,
    resumeId: string,
    jobDescriptionText: string,
    targetRole?: string
  ): Promise<AtsKeywordOutput> {
    if (!userId || !resumeId || !jobDescriptionText) {
      throw new ValidationError('userId, resumeId, and jobDescriptionText are required for ATS keyword optimization.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Build User Prompt
    const userPrompt = buildAtsKeywordUserPrompt({
      title: resume.title,
      jobDescriptionText,
      targetRole,
      resumeContent: resume.content || {}
    });

    // 3. Execute AI Request with Zod Schema Validation & Deterministic Temperature
    const aiResult = await aiRequestServiceInstance.execute<AtsKeywordOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: ATS_KEYWORD_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: atsKeywordOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    return aiResult.data;
  }
}

export const atsKeywordServiceInstance = new AtsKeywordService();
