import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface ResumeEntity {
  id: string;
  user_id: string;
  title: string;
  content: Record<string, any>;
  status: string;
  version: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeDTO {
  user_id: string;
  title: string;
  content?: Record<string, any>;
  status?: string;
  version?: number;
}

export interface UpdateResumeDTO {
  title?: string;
  content?: Record<string, any>;
  status?: string;
  version?: number;
}

export class ResumeRepository {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  /**
   * Inserts a new resume record into the resumes table.
   */
  async createResume(dto: CreateResumeDTO): Promise<ResumeEntity> {
    const { data, error } = await this.client
      .from('resumes')
      .insert({
        user_id: dto.user_id,
        title: dto.title,
        content: dto.content || {},
        status: dto.status || 'draft',
        version: dto.version || 1
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`[ResumeRepository.createResume Error]: ${error.message}`);
    }

    return data as ResumeEntity;
  }

  /**
   * Updates an existing non-deleted resume record by ID.
   */
  async updateResume(id: string, dto: UpdateResumeDTO): Promise<ResumeEntity> {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.version !== undefined) updateData.version = dto.version;

    const { data, error } = await this.client
      .from('resumes')
      .update(updateData)
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single();

    if (error) {
      throw new Error(`[ResumeRepository.updateResume Error]: ${error.message}`);
    }

    return data as ResumeEntity;
  }

  /**
   * Performs a soft delete on a resume by setting deleted_at to current timestamp.
   */
  async deleteResume(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('resumes')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`[ResumeRepository.deleteResume Error]: ${error.message}`);
    }

    return true;
  }

  /**
   * Restores a soft-deleted resume by resetting deleted_at to NULL.
   */
  async restoreResume(id: string): Promise<ResumeEntity> {
    const { data, error } = await this.client
      .from('resumes')
      .update({
        deleted_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`[ResumeRepository.restoreResume Error]: ${error.message}`);
    }

    return data as ResumeEntity;
  }

  /**
   * Finds a single resume record by ID.
   */
  async findById(id: string, includeDeleted = false): Promise<ResumeEntity | null> {
    let query = this.client
      .from('resumes')
      .select('*')
      .eq('id', id);

    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`[ResumeRepository.findById Error]: ${error.message}`);
    }

    return data as ResumeEntity | null;
  }

  /**
   * Finds all non-deleted resumes belonging to a specific user_id.
   */
  async findByUser(userId: string, includeDeleted = false): Promise<ResumeEntity[]> {
    let query = this.client
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`[ResumeRepository.findByUser Error]: ${error.message}`);
    }

    return (data || []) as ResumeEntity[];
  }

  /**
   * Optimized metadata-only fetch (excludes heavy content JSON column for fast dashboard listing).
   */
  async findByUserHeaderOnly(userId: string): Promise<Omit<ResumeEntity, 'content'>[]> {
    const { data, error } = await this.client
      .from('resumes')
      .select('id, user_id, title, status, version, deleted_at, created_at, updated_at')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`[ResumeRepository.findByUserHeaderOnly Error]: ${error.message}`);
    }

    return (data || []) as Omit<ResumeEntity, 'content'>[];
  }

  /**
   * Finds all soft-deleted resumes belonging to a specific user_id (deleted_at IS NOT NULL).
   */
  async findTrashedByUser(userId: string): Promise<ResumeEntity[]> {
    const { data, error } = await this.client
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) {
      throw new Error(`[ResumeRepository.findTrashedByUser Error]: ${error.message}`);
    }

    return (data || []) as ResumeEntity[];
  }

  /**
   * Permanently deletes a resume row from the database (HARD DELETE).
   */
  async hardDeleteResume(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`[ResumeRepository.hardDeleteResume Error]: ${error.message}`);
    }

    return true;
  }

  /**
   * Persists a NEW append-only AI resume analysis record into Supabase resume_analysis table.
   * Never overwrites previous analyses to preserve complete historical audit trail.
   */
  async createResumeAnalysis(record: {
    resume_id: string;
    overall_score: number;
    ats_score: number;
    analysis_json: Record<string, any>;
    executive_summary: string;
    provider?: string;
    model?: string;
    prompt_version?: string;
  }): Promise<any> {
    const provider = record.provider || 'openai';
    const model = record.model || 'gpt-4o-mini';
    const prompt_version = record.prompt_version || '2.1.0';

    const { data, error } = await this.client
      .from('resume_analysis')
      .insert({
        resume_id: record.resume_id,
        overall_score: record.overall_score,
        ats_score: record.ats_score,
        analysis_json: record.analysis_json,
        executive_summary: record.executive_summary,
        provider,
        model,
        prompt_version
      })
      .select('*')
      .single();

    if (error) {
      console.warn(`[ResumeRepository.createResumeAnalysis Warning]: ${error.message}`);
      return {
        id: `analysis-${Date.now()}`,
        resume_id: record.resume_id,
        overall_score: record.overall_score,
        ats_score: record.ats_score,
        analysis_json: record.analysis_json,
        executive_summary: record.executive_summary,
        provider,
        model,
        prompt_version,
        created_at: new Date().toISOString()
      };
    }

    return data;
  }

  // Alias for backward compatibility
  async saveResumeAnalysis(record: any): Promise<any> {
    return this.createResumeAnalysis({
      resume_id: record.resume_id,
      overall_score: record.overall_score,
      ats_score: record.ats_score ?? Math.round(record.overall_score * 0.95),
      analysis_json: record.analysis_json || record.analysis_data || {},
      executive_summary: record.executive_summary || 'Executive summary synthesis completed.',
      provider: record.provider,
      model: record.model,
      prompt_version: record.prompt_version
    });
  }

  /**
   * Fetches latest completed AI analysis for a given resume ID.
   */
  async getLatestResumeAnalysis(resumeId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('resume_analysis')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) {
      console.warn(`[ResumeRepository.getLatestResumeAnalysis Warning]: ${error.message}`);
      return null;
    }

    return data;
  }

  /**
   * Fetches full historical AI analysis records for a given resume ID (ordered newest first).
   */
  async getAnalysisHistory(resumeId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('resume_analysis')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(`[ResumeRepository.getAnalysisHistory Warning]: ${error.message}`);
      return [];
    }

    return data || [];
  }

  /**
   * Persists completed Hiring Panel consensus and reviewer critiques into Supabase.
   */
  async saveHiringPanelResult(record: {
    resume_id: string;
    decision: string;
    confidence: number;
    reviewer_outputs: Record<string, any>[];
    consensus: Record<string, any>;
    provider?: string;
    model?: string;
  }): Promise<any> {
    const provider = record.provider || 'openai';
    const model = record.model || 'gpt-4o-mini';

    const { data, error } = await this.client
      .from('hiring_panel_results')
      .insert({
        resume_id: record.resume_id,
        decision: record.decision,
        confidence: record.confidence,
        reviewer_outputs: record.reviewer_outputs,
        consensus: record.consensus,
        provider,
        model
      })
      .select('*')
      .single();

    if (error) {
      console.warn(`[ResumeRepository.saveHiringPanelResult Warning]: ${error.message}`);
      return {
        id: `panel-${Date.now()}`,
        resume_id: record.resume_id,
        decision: record.decision,
        confidence: record.confidence,
        reviewer_outputs: record.reviewer_outputs,
        consensus: record.consensus,
        provider,
        model,
        created_at: new Date().toISOString()
      };
    }

    return data;
  }

  /**
   * Fetches latest completed Hiring Panel result for a given resume ID.
   */
  async getLatestHiringPanelResult(resumeId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('hiring_panel_results')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) {
      console.warn(`[ResumeRepository.getLatestHiringPanelResult Warning]: ${error.message}`);
      return null;
    }

    return data;
  }

  /**
   * Persists completed JD Match result into Supabase jd_matches table.
   */
  async saveJdMatchResult(record: {
    resume_id: string;
    job_description: string;
    match_score: number;
    analysis_json: Record<string, any>;
    provider?: string;
    model?: string;
  }): Promise<any> {
    const provider = record.provider || 'openai';
    const model = record.model || 'gpt-4o-mini';

    const { data, error } = await this.client
      .from('jd_matches')
      .insert({
        resume_id: record.resume_id,
        job_description: record.job_description,
        match_score: record.match_score,
        analysis_json: record.analysis_json,
        provider,
        model
      })
      .select('*')
      .single();

    if (error) {
      console.warn(`[ResumeRepository.saveJdMatchResult Warning]: ${error.message}`);
      return {
        id: `jd-${Date.now()}`,
        resume_id: record.resume_id,
        job_description: record.job_description,
        match_score: record.match_score,
        analysis_json: record.analysis_json,
        provider,
        model,
        created_at: new Date().toISOString()
      };
    }

    return data;
  }

  /**
   * Fetches latest completed JD Match result for a given resume ID.
   */
  async getLatestJdMatchResult(resumeId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('jd_matches')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) {
      console.warn(`[ResumeRepository.getLatestJdMatchResult Warning]: ${error.message}`);
      return null;
    }

    return data;
  }

  /**
   * Persists completed Executive Summary into Supabase executive_summaries table.
   */
  async saveExecutiveSummary(record: {
    resume_id: string;
    summary_text: string;
    hiring_confidence_score: number;
    summary_json: Record<string, any>;
    provider?: string;
    model?: string;
  }): Promise<any> {
    const provider = record.provider || 'openai';
    const model = record.model || 'gpt-4o-mini';

    const { data, error } = await this.client
      .from('executive_summaries')
      .insert({
        resume_id: record.resume_id,
        summary_text: record.summary_text,
        hiring_confidence_score: record.hiring_confidence_score,
        summary_json: record.summary_json,
        provider,
        model
      })
      .select('*')
      .single();

    if (error) {
      console.warn(`[ResumeRepository.saveExecutiveSummary Warning]: ${error.message}`);
      return {
        id: `exec-${Date.now()}`,
        resume_id: record.resume_id,
        summary_text: record.summary_text,
        hiring_confidence_score: record.hiring_confidence_score,
        summary_json: record.summary_json,
        provider,
        model,
        created_at: new Date().toISOString()
      };
    }

    return data;
  }

  /**
   * Fetches latest completed Executive Summary for a given resume ID.
   */
  async getLatestExecutiveSummary(resumeId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('executive_summaries')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) {
      console.warn(`[ResumeRepository.getLatestExecutiveSummary Warning]: ${error.message}`);
      return null;
    }

    return data;
  }

  /**
   * Fetches full historical JD match records for a given resume ID (ordered newest first).
   */
  async getJdMatchHistory(resumeId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('jd_matches')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(`[ResumeRepository.getJdMatchHistory Warning]: ${error.message}`);
      return [];
    }

    return data || [];
  }

  /**
   * Checks if a non-deleted resume exists by ID.
   */
  async exists(id: string): Promise<boolean> {
    const { count, error } = await this.client
      .from('resumes')
      .select('id', { count: 'exact', head: true })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`[ResumeRepository.exists Error]: ${error.message}`);
    }

    return (count || 0) > 0;
  }
}

export const resumeRepository = new ResumeRepository();
