import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { AiProviderError, AiTimeoutError } from '../errors';
import { estimateTokenCount, calculateCostUsd } from '../utils';
import { AiOutputParser } from '../parsers';

export class GeminiProvider implements AIProvider {
  public readonly providerName: AiProviderName = 'gemini';
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'gemini-1.5-flash') {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY || '' : '');
    this.defaultModel = defaultModel;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  public async generate<T = any>(params: AiGenerateParams): Promise<AiGenerateResult<T>> {
    if (!this.isConfigured()) {
      throw new AiProviderError('Gemini API Key is missing or unconfigured.', 'gemini');
    }

    const startTime = Date.now();
    const selectedModel = params.model || this.defaultModel;
    const timeoutMs = params.timeout || 30000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${this.apiKey}`;

      const contents = [];
      if (params.systemPrompt) {
        contents.push({ role: 'user', parts: [{ text: `SYSTEM DIRECTIVE:\n${params.systemPrompt}` }] });
      }
      contents.push({ role: 'user', parts: [{ text: params.prompt }] });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: params.temperature ?? 0.2,
            maxOutputTokens: params.max_tokens ?? 2048,
            responseMimeType: params.response_format === 'json' ? 'application/json' : 'text/plain'
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new AiProviderError(errorJson.error?.message || `HTTP ${res.status}`, 'gemini', res.status);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const promptTokens = estimateTokenCount(params.prompt);
      const completionTokens = estimateTokenCount(rawText);
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
        provider: 'gemini',
        model: selectedModel,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new AiTimeoutError(`Gemini request timed out after ${timeoutMs}ms.`);
      }
      if (err instanceof AiProviderError) throw err;
      throw new AiProviderError(err.message || 'Gemini API completion failed.', 'gemini');
    }
  }
}
