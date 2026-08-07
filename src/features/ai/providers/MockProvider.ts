import { AIProvider, AiProviderName, AiGenerateParams, AiGenerateResult } from '../types';
import { estimateTokenCount, calculateCostUsd } from '../utils';

export class MockProvider implements AIProvider {
  public readonly providerName: AiProviderName = 'mock';

  public isConfigured(): boolean {
    return true;
  }

  public async generate<T = any>(params: AiGenerateParams): Promise<AiGenerateResult<T>> {
    const startTime = Date.now();
    const selectedModel = params.model || 'mock-evaluator';

    // Simulate ~250ms API latency
    await new Promise((resolve) => setTimeout(resolve, 250));

    const rawText = params.response_format === 'json' || params.response_schema
      ? JSON.stringify({
          status: 'success',
          summary: 'Mock Lumina AI generation output',
          score: 95,
          feedback: ['Enrich metric impact density', 'Strong alignment with target role']
        })
      : `Mock LLM Response: Processed completion for prompt -> ${params.prompt.substring(0, 60)}...`;

    const promptTokens = estimateTokenCount(params.prompt + (params.systemPrompt || ''));
    const completionTokens = estimateTokenCount(rawText);
    const totalTokens = promptTokens + completionTokens;

    let parsedData: any = rawText;
    if (params.response_format === 'json') {
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = rawText;
      }
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
      provider: 'mock',
      model: selectedModel,
      latencyMs: Date.now() - startTime
    };
  }
}
