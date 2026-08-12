import { resumeServiceInstance, ValidationError } from './ResumeService';
import { resumeRepository } from '../repositories/ResumeRepository';
import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { resumeAnalysisOutputSchema, ResumeAnalysisOutput } from '../features/ai/schemas/resume-analysis-engine.schema';
import { 
  RESUME_ANALYSIS_ENGINE_SYSTEM_PROMPT, 
  buildResumeAnalysisEngineUserPrompt,
  RESUME_ANALYSIS_ENGINE_PROMPT_VERSION 
} from '../features/ai/prompts/resume-analysis-engine';

export class ResumeAnalysisService {
  private static pendingRequests = new Map<string, Promise<{ analysis: ResumeAnalysisOutput; recordId: string }>>();

  /**
   * Executes AI Resume Analysis Engine Pipeline with Single Request Lock & Idempotency
   */
  public async analyzeResume(
    userId: string, 
    resumeId: string, 
    targetRole?: string,
    forceReRun = false
  ): Promise<{ analysis: ResumeAnalysisOutput; recordId: string }> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for analysis.');
    }

    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const content = resume.content || {};

    const lockKey = `analysis:${userId}:${resumeId}:v${resume.version}`;

    // 1. IDEMPOTENCY LOCK: Prevent duplicate simultaneous requests
    if (ResumeAnalysisService.pendingRequests.has(lockKey)) {
      console.log(`[LUMINA AI LOCK] Analysis request already in progress for ${lockKey}. Reusing pending promise.`);
      return ResumeAnalysisService.pendingRequests.get(lockKey)!;
    }

    // 2. REUSE COMPLETED ANALYSIS (Unless forceReRun is true)
    if (!forceReRun) {
      const existingRecord = await resumeRepository.getLatestResumeAnalysis(resumeId);
      if (existingRecord) {
        const analysisData = (existingRecord.analysis_json || existingRecord.analysis_data) as ResumeAnalysisOutput;
        if (analysisData && analysisData.overallScore !== undefined) {
          console.log(`[LUMINA AI IDEMPOTENCY] Reusing existing valid analysis for ${lockKey} without extra API call.`);
          return { analysis: analysisData, recordId: existingRecord.id };
        }
      }
    }

    // 3. LAUNCH NEW SINGLE ATTEMPT WITH UNIQUE ANALYSIS_ATTEMPT_ID
    const analysisAttemptId = crypto.randomUUID();
    const startTime = Date.now();

    const requestPromise = (async () => {
      try {
        const compiledRawText = compileRawTextFromResumeContent(content);
        const textFingerprint = simpleHash(compiledRawText);

        console.log(`
[LUMINA AI TRACE]
analysisAttemptId: ${analysisAttemptId}
resumeId: ${resumeId}
title: ${resume.title}
version: ${resume.version}
extractedTextLength: ${compiledRawText.length}
textFingerprint: ${textFingerprint}
requestStarted: true
`.trim());

        if (compiledRawText.length < 15) {
          throw new ValidationError('RESUME_EXTRACTION_FAILED: Resume text could not be evaluated. Please enter your resume details or upload a readable PDF.');
        }

        const userPrompt = buildResumeAnalysisEngineUserPrompt({
          title: resume.title,
          targetRole,
          rawText: compiledRawText,
          resumeContent: content
        });

        let rawAnalysis: any = null;
        let aiProviderName = 'openai';
        let aiModelName = 'gpt-4o-mini';
        let usageTelemetry: any = null;

        try {
          const aiResult = await aiRequestServiceInstance.execute<ResumeAnalysisOutput>({
            params: {
              prompt: userPrompt,
              systemPrompt: RESUME_ANALYSIS_ENGINE_SYSTEM_PROMPT,
              response_format: 'json',
              zodSchema: resumeAnalysisOutputSchema,
              temperature: 0.1,
              max_tokens: 4096,
              disallowMockFallback: true
            },
            timeoutMs: 35000,
            maxRetries: 1
          });

          rawAnalysis = aiResult.data;
          aiProviderName = aiResult.provider;
          aiModelName = aiResult.model;
          usageTelemetry = aiResult.usage;
        } catch (aiErr: any) {
          console.error('[LUMINA AI TRACE ERROR]:', aiErr?.message || aiErr);
          throw aiErr;
        }

        const sec = rawAnalysis.sectionScores || {};

        const pInfoScore = Math.max(0, Math.min(100, sec.personalInfo ?? 80));
        const summaryScore = Math.max(0, Math.min(100, sec.summary ?? 70));
        const eduScore = Math.max(0, Math.min(100, sec.education ?? 70));
        const expScore = Math.max(0, Math.min(100, sec.experience ?? 75));
        const projScore = Math.max(0, Math.min(100, sec.projects ?? 70));
        const skillsScore = Math.max(0, Math.min(100, sec.skills ?? 75));
        const certScore = Math.max(0, Math.min(100, sec.certifications ?? 60));
        const achScore = Math.max(0, Math.min(100, sec.achievements ?? 60));
        const langScore = Math.max(0, Math.min(100, sec.languages ?? 75));

        const sectionScores = {
          personalInfo: pInfoScore,
          summary: summaryScore,
          education: eduScore,
          experience: expScore,
          projects: projScore,
          skills: skillsScore,
          certifications: certScore,
          achievements: achScore,
          languages: langScore
        };

        const calculatedOverallScore = Math.round(
          pInfoScore * 0.05 +
          summaryScore * 0.10 +
          eduScore * 0.10 +
          expScore * 0.25 +
          projScore * 0.15 +
          skillsScore * 0.15 +
          certScore * 0.05 +
          achScore * 0.05 +
          langScore * 0.05
        );

        const calculatedAtsScore = Math.round(
          skillsScore * 0.35 +
          expScore * 0.35 +
          pInfoScore * 0.15 +
          eduScore * 0.15
        );

        let strengths = Array.isArray(rawAnalysis.strengths) ? rawAnalysis.strengths : [];
        let weaknesses = Array.isArray(rawAnalysis.weaknesses) ? rawAnalysis.weaknesses : [];
        let recommendations = Array.isArray(rawAnalysis.recommendations) ? rawAnalysis.recommendations : [];

        if (expScore === 0) strengths = strengths.filter(s => !/experience|bullet point|career history|employment/i.test(s));
        if (projScore === 0) strengths = strengths.filter(s => !/project|portfolio|deliverable/i.test(s));
        if (skillsScore === 0) strengths = strengths.filter(s => !/skill|technical coverage|competenc/i.test(s));
        if (eduScore === 0) strengths = strengths.filter(s => !/education|academic|degree|university/i.test(s));

        if (strengths.length === 0) {
          if (pInfoScore > 50) strengths.push('Contact information and header details present');
          else strengths.push('Document text parsed successfully');
        }

        const analysisOutput: ResumeAnalysisOutput = {
          ...rawAnalysis,
          overallScore: calculatedOverallScore,
          sectionScores,
          atsScore: calculatedAtsScore,
          strengths,
          weaknesses,
          recommendations
        };

        const latencyMs = Date.now() - startTime;
        console.log(`
[LUMINA AI OBSERVABILITY]
analysisAttemptId: ${analysisAttemptId}
resumeId: ${resumeId}
resumeVersion: ${resume.version}
provider: ${aiProviderName}
model: ${aiModelName}
latencyMs: ${latencyMs}
promptTokens: ${usageTelemetry?.promptTokens || 0}
completionTokens: ${usageTelemetry?.completionTokens || 0}
totalTokens: ${usageTelemetry?.totalTokens || 0}
estimatedCostUsd: $${(usageTelemetry?.estimatedCostUsd || 0).toFixed(6)}
status: completed
`.trim());

        let savedRecord;
        try {
          savedRecord = await resumeRepository.createResumeAnalysis({
            resume_id: resumeId,
            overall_score: analysisOutput.overallScore,
            ats_score: analysisOutput.atsScore,
            analysis_json: analysisOutput,
            executive_summary: analysisOutput.executiveSummary || `Candidate evaluation completed with score ${analysisOutput.overallScore}/100.`,
            provider: aiProviderName,
            model: aiModelName,
            prompt_version: RESUME_ANALYSIS_ENGINE_PROMPT_VERSION
          });
        } catch (dbErr: any) {
          throw new Error(`ANALYSIS_DATABASE_ERROR: ${dbErr?.message || 'Failed to save analysis record.'}`);
        }

        return {
          analysis: analysisOutput,
          recordId: savedRecord.id
        };
      } finally {
        ResumeAnalysisService.pendingRequests.delete(lockKey);
      }
    })();

    ResumeAnalysisService.pendingRequests.set(lockKey, requestPromise);
    return requestPromise;
  }

  public async getLatestAnalysis(userId: string, resumeId: string): Promise<ResumeAnalysisOutput | null> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const savedRecord = await resumeRepository.getLatestResumeAnalysis(resumeId);
    if (!savedRecord) return null;

    return (savedRecord.analysis_json || savedRecord.analysis_data) as ResumeAnalysisOutput;
  }

  public async getAnalysisHistory(userId: string, resumeId: string): Promise<any[]> {
    if (!userId || !resumeId) throw new ValidationError('userId and resumeId are required');

    await resumeServiceInstance.getResumeForUser(userId, resumeId);
    return resumeRepository.getAnalysisHistory(resumeId);
  }
}

function compileRawTextFromResumeContent(content: Record<string, any>): string {
  const parts: string[] = [];

  const p = content.personalInfo || {};
  if (p.fullName) parts.push(p.fullName);
  if (p.headline) parts.push(p.headline);
  if (p.email) parts.push(p.email);
  if (p.phone) parts.push(p.phone);
  if (p.location) parts.push(p.location);

  if (content.summary) parts.push(`PROFESSIONAL SUMMARY:\n${content.summary}`);

  if (Array.isArray(content.experience) && content.experience.length > 0) {
    parts.push('WORK EXPERIENCE:');
    content.experience.forEach((e: any) => {
      parts.push(`${e.role || e.title || ''} ${e.company ? `at ${e.company}` : ''} ${e.startDate || e.period || ''} ${e.location || ''}`);
      if (Array.isArray(e.bullets)) parts.push(e.bullets.join('\n'));
      if (e.description) parts.push(e.description);
    });
  }

  if (Array.isArray(content.education) && content.education.length > 0) {
    parts.push('EDUCATION:');
    content.education.forEach((ed: any) => {
      parts.push(`${ed.degree || ''} ${ed.institution || ed.school || ''} ${ed.startDate || ed.year || ''}`);
    });
  }

  if (Array.isArray(content.projects) && content.projects.length > 0) {
    parts.push('PROJECTS:');
    content.projects.forEach((proj: any) => {
      parts.push(`${proj.name || proj.title || ''} ${proj.techStack ? `(${proj.techStack})` : ''}: ${proj.description || ''}`);
      if (Array.isArray(proj.bullets)) parts.push(proj.bullets.join('\n'));
    });
  }

  if (Array.isArray(content.skills) && content.skills.length > 0) {
    parts.push('TECHNICAL SKILLS:');
    content.skills.forEach((s: any) => {
      if (typeof s === 'string') parts.push(s);
      else if (s && typeof s === 'object') parts.push(`${s.category || ''}: ${s.skills || s.name || ''}`);
    });
  }

  if (Array.isArray(content.certifications) && content.certifications.length > 0) {
    parts.push('CERTIFICATIONS:');
    content.certifications.forEach((c: any) => {
      parts.push(typeof c === 'string' ? c : `${c.name || c.title || ''} ${c.issuer ? `(${c.issuer})` : ''}`);
    });
  }

  return parts.join('\n\n').trim();
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fp-${Math.abs(hash).toString(16)}`;
}

export const resumeAnalysisServiceInstance = new ResumeAnalysisService();
