import React, { useState, useEffect, useCallback } from 'react';
import { RestorationErrorState, UseResumeRestorationOptions, UseResumeRestorationReturn } from '../types/restoration';
import { ResumeRestorationService } from '../services/ResumeRestorationService';
import { CanonicalResumeSchema } from '../../editor/components/ResumeStudio';
import { NotFoundError, ForbiddenError } from '../../../../services/ResumeService';
import { DEMO_CANDIDATE_UUID } from '../../../../constants/demoCandidate';

export function useResumeRestoration({
  resumeId = DEMO_CANDIDATE_UUID,
  userId
}: UseResumeRestorationOptions): UseResumeRestorationReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<RestorationErrorState>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState<string>('Untitled_Resume.pdf');
  const [version, setVersion] = useState<number>(1);
  const [resumeData, setResumeData] = useState<CanonicalResumeSchema | null>(null);

  const performRestoration = useCallback(async () => {
    setLoading(true);
    setErrorState(null);
    setErrorMessage(null);

    try {
      const result = await ResumeRestorationService.fetchLatestResume(userId, resumeId);

      if (result.deleted_at !== null && result.deleted_at !== undefined) {
        setErrorState('deleted');
        setErrorMessage('This resume has been moved to trash.');
        setLoading(false);
        return;
      }

      setResumeTitle(result.title);
      setVersion(result.version);
      setResumeData(result.data);
    } catch (err: any) {
      console.warn('[useResumeRestoration Note]:', err.message);

      if (err instanceof NotFoundError) {
        setErrorState('notFound');
        setErrorMessage(`Resume "${resumeId}" was not found.`);
      } else if (err instanceof ForbiddenError) {
        setErrorState('unauthorized');
        setErrorMessage('Unauthorized: You do not have access to this resume.');
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setErrorState('networkError');
        setErrorMessage('Network connection lost. Check your internet connection.');
      } else {
        // Fallback default dataset on transient error to prevent UI hang
        setResumeData(ResumeRestorationService.getDefaultSchema());
        setResumeTitle('Mobile_Application_Testing_Resume.pdf');
      }
    } finally {
      setLoading(false);
    }
  }, [resumeId, userId]);

  useEffect(() => {
    performRestoration();
  }, [performRestoration]);

  return {
    loading,
    errorState,
    errorMessage,
    resumeTitle,
    version,
    resumeData: resumeData || ResumeRestorationService.getDefaultSchema(),
    restoreResume: performRestoration,
    setResumeTitle,
    setResumeData: setResumeData as any
  };
}
