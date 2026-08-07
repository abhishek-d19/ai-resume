import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeAnalysisServiceInstance } from './ResumeAnalysisService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { executiveSummaryOutputSchema, ExecutiveSummaryOutput } from '../features/ai/schemas/executive-summary.schema';
import { 
  EXECUTIVE_SUMMARY_SYSTEM_PROMPT, 
  buildExecutiveSummaryUserPrompt 
} from '../features/ai/prompts/executive-summary';

export class ExecutiveSummaryService {
  /**
   * Generates a 150-250 word Executive Summary post-resume analysis
   */
  public async generateExecutiveSummary(
    userId: string,
    resumeId: string,
    targetRole?: string
  ): Promise<ExecutiveSummaryOutput> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for executive summary generation.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Fetch or trigger Resume Analysis Output
    let analysisOutput = await resumeAnalysisServiceInstance.getLatestAnalysis(userId, resumeId);
    if (!analysisOutput) {
      analysisOutput = await resumeAnalysisServiceInstance.analyzeResume(userId, resumeId, targetRole);
    }

    // 3. Build Prompt
    const userPrompt = buildExecutiveSummaryUserPrompt({
      title: resume.title,
      targetRole,
      analysisOutput,
      resumeContent: resume.content || {}
    });

    // 4. Execute AI Request with Zod Schema Validation
    const aiResult = await aiRequestServiceInstance.execute<ExecutiveSummaryOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: EXECUTIVE_SUMMARY_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: executiveSummaryOutputSchema,
        temperature: 0.2 // Soft, professional & supportive synthesis
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    const summaryOutput = aiResult.data;

    // 5. Persist Executive Summary SEPARATELY into Supabase executive_summaries table
    await resumeRepository.saveExecutiveSummary({
      resume_id: resumeId,
      summary_text: summaryOutput.summaryText,
      hiring_confidence_score: summaryOutput.hiringConfidenceScore,
      summary_json: summaryOutput,
      provider: aiResult.provider,
      model: aiResult.model
    });

    return summaryOutput;
  }

  /**
   * Retrieves latest saved Executive Summary for a candidate resume
   */
  public async getLatestExecutiveSummary(userId: string, resumeId: string): Promise<ExecutiveSummaryOutput | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    // Ownership permission check
    await resumeServiceInstance.getResumeForUser(userId, resumeId);

    const savedRecord = await resumeRepository.getLatestExecutiveSummary(resumeId);
    if (!savedRecord) return null;

    return savedRecord.summary_json as ExecutiveSummaryOutput;
  }
}

export const executiveSummaryServiceInstance = new ExecutiveSummaryService();
