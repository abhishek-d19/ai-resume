import { supabase } from '../lib/supabaseClient';

export const storageService = {
  /**
   * Upload resume PDF file to Supabase Storage bucket 'resumes'
   * Structure: resumes/{user_id}/{resume_id}/original.pdf
   */
  async uploadResumeFile(file, userId, resumeId = crypto.randomUUID()) {
    if (!userId) {
      throw new Error('Authenticated userId is required for storage upload.');
    }

    try {
      const filePath = `${userId}/${resumeId}/original.pdf`;

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { 
          upsert: true,
          contentType: 'application/pdf'
        });

      if (error) {
        console.error('[Supabase Storage Error]:', error.message);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return {
        success: true,
        filePath: data.path,
        publicUrl: publicUrlData?.publicUrl || '',
        fileName: file.name
      };
    } catch (err) {
      console.error('[storageService Upload Exception]:', err.message);
      return {
        success: false,
        error: err.message,
        filePath: `${userId}/${resumeId}/original.pdf`,
        publicUrl: '',
        fileName: file.name
      };
    }
  }
};
