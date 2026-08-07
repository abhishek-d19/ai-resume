import { z } from 'zod';

export const hiringCommitteeConsensusSchema = z.object({
  overallDecision: z.enum(['Strong Hire', 'Hire', 'Maybe', 'No Hire']),
  confidence: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  keyStrengths: z.array(z.string()).min(1),
  criticalConcerns: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()).min(1),
  interviewReadiness: z.number().min(0).max(100)
});

export type HiringCommitteeConsensusOutput = z.infer<typeof hiringCommitteeConsensusSchema>;
