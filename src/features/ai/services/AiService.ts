import { z } from 'zod';
import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { OpenAIProvider } from '../providers/OpenAiProvider';
import { OpenRouterProvider } from '../providers/OpenRouterProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { MockProvider } from '../providers/MockProvider';
import { withExponentialBackoff } from '../utils';
import { AiOutputParser } from '../parsers';

export interface AiGenerateWithSchemaParams<T> extends AiGenerateParams {
  zodSchema?: z.ZodSchema<T>;
  disallowMockFallback?: boolean;
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

  public resolveProvider(preferredProvider?: AiProviderName, disallowMockFallback = false): AIProvider {
    const configuredProvider: AiProviderName = preferredProvider || this.primaryProviderName;
    const targetProvider = this.providers.get(configuredProvider);

    if (targetProvider && targetProvider.isConfigured()) {
      return targetProvider;
    }

    const fallbackOrder: AiProviderName[] = ['openai', 'openrouter', 'gemini'];
    for (const name of fallbackOrder) {
      const fallback = this.providers.get(name);
      if (fallback && fallback.isConfigured()) {
        console.warn(`[AiService]: Configured provider "${configuredProvider}" not available. Falling back to "${name}".`);
        return fallback;
      }
    }

    if (disallowMockFallback) {
      throw new Error(`AI_ANALYSIS_PROVIDER_ERROR: Production AI Provider (${configuredProvider}) is missing or unconfigured. Real resume analysis requires a live AI provider.`);
    }

    return this.providers.get('mock')!;
  }

  public async generate<T = any>(
    params: AiGenerateWithSchemaParams<T>,
    preferredProvider?: AiProviderName
  ): Promise<AiGenerateResult<T>> {
    const configuredProvider: AiProviderName = preferredProvider || this.primaryProviderName;
    const provider = this.resolveProvider(preferredProvider, params.disallowMockFallback);
    const actualProviderName = provider.providerName;
    const isMock = actualProviderName === 'mock';

    const maxRetries = params.retry?.maxRetries ?? 2;
    const delayMs = params.retry?.delayMs ?? 500;

    console.log(`
[LUMINA AI TRACE]
configuredProvider: ${configuredProvider}
resolvedProvider: ${actualProviderName}
actualProvider: ${actualProviderName}
model: ${params.model || 'gpt-4o-mini'}
isMock: ${isMock}
isFallback: ${configuredProvider !== actualProviderName}
apiKeyConfigured: ${provider.isConfigured()}
requestStarted: true
`.trim());

    if (params.disallowMockFallback && isMock) {
      throw new Error(`AI_ANALYSIS_PROVIDER_ERROR: Production analysis cannot use MockProvider.`);
    }

    return withExponentialBackoff(async () => {
      const result = await provider.generate<T>(params);

      let payloadData = result.data;
      if (typeof payloadData === 'string') {
        try {
          payloadData = AiOutputParser.parseStructuredJson<T>(payloadData);
        } catch (parseErr: any) {
          console.warn('[AiService JSON Parse Warning]:', parseErr?.message || parseErr);
        }
      }

      if (params.zodSchema) {
        const validatedData = AiOutputParser.validateWithZod<T>(payloadData, params.zodSchema);
        console.log(`[LUMINA AI TRACE] requestCompleted: true | zodValidated: true`);
        return {
          ...result,
          data: validatedData
        };
      }

      console.log(`[LUMINA AI TRACE] requestCompleted: true`);
      return {
        ...result,
        data: payloadData
      };
    }, maxRetries, delayMs);
  }
}

export const aiServiceInstance = new AiService();
