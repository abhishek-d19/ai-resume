export type AiProviderName = 'openai' | 'openrouter' | 'gemini' | 'mock';

export interface AiRetryConfig {
  maxRetries?: number;
  delayMs?: number;
}

export interface AiGenerateParams {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: 'json' | 'text';
  response_schema?: Record<string, any>;
  timeout?: number;
  retry?: AiRetryConfig;
}

export interface AiUsageReport {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
}

export interface AiGenerateResult<T = any> {
  success: boolean;
  data: T; // Parsed JSON object or raw text response
  rawText: string;
  usage: AiUsageReport;
  provider: AiProviderName;
  model: string;
  latencyMs: number;
}

export interface AIProvider {
  readonly providerName: AiProviderName;
  generate<T = any>(params: AiGenerateParams): Promise<AiGenerateResult<T>>;
  isConfigured(): boolean;
}
