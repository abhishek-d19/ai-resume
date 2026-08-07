export type SaveStatusState = 'idle' | 'editing' | 'saving' | 'saved' | 'offline' | 'error' | 'conflict';

export interface SaveResult {
  success: boolean;
  version?: number;
  updated_at?: string;
  error?: string;
  isConflict?: boolean;
}

export interface UseAutosaveOptions<T> {
  resumeId: string;
  userId: string;
  data: T;
  initialVersion?: number;
  delay?: number; // 1500ms default
  onSaveSuccess?: (version: number, updated_at?: string) => void;
  onSaveError?: (error: string, isConflict?: boolean) => void;
}

export interface UseAutosaveReturn {
  saveStatus: SaveStatusState;
  version: number;
  errorMessage: string | null;
  retrySave: () => void;
}
