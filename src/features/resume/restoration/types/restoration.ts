import { CanonicalResumeSchema } from '../../editor/components/ResumeStudio';

export type RestorationErrorState = 'notFound' | 'deleted' | 'unauthorized' | 'corruptedJson' | 'networkError' | null;

export interface RestorationResult {
  title: string;
  version: number;
  updated_at?: string;
  data: CanonicalResumeSchema;
  deleted_at?: string | null;
}

export interface UseResumeRestorationOptions {
  resumeId: string;
  userId: string;
}

export interface UseResumeRestorationReturn {
  loading: boolean;
  errorState: RestorationErrorState;
  errorMessage: string | null;
  resumeTitle: string;
  version: number;
  resumeData: CanonicalResumeSchema | null;
  restoreResume: () => Promise<void>;
  setResumeTitle: (title: string) => void;
  setResumeData: React.Dispatch<React.SetStateAction<CanonicalResumeSchema>>;
}
