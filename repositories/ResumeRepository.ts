import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClient } from '../lib/supabase/client';

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

  constructor(client: SupabaseClient = supabaseClient) {
    this.client = client;
  }

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
