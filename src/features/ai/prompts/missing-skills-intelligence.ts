import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const MISSING_SKILLS_PROMPT_VERSION = '1.0.0';

export const MISSING_SKILLS_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Conduct a Priority Missing Skills Intelligence Audit.

Evaluation Directives:
1. Compare the candidate's canonical resume JSON against the target Parsed Job Description.
2. Identify missing technical & soft skills and categorize into 3 distinct priority arrays:
   - criticalMissingSkills (Category: "Critical")
   - importantMissingSkills (Category: "Important")
   - optionalMissingSkills (Category: "Optional")
3. For EVERY missing skill, provide:
   - skillName: Name of the missing skill
   - learningDifficulty: "Easy" | "Moderate" | "Hard"
   - hiringImpact: "High" | "Medium" | "Low"
   - recommendedLearningOrder: Integer priority sequence (1, 2, 3...)
   - suggestedResumeSection: "Skills" | "Projects" | "Experience" | "Certifications"
4. Provide summaryGuidance offering executive advice on closing these competency gaps.
5. Anti-hallucination Guardrail: Only evaluate skills explicitly present in the resume vs. parsed JD. Never fabricate candidate qualifications.

Return JSON strictly matching the output schema.
`.trim();

export interface MissingSkillsPromptVariables {
  title: string;
  parsedJd: Record<string, any>;
  resumeContent: Record<string, any>;
}

export function buildMissingSkillsUserPrompt(variables: MissingSkillsPromptVariables): string {
  return `
Resume Title: ${variables.title}
Parsed Target Job Description:
${JSON.stringify(variables.parsedJd, null, 2)}

Candidate Resume Canonical JSON:
${JSON.stringify(variables.resumeContent, null, 2)}

Perform the missing skills audit and return structured JSON.
`.trim();
}
