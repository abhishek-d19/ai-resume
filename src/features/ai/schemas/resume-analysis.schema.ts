import { z } from 'zod';

export const resumeAnalysisResultSchema = z.object({
  atsScore: z.number().min(0).max(100),
  metricDensityScore: z.number().min(0).max(100),
  overallVerdict: z.enum(['Executive Ready', 'Strong Candidate', 'Needs Optimization', 'Critical Deficits']),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  topKeywordsFound: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  sectionCompleteness: z.object({
    basics: z.boolean(),
    summary: z.boolean(),
    experience: z.boolean(),
    education: z.boolean(),
    skills: z.boolean(),
    projects: z.boolean()
  }),
  actionableRecommendations: z.array(z.string()).min(1)
});

export type ResumeAnalysisResult = z.infer<typeof resumeAnalysisResultSchema>;
