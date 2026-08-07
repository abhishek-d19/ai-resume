import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const RESUME_ANALYSIS_ENGINE_PROMPT_VERSION = '2.1.0';

export const RESUME_ANALYSIS_ENGINE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Perform an exhaustive executive resume audit.

Evaluation Rules:
1. Score every section independently from 0 to 100:
   - personalInfo
   - summary
   - education
   - experience
   - projects
   - skills
   - certifications
   - achievements
   - languages
2. Explain every score deduction with explicit rationale.
3. Strict anti-hallucination: Only evaluate text explicitly present in the canonical JSON payload. If a section is empty or missing, score it 0 and include it in missingSections. Never invent candidate experience or qualifications.
4. Extract strengths, weaknesses, criticalIssues, quickWins, recommendations, missingSections, and atsWarnings.

Return JSON strictly matching the output schema.
`.trim();

export interface ResumeAnalysisEnginePromptVariables {
  title: string;
  targetRole?: string;
  resumeContent: Record<string, any>;
}

export function buildResumeAnalysisEngineUserPrompt(variables: ResumeAnalysisEnginePromptVariables): string {
  const roleText = variables.targetRole ? `Target Role Alignment: ${variables.targetRole}\n` : '';
  return `
Resume Title: ${variables.title}
${roleText}
Canonical Resume JSON Content:
${JSON.stringify(variables.resumeContent, null, 2)}

Audit the resume above according to all evaluation rules and return the required JSON object.
`.trim();
}
