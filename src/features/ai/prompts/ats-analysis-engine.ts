import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const ATS_ANALYSIS_ENGINE_PROMPT_VERSION = '2.0.0';

export const ATS_ANALYSIS_ENGINE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Perform an ATS (Applicant Tracking System) Compliance & Parseability Audit.

Evaluate the resume against modern ATS algorithms across 7 dimensions:
1. Contact Information: Check for missing email, phone number, location, or portfolio links.
2. Summary Quality: Flag weak, generic, or missing professional summaries.
3. Action Verbs & Experience: Flag passive verbs, missing strong action verbs, and unquantified bullets.
4. Project Descriptions: Evaluate technical depth and metrics in project statements.
5. Skills Placement: Check category hierarchy and technical skill keyword density.
6. Resume Length & Readability: Assess word count, bullet length, and reading level.
7. ATS Parsing Risks: Detect non-standard headers, missing sections, and formatting traps.

Return JSON strictly matching the output schema.
`.trim();

export interface AtsAnalysisEnginePromptVariables {
  title: string;
  targetRole?: string;
  resumeContent: Record<string, any>;
}

export function buildAtsAnalysisEngineUserPrompt(variables: AtsAnalysisEnginePromptVariables): string {
  const roleText = variables.targetRole ? `Target Role: ${variables.targetRole}\n` : '';
  return `
Resume Title: ${variables.title}
${roleText}
Canonical Resume JSON Content:
${JSON.stringify(variables.resumeContent, null, 2)}

Audit the resume against ATS compliance rules and return the structured JSON object.
`.trim();
}
