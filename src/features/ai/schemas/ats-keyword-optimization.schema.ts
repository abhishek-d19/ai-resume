import { z } from 'zod';

export const matchedKeywordItemSchema = z.object({
  keyword: z.string(),
  frequencyInResume: z.number().min(1),
  frequencyInJd: z.number().min(1)
});

export const missingKeywordItemSchema = z.object({
  keyword: z.string(),
  importance: z.enum(['Critical', 'High', 'Medium']),
  suggestedResumeSection: z.enum(['Skills', 'Experience', 'Summary', 'Projects', 'Education'])
});

export const overusedKeywordItemSchema = z.object({
  keyword: z.string(),
  frequencyInResume: z.number().min(1),
  recommendation: z.string()
});

export const keywordDensitySchema = z.object({
  overallDensityPercentage: z.number().min(0).max(100),
  rating: z.enum(['Optimal', 'Low', 'Overstuffed'])
});

export const atsKeywordOutputSchema = z.object({
  matchedKeywords: z.array(matchedKeywordItemSchema),
  missingKeywords: z.array(missingKeywordItemSchema),
  overusedKeywords: z.array(overusedKeywordItemSchema),
  suggestedKeywords: z.array(z.string()).min(1),
  keywordDensity: keywordDensitySchema,
  atsOptimizationTips: z.array(z.string()).min(1)
});

export type AtsKeywordOutput = z.infer<typeof atsKeywordOutputSchema>;
