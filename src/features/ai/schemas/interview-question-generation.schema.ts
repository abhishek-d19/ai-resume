import { z } from 'zod';

export const interviewQuestionItemSchema = z.object({
  question: z.string(),
  category: z.enum(['Technical', 'Behavioral', 'HR', 'Project']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  reasonAsked: z.string(),
  expectedAnswerOutline: z.array(z.string()).min(1)
});

export const interviewQuestionsOutputSchema = z.object({
  technicalQuestions: z.array(interviewQuestionItemSchema).min(1),
  behavioralQuestions: z.array(interviewQuestionItemSchema).min(1),
  hrQuestions: z.array(interviewQuestionItemSchema).min(1),
  projectQuestions: z.array(interviewQuestionItemSchema).min(1),
  summaryGuidance: z.string()
});

export type InterviewQuestionItem = z.infer<typeof interviewQuestionItemSchema>;
export type InterviewQuestionsOutput = z.infer<typeof interviewQuestionsOutputSchema>;
