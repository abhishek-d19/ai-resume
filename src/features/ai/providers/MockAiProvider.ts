import { BaseAiProvider } from './BaseAiProvider';
import { AiProviderType, AiCompletionRequest, AiCompletionResponse, AiStreamChunk } from '../types';
import { estimateTokenCount, calculateCostUsd } from '../utils';

export class MockAiProvider extends BaseAiProvider {
  public readonly providerType: AiProviderType = 'mock';

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async generateCompletion<T = any>(request: AiCompletionRequest): Promise<AiCompletionResponse<T>> {
    const startTime = Date.now();
    const model = request.options?.model || 'mock-evaluator';
    
    // Simulate ~300ms model inference latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const mockText = typeof request.options?.responseSchema === 'object'
      ? JSON.stringify({
          status: 'success',
          summary: 'Mock Lumina AI evaluation score ready.',
          score: 92,
          recommendations: ['Enrich metric impact statements', 'Align TypeScript keywords']
        })
      : `Lumina AI Mock Response: Completed analysis for prompt -> ${request.prompt.substring(0, 50)}...`;

    const promptTokens = estimateTokenCount(request.prompt + (request.options?.systemPrompt || ''));
    const completionTokens = estimateTokenCount(mockText);
    const totalTokens = promptTokens + completionTokens;

    let parsedData: any = mockText;
    if (request.options?.responseFormat === 'json') {
      try {
        parsedData = JSON.parse(mockText);
      } catch {
        parsedData = mockText;
      }
    }

    return {
      success: true,
      data: parsedData,
      rawContent: mockText,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd: calculateCostUsd(model, promptTokens, completionTokens)
      },
      model,
      provider: 'mock',
      executionTimeMs: Date.now() - startTime
    };
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
