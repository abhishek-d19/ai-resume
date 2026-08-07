import { resumeServiceInstance, ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  hiringCommitteeReviewerSchema, 
  HiringCommitteeReviewerOutput 
} from '../features/ai/schemas/hiring-committee-engine.schema';
import { 
  hiringCommitteeConsensusSchema, 
  HiringCommitteeConsensusOutput 
} from '../features/ai/schemas/hiring-committee-consensus.schema';
import { 
  ATS_SPECIALIST_SYSTEM_PROMPT, 
  TECH_MANAGER_SYSTEM_PROMPT, 
  HR_RECRUITER_SYSTEM_PROMPT, 
  buildHiringCommitteeUserPrompt 
} from '../features/ai/prompts/hiring-committee-engine';
import { 
  CONSENSUS_ENGINE_SYSTEM_PROMPT, 
  buildCommitteeConsensusUserPrompt 
} from '../features/ai/prompts/hiring-committee-consensus';

export interface FullHiringCommitteeResponse {
  reviewers: HiringCommitteeReviewerOutput[];
  consensus: HiringCommitteeConsensusOutput;
}

export class HiringCommitteeService {
  /**
   * Executes 3 Independent AI Reviewers concurrently -> Synthesizes Weighted Consensus (25% ATS, 45% Tech, 30% HR)
   */
  public async evaluateCommittee(
    userId: string,
    resumeId: string,
    targetRole?: string
  ): Promise<FullHiringCommitteeResponse> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for committee evaluation.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const userPrompt = buildHiringCommitteeUserPrompt(resume.title, resume.content || {}, targetRole);

    // 2. CONCURRENT INDEPENDENT REVIEW EXECUTION
    const [atsResult, techResult, hrResult] = await Promise.all([
      // Reviewer 1: ATS Specialist (25%)
      aiRequestServiceInstance.execute<HiringCommitteeReviewerOutput>({
        params: {
          prompt: userPrompt,
          systemPrompt: ATS_SPECIALIST_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: hiringCommitteeReviewerSchema,
          temperature: 0.0 // Deterministic
        },
        timeoutMs: 25000,
        maxRetries: 3
      }),

      // Reviewer 2: Technical Hiring Manager (45%)
      aiRequestServiceInstance.execute<HiringCommitteeReviewerOutput>({
        params: {
          prompt: userPrompt,
          systemPrompt: TECH_MANAGER_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: hiringCommitteeReviewerSchema,
          temperature: 0.0 // Deterministic
        },
        timeoutMs: 25000,
        maxRetries: 3
      }),

      // Reviewer 3: HR Recruiter (30%)
      aiRequestServiceInstance.execute<HiringCommitteeReviewerOutput>({
        params: {
          prompt: userPrompt,
          systemPrompt: HR_RECRUITER_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: hiringCommitteeReviewerSchema,
          temperature: 0.0 // Deterministic
        },
        timeoutMs: 25000,
        maxRetries: 3
      })
    ]);

    const reviewers: HiringCommitteeReviewerOutput[] = [
      atsResult.data,
      techResult.data,
      hrResult.data
    ];

    // Calculate programmatic weighted overall score (25% ATS, 45% Tech, 30% HR)
    const atsScore = atsResult.data.score || 80;
    const techScore = techResult.data.score || 80;
    const hrScore = hrResult.data.score || 80;
    const weightedOverallScore = Math.round((atsScore * 0.25) + (techScore * 0.45) + (hrScore * 0.30));

    // 3. CONSENSUS SYNTHESIS STAGE
    const consensusUserPrompt = buildCommitteeConsensusUserPrompt(resume.title, reviewers);

    const consensusAiResult = await aiRequestServiceInstance.execute<HiringCommitteeConsensusOutput>({
      params: {
        prompt: consensusUserPrompt,
        systemPrompt: CONSENSUS_ENGINE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: hiringCommitteeConsensusSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 25000,
      maxRetries: 3
    });

    const consensusData = {
      ...consensusAiResult.data,
      overallScore: weightedOverallScore // Enforce exact mathematical weight
    };

    return {
      reviewers,
      consensus: consensusData
    };
  }
}

export const hiringCommitteeServiceInstance = new HiringCommitteeService();
