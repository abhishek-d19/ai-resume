import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const JD_PARSER_ENGINE_PROMPT_VERSION = '1.0.0';

export const JD_PARSER_ENGINE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Parse raw Job Description text into structured, standardized entities.

Extraction Requirements:
1. Extract jobTitle and company name (if unstated, use "Unknown / Unspecified").
2. Extract requiredSkills vs. preferredSkills.
3. Extract requiredExperience vs. preferredExperience text summaries.
4. Extract education requirements and industry certifications.
5. Extract responsibilities, core keywords, softSkills, and technicalSkills.
6. Skill Normalization Rule: Normalize duplicate skills and synonyms (e.g. convert "React.js", "ReactJS" -> "React"; "Node.js", "NodeJS" -> "Node.js"). Deduplicate array items.

Return JSON strictly matching the output schema.
`.trim();

export function buildJdParserUserPrompt(rawJdText: string): string {
  return `
Raw Job Description Text:
"""
${rawJdText}
"""

Parse and extract all structured job description entities into JSON.
`.trim();
}
