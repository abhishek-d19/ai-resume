import { BaseAiProvider } from './BaseAiProvider';
import { AiProviderType, AiCompletionRequest, AiCompletionResponse, AiStreamChunk } from '../types';
import { AiProviderError } from '../errors';
import { estimateTokenCount, calculateCostUsd } from '../utils';
import { AiOutputParser } from '../parsers';

export class GeminiAiProvider extends BaseAiProvider {
  public readonly providerType: AiProviderType = 'gemini';
  private apiKey: string;

  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  public async generateCompletion<T = any>(request: AiCompletionRequest): Promise<AiCompletionResponse<T>> {
    if (!this.apiKey) {
      throw new AiProviderError('Gemini API key missing from environment.', 'gemini');
    }

    const startTime = Date.now();
    const model = request.options?.model || 'gemini-1.5-flash';

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      
      const contents = [];
      if (request.options?.systemPrompt) {
        contents.push({ role: 'user', parts: [{ text: `SYSTEM DIRECTIVE:\n${request.options.systemPrompt}` }] });
      }
      contents.push({ role: 'user', parts: [{ text: request.prompt }] });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: request.options?.temperature ?? 0.2,
            maxOutputTokens: request.options?.maxTokens ?? 2048,
            responseMimeType: request.options?.responseFormat === 'json' ? 'application/json' : 'text/plain'
          }
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new AiProviderError(errJson.error?.message || `HTTP ${res.status}`, 'gemini', res.status);
      }

      const data = await res.json();
      const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const promptTokens = estimateTokenCount(request.prompt);
      const completionTokens = estimateTokenCount(rawContent);
      const totalTokens = promptTokens + completionTokens;

      let parsedData: any = rawContent;
      if (request.options?.responseFormat === 'json') {
        parsedData = AiOutputParser.parseStructuredJson<T>(rawContent);
      }

      return {
        success: true,
        data: parsedData,
        rawContent,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd: calculateCostUsd(model, promptTokens, completionTokens)
        },
        model,
        provider: 'gemini',
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      if (err instanceof AiProviderError) throw err;
      throw new AiProviderError(err.message || 'Gemini completion failed', 'gemini');
    }
  }

  public async generateStream(
    request: AiCompletionRequest,
    onChunk: (chunk: AiStreamChunk) => void
  ): Promise<AiCompletionResponse> {
    const completion = await this.generateCompletion(request);
    onChunk({ delta: completion.rawContent, isComplete: true, usage: completion.usage });
    return completion;
  }
}
