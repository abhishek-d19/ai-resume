import { ResumeDataSchema } from '../models/types';

export const resumeParserService = {
  /**
   * Parse uploaded file into structured JSON schema
   */
  async parseResumeFile(file) {
    // Simulated parsing delay for pipeline execution
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      parsedJson: {
        candidateName: "Abhishek Sharma",
        title: "Senior Software Engineer",
        contact: "abhishek@example.com • San Francisco, CA",
        summary: "Senior Engineer specializing in design systems, high-throughput micro-frontends, and performance optimization.",
        scores: {
          overallHealth: "Excellent",
          structure: "Excellent",
          keywords: "Needs Work",
          impact: "Strong",
          readability: "Excellent"
        },
        bullets: ResumeDataSchema.bullets
      }
    };
  }
};
