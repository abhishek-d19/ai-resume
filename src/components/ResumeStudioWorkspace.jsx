import React from 'react';
import { ResumeStudio } from '../features/resume/editor/components/ResumeStudio';
import { DEMO_CANDIDATE_UUID } from '../constants/demoCandidate';

export default function ResumeStudioWorkspace({ resumeId = DEMO_CANDIDATE_UUID, userId, onNavigateToDashboard, onNavigateToAnalysis }) {
  return (
    <ResumeStudio 
      resumeId={resumeId}
      userId={userId}
      onBackToDashboard={onNavigateToDashboard}
      onNavigateToAnalysis={onNavigateToAnalysis}
    />
  );
}
