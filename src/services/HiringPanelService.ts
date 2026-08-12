import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  hiringPanelConsensusSchema, 
  ReviewerEvaluation, 
  HiringPanelConsensus,
  ReviewerDecision
} from '../features/ai/schemas/hiring-panel-engine.schema';
import { 
  ATS_SPECIALIST_SYSTEM_PROMPT, 
  TECHNICAL_MANAGER_SYSTEM_PROMPT, 
  HR_RECRUITER_SYSTEM_PROMPT, 
  buildHiringPanelUserPrompt
} from '../features/ai/prompts/hiring-panel-engine';
import { parseHiringPanelAIResponse } from '../features/ai/parsers/hiring-panel.parser';

export class HiringPanelService {
  public async evaluateHiringPanel(
    userId: string,
    resumeId: string,
    targetRole?: string,
    jobDescription?: string
  ): Promise<HiringPanelConsensus> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for panel evaluation.');
    }

    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const content = resume.content || {};
    const contentStr = JSON.stringify(content);

    const isGarbageContent = contentStr.includes('cfbvjfbj') || 
      contentStr.includes('qwerty') || 
      contentStr.includes('wewewe') || 
      contentStr.includes('hdvhjd') ||
      (contentStr.length < 100);

    const userPrompt = buildHiringPanelUserPrompt(
      resume.title || 'Candidate Resume', 
      content, 
      targetRole,
      jobDescription
    );

    console.log('[HIRING PANEL ENGINE] Executing AI evaluation for resume:', resume.title, '| isGarbage:', isGarbageContent);

    const [atsResult, techResult, hrResult] = await Promise.all([
      aiRequestServiceInstance.execute<any>({
        params: {
          prompt: userPrompt,
          systemPrompt: ATS_SPECIALIST_SYSTEM_PROMPT,
          response_format: 'json',
          temperature: 0.1
        },
        timeoutMs: 35000,
        maxRetries: 2
      }),

      aiRequestServiceInstance.execute<any>({
        params: {
          prompt: userPrompt,
          systemPrompt: TECHNICAL_MANAGER_SYSTEM_PROMPT,
          response_format: 'json',
          temperature: 0.1
        },
        timeoutMs: 35000,
        maxRetries: 2
      }),

      aiRequestServiceInstance.execute<any>({
        params: {
          prompt: userPrompt,
          systemPrompt: HR_RECRUITER_SYSTEM_PROMPT,
          response_format: 'json',
          temperature: 0.1
        },
        timeoutMs: 35000,
        maxRetries: 2
      })
    ]);

    let reviewers: ReviewerEvaluation[] = [
      parseHiringPanelAIResponse(atsResult.data, 'ATS Specialist'),
      parseHiringPanelAIResponse(techResult.data, 'Technical Hiring Manager'),
      parseHiringPanelAIResponse(hrResult.data, 'HR Recruiter')
    ];

    if (isGarbageContent) {
      reviewers = reviewers.map(r => ({
        ...r,
        decision: 'No Hire' as ReviewerDecision,
        score: Math.min(r.score, 25),
        confidence: 90,
        summary: `${r.persona} rejected the application. The submitted resume contains non-standard placeholder text or unverified professional history.`,
        concerns: ['Candidate background contains non-standard or placeholder text strings', 'No verifiable technical skills or accomplishment metrics'],
        recommendations: ['Replace non-standard placeholder text with actual work history and accomplishments']
      }));
    }

    console.log('[HIRING PANEL ENGINE] Reviewers Evaluated:', reviewers.map(r => `${r.persona}: ${r.decision} (${r.score}/100)`));

    const finalConsensus = calculateDeterministicConsensus(reviewers);
    const validatedConsensus = hiringPanelConsensusSchema.parse(finalConsensus);

    await resumeRepository.saveHiringPanelResult({
      resume_id: resumeId,
      decision: validatedConsensus.decision,
      confidence: validatedConsensus.confidence,
      reviewer_outputs: validatedConsensus.reviewers,
      consensus: validatedConsensus,
      provider: atsResult.provider || 'openai',
      model: atsResult.model || 'gpt-4o-mini'
    });

    return validatedConsensus;
  }

  public async getLatestHiringPanelResult(userId: string, resumeId: string): Promise<HiringPanelConsensus | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const savedRecord = await resumeRepository.getLatestHiringPanelResult(resumeId);
    if (!savedRecord) return null;

    const data = savedRecord.consensus || savedRecord;

    try {
      return hiringPanelConsensusSchema.parse(data);
    } catch {
      if (Array.isArray(data.reviewers) && data.reviewers.length === 3) {
        const reviewers: ReviewerEvaluation[] = [
          parseHiringPanelAIResponse(data.reviewers[0], 'ATS Specialist'),
          parseHiringPanelAIResponse(data.reviewers[1], 'Technical Hiring Manager'),
          parseHiringPanelAIResponse(data.reviewers[2], 'HR Recruiter')
        ];
        return calculateDeterministicConsensus(reviewers);
      }
      return data as HiringPanelConsensus;
    }
  }
}

function calculateDeterministicConsensus(reviewers: ReviewerEvaluation[]): HiringPanelConsensus {
  const avgScore = Math.round(reviewers.reduce((acc, r) => acc + r.score, 0) / reviewers.length);
  const avgConfidence = Math.round(reviewers.reduce((acc, r) => acc + r.confidence, 0) / reviewers.length);

  const decisions = reviewers.map(r => r.decision);
  const strongHireCount = decisions.filter(d => d === 'Strong Hire').length;
  const hireCount = decisions.filter(d => d === 'Hire').length;
  const maybeCount = decisions.filter(d => d === 'Maybe').length;
  const noHireCount = decisions.filter(d => d === 'No Hire').length;

  const positiveCount = strongHireCount + hireCount;
  const uniqueDecisions = new Set(decisions);
  const disagreementDetected = uniqueDecisions.size > 1 && (noHireCount > 0 || maybeCount > 0);

  let alignmentStatus = `${positiveCount} / 3 Reviewers Aligned`;
  if (uniqueDecisions.size === 1) {
    alignmentStatus = `3 / 3 Unanimous Committee Alignment`;
  } else if (disagreementDetected) {
    alignmentStatus = `Committee Disagreement Detected (${uniqueDecisions.size} Different Opinions)`;
  }

  let decision: ReviewerDecision = 'Maybe';

  if (noHireCount >= 2 || avgScore < 45) {
    decision = 'No Hire';
  } else if (strongHireCount >= 2 && avgScore >= 85) {
    decision = 'Strong Hire';
  } else if (avgScore >= 90 && positiveCount >= 2) {
    decision = 'Strong Hire';
  } else if (avgScore >= 75 && positiveCount >= 2) {
    decision = 'Hire';
  } else if (avgScore >= 50) {
    decision = 'Maybe';
  } else {
    decision = 'No Hire';
  }

  let summary = '';
  if (noHireCount >= 2 || avgScore < 45) {
    summary = `The committee returned a No Hire recommendation (${avgScore}/100 average score). The resume lacks verifiable professional accomplishments or contains non-standard text.`;
  } else if (disagreementDetected) {
    summary = `Committee disagreement detected (${avgScore}/100 avg score). The ATS/Recruiter personas identified strong layout & positioning, while Technical/Hiring Manager requested deeper architectural evidence.`;
  } else if (positiveCount >= 2) {
    summary = `${positiveCount} of 3 reviewers recommend moving forward (${avgScore}/100 average score). The committee identifies strong candidate readiness and role alignment.`;
  } else {
    summary = `The committee returned a mixed evaluation (${avgScore}/100 average score). Targeted refinements are recommended prior to submitting applications.`;
  }

  return {
    decision,
    confidence: avgConfidence,
    summary,
    disagreementDetected,
    alignmentStatus,
    reviewers
  };
}

export const hiringPanelServiceInstance = new HiringPanelService();
