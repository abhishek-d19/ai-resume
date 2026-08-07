import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const ATS_KEYWORD_PROMPT_VERSION = '1.0.0';

export const ATS_KEYWORD_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Perform an ATS Keyword Optimization & Frequency Audit.

Evaluation Directives:
1. Compare candidate's canonical resume JSON against the target Job Description text.
2. Extract matchedKeywords: List matched keywords with frequencyInResume and frequencyInJd counts.
3. Identify missingKeywords: List missing keywords with importance ("Critical" | "High" | "Medium") and suggestedResumeSection ("Skills" | "Experience" | "Summary" | "Projects" | "Education").
4. Detect overusedKeywords: Identify keywords repeated excessively (>4 times) that trigger keyword stuffing penalties, providing frequencyInResume and recommendation.
5. Compile suggestedKeywords list.
6. Calculate keywordDensity: overallDensityPercentage and rating ("Optimal" | "Low" | "Overstuffed").
7. Provide high-impact atsOptimizationTips.

Return JSON strictly matching the output schema.
`.trim();

export interface AtsKeywordPromptVariables {
  title: string;
  jobDescriptionText: string;
  targetRole?: string;
  resumeContent: Record<string, any>;
}

export function buildAtsKeywordUserPrompt(variables: AtsKeywordPromptVariables): string {
  const roleText = variables.targetRole ? `Target Role: ${variables.targetRole}\n` : '';
  return `
Resume Title: ${variables.title}
${roleText}
Target Job Description:
"""
${variables.jobDescriptionText}
"""

Candidate Resume Canonical JSON:
${JSON.stringify(variables.resumeContent, null, 2)}

Audit ATS keyword density, missing keywords, and section placement, then return structured JSON.
`.trim();
}
