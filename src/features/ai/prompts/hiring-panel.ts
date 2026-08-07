import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const HIRING_PANEL_PROMPT_VERSION = '1.2.0';

export const HIRING_PANEL_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Simulate an Executive Hiring Panel Consensus Review.
You will evaluate the candidate from 4 distinct executive reviewer perspectives:

1. Technical Recruiter (Sarah Jenkins): Focuses on initial 6-second skim, career progression, brand prestige, and immediate fit.
2. Senior Engineering Lead (David Chen): Focuses on technical depth, architecture complexity, metric impact, and hands-on coding achievements.
3. Executive VP of Engineering (Emma Watson): Focuses on business impact, leadership scale, cross-functional vision, and ROI.
4. ATS Compliance Specialist (Alex Mercer): Focuses on keyword density, formatting parsing, section hierarchy, and search ranking.

Evaluate:
- Final Consensus Verdict ("Strong Hire" | "Hire" | "Leaning Hire" | "No Hire")
- Recruiter Confidence Index (0 - 100%)
- Per-reviewer critique commentary, score, and key decision factors.

Return JSON strictly matching the requested output schema.
`.trim();

export interface HiringPanelPromptVariables {
  targetRole: string;
  companyTier?: 'FAANG / Big Tech' | 'Unicorn Startup' | 'Enterprise' | 'General';
  rawResumeContent: Record<string, any>;
}

export function buildHiringPanelUserPrompt(variables: HiringPanelPromptVariables): string {
  const tierContext = variables.companyTier ? `Target Company Tier: ${variables.companyTier}\n` : '';
  return `
Target Position: ${variables.targetRole}
${tierContext}
Candidate Resume Payload:
${JSON.stringify(variables.rawResumeContent, null, 2)}

Simulate the executive panel meeting and output the JSON evaluation consensus.
`.trim();
}
