import { AiModelName, AiUsageMetrics } from '../types';
import { AI_MODEL_COST_PER_1K_TOKENS } from '../constants';
import { AiRateLimitError, AiTimeoutError } from '../errors';

/**
 * Estimates token count based on standard ~4 characters per token heuristic
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Calculates USD cost based on token usage metrics and model pricing table
 */
export function calculateCostUsd(model: AiModelName, promptTokens: number, completionTokens: number): number {
  const rates = AI_MODEL_COST_PER_1K_TOKENS[model] || AI_MODEL_COST_PER_1K_TOKENS['gpt-4o-mini'];
  const inputCost = (promptTokens / 1000) * rates.input;
  const outputCost = (completionTokens / 1000) * rates.output;
  return Number((inputCost + outputCost).toFixed(6));
}

/**
 * Resilient Retry Wrapper with Exponential Backoff
 */
export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 500
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt >= maxRetries) {
        throw err;
      }
      
      // Do not retry on permanent validation errors
      if (err.name === 'AiValidationError' || err.name === 'AiSchemaParseError') {
        throw err;
      }

      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[AI Utility Retry Attempt ${attempt}/${maxRetries}]: Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new AiTimeoutError('Max retries exceeded.');
}
