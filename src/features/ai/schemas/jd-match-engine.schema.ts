import { z } from 'zod';

export const jdMatchSkillsSchema = z.object({
  matched: z.array(z.string()),
  missing: z.array(z.string()),
  recommended: z.array(z.string())
});

export const jdMatchExperienceSchema = z.object({
  alignmentScore: z.number().min(0).max(100),
  missingExperience: z.array(z.string()),
  strengths: z.array(z.string())
});

export const jdMatchEducationSchema = z.object({
  alignment: z.number().min(0).max(100),
  recommendations: z.array(z.string())
});

export const jdMatchKeywordsSchema = z.object({
  matched: z.array(z.string()),
  missing: z.array(z.string()),
  keywordCoverage: z.number().min(0).max(100)
});

export const jdMatchAtsImpactSchema = z.object({
  score: z.number().min(0).max(100),
  warnings: z.array(z.string())
});

export const jdMatchOutputSchema = z.object({
  overallMatch: z.number().min(0).max(100),
  matchCategory: z.enum(['Excellent', 'Strong', 'Moderate', 'Weak']),
  skills: jdMatchSkillsSchema,
  experience: jdMatchExperienceSchema,
  education: jdMatchEducationSchema,
  keywords: jdMatchKeywordsSchema,
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  recommendations: z.array(z.string()).min(1),
  atsImpact: jdMatchAtsImpactSchema
});

export type JdMatchOutput = z.infer<typeof jdMatchOutputSchema>;
