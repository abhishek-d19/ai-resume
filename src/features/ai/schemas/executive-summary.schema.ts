import { z } from 'zod';

export const executiveSummaryOutputSchema = z.object({
  summaryText: z.string().min(100).max(1800), // Enforces 150-250 words approx
  wordCount: z.number().min(100).max(350),
  overallQualityAssessment: z.string(),
  biggestStrengths: z.array(z.string()).min(1),
  biggestWeaknesses: z.array(z.string()).min(1),
  topThreeImprovements: z.array(z.string()).min(3).max(3),
  hiringConfidenceScore: z.number().min(0).max(100),
  hiringConfidenceAssessment: z.string()
});

export type ExecutiveSummaryOutput = z.infer<typeof executiveSummaryOutputSchema>;
