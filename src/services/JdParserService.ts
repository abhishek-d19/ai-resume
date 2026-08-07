import { ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { jdParserOutputSchema, JdParserOutput } from '../features/ai/schemas/jd-parser-engine.schema';
import { 
  JD_PARSER_ENGINE_SYSTEM_PROMPT, 
  buildJdParserUserPrompt 
} from '../features/ai/prompts/jd-parser-engine';

export class JdParserService {
  /**
   * Parses raw Job Description text into structured JSON with skill normalization
   */
  public async parseJobDescription(rawJdText: string): Promise<JdParserOutput> {
    if (!rawJdText || rawJdText.trim().length < 10) {
      throw new ValidationError('Valid job description text (minimum 10 characters) is required.');
    }

    // 1. Build User Prompt
    const userPrompt = buildJdParserUserPrompt(rawJdText);

    // 2. Execute AI Request with Zod Schema Validation & Deterministic Temperature
    const aiResult = await aiRequestServiceInstance.execute<JdParserOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: JD_PARSER_ENGINE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: jdParserOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    const rawParsed = aiResult.data;

    // 3. Programmatic Array Deduplication & Skill Normalization
    return {
      ...rawParsed,
      requiredSkills: this.normalizeAndDedupe(rawParsed.requiredSkills),
      preferredSkills: this.normalizeAndDedupe(rawParsed.preferredSkills),
      education: this.normalizeAndDedupe(rawParsed.education),
      certifications: this.normalizeAndDedupe(rawParsed.certifications),
      responsibilities: this.normalizeAndDedupe(rawParsed.responsibilities),
      keywords: this.normalizeAndDedupe(rawParsed.keywords),
      softSkills: this.normalizeAndDedupe(rawParsed.softSkills),
      technicalSkills: this.normalizeAndDedupe(rawParsed.technicalSkills)
    };
  }

  /**
   * Case-insensitive array deduplication and trimming helper
   */
  private normalizeAndDedupe(items: string[]): string[] {
    if (!Array.isArray(items)) return [];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const item of items) {
      if (!item || typeof item !== 'string') continue;
      const trimmed = item.trim();
      const lowerKey = trimmed.toLowerCase();

      if (!seen.has(lowerKey)) {
        seen.add(lowerKey);
        result.push(trimmed);
      }
    }

    return result;
  }
}

export const jdParserServiceInstance = new JdParserService();
