import { z } from 'zod';
import { AiGenerateWithSchemaParams, aiServiceInstance, AiService } from './AiService';
import { AiCacheService } from './AiCacheService';
import { AiGenerateResult, AiProviderName } from '../types';
import { 
  AiBaseError, 
  AiTimeoutError, 
  AiRateLimitError, 
  AiValidationError, 
  AiSchemaParseError, 
  AiProviderError 
} from '../errors';

export interface AIExecuteOptions<T> {
  params: AiGenerateWithSchemaParams<T>;
  provider?: AiProviderName;
  signal?: AbortSignal;
  timeoutMs?: number;
  maxRetries?: number;
  initialDelayMs?: number;
}

export class AIRequestService {
  private service: AiService;

  constructor(service: AiService = aiServiceInstance) {
    this.service = service;
  }

  /**
   * Primary Execution Handler with Timeout, Exponential Backoff, Rate-Limit Retries & Cancellation
   */
  public async execute<T = any>(options: AIExecuteOptions<T>): Promise<AiGenerateResult<T>> {
    const {
      params,
      provider,
      signal,
      timeoutMs = 30000,
      maxRetries = 3,
      initialDelayMs = 500
    } = options;

    const cacheKey = AiCacheService.generateKey(params.prompt, {
      systemPrompt: params.systemPrompt,
      model: params.model,
      provider
    });

    // Return cached result instantly if present
    const cachedData = AiCacheService.get<AiGenerateResult<T>>(cacheKey);
    if (cachedData) {
      return {
        ...cachedData,
        latencyMs: 5 // Perceived instant latency for cached requests
      };
    }

    let attempt = 0;

    while (attempt < maxRetries) {
      // 1. Check client cancellation signal before initiating attempt
      if (signal?.aborted) {
        throw new AiTimeoutError('AI Request was cancelled by client.');
      }

      attempt++;
      const controller = new AbortController();

      // Combine client cancellation signal if present
      let signalListener: (() => void) | undefined;
      if (signal) {
        signalListener = () => controller.abort();
        signal.addEventListener('abort', signalListener);
      }

      // Configure timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      try {
        const enrichedParams: AiGenerateWithSchemaParams<T> = {
          ...params,
          timeout: timeoutMs
        };

        const result = await this.service.generate<T>(enrichedParams, provider);

        clearTimeout(timeoutId);
        if (signalListener && signal) {
          signal.removeEventListener('abort', signalListener);
        }

        // Cache successful response
        AiCacheService.set(cacheKey, result);

        return result;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (signalListener && signal) {
          signal.removeEventListener('abort', signalListener);
        }

        const isLastAttempt = attempt >= maxRetries;

        // Handle AbortSignal cancellation
        if (err.name === 'AbortError' || signal?.aborted) {
          throw new AiTimeoutError(`AI Request aborted or timed out after ${timeoutMs}ms.`);
        }

        console.warn(`[AIRequestService Attempt ${attempt}/${maxRetries} Failed]: ${err.message}`);

        // If permanent non-retryable error on last attempt, throw structured exception
        if (isLastAttempt) {
          if (err instanceof AiBaseError) {
            throw err;
          }
          throw new AiProviderError(err.message || 'AI request execution failed.', provider || 'openai');
        }

        // Exponential backoff delay calculation
        let delayMs = initialDelayMs * Math.pow(2, attempt - 1);

        // Respect rate limit Retry-After header if present
        if (err instanceof AiRateLimitError && err.retryAfterMs) {
          delayMs = err.retryAfterMs;
        }

        // Delay execution before next attempt
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new AiTimeoutError(`AI Request failed after ${maxRetries} execution retries.`);
  }
}

export const aiRequestServiceInstance = new AIRequestService();
