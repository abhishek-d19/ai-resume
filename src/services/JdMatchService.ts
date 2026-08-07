import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { jdMatchOutputSchema, JdMatchOutput } from '../features/ai/schemas/jd-match-engine.schema';
import { 
  JD_MATCH_ENGINE_SYSTEM_PROMPT, 
  buildJdMatchEngineUserPrompt 
} from '../features/ai/prompts/jd-match-engine';

export class JdMatchService {
  /**
   * Executes Complete JD Matching Pipeline:
   * API Route -> JdMatchService -> AIService -> Provider -> Zod Validation -> Repository -> Supabase
   */
  public async matchJobDescription(
    userId: string,
    resumeId: string,
    jobDescriptionText: string,
    targetRole?: string
  ): Promise<JdMatchOutput> {
    if (!userId || !resumeId || !jobDescriptionText) {
      throw new ValidationError('userId, resumeId, and jobDescriptionText are required for JD matching.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Build User Prompt
    const userPrompt = buildJdMatchEngineUserPrompt({
      title: resume.title,
      jobDescriptionText,
      targetRole,
      resumeContent: resume.content || {}
    });

    // 3. Execute AIService request with Zod Schema Validation & Deterministic Temperature
    const aiResult = await aiRequestServiceInstance.execute<JdMatchOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: JD_MATCH_ENGINE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: jdMatchOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    const matchOutput = aiResult.data;

    // 4. Persist completed match into Supabase jd_matches database table
    await resumeRepository.saveJdMatchResult({
      resume_id: resumeId,
      job_description: jobDescriptionText,
      match_score: matchOutput.overallMatch,
      analysis_json: matchOutput,
      provider: aiResult.provider,
      model: aiResult.model
    });

    return matchOutput;
  }

  /**
   * Retrieves latest saved JD match result for a candidate resume
   */
  public async getLatestJdMatchResult(userId: string, resumeId: string): Promise<JdMatchOutput | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    // Ownership permission check
    await resumeServiceInstance.getResumeForUser(userId, resumeId);

    const savedRecord = await resumeRepository.getLatestJdMatchResult(resumeId);
    if (!savedRecord) return null;

    return (savedRecord.analysis_json || savedRecord.match_json) as JdMatchOutput;
  }

  /**
   * Retrieves full historical JD match timeline records for a candidate resume
   */
  public async getJdMatchHistory(userId: string, resumeId: string): Promise<any[]> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    await resumeServiceInstance.getResumeForUser(userId, resumeId);
    return resumeRepository.getJdMatchHistory(resumeId);
  }
}

export const jdMatchServiceInstance = new JdMatchService();
