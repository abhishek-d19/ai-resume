import { z } from 'zod';

export const parsedPersonalInfoSchema = z.object({
  fullName: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  summary: z.string().default(''),
  website: z.string().default(''),
  linkedin: z.string().default('')
});

export const parsedEducationItemSchema = z.object({
  institution: z.string().default(''),
  degree: z.string().default(''),
  year: z.string().default(''),
  gpa: z.string().optional()
});

export const parsedExperienceItemSchema = z.object({
  company: z.string().default(''),
  role: z.string().default(''),
  period: z.string().default(''),
  location: z.string().default(''),
  bullets: z.array(z.string()).default([])
});

export const parsedProjectItemSchema = z.object({
  name: z.string().default(''),
  description: z.string().default(''),
  link: z.string().default(''),
  technologies: z.array(z.string()).default([])
});

export const parsedCertificationItemSchema = z.object({
  title: z.string().default(''),
  issuer: z.string().default(''),
  year: z.string().default('')
});

export const parsedLinkItemSchema = z.object({
  label: z.string().default(''),
  url: z.string().default('')
});

export const canonicalResumeParserOutputSchema = z.object({
  personalInfo: parsedPersonalInfoSchema,
  summary: z.string().default(''),
  education: z.array(parsedEducationItemSchema).default([]),
  experience: z.array(parsedExperienceItemSchema).default([]),
  projects: z.array(parsedProjectItemSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(parsedCertificationItemSchema).default([]),
  achievements: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  links: z.array(parsedLinkItemSchema).default([])
});

export type CanonicalResumeParserOutput = z.infer<typeof canonicalResumeParserOutputSchema>;
