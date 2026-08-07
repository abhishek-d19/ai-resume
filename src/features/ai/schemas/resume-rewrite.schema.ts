import { z } from 'zod';

export const rewriteSuggestionSchema = z.object({
  id: z.string(),
  section: z.enum([
    'personalInfo', 
    'summary', 
    'experience', 
    'education', 
    'projects', 
    'skills', 
    'certifications', 
    'achievements', 
    'languages'
  ]),
  original: z.string(),
  improved: z.string(),
  reason: z.string(),
  impact: z.enum(['High', 'Medium', 'Low'])
});

export const resumeRewriteOutputSchema = z.object({
  suggestions: z.array(rewriteSuggestionSchema).min(1),
  summaryGuidance: z.string()
});

export type RewriteSuggestion = z.infer<typeof rewriteSuggestionSchema>;
export type ResumeRewriteOutput = z.infer<typeof resumeRewriteOutputSchema>;
