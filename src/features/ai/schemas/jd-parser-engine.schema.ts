import { z } from 'zod';

export const jdParserOutputSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  requiredExperience: z.string(),
  preferredExperience: z.string(),
  education: z.array(z.string()),
  certifications: z.array(z.string()),
  responsibilities: z.array(z.string()),
  keywords: z.array(z.string()),
  softSkills: z.array(z.string()),
  technicalSkills: z.array(z.string())
});

export type JdParserOutput = z.infer<typeof jdParserOutputSchema>;
