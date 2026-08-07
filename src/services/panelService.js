export const panelService = {
  /**
   * Fetch executive reviewer evaluations
   */
  async getHiringPanelReviews(targetRole = 'Software Engineer') {
    return {
      success: true,
      targetRole,
      organization: 'Google Hiring Panel',
      consensus: 'Hire',
      confidence: 'High',
      reviewers: [
        {
          id: 'sarah',
          name: 'Sarah',
          role: 'HR Recruiter',
          avatar: '👩‍💼',
          confidence: '94% High Confidence',
          strengths: ['Clear career progression', 'Strong CS foundation', 'Clean ATS formatting'],
          feedback: 'Resume communicates core qualifications effectively, but needs stronger metric density for initial 6-second recruiter scans.',
          improvements: 'Front-load metric percentages in top 3 bullet points to double recruiter callback rate.',
          verdict: 'Hire',
          accent: '#38E8F5'
        },
        {
          id: 'david',
          name: 'David',
          role: 'Engineering Manager',
          avatar: '👨‍💻',
          confidence: '92% High Confidence',
          strengths: ['Cross-functional team leadership', 'Agile delivery track record', 'System scaling experience'],
          feedback: 'Demonstrates solid leadership, but backend system scaling metrics require explicit throughput figures.',
          improvements: 'Quantify team velocity gains and API latency reductions in the senior role experience section.',
          verdict: 'Strong Hire',
          accent: '#9877FF'
        },
        {
          id: 'emma',
          name: 'Emma',
          role: 'Hiring Manager',
          avatar: '👩‍🔬',
          confidence: '98% Very High Confidence',
          strengths: ['Product impact mindset', 'User adoption orientation', 'High technical clarity'],
          feedback: 'Exceptional alignment with staff-level engineering expectations.',
          improvements: 'Highlight design system user adoption numbers.',
          verdict: 'Strong Hire',
          accent: '#10B981'
        },
        {
          id: 'alex',
          name: 'Alex',
          role: 'Senior Software Engineer',
          avatar: '👨‍🔧',
          confidence: '96% High Confidence',
          strengths: ['React & TypeScript mastery', 'Design system architecture', 'Frontend TTI performance'],
          feedback: 'Technical expertise is evident; add GraphQL federation experience.',
          improvements: 'Include GraphQL schema federation details.',
          verdict: 'Hire',
          accent: '#F5BB27'
        }
      ]
    };
  }
};
