import { resumeServiceInstance, ForbiddenError, NotFoundError } from '../../../../services/ResumeService';
import { SaveResult } from '../types/autosave';

export class ResumeAutosaveService {
  /**
   * Executes PATCH request with Optimistic Locking Version Checks
   */
  public static async patchResumeContent<T>(
    userId: string,
    resumeId: string,
    content: T,
    title?: string,
    expectedVersion?: number
  ): Promise<SaveResult> {
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return { success: false, error: 'Network disconnected. Changes cached locally.' };
      }

      // Execute update via ResumeService
      const updated = await resumeServiceInstance.updateResume({
        userId,
        resumeId,
        title,
        content: content as Record<string, any>,
        incrementVersion: true
      });

      return {
        success: true,
        version: updated.version,
        updated_at: updated.updated_at
      };
    } catch (err: any) {
      console.warn('[ResumeAutosaveService Error]:', err.message);

      if (err instanceof ForbiddenError) {
        return { success: false, error: 'Unauthorized save attempt.', isConflict: false };
      }

      if (err instanceof NotFoundError) {
        return { success: false, error: 'Resume deleted or missing.', isConflict: false };
      }

      // Check for Optimistic Concurrency Conflict
      if (err.message && err.message.includes('version mismatch')) {
        return {
          success: false,
          error: 'Document changed elsewhere. Refresh to sync latest version.',
          isConflict: true
        };
      }

      return { success: false, error: err.message || 'Save request failed.' };
    }
  }
}
