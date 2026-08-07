import { z } from 'zod';

export const reviewerEvaluationSchema = z.object({
  persona: z.enum(['ATS Reviewer', 'Technical Hiring Manager', 'HR Recruiter']),
  verdict: z.enum(['Strong Hire', 'Hire', 'Maybe', 'No Hire']),
  score: z.number().min(0).max(100),
  feedback: z.string(),
  pros: z.array(z.string()).min(1),
  cons: z.array(z.string())
});

export const hiringPanelConsensusSchema = z.object({
  decision: z.enum(['Strong Hire', 'Hire', 'Maybe', 'No Hire']),
  confidence: z.number().min(0).max(100),
  summary: z.string(),
  reviewers: z.array(reviewerEvaluationSchema).min(3).max(3)
});

export type ReviewerEvaluation = z.infer<typeof reviewerEvaluationSchema>;
export type HiringPanelConsensus = z.infer<typeof hiringPanelConsensusSchema>;
