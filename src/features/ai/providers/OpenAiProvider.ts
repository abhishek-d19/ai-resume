import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { AiProviderError, AiTimeoutError } from '../errors';
import { estimateTokenCount, calculateCostUsd } from '../utils';
import { AiOutputParser } from '../parsers';

export class OpenAIProvider implements AIProvider {
  public readonly providerName: AiProviderName = 'openai';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gpt-4o-mini') {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env.OPENAI_API_KEY || '' : '');
    this.defaultModel = defaultModel;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  public async generate<T = any>(params: AiGenerateParams): Promise<AiGenerateResult<T>> {
    if (!this.isConfigured()) {
      throw new AiProviderError('OpenAI API Key is missing or unconfigured.', 'openai');
    }

    const startTime = Date.now();
    const selectedModel = params.model || this.defaultModel;
    const timeoutMs = params.timeout || 30000;

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
        temperature: params.temperature ?? 0.2,
        max_tokens: params.max_tokens ?? 2048
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
        throw new AiProviderError(errorJson.error?.message || `HTTP ${res.status}`, 'openai', res.status);
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content || '';

      const promptTokens = data.usage?.prompt_tokens || estimateTokenCount(params.prompt);
      const completionTokens = data.usage?.completion_tokens || estimateTokenCount(rawText);
      const totalTokens = promptTokens + completionTokens;

      let parsedData: any = rawText;
      if (params.response_format === 'json') {
        parsedData = AiOutputParser.parseStructuredJson<T>(rawText);
      }

      return {
        success: true,
        data: parsedData,
        rawText,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd: calculateCostUsd(selectedModel as any, promptTokens, completionTokens)
        },
        provider: 'openai',
        model: selectedModel,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new AiTimeoutError(`OpenAI completion request timed out after ${timeoutMs}ms.`);
      }
      if (err instanceof AiProviderError) throw err;
      throw new AiProviderError(err.message || 'OpenAI API completion failed.', 'openai');
    }
  }
}
