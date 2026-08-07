import { useState, useEffect, useRef, useCallback } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'offline' | 'retrying' | 'error';

export interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T, version: number) => Promise<{ success: boolean; version?: number; error?: string }>;
  delay?: number;
  initialVersion?: number;
}

export interface UseAutosaveReturn {
  saveStatus: SaveStatus;
  version: number;
  retrySave: () => void;
}

export function useAutosave<T>({
  data,
  onSave,
  delay = 1500,
  initialVersion = 1
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [version, setVersion] = useState<number>(initialVersion);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef<boolean>(false);
  const latestDataRef = useRef<T>(data);
  const latestVersionRef = useRef<number>(version);
  const isFirstRender = useRef<boolean>(true);

  latestDataRef.current = data;

  const executeSave = useCallback(async (dataToSave: T, retryCount = 0) => {
    if (isSavingRef.current) {
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSaveStatus('offline');
      return;
    }

    isSavingRef.current = true;
    if (retryCount > 0) {
      setSaveStatus('retrying');
    } else {
      setSaveStatus('saving');
    }

    try {
      const currentVersion = latestVersionRef.current;
      const result = await onSave(dataToSave, currentVersion);

      if (result && result.success) {
        const nextVersion = result.version || currentVersion + 1;
        latestVersionRef.current = nextVersion;
        setVersion(nextVersion);
        setSaveStatus('saved');
      } else {
        throw new Error(result?.error || 'Save request failed');
      }
    } catch (err: any) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setSaveStatus('offline');
      } else if (retryCount < 3) {
        setSaveStatus('retrying');
        const backoffMs = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          isSavingRef.current = false;
          executeSave(dataToSave, retryCount + 1);
        }, backoffMs);
        return;
      } else {
        setSaveStatus('error');
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSave(latestDataRef.current);
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, delay, executeSave]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'saving' || saveStatus === 'retrying') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes syncing to cloud. Are you sure you want to exit?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  const retrySave = useCallback(() => {
    executeSave(latestDataRef.current, 0);
  }, [executeSave]);

  return {
    saveStatus,
    version,
    retrySave
  };
}
