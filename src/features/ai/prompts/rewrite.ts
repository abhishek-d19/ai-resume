import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const REWRITE_PROMPT_VERSION = '1.0.0';

export const REWRITE_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Enhance candidate resume text (bullet points or summary statements).
Rules:
1. Start every bullet with a high-impact strong action verb (e.g., "Architected", "Engineered", "Spearheaded", "Pioneered").
2. Include metric density boosters (percentage improvements, latency reductions, scale numbers, revenue impact).
3. Eliminate passive phrases (e.g. "Responsible for", "Helped with", "Worked on").
4. Maintain truthful grounding based on the candidate's original intent.

Return 3 optimized alternative versions (Concise, Metric-Dense, Leadership-Focused) in JSON format.
`.trim();

export interface RewritePromptVariables {
  originalText: string;
  sectionType: 'bullet' | 'summary';
  targetRole?: string;
}

export function buildRewriteUserPrompt(variables: RewritePromptVariables): string {
  const roleContext = variables.targetRole ? `Target Role Alignment: ${variables.targetRole}\n` : '';
  return `
Section Type: ${variables.sectionType}
${roleContext}
Original Text:
"${variables.originalText}"

Generate 3 optimized alternative versions and return JSON.
`.trim();
}
