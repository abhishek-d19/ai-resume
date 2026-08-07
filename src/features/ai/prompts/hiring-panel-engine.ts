import { BASE_SYSTEM_GUARDRAILS } from './shared';
import { ReviewerEvaluation } from '../schemas/hiring-panel-engine.schema';

export const HIRING_PANEL_ENGINE_PROMPT_VERSION = '2.0.0';

export const ATS_REVIEWER_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}
Persona: ATS Compliance Reviewer.
Focus: Keyword density, machine parseability, section headers, formatting consistency, and standard resume taxonomy alignment.
Return a JSON evaluation with persona "ATS Reviewer".
`.trim();

export const TECHNICAL_MANAGER_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}
Persona: Technical Hiring Manager.
Focus: Engineering rigor, architecture complexity, system design scale, metric impact statements, and technical stack depth.
Return a JSON evaluation with persona "Technical Hiring Manager".
`.trim();

export const HR_RECRUITER_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}
Persona: HR Recruiter.
Focus: Career trajectory, tenure stability, leadership signals, soft skills, communication clarity, and brand prestige.
Return a JSON evaluation with persona "HR Recruiter".
`.trim();

export const CONSENSUS_SYNTHESIS_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}
Task: Executive Hiring Panel Consensus Synthesizer.
Analyze 3 independent reviewer evaluations (ATS Reviewer, Technical Hiring Manager, HR Recruiter) and synthesize a final panel decision ("Strong Hire" | "Hire" | "Maybe" | "No Hire"), overall confidence percentage (0 - 100%), and executive summary.

Return JSON strictly matching the output schema.
`.trim();

export function buildIndividualReviewerUserPrompt(title: string, resumeContent: Record<string, any>, targetRole?: string): string {
  const roleText = targetRole ? `Target Role: ${targetRole}\n` : '';
  return `
Resume Title: ${title}
${roleText}
Resume Canonical JSON Content:
${JSON.stringify(resumeContent, null, 2)}

Provide your independent reviewer evaluation in JSON format.
`.trim();
}

export function buildConsensusUserPrompt(title: string, reviews: ReviewerEvaluation[]): string {
  return `
Resume Title: ${title}
Independent Reviewer Evaluations:
${JSON.stringify(reviews, null, 2)}

Synthesize the final panel decision, confidence percentage, executive summary, and return the complete JSON object.
`.trim();
}
