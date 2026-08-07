export class AiBaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = 'AI_BASE_ERROR', statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AiProviderError extends AiBaseError {
  public readonly provider: string;

  constructor(message: string, provider: string, statusCode = 502) {
    super(`[AI Provider Error - ${provider}]: ${message}`, 'AI_PROVIDER_ERROR', statusCode);
    this.provider = provider;
  }
}

export class AiRateLimitError extends AiBaseError {
  public readonly retryAfterMs?: number;

  constructor(message = 'AI provider rate limit exceeded.', retryAfterMs?: number) {
    super(message, 'AI_RATE_LIMIT_ERROR', 429);
    this.retryAfterMs = retryAfterMs;
  }
}

export class AiValidationError extends AiBaseError {
  constructor(message: string) {
    super(message, 'AI_VALIDATION_ERROR', 400);
  }
}

export class AiSchemaParseError extends AiBaseError {
  public readonly rawContent: string;

  constructor(message: string, rawContent: string) {
    super(`Failed to parse AI output schema: ${message}`, 'AI_SCHEMA_PARSE_ERROR', 422);
    this.rawContent = rawContent;
  }
}

export class AiTimeoutError extends AiBaseError {
  constructor(message = 'AI completion request timed out.') {
    super(message, 'AI_TIMEOUT_ERROR', 504);
  }
}
