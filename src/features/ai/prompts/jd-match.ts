import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const JD_MATCH_PROMPT_VERSION = '1.0.0';

export const JD_MATCH_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Perform Job Description (JD) Competency Matching & Gap Analysis.
Evaluate:
1. Overall Role Match Percentage (0 - 100%)
2. Matched Core Skills & Technologies
3. Missing Required Skills
4. Missing Preferred / Nice-to-have Skills
5. High-Impact Keyword Alignment Recommendations

Return JSON strictly matching the requested output schema.
`.trim();

export interface JdMatchPromptVariables {
  jobTitle: string;
  companyName?: string;
  jobDescriptionText: string;
  rawResumeContent: Record<string, any>;
}

export function buildJdMatchUserPrompt(variables: JdMatchPromptVariables): string {
  const companyContext = variables.companyName ? `Company: ${variables.companyName}\n` : '';
  return `
Target Job Title: ${variables.jobTitle}
${companyContext}
Job Description Text:
"""
${variables.jobDescriptionText}
"""

Candidate Resume JSON:
${JSON.stringify(variables.rawResumeContent, null, 2)}

Perform JD alignment audit and return JSON response.
`.trim();
}
