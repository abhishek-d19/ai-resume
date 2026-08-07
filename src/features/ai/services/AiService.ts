import { z } from 'zod';
import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { OpenRouterProvider } from '../providers/OpenRouterProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { MockProvider } from '../providers/MockProvider';
import { withExponentialBackoff } from '../utils';
import { AiOutputParser } from '../parsers';

export interface AiGenerateWithSchemaParams<T> extends AiGenerateParams {
  zodSchema?: z.ZodSchema<T>;
}

export class AiService {
  private providers: Map<AiProviderName, AIProvider> = new Map();
  private primaryProviderName: AiProviderName = 'openai';

  constructor(customProviders?: AIProvider[]) {
    if (customProviders && customProviders.length > 0) {
      customProviders.forEach(p => this.registerProvider(p));
    } else {
      this.registerProvider(new OpenAIProvider());
      this.registerProvider(new OpenRouterProvider());
      this.registerProvider(new GeminiProvider());
      this.registerProvider(new MockProvider());
    }
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.providerName, provider);
  }

  public setPrimaryProvider(providerName: AiProviderName): void {
    this.primaryProviderName = providerName;
  }

  private resolveProvider(preferredProvider?: AiProviderName): AIProvider {
    const targetName = preferredProvider || this.primaryProviderName;
    const provider = this.providers.get(targetName);

    if (provider && provider.isConfigured()) {
      return provider;
    }

    const fallbackOrder: AiProviderName[] = ['openai', 'openrouter', 'gemini', 'mock'];
    for (const name of fallbackOrder) {
      const fallback = this.providers.get(name);
      if (fallback && fallback.isConfigured()) {
        console.warn(`[AiService]: Preferred provider "${targetName}" not configured. Falling back to "${name}".`);
        return fallback;
      }
    }

    return this.providers.get('mock')!;
  }

  /**
   * GENERATE WITH ZOD SCHEMA VALIDATION & AUTOMATIC RETRY WORKFLOW
   * Workflow: LLM -> JSON -> Zod Validation -> Valid -> Return | Invalid -> Retry
   */
  public async generate<T = any>(
    params: AiGenerateWithSchemaParams<T>,
    preferredProvider?: AiProviderName
  ): Promise<AiGenerateResult<T>> {
    const provider = this.resolveProvider(preferredProvider);
    const maxRetries = params.retry?.maxRetries ?? 2;
    const delayMs = params.retry?.delayMs ?? 500;

    return withExponentialBackoff(async () => {
      const result = await provider.generate<T>(params);

      // Validate parsed JSON output against Zod Schema if provided
      if (params.zodSchema) {
        const validatedData = AiOutputParser.validateWithZod<T>(result.data, params.zodSchema);
        return {
          ...result,
          data: validatedData
        };
      }

      return result;
    }, maxRetries, delayMs);
  }
}

export const aiServiceInstance = new AiService();
