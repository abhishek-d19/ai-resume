import { IAiProvider, AiProviderType, AiCompletionRequest, AiCompletionResponse, AiStreamChunk } from '../types';

export abstract class BaseAiProvider implements IAiProvider {
  public abstract readonly providerType: AiProviderType;

  public abstract generateCompletion<T = any>(request: AiCompletionRequest): Promise<AiCompletionResponse<T>>;
  
  public abstract generateStream(
    request: AiCompletionRequest, 
    onChunk: (chunk: AiStreamChunk) => void
  ): Promise<AiCompletionResponse>;

  public abstract isAvailable(): Promise<boolean>;
}
