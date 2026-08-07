import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const JD_MATCH_ENGINE_PROMPT_VERSION = '2.1.0';

export const JD_MATCH_ENGINE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Conduct a rigorous Job Description Competency Match & Gap Analysis.

Evaluation Directives:
1. Compare the candidate's canonical resume JSON against the target Job Description.
2. Determine overall match score (0 - 100) and matchCategory ("Excellent" | "Strong" | "Moderate" | "Weak").
3. Evaluate Skills Breakdown: matched skills, missing required skills, and recommended skills to acquire.
4. Evaluate Experience Alignment: alignmentScore, missing experience areas, and candidate experience strengths.
5. Evaluate Education Alignment: alignment score and education gap recommendations.
6. Evaluate Keywords Coverage: matched keywords, missing essential keywords, and keywordCoverage percentage.
7. Identify overall candidate strengths, weaknesses, actionable alignment recommendations, and ATS impact warnings.
8. Anti-hallucination Guardrail: Never invent candidate experience or skills. Only evaluate claims explicitly supported by the candidate's resume content. If something is absent, explicitly state that it is missing.

Return JSON strictly matching the output schema.
`.trim();

export interface JdMatchEnginePromptVariables {
  title: string;
  jobDescriptionText: string;
  targetRole?: string;
  resumeContent: Record<string, any>;
}

export function buildJdMatchEngineUserPrompt(variables: JdMatchEnginePromptVariables): string {
  const roleText = variables.targetRole ? `Target Position Alignment: ${variables.targetRole}\n` : '';
  return `
Resume Title: ${variables.title}
${roleText}
Target Job Description:
"""
${variables.jobDescriptionText}
"""

Candidate Resume Canonical JSON Content:
${JSON.stringify(variables.resumeContent, null, 2)}

Audit candidate alignment against the target Job Description and return the required JSON object.
`.trim();
}
