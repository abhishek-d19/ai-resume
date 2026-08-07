import { z } from 'zod';

export const missingSkillItemSchema = z.object({
  skillName: z.string(),
  category: z.enum(['Critical', 'Important', 'Optional']),
  learningDifficulty: z.enum(['Easy', 'Moderate', 'Hard']),
  hiringImpact: z.enum(['High', 'Medium', 'Low']),
  recommendedLearningOrder: z.number().min(1),
  suggestedResumeSection: z.enum(['Skills', 'Projects', 'Experience', 'Certifications'])
});

export const missingSkillsOutputSchema = z.object({
  criticalMissingSkills: z.array(missingSkillItemSchema),
  importantMissingSkills: z.array(missingSkillItemSchema),
  optionalMissingSkills: z.array(missingSkillItemSchema),
  summaryGuidance: z.string()
});

export type MissingSkillItem = z.infer<typeof missingSkillItemSchema>;
export type MissingSkillsOutput = z.infer<typeof missingSkillsOutputSchema>;
