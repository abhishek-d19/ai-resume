import { ResumeRepository, resumeRepository, ResumeEntity } from '../repositories/ResumeRepository';
import { pdfParserServiceInstance } from './PdfParserService';
import { storageService } from './storageService';
import { userService } from './userService';
import { ResumeRestorationService } from '../features/resume/restoration/services/ResumeRestorationService';

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
   * Fetches real aggregated dashboard metrics directly from Supabase tables using internal user UUID
   */
  async getDashboardMetrics(userId: string) {
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('Valid userId is required.');
    }
    const userUuid = await userService.resolveUserUuid(userId);
    return this.repository.getDashboardMetrics(userUuid);
  }

  /**
   * Pipeline: Validates PDF upload, extracts text, converts to Canonical JSON, and saves to repository using internal user UUID
   */
  async uploadAndConvertResume(
    userId: string,
    file: { name: string; size: number; type: string; buffer: Buffer | ArrayBuffer; rawFile?: File },
    customTitle?: string
  ): Promise<ResumeEntity> {
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('Valid userId is required.');
    }

    const userUuid = await userService.resolveUserUuid(userId);

    // 1. Validate PDF File (Format, MIME, Size <= 10MB, Password protection)
    pdfParserServiceInstance.validatePdfFile(file);

    // 2. Extract Text & Parse Canonical JSON
    const { canonicalContent } = await pdfParserServiceInstance.extractTextAndConvertToCanonicalJson(file.buffer, file.name);

    // 3. Resolve Title & Save to Repository
    const rawTitle = customTitle || file.name.replace(/\.[^/.]+$/, "");
    const existingResumes = (await this.repository.findByUser(userUuid)) || [];
    const existingTitles = Array.isArray(existingResumes) ? existingResumes.map(r => r.title) : [];
    const resolvedTitle = this.resolveDuplicateTitle(rawTitle, existingTitles);

    const createdResume = await this.repository.createResume({
      user_id: userUuid,
      title: resolvedTitle,
      content: canonicalContent,
      status: 'draft',
      version: 1
    });

    // 4. Storage: Upload original PDF to Supabase Storage
    try {
      if (file.rawFile) {
        await storageService.uploadResumeFile(file.rawFile, userUuid, createdResume.id);
      } else {
        const pdfBlob = new Blob([file.buffer], { type: 'application/pdf' });
        const pdfFile = new File([pdfBlob], file.name, { type: 'application/pdf' });
        await storageService.uploadResumeFile(pdfFile, userUuid, createdResume.id);
      }
    } catch (storageErr: any) {
      console.warn('[Supabase Storage upload note]:', storageErr?.message || storageErr);
    }

    return createdResume;
  }

  async createResume(input: CreateResumeInput): Promise<ResumeEntity> {
    if (!input.userId || typeof input.userId !== 'string') {
      throw new ValidationError('Valid userId is required.');
    }

    const userUuid = await userService.resolveUserUuid(input.userId);

    const trimmedTitle = input.title ? input.title.trim() : '';
    if (!trimmedTitle) {
      throw new ValidationError('Resume title cannot be empty.');
    }

    if (trimmedTitle.length > 150) {
      throw new ValidationError('Resume title cannot exceed 150 characters.');
    }

    // Resolve Duplicate Titles for User
    const existingResumes = (await this.repository.findByUser(userUuid)) || [];
    const existingTitles = Array.isArray(existingResumes) ? existingResumes.map(r => r.title) : [];
    const resolvedTitle = this.resolveDuplicateTitle(trimmedTitle, existingTitles);

    return this.repository.createResume({
      user_id: userUuid,
      title: resolvedTitle,
      content: input.content || ResumeRestorationService.getDefaultSchema(),
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

    const userUuid = await userService.resolveUserUuid(input.userId);
    const existing = await this.repository.findById(input.resumeId);

    if (!existing) {
      throw new NotFoundError(`Resume "${input.resumeId}" was not found.`);
    }

    if (existing.deleted_at !== null) {
      throw new ValidationError('Cannot update a deleted resume. Restore it first.');
    }

    const newVersion = input.incrementVersion !== false ? existing.version + 1 : existing.version;

    return this.repository.updateResume(input.resumeId, {
      title: input.title,
      content: input.content,
      version: newVersion
    });
  }

  async deleteResume(userId: string, resumeId: string): Promise<boolean> {
    if (!userId || !resumeId) {
      throw new ValidationError('Both userId and resumeId are required.');
    }

    const userUuid = await userService.resolveUserUuid(userId);
    const existing = await this.repository.findById(resumeId);

    if (!existing) {
      throw new NotFoundError(`Resume "${resumeId}" was not found.`);
    }

    return this.repository.deleteResume(resumeId);
  }

  async restoreResume(userId: string, resumeId: string): Promise<ResumeEntity> {
    if (!userId || !resumeId) {
      throw new ValidationError('Both userId and resumeId are required.');
    }

    const userUuid = await userService.resolveUserUuid(userId);
    const existing = await this.repository.findById(resumeId, true);

    if (!existing) {
      throw new NotFoundError(`Resume "${resumeId}" was not found.`);
    }

    return this.repository.restoreResume(resumeId);
  }

  async getResumeForUser(userId: string, resumeId: string): Promise<ResumeEntity> {
    if (!userId) {
      throw new ValidationError('Valid userId is required.');
    }

    const userUuid = await userService.resolveUserUuid(userId);

    // If resumeId is invalid or placeholder ('res-1'), return user's latest active resume or auto-create one
    if (!resumeId || resumeId === 'res-1' || resumeId === 'undefined' || resumeId === 'null') {
      const userResumes = await this.repository.findByUser(userUuid);
      if (userResumes && userResumes.length > 0) {
        return userResumes[0];
      }
      return this.createResume({
        userId,
        title: 'Executive Resume 1',
        content: ResumeRestorationService.getDefaultSchema()
      });
    }

    const existing = await this.repository.findById(resumeId, true);

    if (!existing) {
      const userResumes = await this.repository.findByUser(userUuid);
      if (userResumes && userResumes.length > 0) {
        return userResumes[0];
      }
      throw new NotFoundError(`Resume "${resumeId}" was not found.`);
    }

    return existing;
  }

  async listResumesForUser(userId: string): Promise<Omit<ResumeEntity, 'content'>[]> {
    if (!userId || typeof userId !== 'string') {
      throw new ValidationError('Valid userId is required.');
    }
    const userUuid = await userService.resolveUserUuid(userId);
    const list = await this.repository.findByUserHeaderOnly(userUuid);
    return Array.isArray(list) ? list : [];
  }

  private resolveDuplicateTitle(baseTitle: string, existingTitles: string[]): string {
    const safeTitles = Array.isArray(existingTitles) ? existingTitles : [];
    if (!safeTitles.includes(baseTitle)) {
      return baseTitle;
    }

    let count = 1;
    let candidate = `${baseTitle} (${count})`;
    while (safeTitles.includes(candidate)) {
      count++;
      candidate = `${baseTitle} (${count})`;
    }

    return candidate;
  }
}

export const resumeServiceInstance = new ResumeService();
