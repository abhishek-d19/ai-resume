import { z } from 'zod';

export const hiringCommitteeReviewerSchema = z.object({
  reviewer: z.enum(['ATS Specialist', 'Technical Hiring Manager', 'HR Recruiter']),
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  concerns: z.array(z.string()),
  recommendations: z.array(z.string()).min(1),
  hireRecommendation: z.enum(['Strong Hire', 'Hire', 'Leaning Hire', 'No Hire'])
});

export const hiringCommitteeOutputSchema = z.object({
  reviewers: z.array(hiringCommitteeReviewerSchema).min(3).max(3),
  averageScore: z.number().min(0).max(100)
});

export type HiringCommitteeReviewerOutput = z.infer<typeof hiringCommitteeReviewerSchema>;
export type HiringCommitteeOutput = z.infer<typeof hiringCommitteeOutputSchema>;
