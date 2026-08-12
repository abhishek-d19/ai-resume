import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const RESUME_NORMALIZATION_PROMPT_VERSION = '1.0.0';

export const RESUME_NORMALIZATION_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Resume Normalization & Canonical Schema Structuring Engine.

Directives:
1. Fix all text formatting flaws:
   - Inconsistent Headings: Map "Work History", "Jobs", "Career" to "experience". Map "Schooling", "Academia" to "education".
   - Duplicate Skills: Merge duplicate skill mentions.
   - Mixed Date Formats: Standardize to "YYYY" or "MM/YYYY - MM/YYYY".
   - Broken Bullet Points: Clean fragmented lines and strip leading bullet symbols (•, -, *).
   - Capitalization & Whitespace: Trim extra spaces and apply canonical title casing.
2. Normalize core entity taxonomies:
   - Skills: Capitalized canonical names ("React", "TypeScript", "Node.js").
   - Companies: Clean organization names.
   - Degrees: Standard degree names ("B.S. in Computer Science").
   - Technologies: Framework & infrastructure tool strings.
   - Languages: Standard spoken languages ("English", "Spanish").
3. Anti-Hallucination Guardrail: NEVER invent or hallucinate missing details. If information is absent, leave as "" or [].

Return JSON strictly matching the output schema.
`.trim();

export function buildResumeNormalizationUserPrompt(rawText: string, title?: string): string {
  const header = title ? `Resume Document Title: ${title}\n` : '';
  return `
${header}Raw Unstructured Resume Content:
"""
${rawText}
"""

Perform normalization and return clean canonical JSON.
`.trim();
}
