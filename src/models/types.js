/**
 * Lumina AI Type-Safe Domain Models & Data Contracts
 * Defines canonical schemas for User Profiles, Resumes, Panel Reviews, and JD Match results.
 */

import { DEMO_CANDIDATE } from '../constants/demoCandidate';

export const UserProfileSchema = {
  id: '',
  email: '',
  fullName: '',
  targetRole: 'Principal Software Engineer & Systems Architect',
  careerConfidence: 'High'
};

export const ResumeDataSchema = {
  id: '',
  userId: '',
  title: DEMO_CANDIDATE.resumeFileName,
  fileUrl: '',
  impactScore: 82,
  structureScore: 'Excellent',
  keywordsScore: 'Needs Work',
  readabilityScore: 'Excellent',
  bullets: DEMO_CANDIDATE.experience[0].bullets
};

export const ReviewerSchema = {
  id: '',
  name: '',
  role: '',
  avatar: '👩‍💼',
  confidence: '94% High Confidence',
  strengths: [],
  feedback: '',
  improvements: '',
  verdict: 'Hire'
};
