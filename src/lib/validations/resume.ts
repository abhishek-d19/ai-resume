import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().optional().default(''),
  headline: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  location: z.string().optional().default('')
});

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string().optional().default(''),
  degree: z.string().optional().default(''),
  fieldOfStudy: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  gpa: z.string().optional().default('')
});

export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().optional().default(''),
  role: z.string().optional().default(''),
  location: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  isCurrent: z.boolean().optional().default(false),
  bullets: z.array(z.string()).optional().default([])
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().optional().default(''),
  description: z.string().optional().default(''),
  techStack: z.string().optional().default(''),
  bullets: z.array(z.string()).optional().default([])
});

export const skillCategoryItemSchema = z.object({
  id: z.string(),
  category: z.string().optional().default(''),
  skills: z.string().optional().default('')
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().optional().default(''),
  issuer: z.string().optional().default(''),
  date: z.string().optional().default('')
});

export const achievementItemSchema = z.object({
  id: z.string(),
  title: z.string().optional().default(''),
  description: z.string().optional().default('')
});

export const languageItemSchema = z.object({
  id: z.string(),
  language: z.string().optional().default(''),
  proficiency: z.string().optional().default('')
});

export const linkItemSchema = z.object({
  id: z.string(),
  label: z.string().optional().default(''),
  url: z.string().optional().default('')
});

export const canonicalResumeSchema = z.object({
  personalInfo: personalInfoSchema.default({}),
  summary: z.string().optional().default(''),
  education: z.array(educationItemSchema).optional().default([]),
  experience: z.array(experienceItemSchema).optional().default([]),
  projects: z.array(projectItemSchema).optional().default([]),
  skills: z.array(skillCategoryItemSchema).optional().default([]),
  certifications: z.array(certificationItemSchema).optional().default([]),
  achievements: z.array(achievementItemSchema).optional().default([]),
  languages: z.array(languageItemSchema).optional().default([]),
  links: z.array(linkItemSchema).optional().default([])
});

export const createResumeSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty').max(150, 'Title cannot exceed 150 characters'),
  content: z.record(z.any()).optional().default({})
});

export const updateResumeSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(150, 'Title cannot exceed 150 characters').optional(),
  content: z.record(z.any()).optional()
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type EducationItemInput = z.infer<typeof educationItemSchema>;
export type ExperienceItemInput = z.infer<typeof experienceItemSchema>;
export type ProjectItemInput = z.infer<typeof projectItemSchema>;
export type SkillCategoryItemInput = z.infer<typeof skillCategoryItemSchema>;
export type CertificationItemInput = z.infer<typeof certificationItemSchema>;
export type AchievementItemInput = z.infer<typeof achievementItemSchema>;
export type LanguageItemInput = z.infer<typeof languageItemSchema>;
export type LinkItemInput = z.infer<typeof linkItemSchema>;
export type CanonicalResume = z.infer<typeof canonicalResumeSchema>;
export type CreateResumeInputType = z.infer<typeof createResumeSchema>;
export type UpdateResumeInputType = z.infer<typeof updateResumeSchema>;
