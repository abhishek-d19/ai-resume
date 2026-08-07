import { z } from 'zod';
import { AiSchemaParseError, AiValidationError } from '../errors';

export class AiOutputParser {
  /**
   * Cleans and parses JSON markdown blocks or raw JSON strings
   */
  public static parseStructuredJson<T = any>(rawContent: string): T {
    if (!rawContent || typeof rawContent !== 'string') {
      throw new AiSchemaParseError('Raw completion content is empty.', rawContent || '');
    }

    try {
      return JSON.parse(rawContent.trim());
    } catch {
      const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
      const match = rawContent.match(jsonBlockRegex);

      if (match && match[1]) {
        try {
          return JSON.parse(match[1].trim());
        } catch (innerErr: any) {
          throw new AiSchemaParseError(`Failed to parse extracted JSON block: ${innerErr.message}`, rawContent);
        }
      }

      const curlyMatch = rawContent.match(/\{[\s\S]*\}/);
      if (curlyMatch) {
        try {
          return JSON.parse(curlyMatch[0]);
        } catch (curlyErr: any) {
          throw new AiSchemaParseError(`Failed to parse regex matched JSON object: ${curlyErr.message}`, rawContent);
        }
      }

      throw new AiSchemaParseError('No valid JSON structure found in AI response text.', rawContent);
    }
  }

  /**
   * Validates parsed JSON against a Zod Schema with detailed error reporting
   */
  public static validateWithZod<T>(data: unknown, schema: z.ZodSchema<T>): T {
    const result = schema.safeParse(data);
    if (result.success) {
      return result.data;
    }

    const formattedErrors = result.error.issues
      .map((issue) => `Field '${issue.path.join('.')}': ${issue.message}`)
      .join('; ');

    throw new AiValidationError(`Zod AI Schema Validation Failed -> ${formattedErrors}`);
  }
}
