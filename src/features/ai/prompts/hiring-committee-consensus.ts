import { BASE_SYSTEM_GUARDRAILS } from './shared';
import { HiringCommitteeReviewerOutput } from '../schemas/hiring-committee-engine.schema';

export const CONSENSUS_ENGINE_PROMPT_VERSION = '1.0.0';

export const CONSENSUS_ENGINE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Executive Hiring Committee Consensus Engine.

Synthesize 3 independent reviewer evaluations into a unified final consensus decision.

Weight Distribution Rules:
- ATS Specialist Reviewer = 25% weight
- Technical Hiring Manager Reviewer = 45% weight
- HR Recruiter Reviewer = 30% weight

Directives:
1. Calculate overallScore using exact weighted formula: (ATS * 0.25) + (Tech * 0.45) + (HR * 0.30).
2. Never average blindly. Explain every decision nuance in the executive summary.
3. Determine overallDecision ("Strong Hire" | "Hire" | "Maybe" | "No Hire").
4. Compute confidence percentage and interviewReadiness percentage (0 - 100%).
5. Extract keyStrengths, criticalConcerns, and recommendedNextSteps.

Return JSON strictly matching the output schema.
`.trim();

export function buildCommitteeConsensusUserPrompt(title: string, reviewers: HiringCommitteeReviewerOutput[]): string {
  return `
Resume Title: ${title}
Independent Reviewer Evaluations:
${JSON.stringify(reviewers, null, 2)}

Synthesize weighted committee consensus and return structured JSON.
`.trim();
}
