import { z } from 'zod';

export const reviewerCritiqueSchema = z.object({
  personaName: z.string(),
  personaRole: z.string(),
  verdict: z.enum(['Strong Hire', 'Hire', 'Leaning Hire', 'No Hire']),
  score: z.number().min(0).max(100),
  keyFeedback: z.string(),
  positivePoints: z.array(z.string()),
  concerns: z.array(z.string())
});

export const hiringPanelResultSchema = z.object({
  consensusVerdict: z.enum(['Strong Hire', 'Hire', 'Leaning Hire', 'No Hire']),
  recruiterConfidenceIndex: z.number().min(0).max(100),
  executiveSummary: z.string(),
  reviewers: z.array(reviewerCritiqueSchema).min(4).max(4),
  topPanelKeyTakeaways: z.array(z.string())
});

export type HiringPanelResult = z.infer<typeof hiringPanelResultSchema>;
