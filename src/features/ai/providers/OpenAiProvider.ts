import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { AiProviderError, AiTimeoutError } from '../errors';
import { estimateTokenCount, calculateCostUsd } from '../utils';
import { AiOutputParser } from '../parsers';

export class OpenAIProvider implements AIProvider {
  public readonly providerName: AiProviderName = 'openai';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel?: string) {
    const processKey = (typeof process !== 'undefined' && process.env) 
      ? (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY) 
      : '';
    const viteKey = (typeof import.meta !== 'undefined' && import.meta.env) 
      ? (import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY) 
      : '';
    
    this.apiKey = apiKey || processKey || viteKey || '';

    const processModel = (typeof process !== 'undefined' && process.env) ? process.env.OPENAI_MODEL : '';
    const viteModel = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_OPENAI_MODEL : '';
    this.defaultModel = defaultModel || processModel || viteModel || 'gpt-4o-mini';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  public getApiKeyStatus(): { configured: boolean; keyLength: number } {
    return {
      configured: this.isConfigured(),
      keyLength: this.apiKey ? this.apiKey.length : 0
    };
  }

  public async generate<T = any>(params: AiGenerateParams): Promise<AiGenerateResult<T>> {
    if (!this.isConfigured()) {
      throw new AiProviderError('AI_ANALYSIS_PROVIDER_ERROR: OpenAI API Key is unconfigured or missing.', 'openai');
    }

    const startTime = Date.now();
    const selectedModel = params.model || this.defaultModel;
    const timeoutMs = params.timeout || 35000;

    console.log(`[LUMINA AI TRACE] Request Started | Provider: OpenAI | Model: ${selectedModel}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const messages: Array<{ role: string; content: string }> = [];
      if (params.systemPrompt) {
        messages.push({ role: 'system', content: params.systemPrompt });
      }
      messages.push({ role: 'user', content: params.prompt });

      const payload: Record<string, any> = {
        model: selectedModel,
        messages,
        temperature: params.temperature ?? 0.1,
        max_tokens: params.max_tokens ?? 4096
      };

      if (params.response_format === 'json') {
        payload.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        const errCode = errorJson.error?.code || '';
        const errMsg = errorJson.error?.message || `HTTP ${res.status}`;

        if (res.status === 429 || errCode === 'insufficient_quota' || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('billing')) {
          throw new AiProviderError('AI_BILLING_LIMIT_REACHED: AI analysis is temporarily unavailable because the AI service has reached its usage limit. Please try again later.', 'openai', 429);
        }
        if (res.status === 429 || errMsg.toLowerCase().includes('rate limit')) {
          throw new AiProviderError('AI_RATE_LIMITED: Too many analysis requests were made. Please wait a moment and try again.', 'openai', 429);
        }

        throw new AiProviderError(`AI_PROVIDER_ERROR: OpenAI request failed (${errMsg})`, 'openai', res.status);
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content || '';

      const promptTokens = data.usage?.prompt_tokens || estimateTokenCount(params.prompt);
      const completionTokens = data.usage?.completion_tokens || estimateTokenCount(rawText);
      const totalTokens = promptTokens + completionTokens;
      const estimatedCostUsd = calculateCostUsd(selectedModel as any, promptTokens, completionTokens);

      let parsedData: any = rawText;
      if (params.response_format === 'json') {
        parsedData = AiOutputParser.parseStructuredJson<T>(rawText);
      }

      console.log(`[LUMINA AI OBSERVABILITY] Tokens: ${totalTokens} (${promptTokens} in / ${completionTokens} out) | Est. Cost: $${estimatedCostUsd.toFixed(6)} | Latency: ${Date.now() - startTime}ms`);

      return {
        success: true,
        data: parsedData,
        rawText,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd
        },
        provider: 'openai',
        model: selectedModel,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new AiTimeoutError(`AI_TIMEOUT: OpenAI completion request timed out after ${timeoutMs}ms.`);
      }
      if (err instanceof AiProviderError) throw err;
      throw new AiProviderError(`AI_PROVIDER_ERROR: ${err.message || 'OpenAI API completion failed.'}`, 'openai');
    }
  }
}
