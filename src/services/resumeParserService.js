import { DEMO_CANDIDATE } from '../constants/demoCandidate';

export const resumeParserService = {
  /**
   * Parse uploaded file into structured JSON schema
   */
  async parseResumeFile(file) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      parsedJson: {
        candidateName: DEMO_CANDIDATE.name,
        title: DEMO_CANDIDATE.headline,
        contact: `${DEMO_CANDIDATE.email} • ${DEMO_CANDIDATE.location}`,
        summary: DEMO_CANDIDATE.summary,
        scores: {
          overallHealth: "Excellent",
          structure: "Excellent",
          keywords: "Needs Work",
          impact: "Strong",
          readability: "Excellent"
        },
        bullets: DEMO_CANDIDATE.experience[0].bullets
      }
    };
  }
};
