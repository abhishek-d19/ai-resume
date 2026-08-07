import { resumeServiceInstance, ValidationError } from './ResumeService';
import { jdParserServiceInstance } from './JdParserService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { missingSkillsOutputSchema, MissingSkillsOutput } from '../features/ai/schemas/missing-skills-intelligence.schema';
import { 
  MISSING_SKILLS_SYSTEM_PROMPT, 
  buildMissingSkillsUserPrompt 
} from '../features/ai/prompts/missing-skills-intelligence';

export class MissingSkillsService {
  /**
   * Generates Missing Skills Intelligence by comparing Candidate Resume vs Parsed JD
   */
  public async analyzeMissingSkills(
    userId: string,
    resumeId: string,
    rawJdOrParsed: string | Record<string, any>
  ): Promise<MissingSkillsOutput> {
    if (!userId || !resumeId || !rawJdOrParsed) {
      throw new ValidationError('userId, resumeId, and job description are required for missing skills analysis.');
    }

    // 1. Fetch Candidate Resume
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    // 2. Parse Job Description if raw text provided
    let parsedJd: Record<string, any>;
    if (typeof rawJdOrParsed === 'string') {
      parsedJd = await jdParserServiceInstance.parseJobDescription(rawJdOrParsed);
    } else {
      parsedJd = rawJdOrParsed;
    }

    // 3. Build User Prompt
    const userPrompt = buildMissingSkillsUserPrompt({
      title: resume.title,
      parsedJd,
      resumeContent: resume.content || {}
    });

    // 4. Execute AI Request with Zod Schema Validation & Deterministic Temperature
    const aiResult = await aiRequestServiceInstance.execute<MissingSkillsOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: MISSING_SKILLS_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: missingSkillsOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    return aiResult.data;
  }
}

export const missingSkillsServiceInstance = new MissingSkillsService();
