export * from './resume-analysis.schema';
export * from './resume-analysis-engine.schema';
export * from './ats-analysis-engine.schema';
export * from './ats-keyword-optimization.schema';
export * from './executive-summary.schema';
export * from './jd-match.schema';
export * from './jd-match-engine.schema';
export * from './jd-parser-engine.schema';
export * from './missing-skills-intelligence.schema';
export * from './hiring-panel.schema';
export * from './hiring-panel-engine.schema';
export * from './hiring-committee-engine.schema';
export * from './hiring-committee-consensus.schema';
export * from './interview-question-generation.schema';
export * from './resume-improvement-engine.schema';
export * from './resume-rewrite.schema';
export * from './resume-parser-engine.schema';
export * from './resume-normalization.schema';

export interface AiSchemaDefinition {
  name: string;
  description: string;
  jsonSchema: Record<string, any>;
}

export class SchemaRegistry {
  private static schemas: Map<string, AiSchemaDefinition> = new Map();

  public static register(schema: AiSchemaDefinition): void {
    this.schemas.set(schema.name, schema);
  }

  public static get(name: string): AiSchemaDefinition | undefined {
    return this.schemas.get(name);
  }

  public static has(name: string): boolean {
    return this.schemas.has(name);
  }
}
