import { z } from 'zod';

export const jdMatchSkillSchema = z.object({
  skillName: z.string(),
  status: z.enum(['Matched', 'Missing', 'Partial']),
  importance: z.enum(['Required', 'Preferred', 'Nice-to-have']),
  candidateEvidence: z.string().optional()
});

export const jdMatchResultSchema = z.object({
  matchPercentage: z.number().min(0).max(100),
  roleTitle: z.string(),
  companyName: z.string().optional(),
  summary: z.string(),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  detailedCompetencies: z.array(jdMatchSkillSchema),
  keywordOptimizationTips: z.array(z.string())
});

export type JdMatchResult = z.infer<typeof jdMatchResultSchema>;
