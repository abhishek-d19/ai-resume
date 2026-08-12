import { aiRequestServiceInstance } from '../features/ai/services/AIRequestService';
import { BASE_SYSTEM_GUARDRAILS } from '../features/ai/prompts/shared';

export class PdfValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfValidationError';
  }
}

export class PdfParserService {
  private static MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

  public validatePdfFile(file: { name: string; size: number; type: string }): void {
    if (!file) {
      throw new PdfValidationError('No file provided for upload.');
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      throw new PdfValidationError('Invalid file format. Only PDF files (.pdf) are supported.');
    }

    if (file.size > PdfParserService.MAX_FILE_SIZE_BYTES) {
      throw new PdfValidationError(`File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB). Please upload a smaller PDF.`);
    }

    if (file.size === 0) {
      throw new PdfValidationError('Uploaded PDF file is empty (0 bytes).');
    }
  }

  public async extractTextAndConvertToCanonicalJson(
    fileBuffer: Buffer | ArrayBuffer,
    fileName: string
  ): Promise<{ canonicalContent: Record<string, any>; extractedText: string }> {
    const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
    
    if (buffer.length < 5) {
      throw new PdfValidationError('Uploaded PDF file is corrupted or empty.');
    }

    const header = buffer.slice(0, 8).toString('ascii');
    if (!header.startsWith('%PDF-')) {
      throw new PdfValidationError('Invalid PDF format. File does not contain a valid PDF structure (%PDF-).');
    }

    let rawText = '';

    try {
      const fileContentStr = buffer.toString('binary');

      if (fileContentStr.includes('/Filter/Standard') && fileContentStr.includes('/Encrypt')) {
        throw new PdfValidationError('This PDF is password-protected. Please upload an unlocked PDF document.');
      }

      const textMatches = fileContentStr.match(/\(([^\(\)]+)\)\s*T[jJ]/g);
      if (textMatches && textMatches.length > 0) {
        rawText = textMatches.map(m => m.replace(/^\(|\)\s*T[jJ]$/g, '')).join(' ');
      } else {
        rawText = fileContentStr.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ').substring(0, 8000);
      }
    } catch (err: any) {
      if (err instanceof PdfValidationError) throw err;
      console.warn('[PdfParserService Stream Extraction Note]:', err?.message);
    }

    rawText = (rawText || '').trim();

    if (rawText.length < 15) {
      throw new PdfValidationError('RESUME_TEXT_EXTRACTION_FAILED: Resume text could not be extracted. Please upload a readable text-based PDF.');
    }

    const fingerprint = simpleHash(rawText);
    const previewStart = rawText.substring(0, 300).replace(/\s+/g, ' ');
    const previewEnd = rawText.substring(Math.max(0, rawText.length - 300)).replace(/\s+/g, ' ');

    console.log(`
[PDF_EXTRACTION_TRACE]
fileName: "${fileName}"
fileSize: ${buffer.length} bytes
extractedTextLength: ${rawText.length}
resumeTextFingerprint: "${fingerprint}"
extractedTextPreviewStart: "${previewStart}"
extractedTextPreviewEnd: "${previewEnd}"
`.trim());

    const canonicalContent = await this.parseTextToCanonicalJson(rawText, fileName);

    return {
      canonicalContent,
      extractedText: rawText
    };
  }

  private async parseTextToCanonicalJson(rawText: string, fileName: string): Promise<Record<string, any>> {
    const candidateName = fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    try {
      const systemPrompt = `
${BASE_SYSTEM_GUARDRAILS}

Task: Convert Raw PDF Extracted Resume Text into Structured Canonical Resume JSON.

STRICT RULES:
- ONLY extract information present in the supplied text.
- Do NOT invent companies, job titles, degrees, skills, certifications, or accomplishments.
- If a section is missing or unmentioned, leave it as an empty array or empty string.

Output JSON Structure:
{
  "personalInfo": {
    "fullName": string,
    "email": string,
    "phone": string,
    "location": string,
    "headline": string
  },
  "summary": string,
  "experience": [
    {
      "id": string,
      "company": string,
      "role": string,
      "startDate": string,
      "endDate": string,
      "location": string,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "id": string,
      "institution": string,
      "degree": string,
      "fieldOfStudy": string,
      "startDate": string,
      "endDate": string
    }
  ],
  "projects": [
    {
      "id": string,
      "name": string,
      "description": string,
      "techStack": string,
      "bullets": string[]
    }
  ],
  "skills": [
    {
      "id": string,
      "category": string,
      "skills": string
    }
  ],
  "certifications": [],
  "achievements": [],
  "languages": [],
  "links": []
}
`.trim();

      const userPrompt = `
File Name: ${fileName}
Raw Extracted Resume Text:
"""
${rawText}
"""

Extract structured canonical resume JSON strictly from the text above.
`.trim();

      const result = await aiRequestServiceInstance.execute<any>({
        params: {
          prompt: userPrompt,
          systemPrompt,
          response_format: 'json',
          temperature: 0.1
        },
        timeoutMs: 25000,
        maxRetries: 2
      });

      if (result.data && typeof result.data === 'object') {
        return this.sanitizeParsedJson(result.data, candidateName);
      }
    } catch (err: any) {
      console.warn('[PdfParserService AI Parser Exception]:', err?.message);
    }

    return this.buildRawTextCanonicalFallback(candidateName, rawText);
  }

  private sanitizeParsedJson(parsed: any, defaultName: string): Record<string, any> {
    const pInfo = parsed.personalInfo || {};
    return {
      personalInfo: {
        fullName: pInfo.fullName || defaultName,
        headline: pInfo.headline || '',
        email: pInfo.email || '',
        phone: pInfo.phone || '',
        location: pInfo.location || ''
      },
      summary: parsed.summary || '',
      experience: Array.isArray(parsed.experience) ? parsed.experience.map((e: any, idx: number) => ({
        id: e.id || `exp-${idx + 1}`,
        company: e.company || '',
        role: e.role || e.title || '',
        startDate: e.startDate || e.period || '',
        endDate: e.endDate || '',
        location: e.location || '',
        bullets: Array.isArray(e.bullets) ? e.bullets.map(String) : []
      })) : [],
      education: Array.isArray(parsed.education) ? parsed.education.map((e: any, idx: number) => ({
        id: e.id || `edu-${idx + 1}`,
        institution: e.institution || e.school || '',
        degree: e.degree || '',
        fieldOfStudy: e.fieldOfStudy || e.field || '',
        startDate: e.startDate || e.year || '',
        endDate: e.endDate || ''
      })) : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects.map((p: any, idx: number) => ({
        id: p.id || `proj-${idx + 1}`,
        name: p.name || p.title || '',
        description: p.description || '',
        techStack: p.techStack || p.link || '',
        bullets: Array.isArray(p.bullets) ? p.bullets.map(String) : []
      })) : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills.map((s: any, idx: number) => {
        if (typeof s === 'string') return { id: `sk-${idx + 1}`, category: 'Technical Skills', skills: s };
        return { id: s.id || `sk-${idx + 1}`, category: s.category || 'Skills', skills: s.skills || s.name || '' };
      }) : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
      links: Array.isArray(parsed.links) ? parsed.links : []
    };
  }

  private buildRawTextCanonicalFallback(candidateName: string, rawText: string): Record<string, any> {
    return {
      personalInfo: {
        fullName: candidateName,
        headline: '',
        email: '',
        phone: '',
        location: ''
      },
      summary: rawText.substring(0, 300),
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      languages: [],
      links: []
    };
  }
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

export const pdfParserServiceInstance = new PdfParserService();
