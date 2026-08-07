import { z } from 'zod';

export const resumeAnalysisOutputSchema = z.object({
  overallScore: z.number().min(0).max(100),
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
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  criticalIssues: z.array(z.string()),
  quickWins: z.array(z.string()).min(1),
  recommendations: z.array(z.string()).min(1),
  missingSections: z.array(z.string()),
  atsWarnings: z.array(z.string())
});

export type ResumeAnalysisOutput = z.infer<typeof resumeAnalysisOutputSchema>;
