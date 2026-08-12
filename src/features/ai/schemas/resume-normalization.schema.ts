import { z } from 'zod';

export const normalizedPersonalInfoSchema = z.object({
  fullName: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  summary: z.string().default(''),
  website: z.string().default(''),
  linkedin: z.string().default('')
});

export const normalizedExperienceItemSchema = z.object({
  company: z.string().default(''),
  role: z.string().default(''),
  period: z.string().default(''),
  location: z.string().default(''),
  bullets: z.array(z.string()).default([])
});

export const normalizedEducationItemSchema = z.object({
  institution: z.string().default(''),
  degree: z.string().default(''),
  year: z.string().default('')
});

export const normalizedProjectItemSchema = z.object({
  name: z.string().default(''),
  description: z.string().default(''),
  link: z.string().default(''),
  technologies: z.array(z.string()).default([])
});

export const canonicalResumeNormalizationOutputSchema = z.object({
  personalInfo: normalizedPersonalInfoSchema,
  summary: z.string().default(''),
  experience: z.array(normalizedExperienceItemSchema).default([]),
  education: z.array(normalizedEducationItemSchema).default([]),
  projects: z.array(normalizedProjectItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  certifications: z.array(z.object({
    title: z.string().default(''),
    issuer: z.string().default(''),
    year: z.string().default('')
  })).default([])
});

export type CanonicalResumeNormalizationOutput = z.infer<typeof canonicalResumeNormalizationOutputSchema>;
