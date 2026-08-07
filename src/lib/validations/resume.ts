import { z } from 'zod';

export const createResumeSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty').max(150, 'Title cannot exceed 150 characters'),
  content: z.record(z.any()).optional().default({})
});

export const updateResumeSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(150, 'Title cannot exceed 150 characters').optional(),
  content: z.record(z.any()).optional()
});

export type CreateResumeInputType = z.infer<typeof createResumeSchema>;
export type UpdateResumeInputType = z.infer<typeof updateResumeSchema>;
