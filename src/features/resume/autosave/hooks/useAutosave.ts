import { useState, useEffect, useRef, useCallback } from 'react';
import { SaveStatusState, UseAutosaveOptions, UseAutosaveReturn } from '../types/autosave';
import { ResumeAutosaveService } from '../services/ResumeAutosaveService';

export function useAutosave<T>({
  resumeId,
  userId,
  data,
  initialVersion = 1,
  delay = 1500,
  onSaveSuccess,
  onSaveError
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatusState>('idle');
  const [version, setVersion] = useState<number>(initialVersion);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef<boolean>(false);
  const queuedDataRef = useRef<T | null>(null);
  const lastSavedHashRef = useRef<string>(JSON.stringify(data));
  const latestDataRef = useRef<T>(data);
  const latestVersionRef = useRef<number>(version);
  const isFirstRender = useRef<boolean>(true);

  latestDataRef.current = data;

  /**
   * Executes HTTP PATCH save with queueing & single retry
   */
  const performSave = useCallback(async (dataToSave: T, isRetry = false): Promise<void> => {
    // Skip save if content hasn't changed from last confirmed server save
    const currentHash = JSON.stringify(dataToSave);
    if (currentHash === lastSavedHashRef.current && !isRetry) {
      setSaveStatus('saved');
      return;
    }

    if (isSavingRef.current) {
      // Queue latest data while current save is in-flight
      queuedDataRef.current = dataToSave;
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSaveStatus('offline');
      setErrorMessage('Network connection offline.');
      return;
    }

    isSavingRef.current = true;
    setSaveStatus('saving');
    setErrorMessage(null);

    const result = await ResumeAutosaveService.patchResumeContent(
      userId,
      resumeId,
      dataToSave,
      undefined,
      latestVersionRef.current
    );

    if (result.success) {
      const nextVersion = result.version || latestVersionRef.current + 1;
      latestVersionRef.current = nextVersion;
      setVersion(nextVersion);
      lastSavedHashRef.current = currentHash;
      setSaveStatus('saved');

      if (onSaveSuccess) {
        onSaveSuccess(nextVersion, result.updated_at);
      }

      isSavingRef.current = false;

      // Process queued changes if candidate typed while save was in flight!
      if (queuedDataRef.current !== null) {
        const nextData = queuedDataRef.current;
        queuedDataRef.current = null;
        performSave(nextData);
      }
    } else {
      // Auto-retry once for transient network failures
      if (!isRetry && !result.isConflict && navigator.onLine) {
        console.log('[useAutosave]: Retrying save once...');
        isSavingRef.current = false;
        setTimeout(() => {
          performSave(dataToSave, true);
        }, 1000);
        return;
      }

      isSavingRef.current = false;

      if (result.isConflict) {
        setSaveStatus('conflict');
      } else if (!navigator.onLine) {
        setSaveStatus('offline');
      } else {
        setSaveStatus('error');
      }

      const msg = result.error || 'Autosave failed.';
      setErrorMessage(msg);
      if (onSaveError) {
        onSaveError(msg, result.isConflict);
      }
    }
  }, [resumeId, userId, onSaveSuccess, onSaveError]);

  /**
   * Debounced Effect: 1500ms inactivity timer
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentHash = JSON.stringify(data);
    if (currentHash === lastSavedHashRef.current) {
      return;
    }

    setSaveStatus('editing');

    // Cancel previous pending timer on new typing
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule save after 1.5s (1500ms) inactivity
    debounceTimerRef.current = setTimeout(() => {
      performSave(latestDataRef.current);
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, delay, performSave]);

  /**
   * Page Refresh Protection
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving' || saveStatus === 'editing') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes syncing to cloud. Are you sure you want to exit?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  const retrySave = useCallback(() => {
    performSave(latestDataRef.current, true);
  }, [performSave]);

  return {
    saveStatus,
    version,
    errorMessage,
    retrySave
  };
}
