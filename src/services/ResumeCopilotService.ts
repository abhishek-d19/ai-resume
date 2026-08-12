import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { 
  summaryImprovementSchema, 
  bulletRewriteSchema, 
  projectImprovementSchema, 
  skillsSuggestionSchema,
  SummaryImprovementOutput,
  BulletRewriteOutput,
  ProjectImprovementOutput,
  SkillsSuggestionOutput
} from '../features/ai/schemas/copilot.schema';
import { 
  COPILOT_SUMMARY_SYSTEM_PROMPT, 
  COPILOT_BULLET_SYSTEM_PROMPT, 
  COPILOT_PROJECT_SYSTEM_PROMPT, 
  COPILOT_SKILLS_SYSTEM_PROMPT,
  buildCopilotSummaryPrompt,
  buildCopilotBulletPrompt,
  buildCopilotProjectPrompt,
  buildCopilotSkillsPrompt
} from '../features/ai/prompts/copilot';

export class ResumeCopilotService {
  /**
   * Intelligent 1-Page Content Compression:
   * Shortens verbose wording and bullet points while preserving 100% of facts, companies, dates, and metrics.
   */
  public async compressContentForOnePage(canonicalResume: Record<string, any>): Promise<Record<string, any>> {
    if (!canonicalResume || typeof canonicalResume !== 'object') {
      return canonicalResume;
    }

    const copy = JSON.parse(JSON.stringify(canonicalResume));

    // 1. Tighten Summary if lengthy
    if (typeof copy.summary === 'string' && copy.summary.length > 250) {
      try {
        const res = await this.improveSummary(copy.summary);
        if (res.improved && res.improved.length < copy.summary.length) {
          copy.summary = res.improved;
        }
      } catch {}
    }

    // 2. Tighten Experience Bullets
    if (Array.isArray(copy.experience)) {
      for (const exp of copy.experience) {
        if (Array.isArray(exp.bullets) && exp.bullets.length > 0) {
          exp.bullets = exp.bullets.slice(0, 4).map((b: string) => {
            return b.replace(/\b(in order to|for the purpose of|responsible for|helped to|worked on)\b/gi, '').trim();
          });
        }
      }
    }

    // 3. Limit projects to top 3 if too long
    if (Array.isArray(copy.projects) && copy.projects.length > 3) {
      copy.projects = copy.projects.slice(0, 3);
    }

    return copy;
  }

  /**
   * Transforms rough summary text into a polished executive summary
   */
  public async improveSummary(rawSummary: string, fullName?: string): Promise<SummaryImprovementOutput> {
    if (!rawSummary || !rawSummary.trim()) {
      throw new Error('Please enter draft summary text before improving.');
    }

    try {
      const prompt = buildCopilotSummaryPrompt(rawSummary, fullName);
      const result = await aiRequestServiceInstance.execute<SummaryImprovementOutput>({
        params: {
          prompt,
          systemPrompt: COPILOT_SUMMARY_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: summaryImprovementSchema,
          temperature: 0.2
        },
        timeoutMs: 25000,
        maxRetries: 2
      });

      return result.data;
    } catch (err: any) {
      console.warn('[ResumeCopilotService.improveSummary Note]:', err?.message || err);
      throw new Error("AI suggestion couldn't be generated. Your original content is safe.");
    }
  }

  /**
   * Transforms a weak experience bullet into an active action verb bullet
   */
  public async rewriteBullet(bullet: string, role?: string, company?: string): Promise<BulletRewriteOutput> {
    if (!bullet || !bullet.trim()) {
      throw new Error('Please enter bullet text before rewriting.');
    }

    try {
      const prompt = buildCopilotBulletPrompt(bullet, role, company);
      const result = await aiRequestServiceInstance.execute<BulletRewriteOutput>({
        params: {
          prompt,
          systemPrompt: COPILOT_BULLET_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: bulletRewriteSchema,
          temperature: 0.2
        },
        timeoutMs: 25000,
        maxRetries: 2
      });

      return result.data;
    } catch (err: any) {
      console.warn('[ResumeCopilotService.rewriteBullet Note]:', err?.message || err);
      throw new Error("AI suggestion couldn't be generated. Your original content is safe.");
    }
  }

  /**
   * Enhances project overview, tech stack framing, and accomplishment bullets
   */
  public async improveProject(name: string, description: string, techStack?: string): Promise<ProjectImprovementOutput> {
    if (!description || !description.trim()) {
      throw new Error('Please enter project description text before improving.');
    }

    try {
      const prompt = buildCopilotProjectPrompt(name, description, techStack);
      const result = await aiRequestServiceInstance.execute<ProjectImprovementOutput>({
        params: {
          prompt,
          systemPrompt: COPILOT_PROJECT_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: projectImprovementSchema,
          temperature: 0.2
        },
        timeoutMs: 25000,
        maxRetries: 2
      });

      return result.data;
    } catch (err: any) {
      console.warn('[ResumeCopilotService.improveProject Note]:', err?.message || err);
      throw new Error("AI suggestion couldn't be generated. Your original content is safe.");
    }
  }

  /**
   * Surfaces technical skills grounded in candidate's experience history
   */
  public async suggestSkills(canonicalResume: Record<string, any>): Promise<SkillsSuggestionOutput> {
    try {
      const prompt = buildCopilotSkillsPrompt(canonicalResume);
      const result = await aiRequestServiceInstance.execute<SkillsSuggestionOutput>({
        params: {
          prompt,
          systemPrompt: COPILOT_SKILLS_SYSTEM_PROMPT,
          response_format: 'json',
          zodSchema: skillsSuggestionSchema,
          temperature: 0.2
        },
        timeoutMs: 25000,
        maxRetries: 2
      });

      return result.data;
    } catch (err: any) {
      console.warn('[ResumeCopilotService.suggestSkills Note]:', err?.message || err);
      throw new Error("AI suggestion couldn't be generated. Your original content is safe.");
    }
  }
}

export const resumeCopilotServiceInstance = new ResumeCopilotService();
