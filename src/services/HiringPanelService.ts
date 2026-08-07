import { resumeServiceInstance, ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  reviewerEvaluationSchema, 
  hiringPanelConsensusSchema, 
  ReviewerEvaluation, 
  HiringPanelConsensus 
} from '../features/ai/schemas/hiring-panel-engine.schema';
import { 
  ATS_REVIEWER_SYSTEM_PROMPT, 
  TECHNICAL_MANAGER_SYSTEM_PROMPT, 
  HR_RECRUITER_SYSTEM_PROMPT, 
  CONSENSUS_SYNTHESIS_SYSTEM_PROMPT,
  buildIndividualReviewerUserPrompt,
  buildConsensusUserPrompt
} from '../features/ai/prompts/hiring-panel-engine';

export class HiringPanelService {
  /**
   * Executes 3 Independent Reviewers concurrently -> Synthesizes Consensus -> Returns Deterministic Result
   */
  public async evaluateHiringPanel(
    userId: string,
    resumeId: string,
    targetRole?: string
  ): Promise<HiringPanelConsensus> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for panel evaluation.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const userPrompt = buildIndividualReviewerUserPrompt(resume.title, resume.content || {}, targetRole);

    // 2. CONCURRENT INDEPENDENT REVIEW EXECUTION (No reviewer sees another review beforehand!)
    const [atsResult, techResult, hrResult] = await Promise.all([
      // Reviewer 1: ATS Reviewer
      aiRequestServiceInstance.execute<ReviewerEvaluation>({
        params: {
          prompt: userPrompt,
          systemPrompt: ATS_REVIEWER_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: reviewerEvaluationSchema,
          temperature: 0.0 // Deterministic
        },
        timeoutMs: 25000,
        maxRetries: 3
      }),

      // Reviewer 2: Technical Hiring Manager
      aiRequestServiceInstance.execute<ReviewerEvaluation>({
        params: {
          prompt: userPrompt,
          systemPrompt: TECHNICAL_MANAGER_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: reviewerEvaluationSchema,
          temperature: 0.0 // Deterministic
        },
        timeoutMs: 25000,
        maxRetries: 3
      }),

      // Reviewer 3: HR Recruiter
      aiRequestServiceInstance.execute<ReviewerEvaluation>({
        params: {
          prompt: userPrompt,
          systemPrompt: HR_RECRUITER_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: reviewerEvaluationSchema,
          temperature: 0.0 // Deterministic
        },
        timeoutMs: 25000,
        maxRetries: 3
      })
    ]);

    const independentReviews: ReviewerEvaluation[] = [
      atsResult.data,
      techResult.data,
      hrResult.data
    ];

    // 3. CONSENSUS SYNTHESIS STAGE
    const consensusUserPrompt = buildConsensusUserPrompt(resume.title, independentReviews);

    const consensusResult = await aiRequestServiceInstance.execute<HiringPanelConsensus>({
      params: {
        prompt: consensusUserPrompt,
        systemPrompt: CONSENSUS_SYNTHESIS_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: hiringPanelConsensusSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 25000,
      maxRetries: 3
    });

    const finalConsensus: HiringPanelConsensus = {
      ...consensusResult.data,
      reviewers: independentReviews
    };

    // 4. Persist Hiring Panel Result to Supabase persistence layer
    await resumeRepository.saveHiringPanelResult({
      resume_id: resumeId,
      decision: finalConsensus.decision,
      confidence: finalConsensus.confidence,
      reviewer_outputs: independentReviews,
      consensus: finalConsensus,
      provider: consensusResult.provider,
      model: consensusResult.model
    });

    return finalConsensus;
  }

  /**
   * Retrieves latest saved hiring panel evaluation for a given candidate resume
   */
  public async getLatestHiringPanelResult(userId: string, resumeId: string): Promise<HiringPanelConsensus | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    // Ownership permission check
    await resumeServiceInstance.getResumeForUser(userId, resumeId);

    const savedRecord = await resumeRepository.getLatestHiringPanelResult(resumeId);
    if (!savedRecord) return null;

    return (savedRecord.consensus || savedRecord.reviewer_outputs) as HiringPanelConsensus;
  }
}

export const hiringPanelServiceInstance = new HiringPanelService();
