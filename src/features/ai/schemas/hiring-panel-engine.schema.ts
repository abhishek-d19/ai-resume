import { z } from 'zod';

export const reviewerDecisionSchema = z.enum([
  'Strong Hire',
  'Hire',
  'Maybe',
  'No Hire'
]);

export const reviewerPersonaSchema = z.enum([
  'ATS Specialist',
  'Technical Hiring Manager',
  'HR Recruiter'
]);

export const categoryScoreSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  reasoning: z.string()
});

export const evidenceClaimSchema = z.object({
  claim: z.string(),
  source: z.string(),
  type: z.enum(['explicit', 'inferred', 'missing'])
});

export const reviewerEvaluationSchema = z.object({
  persona: reviewerPersonaSchema,
  decision: reviewerDecisionSchema,
  confidence: z.number().min(0).max(100),
  score: z.number().min(0).max(100),
  summary: z.string(),
  categoryScores: z.array(categoryScoreSchema),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  concerns: z.array(z.string()),
  evidence: z.array(evidenceClaimSchema),
  recommendations: z.array(z.string()),
  interviewQuestions: z.array(z.string())
});

export const hiringPanelConsensusSchema = z.object({
  decision: reviewerDecisionSchema,
  confidence: z.number().min(0).max(100),
  summary: z.string(),
  disagreementDetected: z.boolean(),
  alignmentStatus: z.string(),
  reviewers: z.array(reviewerEvaluationSchema).length(3)
});

export type ReviewerDecision = z.infer<typeof reviewerDecisionSchema>;
export type ReviewerPersona = z.infer<typeof reviewerPersonaSchema>;
export type CategoryScore = z.infer<typeof categoryScoreSchema>;
export type EvidenceClaim = z.infer<typeof evidenceClaimSchema>;
export type ReviewerEvaluation = z.infer<typeof reviewerEvaluationSchema>;
export type HiringPanelConsensus = z.infer<typeof hiringPanelConsensusSchema>;
