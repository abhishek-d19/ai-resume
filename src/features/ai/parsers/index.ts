import { z } from 'zod';
import { AiSchemaParseError, AiValidationError } from '../errors';
import { resumeAnalysisOutputSchema, ResumeAnalysisOutput } from '../schemas/resume-analysis-engine.schema';

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
   * Normalizes known safe field aliases (e.g. overall_score -> overallScore)
   */
  public static normalizeResumeAnalysisOutput(rawObj: any): any {
    if (!rawObj || typeof rawObj !== 'object') return rawObj;

    const normalized: Record<string, any> = { ...rawObj };

    // Safe alias mapping
    if (rawObj.overall_score !== undefined && rawObj.overallScore === undefined) {
      normalized.overallScore = Number(rawObj.overall_score);
    }
    if (rawObj.ats_score !== undefined && rawObj.atsScore === undefined) {
      normalized.atsScore = Number(rawObj.ats_score);
    }
    if (rawObj.section_scores !== undefined && rawObj.sectionScores === undefined) {
      normalized.sectionScores = rawObj.section_scores;
    }
    if (rawObj.executive_summary !== undefined && rawObj.executiveSummary === undefined) {
      normalized.executiveSummary = String(rawObj.executive_summary);
    }
    if (rawObj.critical_issues !== undefined && rawObj.criticalIssues === undefined) {
      normalized.criticalIssues = rawObj.critical_issues;
    }
    if (rawObj.quick_wins !== undefined && rawObj.quickWins === undefined) {
      normalized.quickWins = rawObj.quick_wins;
    }
    if (rawObj.missing_sections !== undefined && rawObj.missingSections === undefined) {
      normalized.missingSections = rawObj.missing_sections;
    }
    if (rawObj.ats_warnings !== undefined && rawObj.atsWarnings === undefined) {
      normalized.atsWarnings = rawObj.ats_warnings;
    }

    // Ensure array fields default to empty arrays rather than undefined
    ['strengths', 'weaknesses', 'criticalIssues', 'quickWins', 'recommendations', 'missingSections', 'atsWarnings'].forEach(field => {
      if (!Array.isArray(normalized[field])) {
        normalized[field] = [];
      }
    });

    if (typeof normalized.executiveSummary !== 'string') {
      normalized.executiveSummary = 'Candidate evaluation complete.';
    }

    return normalized;
  }

  /**
   * Validates parsed JSON against a Zod Schema with detailed error reporting
   */
  public static validateWithZod<T>(data: unknown, schema: z.ZodSchema<T>): T {
    const normalizedData = (schema === (resumeAnalysisOutputSchema as any)) 
      ? AiOutputParser.normalizeResumeAnalysisOutput(data) 
      : data;

    const result = schema.safeParse(normalizedData);
    if (result.success) {
      return result.data;
    }

    const formattedErrors = result.error.issues
      .map((issue) => `Field '${issue.path.join('.')}': ${issue.message}`)
      .join('\n');

    console.error('[AI_RESPONSE_SCHEMA_ERROR]: Zod validation failed:', formattedErrors);
    throw new AiValidationError(`AI_RESPONSE_SCHEMA_ERROR: Analysis could not be completed because the AI returned an invalid response. Please retry.`);
  }
}
