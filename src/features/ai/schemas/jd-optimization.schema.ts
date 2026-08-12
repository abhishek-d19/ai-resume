import { z } from 'zod';

export const jdOptimizationSectionSchema = z.enum([
  'personalInfo',
  'summary',
  'education',
  'experience',
  'projects',
  'skills',
  'certifications',
  'achievements',
  'languages'
]);

export const jdOptimizationTypeSchema = z.enum([
  'add',
  'rewrite',
  'remove'
]);

export const jdOptimizationPrioritySchema = z.enum([
  'high',
  'medium',
  'low'
]);

export const jdOptimizationChangeSchema = z.object({
  id: z.string(),
  section: jdOptimizationSectionSchema,
  type: jdOptimizationTypeSchema,
  reason: z.string(),
  before: z.string(),
  after: z.string(),
  priority: jdOptimizationPrioritySchema
});

export const jdOptimizationOutputSchema = z.object({
  summary: z.string(),
  changes: z.array(jdOptimizationChangeSchema).min(1)
});

export type JdOptimizationSection = z.infer<typeof jdOptimizationSectionSchema>;
export type JdOptimizationType = z.infer<typeof jdOptimizationTypeSchema>;
export type JdOptimizationPriority = z.infer<typeof jdOptimizationPrioritySchema>;
export type JdOptimizationChange = z.infer<typeof jdOptimizationChangeSchema>;
export type JdOptimizationOutput = z.infer<typeof jdOptimizationOutputSchema>;
