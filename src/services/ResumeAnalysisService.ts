import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { resumeAnalysisOutputSchema, ResumeAnalysisOutput } from '../features/ai/schemas/resume-analysis-engine.schema';
import { 
  RESUME_ANALYSIS_ENGINE_SYSTEM_PROMPT, 
  buildResumeAnalysisEngineUserPrompt,
  RESUME_ANALYSIS_ENGINE_PROMPT_VERSION 
} from '../features/ai/prompts/resume-analysis-engine';

export class ResumeAnalysisService {
  /**
   * Executes AI Resume Analysis Engine Pipeline:
   * AI Route -> ResumeAnalysisService -> AIService -> Provider -> Structured JSON -> Zod Validation -> Append-only Persistence
   */
  public async analyzeResume(
    userId: string, 
    resumeId: string, 
    targetRole?: string
  ): Promise<{ analysis: ResumeAnalysisOutput; recordId: string }> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for analysis.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Build User Prompt
    const userPrompt = buildResumeAnalysisEngineUserPrompt({
      title: resume.title,
      targetRole,
      resumeContent: resume.content || {}
    });

    // 3. Execute AIService request with Zod Schema Validation & Automatic Retry
    const aiResult = await aiRequestServiceInstance.execute<ResumeAnalysisOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: RESUME_ANALYSIS_ENGINE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: resumeAnalysisOutputSchema,
        temperature: 0.1,
        max_tokens: 4096
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    const analysisOutput = aiResult.data;

    // Synthesize quick executive summary sentence
    const executiveSummaryText = `Candidate achieved an overall score of ${analysisOutput.overallScore}/100 with key strengths in ${analysisOutput.strengths.slice(0, 2).join(', ')}. Top recommendation: ${analysisOutput.recommendations[0] || 'Enrich metric density'}.`;
    const atsScoreComputed = Math.round((analysisOutput.sectionScores.skills + analysisOutput.sectionScores.experience) / 2);

    // 4. Persist a NEW append-only record in Supabase resume_analysis table (never overwrite history)
    const savedRecord = await resumeRepository.createResumeAnalysis({
      resume_id: resumeId,
      overall_score: analysisOutput.overallScore,
      ats_score: atsScoreComputed,
      analysis_json: analysisOutput,
      executive_summary: executiveSummaryText,
      provider: aiResult.provider,
      model: aiResult.model,
      prompt_version: RESUME_ANALYSIS_ENGINE_PROMPT_VERSION
    });

    return {
      analysis: analysisOutput,
      recordId: savedRecord.id
    };
  }

  /**
   * Retrieves latest saved analysis for a candidate resume
   */
  public async getLatestAnalysis(userId: string, resumeId: string): Promise<ResumeAnalysisOutput | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    await resumeServiceInstance.getResumeForUser(userId, resumeId);

    const savedRecord = await resumeRepository.getLatestResumeAnalysis(resumeId);
    if (!savedRecord) return null;

    return (savedRecord.analysis_json || savedRecord.analysis_data) as ResumeAnalysisOutput;
  }

  /**
   * Retrieves full append-only historical AI analysis timeline records for a candidate resume
   */
  public async getAnalysisHistory(userId: string, resumeId: string): Promise<any[]> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    await resumeServiceInstance.getResumeForUser(userId, resumeId);
    return resumeRepository.getAnalysisHistory(resumeId);
  }
}

export const resumeAnalysisServiceInstance = new ResumeAnalysisService();
