import { BASE_SYSTEM_GUARDRAILS, ATS_KEYWORD_GUARDRAILS } from './shared';

export const RESUME_REWRITE_PROMPT_VERSION = '2.0.0';

export const RESUME_REWRITE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

${ATS_KEYWORD_GUARDRAILS}

Task: Perform Section-by-Section AI Resume Rewrite Suggestion Generation.

Input Context:
- Candidate Resume JSON
- Resume Analysis Output
- JD Matching Data
- Hiring Committee Concerns

Directives:
1. Generate intelligent rewrite suggestions for EVERY resume section (personalInfo, summary, experience, education, projects, skills, certifications, achievements, languages).
2. For EVERY suggestion return:
   - id: Unique identifier string (e.g. "rw-exp-1")
   - section: Exact section name ("personalInfo" | "summary" | "experience" | "education" | "projects" | "skills" | "certifications" | "achievements" | "languages")
   - original: The exact existing text snippet or field value
   - improved: The rewritten, high-impact version with strong action verbs, metric density, and ATS keywords
   - reason: Detailed rationale explaining why this change improves ATS ranking or executive recruiter score
   - impact: Priority rating ("High" | "Medium" | "Low")
3. Preserve structural formatting so suggested text can drop seamlessly into the canonical resume schema upon approval.

Return JSON strictly matching the output schema.
`.trim();

export interface ResumeRewritePromptVariables {
  title: string;
  analysisData?: Record<string, any>;
  jdMatchData?: Record<string, any>;
  committeeData?: Record<string, any>;
  resumeContent: Record<string, any>;
}

export function buildResumeRewriteUserPrompt(variables: ResumeRewritePromptVariables): string {
  const analysisText = variables.analysisData ? `Resume Analysis Audit:\n${JSON.stringify(variables.analysisData, null, 2)}\n` : '';
  const jdMatchText = variables.jdMatchData ? `JD Match Competency Data:\n${JSON.stringify(variables.jdMatchData, null, 2)}\n` : '';
  const committeeText = variables.committeeData ? `Hiring Committee Feedback:\n${JSON.stringify(variables.committeeData, null, 2)}\n` : '';

  return `
Resume Title: ${variables.title}
${analysisText}
${jdMatchText}
${committeeText}
Canonical Resume JSON Content:
${JSON.stringify(variables.resumeContent, null, 2)}

Generate section-by-section rewrite suggestions and return structured JSON.
`.trim();
}
