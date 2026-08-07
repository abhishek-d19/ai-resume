import { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { storageService } from '../services/storageService';
import { resumeParserService } from '../services/resumeParserService';

export function useResumeData(userId = 'mock-user') {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    resumeService.getActiveResume(userId).then((res) => {
      setResumeData(res.data);
      setLoading(false);
    });
  }, [userId]);

  const uploadResume = async (file) => {
    setLoading(true);
    try {
      const storageRes = await storageService.uploadResumeFile(file, userId);
      const parseRes = await resumeParserService.parseResumeFile(file);

      const updated = {
        ...resumeData,
        title: storageRes.fileName,
        fileUrl: storageRes.publicUrl,
        bullets: parseRes.parsedJson.bullets,
        impactScore: 94
      };

      setResumeData(updated);
      setLoading(false);
      return { success: true, data: updated };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const updateBullets = async (newBullets) => {
    const updated = { ...resumeData, bullets: newBullets, impactScore: 94 };
    setResumeData(updated);
    await resumeService.updateResumeBullets(resumeData.id, newBullets);
  };

  return {
    resumeData,
    loading,
    error,
    uploadResume,
    updateBullets
  };
}
