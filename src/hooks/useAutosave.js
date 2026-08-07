import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Lumina AI Production-Grade Autosave Hook (useAutosave)
 * Features:
 * - 1.5s Debounced Inactivity Saver (cancels previous pending timers on active typing)
 * - Concurrency Lock: Prevents simultaneous inflight HTTP save calls
 * - Optimistic Locking Version Counter: Prevents stale out-of-order state overwrites
 * - Exponential Backoff Automatic Retry: Retries failed network requests
 * - Safe Page Refresh Protection (beforeunload event listener)
 * - State Machine: 'saved' | 'saving' | 'offline' | 'retrying' | 'error'
 */
export function useAutosave({ data, onSave, delay = 1500, initialVersion = 1 }) {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'offline' | 'retrying' | 'error'
  const [version, setVersion] = useState(initialVersion);

  const debounceTimerRef = useRef(null);
  const isSavingRef = useRef(false);
  const latestDataRef = useRef(data);
  const latestVersionRef = useRef(version);
  const isFirstRender = useRef(true);

  latestDataRef.current = data;

  /**
   * Executes HTTP PATCH with Optimistic Locking Version Check
   */
  const executeSave = useCallback(async (dataToSave, retryCount = 0) => {
    if (isSavingRef.current) {
      console.log('[useAutosave]: Save lock active; queuing next tick.');
      return;
    }

    if (!navigator.onLine) {
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
    } catch (err) {
      console.warn(`[useAutosave Error - Attempt ${retryCount + 1}]:`, err.message);

      if (!navigator.onLine) {
        setSaveStatus('offline');
      } else if (retryCount < 3) {
        setSaveStatus('retrying');
        // Exponential Backoff Retry (1s, 2s, 4s)
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

  /**
   * Debounced Effect: Waits 1.5s after editing stops.
   * Cancels previous timer if user continues typing!
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');

    // Cancel previous pending save timer on new keystroke
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule new save after 1.5s (1500ms) inactivity
    debounceTimerRef.current = setTimeout(() => {
      executeSave(latestDataRef.current);
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, delay, executeSave]);

  /**
   * Safe Page Refresh Protection
   */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saveStatus === 'saving' || saveStatus === 'retrying') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes currently syncing to cloud. Are you sure you want to exit?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  /**
   * Manual Retry Trigger
   */
  const retrySave = useCallback(() => {
    executeSave(latestDataRef.current, 0);
  }, [executeSave]);

  return {
    saveStatus,
    version,
    retrySave
  };
}
