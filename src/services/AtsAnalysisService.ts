import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { atsAnalysisOutputSchema, AtsAnalysisOutput } from '../features/ai/schemas/ats-analysis-engine.schema';
import { 
  ATS_ANALYSIS_ENGINE_SYSTEM_PROMPT, 
  buildAtsAnalysisEngineUserPrompt 
} from '../features/ai/prompts/ats-analysis-engine';

export class AtsAnalysisService {
  /**
   * Executes ATS Compliance Audit Pipeline:
   * Fetch Resume -> Build Prompt -> LLM Execution (Deterministic) -> Zod Schema Validation -> Persist -> Return
   */
  public async analyzeAtsCompliance(
    userId: string,
    resumeId: string,
    targetRole?: string
  ): Promise<AtsAnalysisOutput> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for ATS analysis.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Build User Prompt
    const userPrompt = buildAtsAnalysisEngineUserPrompt({
      title: resume.title,
      targetRole,
      resumeContent: resume.content || {}
    });

    // 3. Execute AI Request with Zod Schema Validation & Deterministic Temperature
    const aiResult = await aiRequestServiceInstance.execute<AtsAnalysisOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: ATS_ANALYSIS_ENGINE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: atsAnalysisOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    const atsOutput = aiResult.data;

    // 4. Persist result into database persistence layer
    await resumeRepository.saveResumeAnalysis({
      resume_id: resumeId,
      overall_score: atsOutput.atsScore,
      analysis_json: atsOutput,
      provider: aiResult.provider,
      model: aiResult.model
    });

    return atsOutput;
  }

  /**
   * Retrieves latest saved ATS compliance audit for a candidate resume
   */
  public async getLatestAtsAnalysis(userId: string, resumeId: string): Promise<AtsAnalysisOutput | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    // Ownership permission check
    await resumeServiceInstance.getResumeForUser(userId, resumeId);

    const savedRecord = await resumeRepository.getLatestResumeAnalysis(resumeId);
    if (!savedRecord) return null;

    return (savedRecord.analysis_json || savedRecord.analysis_data) as AtsAnalysisOutput;
  }
}

export const atsAnalysisServiceInstance = new AtsAnalysisService();
