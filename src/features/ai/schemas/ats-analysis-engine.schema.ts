import { z } from 'zod';

export const atsFormattingSchema = z.object({
  score: z.number().min(0).max(100),
  issues: z.array(z.string())
});

export const atsKeywordOptimizationSchema = z.object({
  score: z.number().min(0).max(100),
  density: z.number().min(0).max(100),
  topKeywordsFound: z.array(z.string()),
  missingEssentialKeywords: z.array(z.string())
});

export const atsReadabilitySchema = z.object({
  score: z.number().min(0).max(100),
  readingLevel: z.string(),
  bulletLengthQuality: z.string()
});

export const atsSectionCompletenessSchema = z.object({
  score: z.number().min(0).max(100),
  missingSections: z.array(z.string())
});

export const atsParsingRiskSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  detectedRisks: z.array(z.string())
});

export const atsContactInfoSchema = z.object({
  score: z.number().min(0).max(100),
  missingFields: z.array(z.string())
});

export const atsAnalysisOutputSchema = z.object({
  atsScore: z.number().min(0).max(100),
  formatting: atsFormattingSchema,
  keywordOptimization: atsKeywordOptimizationSchema,
  readability: atsReadabilitySchema,
  sectionCompleteness: atsSectionCompletenessSchema,
  parsingRisk: atsParsingRiskSchema,
  contactInformation: atsContactInfoSchema,
  recommendations: z.array(z.string()).min(1)
});

export type AtsAnalysisOutput = z.infer<typeof atsAnalysisOutputSchema>;
