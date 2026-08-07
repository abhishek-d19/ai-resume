import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const EXECUTIVE_SUMMARY_PROMPT_VERSION = '1.0.0';

export const EXECUTIVE_SUMMARY_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Generate a concise, high-impact Executive Summary synthesizing a candidate's resume analysis.

Constraints:
- Word Count: Strictly between 150 and 250 words.
- Tone: Professional, supportive, constructive, and recruiter-friendly.
- Required Elements:
  1. Overall resume quality overview
  2. Biggest candidate strengths
  3. Biggest candidate weaknesses
  4. Top THREE actionable improvements (exactly 3)
  5. Hiring confidence score & description

Return JSON strictly matching the output schema.
`.trim();

export interface ExecutiveSummaryPromptVariables {
  title: string;
  targetRole?: string;
  analysisOutput: Record<string, any>;
  resumeContent: Record<string, any>;
}

export function buildExecutiveSummaryUserPrompt(variables: ExecutiveSummaryPromptVariables): string {
  const roleText = variables.targetRole ? `Target Role Alignment: ${variables.targetRole}\n` : '';
  return `
Resume Title: ${variables.title}
${roleText}
Completed Resume Analysis Data:
${JSON.stringify(variables.analysisOutput, null, 2)}

Candidate Resume Payload:
${JSON.stringify(variables.resumeContent, null, 2)}

Generate the 150–250 word supportive, recruiter-friendly executive summary and return JSON.
`.trim();
}
