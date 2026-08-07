import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const RESUME_ANALYSIS_PROMPT_VERSION = '1.1.0';

export const RESUME_ANALYSIS_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Conduct a comprehensive resume audit.
Evaluate:
1. Overall ATS Readiness Score (0 - 100)
2. Metric Density Score (0 - 100)
3. Hard & Soft Skills Breakdown
4. Top 3 Strengths
5. Top 3 Critical Areas for Improvement
6. Recommended Actionable Next Steps

Return JSON strictly matching the requested output schema.
`.trim();

export interface ResumeAnalysisPromptVariables {
  resumeTitle: string;
  targetRole?: string;
  rawResumeContent: Record<string, any>;
}

export function buildResumeAnalysisUserPrompt(variables: ResumeAnalysisPromptVariables): string {
  const roleContext = variables.targetRole ? `Target Role: ${variables.targetRole}\n` : '';
  return `
Resume Title: ${variables.resumeTitle}
${roleContext}
Resume Canonical JSON Payload:
${JSON.stringify(variables.rawResumeContent, null, 2)}

Audit the resume above and produce a JSON evaluation.
`.trim();
}
