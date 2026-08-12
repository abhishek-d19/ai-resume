import { ValidationError } from './ResumeService';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  canonicalResumeNormalizationOutputSchema, 
  CanonicalResumeNormalizationOutput 
} from '../features/ai/schemas/resume-normalization.schema';
import { 
  RESUME_NORMALIZATION_SYSTEM_PROMPT, 
  buildResumeNormalizationUserPrompt 
} from '../features/ai/prompts/resume-normalization';

export class ResumeNormalizationService {
  /**
   * Normalizes raw extracted text into clean Canonical Resume JSON with Zod validation
   */
  public async normalizeRawText(
    rawText: string,
    title?: string
  ): Promise<CanonicalResumeNormalizationOutput> {
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      throw new ValidationError('rawText is required for resume normalization.');
    }

    const userPrompt = buildResumeNormalizationUserPrompt(rawText.trim(), title);

    // 1. AI Execution with Zod Schema Validation & Deterministic Temperature (0.0)
    const aiResult = await aiRequestServiceInstance.execute<CanonicalResumeNormalizationOutput>({
      params: {
        prompt: userPrompt,
        systemPrompt: RESUME_NORMALIZATION_SYSTEM_PROMPT,
        response_format: 'json',
        zodSchema: canonicalResumeNormalizationOutputSchema,
        temperature: 0.0 // Deterministic
      },
      timeoutMs: 30000,
      maxRetries: 3
    });

    // 2. Programmatic Sanitization Pass
    return this.sanitizeNormalizedOutput(aiResult.data);
  }

  /**
   * Programmatic Sanitization Pass: Clean orphaned bullets, trim whitespace, deduplicate skills
   */
  private sanitizeNormalizedOutput(data: CanonicalResumeNormalizationOutput): CanonicalResumeNormalizationOutput {
    // Sanitize experience bullets
    const cleanExperience = (data.experience || []).map(exp => ({
      ...exp,
      company: exp.company ? exp.company.trim() : '',
      role: exp.role ? exp.role.trim() : '',
      bullets: (exp.bullets || []).map(b => b.replace(/^[\s•\-\*]+/, '').trim()).filter(Boolean)
    }));

    // Deduplicate skills case-insensitively
    const skillMap = new Map<string, string>();
    (data.skills || []).forEach(s => {
      if (typeof s === 'string' && s.trim()) {
        const cleaned = s.trim();
        const lowerKey = cleaned.toLowerCase();
        if (!skillMap.has(lowerKey)) {
          skillMap.set(lowerKey, cleaned);
        }
      }
    });

    return {
      ...data,
      experience: cleanExperience,
      skills: Array.from(skillMap.values())
    };
  }
}

export const resumeNormalizationServiceInstance = new ResumeNormalizationService();
