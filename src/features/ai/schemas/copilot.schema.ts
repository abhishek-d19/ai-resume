import { z } from 'zod';

export const summaryImprovementSchema = z.object({
  original: z.string(),
  improved: z.string(),
  explanation: z.string()
});

export const bulletRewriteSchema = z.object({
  original: z.string(),
  rewritten: z.string(),
  metricsPrompt: z.string().optional().default(''),
  explanation: z.string()
});

export const projectImprovementSchema = z.object({
  name: z.string(),
  description: z.string(),
  techStack: z.string(),
  bullets: z.array(z.string()),
  explanation: z.string()
});

export const skillsSuggestionSchema = z.object({
  suggestedSkills: z.array(z.string()),
  explanation: z.string()
});

export type SummaryImprovementOutput = z.infer<typeof summaryImprovementSchema>;
export type BulletRewriteOutput = z.infer<typeof bulletRewriteSchema>;
export type ProjectImprovementOutput = z.infer<typeof projectImprovementSchema>;
export type SkillsSuggestionOutput = z.infer<typeof skillsSuggestionSchema>;
