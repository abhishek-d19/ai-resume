import { z } from 'zod';

export const resumeAnalysisOutputSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  sectionScores: z.object({
    personalInfo: z.number().min(0).max(100),
    summary: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    projects: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
    certifications: z.number().min(0).max(100),
    achievements: z.number().min(0).max(100),
    languages: z.number().min(0).max(100)
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  criticalIssues: z.array(z.string()),
  quickWins: z.array(z.string()),
  recommendations: z.array(z.string()),
  missingSections: z.array(z.string()),
  atsWarnings: z.array(z.string()),
  executiveSummary: z.string(),
  keywordAnalysis: z.object({
    matched: z.array(z.string()),
    partial: z.array(z.string()).optional(),
    missing: z.array(z.string())
  }).optional(),
  radar: z.object({
    impact: z.number().min(0).max(100),
    relevance: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100),
    technicalDepth: z.number().min(0).max(100),
    atsReadiness: z.number().min(0).max(100)
  }).optional()
});

export type ResumeAnalysisOutput = z.infer<typeof resumeAnalysisOutputSchema>;
