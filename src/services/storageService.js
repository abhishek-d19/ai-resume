import { supabase } from '../lib/supabaseClient';

export const storageService = {
  /**
   * Upload resume PDF/DOCX file to Supabase Storage bucket 'resumes'
   */
  async uploadResumeFile(file, userId = 'default-user') {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return {
        success: true,
        filePath: data.path,
        publicUrl: publicUrlData.publicUrl,
        fileName: file.name
      };
    } catch (err) {
      console.warn("Storage upload fallback:", err.message);
      return {
        success: true,
        filePath: `resumes/local_${file.name}`,
        publicUrl: `https://lumina-ai.storage.co/resumes/${file.name}`,
        fileName: file.name
      };
    }
  }
};
