export const jdMatchService = {
  /**
   * Compare candidate resume against target job description
   */
  async compareJobDescription(jobTitle = 'Senior Software Engineer', company = 'Google') {
    return {
      success: true,
      jobTitle,
      company,
      overallFit: '96% Overall Skill Fit',
      skillComparisons: [
        { name: 'React & TypeScript Architecture', percent: 95, status: 'Matched', variant: 'matched' },
        { name: 'Node.js Backend & API Design', percent: 35, status: 'Missing', variant: 'missing' },
        { name: 'AWS & Cloud Architecture', percent: 80, status: 'Matched', variant: 'matched' },
        { name: 'Docker & Containerization', percent: 55, status: 'Improve', variant: 'improve' }
      ],
      missingSkills: [
        { skill: 'Distributed Caching (Redis/Memcached)', impact: 'Medium Gap' },
        { skill: 'GraphQL Federation Schema Specs', impact: 'Low Gap' }
      ],
      suggestions: [
        { text: 'Add Redis caching metrics to Senior Engineer project bullet.', impact: '+4% Match Score' },
        { text: 'Highlight GraphQL schema federation experience in Skills section.', impact: '+2% Match Score' }
      ]
    };
  }
};
