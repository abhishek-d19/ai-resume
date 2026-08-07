import { z } from 'zod';

export const improvementItemSchema = z.object({
  id: z.string(),
  category: z.enum(['Summary', 'BulletPoint', 'ActionVerb', 'Skills', 'Keyword', 'Grammar', 'ATS']),
  section: z.string(),
  original: z.string(),
  suggested: z.string(),
  reason: z.string()
});

export const resumeImprovementOutputSchema = z.object({
  improvements: z.array(improvementItemSchema).min(1),
  improvedSummary: z.object({
    original: z.string(),
    suggested: z.string(),
    reason: z.string()
  }),
  improvedSkills: z.object({
    original: z.array(z.string()),
    suggested: z.array(z.string()),
    reason: z.string()
  }),
  summaryGuidance: z.string()
});

export type ImprovementItem = z.infer<typeof improvementItemSchema>;
export type ResumeImprovementOutput = z.infer<typeof resumeImprovementOutputSchema>;
