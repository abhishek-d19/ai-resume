/**
 * Lumina AI Type-Safe Domain Models & Data Contracts
 * Defines canonical schemas for User Profiles, Resumes, Panel Reviews, and JD Match results.
 */

export const UserProfileSchema = {
  id: '',
  email: '',
  fullName: '',
  targetRole: 'Software Engineer',
  careerConfidence: 'High'
};

export const ResumeDataSchema = {
  id: '',
  userId: '',
  title: 'Abhishek_Sharma_Resume.pdf',
  fileUrl: '',
  impactScore: 82,
  structureScore: 'Excellent',
  keywordsScore: 'Needs Work',
  readabilityScore: 'Excellent',
  bullets: [
    "Architected distributed multi-tenant design system scaling across 14 enterprise web applications, reducing bundle size by 35%.",
    "Engineered real-time AI prompt transformation engine, reducing TTI by 42% for 300,000+ active enterprise users.",
    "Led cross-functional team of 6 engineers to launch automated token pipeline directly into GitHub CI/CD, eliminating manual handoffs."
  ]
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

export const JdMatchResultSchema = {
  jobTitle: 'Senior Software Engineer',
  company: 'Google',
  matchScore: 96,
  matchingSkills: [],
  missingSkills: [],
  suggestions: []
};
