import { AiModelName } from '../types';

export const AI_DEFAULT_MODEL: AiModelName = 'gpt-4o-mini';

export const AI_MODELS = {
  GPT_4O: 'gpt-4o' as AiModelName,
  GPT_4O_MINI: 'gpt-4o-mini' as AiModelName,
  GEMINI_1_5_PRO: 'gemini-1.5-pro' as AiModelName,
  GEMINI_1_5_FLASH: 'gemini-1.5-flash' as AiModelName,
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet' as AiModelName,
  MOCK_EVALUATOR: 'mock-evaluator' as AiModelName,
};

export const AI_TEMPERATURE_PRESETS = {
  STRICT_ANALYSIS: 0.1,
  BALANCED_REWRITE: 0.3,
  CREATIVE_BRAINSTORM: 0.7,
};

export const AI_TOKEN_LIMITS = {
  DEFAULT_MAX_TOKENS: 2048,
  RESUME_ANALYSIS_MAX_TOKENS: 4096,
  SYSTEM_PROMPT_MAX_TOKENS: 1024,
};

export const AI_MODEL_COST_PER_1K_TOKENS: Record<AiModelName, { input: number; output: number }> = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  'mock-evaluator': { input: 0.0, output: 0.0 },
};

export const AI_DEFAULT_SYSTEM_DIRECTIVE = `
You are Lumina AI — an elite executive hiring evaluator and candidate resume optimization engine.
Analyze inputs with strict precision, factual grounding, and actionable ATS alignment.
Never output fluff or generic advice. Follow JSON schemas strictly when requested.
`.trim();
