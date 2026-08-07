import { BASE_SYSTEM_GUARDRAILS } from './shared';

export const INTERVIEW_QUESTIONS_PROMPT_VERSION = '1.0.0';

export const INTERVIEW_QUESTIONS_SYSTEM_PROMPT = `
${BASE_SYSTEM_GUARDRAILS}

Task: Generate Targeted Executive Interview Prep Questions.

Input Data:
- Candidate Resume JSON
- Target Job Description
- Hiring Committee Feedback & Concerns

Directives:
1. Generate tailored interview questions across 4 distinct categories:
   - technicalQuestions (Category: "Technical")
   - behavioralQuestions (Category: "Behavioral")
   - hrQuestions (Category: "HR")
   - projectQuestions (Category: "Project")
2. Assign difficulty rating to every question ("Easy" | "Medium" | "Hard").
3. For EVERY question provide:
   - question: The exact interview question prompt.
   - reasonAsked: Detailed rationale explaining why this question was triggered (referencing specific resume experience, JD skill gaps, or committee concerns).
   - expectedAnswerOutline: Key bullet points outlining a candidate response.
4. Provide summaryGuidance offering executive interview strategy.

Return JSON strictly matching the output schema.
`.trim();

export interface InterviewQuestionsPromptVariables {
  title: string;
  jobDescriptionText?: string;
  committeeFeedback?: Record<string, any>;
  resumeContent: Record<string, any>;
}

export function buildInterviewQuestionsUserPrompt(variables: InterviewQuestionsPromptVariables): string {
  const jdText = variables.jobDescriptionText ? `Target Job Description:\n"""\n${variables.jobDescriptionText}\n"""\n` : '';
  const committeeText = variables.committeeFeedback ? `Hiring Committee Feedback:\n${JSON.stringify(variables.committeeFeedback, null, 2)}\n` : '';

  return `
Resume Title: ${variables.title}
${jdText}
${committeeText}
Candidate Resume Canonical JSON:
${JSON.stringify(variables.resumeContent, null, 2)}

Generate the targeted interview prep questions and return structured JSON.
`.trim();
}
