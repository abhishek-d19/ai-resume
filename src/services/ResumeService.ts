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

  /**
   * Validates input, resolves title collisions, and creates a new candidate resume.
   */
  async createResume(input: CreateResumeInput): Promise<ResumeEntity> {
    // 1. Input Validation
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

    // 2. Resolve Duplicate Titles for User
    const existingResumes = await this.repository.findByUser(input.userId);
    const resolvedTitle = this.resolveDuplicateTitle(trimmedTitle, existingResumes.map(r => r.title));

    // 3. Delegate Persistence to Repository
    return this.repository.createResume({
      user_id: input.userId,
      title: resolvedTitle,
      content: input.content || {},
      status: 'draft',
      version: 1
    });
  }

  /**
   * Validates ownership, checks soft-delete state, increments version on content updates.
   */
  async updateResume(input: UpdateResumeInput): Promise<ResumeEntity> {
    if (!input.userId || !input.resumeId) {
      throw new ValidationError('Both userId and resumeId are required.');
    }

    // 1. Fetch Existing Entity
    const existing = await this.repository.findById(input.resumeId);
    if (!existing) {
      throw new NotFoundError(`Resume with ID ${input.resumeId} was not found.`);
    }

    // 2. Permission Check
    if (existing.user_id !== input.userId) {
      throw new ForbiddenError('You do not have permission to update this resume.');
    }

    // 3. Prevent Invalid Operations on Soft-Deleted Resumes
    if (existing.deleted_at !== null) {
      throw new ValidationError('Cannot update a deleted resume. Please restore it first.');
    }

    const updates: { title?: string; content?: Record<string, any>; version?: number } = {};

    // 4. Validate & Resolve Duplicate Title if changed
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

    // 5. Version Increment Logic on Content Edits
    if (input.content !== undefined) {
      updates.content = input.content;
      if (input.incrementVersion !== false) {
        updates.version = existing.version + 1;
      }
    }

    return this.repository.updateResume(input.resumeId, updates);
  }

  /**
   * Validates ownership and soft deletes a resume.
   */
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

  /**
   * Restores a soft-deleted resume after checking ownership.
   */
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
      return existing; // Already active
    }

    return this.repository.restoreResume(resumeId);
  }

  /**
   * Fetches a single resume for user with ownership check.
   */
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

  /**
   * Lists all non-deleted resumes for user.
   */
  async listResumesForUser(userId: string): Promise<ResumeEntity[]> {
    if (!userId) {
      throw new ValidationError('userId is required.');
    }

    return this.repository.findByUser(userId);
  }

  /**
   * Fetches soft-deleted resumes for a specific user (deleted_at IS NOT NULL).
   */
  async listTrashedResumesForUser(userId: string): Promise<ResumeEntity[]> {
    if (!userId) throw new ValidationError('userId is required');
    return this.repository.findTrashedByUser(userId);
  }

  /**
   * Permanently destroys a soft-deleted resume record from database (HARD DELETE).
   */
  async permanentlyDeleteResume(userId: string, resumeId: string): Promise<boolean> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    const resume = await this.repository.findById(resumeId, true);
    if (!resume) throw new NotFoundError(`Resume with ID ${resumeId} not found`);
    if (resume.user_id !== userId) throw new ForbiddenError('Unauthorized resume access');

    return this.repository.hardDeleteResume(resumeId);
  }

  /**
   * Future AI Provider Compatibility: Hook for AI prompt metric enhancement pipeline.
   */
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

  /**
   * Helper method to handle duplicate title collisions automatically.
   */
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
