import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const RESUME_PARSER_ENGINE_PROMPT_VERSION = '1.0.0';

export const RESUME_PARSER_ENGINE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Deterministic Raw Resume Text to Canonical Resume JSON Parser.

Extraction Targets:
1. personalInfo (fullName, email, phone, location, summary, website, linkedin)
2. summary (Executive profile statement)
3. education (institution, degree, year, gpa)
4. experience (company, role, period, location, bullets)
5. projects (name, description, link, technologies)
6. skills (Array of deduplicated, normalized skill names)
7. certifications (title, issuer, year)
8. achievements (Array of notable honor/award strings)
9. languages (Array of language proficiency strings)
10. links (Array of label/url objects)

Anti-Hallucination Guardrails:
- NEVER invent or hallucinate missing data.
- If a section or field is absent from raw text, leave it empty ("" or []).

Normalization Rules:
- Dates: Standardize to "YYYY" or "MM/YYYY - MM/YYYY".
- Phone: Format to international standard "+1 (555) 000-0000".
- Email: Lowercase trimmed email string.
- URLs: Ensure valid http:// or https:// protocol prefixes.
- Skills: Capitalize canonical names ("React", "TypeScript", "Node.js", "Python").

Return JSON strictly matching the output schema.
`.trim();

export function buildResumeParserUserPrompt(rawText: string, fileName?: string): string {
  const fileHeader = fileName ? `File Name: ${fileName}\n` : '';
  return `
${fileHeader}Raw Extracted PDF Document Text:
"""
${rawText}
"""

Parse this resume text and return deterministic canonical JSON.
`.trim();
}
