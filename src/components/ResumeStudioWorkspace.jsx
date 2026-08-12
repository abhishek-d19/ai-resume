import React from 'react';
import { ResumeStudio } from '../features/resume/editor/components/ResumeStudio';

export default function ResumeStudioWorkspace({ resumeId = 'res-1', userId, onNavigateToDashboard, onNavigateToAnalysis }) {
  return (
    <ResumeStudio 
      resumeId={resumeId}
      userId={userId}
      onBackToDashboard={onNavigateToDashboard}
      onNavigateToAnalysis={onNavigateToAnalysis}
    />
  );
}
