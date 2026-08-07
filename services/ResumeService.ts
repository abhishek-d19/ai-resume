import { ResumeRepository, resumeRepository, ResumeEntity } from '../repositories/ResumeRepository';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export interface CreateResumeInput {
  userId: string;
  title: string;
  content?: Record<string, any>;
}

export interface UpdateResumeInput {
  userId: string;
  resumeId: string;
  title?: string;
  content?: Record<string, any>;
  incrementVersion?: boolean;
}

export class ResumeService {
  private repository: ResumeRepository;

  constructor(repository: ResumeRepository = resumeRepository) {
    this.repository = repository;
  }

  async createResume(input: CreateResumeInput): Promise<ResumeEntity> {
    if (!input.userId || typeof input.userId !== 'string') {
      throw new ValidationError('Valid userId is required.');
    }

    const trimmedTitle = input.title ? input.title.trim() : '';
    if (!trimmedTitle) {
      throw new ValidationError('Resume title cannot be empty.');
    }

    if (trimmedTitle.length > 150) {
      throw new ValidationError('Resume title cannot exceed 150 characters.');
    }

    const existingResumes = await this.repository.findByUser(input.userId);
    const resolvedTitle = this.resolveDuplicateTitle(trimmedTitle, existingResumes.map(r => r.title));

    return this.repository.createResume({
      user_id: input.userId,
      title: resolvedTitle,
      content: input.content || {},
      status: 'draft',
      version: 1
    });
  }

  async updateResume(input: UpdateResumeInput): Promise<ResumeEntity> {
    if (!input.userId || !input.resumeId) {
      throw new ValidationError('Both userId and resumeId are required.');
    }

    const existing = await this.repository.findById(input.resumeId);
    if (!existing) {
      throw new NotFoundError(`Resume with ID ${input.resumeId} was not found.`);
    }

    if (existing.user_id !== input.userId) {
      throw new ForbiddenError('You do not have permission to update this resume.');
    }

    if (existing.deleted_at !== null) {
      throw new ValidationError('Cannot update a deleted resume. Please restore it first.');
    }

    const updates: { title?: string; content?: Record<string, any>; version?: number } = {};

    if (input.title !== undefined) {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) {
        throw new ValidationError('Resume title cannot be empty.');
      }

      if (trimmedTitle !== existing.title) {
        const userResumes = await this.repository.findByUser(input.userId);
        const otherTitles = userResumes.filter(r => r.id !== input.resumeId).map(r => r.title);
        updates.title = this.resolveDuplicateTitle(trimmedTitle, otherTitles);
      }
    }

    if (input.content !== undefined) {
      updates.content = input.content;
      if (input.incrementVersion !== false) {
        updates.version = existing.version + 1;
      }
    }

    return this.repository.updateResume(input.resumeId, updates);
  }

  async deleteResume(userId: string, resumeId: string): Promise<boolean> {
    if (!userId || !resumeId) {
      throw new ValidationError('Both userId and resumeId are required.');
    }

    const existing = await this.repository.findById(resumeId);
    if (!existing) {
      throw new NotFoundError(`Resume with ID ${resumeId} was not found.`);
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You do not have permission to delete this resume.');
    }

    return this.repository.deleteResume(resumeId);
  }

  async restoreResume(userId: string, resumeId: string): Promise<ResumeEntity> {
    if (!userId || !resumeId) {
      throw new ValidationError('Both userId and resumeId are required.');
    }

    const existing = await this.repository.findById(resumeId, true);
    if (!existing) {
      throw new NotFoundError(`Resume with ID ${resumeId} was not found.`);
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You do not have permission to restore this resume.');
    }

    if (existing.deleted_at === null) {
      return existing;
    }

    return this.repository.restoreResume(resumeId);
  }

  async getResumeForUser(userId: string, resumeId: string): Promise<ResumeEntity> {
    const existing = await this.repository.findById(resumeId);
    if (!existing) {
      throw new NotFoundError(`Resume with ID ${resumeId} was not found.`);
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You do not have permission to access this resume.');
    }

    return existing;
  }

  async listResumesForUser(userId: string): Promise<ResumeEntity[]> {
    if (!userId) {
      throw new ValidationError('userId is required.');
    }

    return this.repository.findByUser(userId);
  }

  async prepareForAiEnhancement(userId: string, resumeId: string, targetRole: string) {
    const resume = await this.getResumeForUser(userId, resumeId);
    
    return {
      resumeId: resume.id,
      version: resume.version,
      targetRole,
      rawContent: resume.content,
      aiPromptReady: true
    };
  }

  private resolveDuplicateTitle(requestedTitle: string, existingTitles: string[]): string {
    const titleSet = new Set(existingTitles.map(t => t.toLowerCase()));
    
    if (!titleSet.has(requestedTitle.toLowerCase())) {
      return requestedTitle;
    }

    let counter = 1;
    let candidateTitle = `${requestedTitle} (${counter})`;

    while (titleSet.has(candidateTitle.toLowerCase())) {
      counter++;
      candidateTitle = `${requestedTitle} (${counter})`;
    }

    return candidateTitle;
  }
}

export const resumeServiceInstance = new ResumeService();
