import { ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  canonicalResumeParserOutputSchema, 
  CanonicalResumeParserOutput 
} from '../features/ai/schemas/resume-parser-engine.schema';
import { 
  RESUME_PARSER_ENGINE_SYSTEM_PROMPT, 
  buildResumeParserUserPrompt 
} from '../features/ai/prompts/resume-parser-engine';

export class ResumeParserService {
  /**
   * Parses raw extracted resume text into Canonical Resume JSON with Zod validation & normalization
   */
  public async parseRawTextToCanonicalJson(
    rawText: string,
    fileName?: string
  ): Promise<CanonicalResumeParserOutput> {
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      throw new ValidationError('rawText is required for resume parsing.');
    }

    const userPrompt = buildResumeParserUserPrompt(rawText.trim(), fileName);

    // 1. AI Execution with Zod Schema Validation & Deterministic Temperature (0.0)
    const aiResult = await aiRequestServiceInstance.execute<CanonicalResumeParserOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: RESUME_PARSER_ENGINE_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: canonicalResumeParserOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    const parsed = aiResult.data;

    // 2. Programmatic Normalization Pass
    return this.normalizeParsedOutput(parsed);
  }

  /**
   * Programmatic Normalization: Clean emails, URLs, phone numbers, and deduplicate skills
   */
  private normalizeParsedOutput(parsed: CanonicalResumeParserOutput): CanonicalResumeParserOutput {
    const p = parsed.personalInfo || {};

    const normalizedPersonalInfo = {
      fullName: p.fullName ? p.fullName.trim() : '',
      email: p.email ? p.email.toLowerCase().trim() : '',
      phone: p.phone ? this.normalizePhoneNumber(p.phone) : '',
      location: p.location ? p.location.trim() : '',
      summary: p.summary ? p.summary.trim() : '',
      website: p.website ? this.normalizeUrl(p.website) : '',
      linkedin: p.linkedin ? this.normalizeUrl(p.linkedin) : ''
    };

    // Deduplicate & normalize skills array case-insensitively
    const rawSkills = Array.isArray(parsed.skills) ? parsed.skills : [];
    const skillMap = new Map<string, string>();
    rawSkills.forEach((s) => {
      if (typeof s === 'string' && s.trim()) {
        const cleaned = s.trim();
        const lowerKey = cleaned.toLowerCase();
        if (!skillMap.has(lowerKey)) {
          skillMap.set(lowerKey, cleaned);
        }
      }
    });

    const normalizedSkills = Array.from(skillMap.values());

    return {
      ...parsed,
      personalInfo: normalizedPersonalInfo,
      summary: parsed.summary ? parsed.summary.trim() : normalizedPersonalInfo.summary,
      skills: normalizedSkills
    };
  }

  private normalizePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone.trim();
  }

  private normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }
}

export const resumeParserServiceInstance = new ResumeParserService();
