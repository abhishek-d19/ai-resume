import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const RESUME_IMPROVEMENT_PROMPT_VERSION = '1.0.0';

export const RESUME_IMPROVEMENT_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Generate AI Resume Improvements & Rewrite Suggestions.

Input Data:
- Candidate Resume JSON
- Resume Analysis Output
- JD Match Competency Data
- Hiring Committee Consensus & Concerns

Directives:
1. Generate high-impact improvement suggestions across 7 dimensions:
   - Summary (Executive summary rewrite)
   - BulletPoint (Experience & project bullet rewrites with metric boosters)
   - ActionVerb (Replacing passive verbs with strong executive action verbs)
   - Skills (Skills section taxonomy optimization)
   - Keyword (ATS keyword enrichment)
   - Grammar (Tone, conciseness, and syntax polish)
   - ATS (Header & formatting risk fixes)
2. Every item MUST follow the strict Original -> Suggested -> Reason pattern:
   - original: The original text snippet
   - suggested: The optimized replacement text
   - reason: Detailed rationale explaining why this change improves ATS ranking or recruiter impact
3. Generate improvedSummary object and improvedSkills object.

Return JSON strictly matching the output schema.
`.trim();

export interface ResumeImprovementPromptVariables {
  title: string;
  analysisData?: Record<string, any>;
  jdMatchData?: Record<string, any>;
  committeeData?: Record<string, any>;
  resumeContent: Record<string, any>;
}

export function buildResumeImprovementUserPrompt(variables: ResumeImprovementPromptVariables): string {
  const analysisText = variables.analysisData ? `Resume Audit Data:\n${JSON.stringify(variables.analysisData, null, 2)}\n` : '';
  const jdMatchText = variables.jdMatchData ? `JD Match Competency Data:\n${JSON.stringify(variables.jdMatchData, null, 2)}\n` : '';
  const committeeText = variables.committeeData ? `Hiring Committee Feedback:\n${JSON.stringify(variables.committeeData, null, 2)}\n` : '';

  return `
Resume Title: ${variables.title}
${analysisText}
${jdMatchText}
${committeeText}
Candidate Resume Canonical JSON:
${JSON.stringify(variables.resumeContent, null, 2)}

Generate the structured resume improvement suggestions and return JSON.
`.trim();
}
