import { jsPDF } from 'jspdf';
import { resumeServiceInstance } from '../../../services/ResumeService';

export interface PersonalInfoData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface EducationItem {
  institution?: string;
  school?: string;
  degree?: string;
  field?: string;
  year?: string;
  dates?: string;
  gpa?: string;
  location?: string;
}

export interface ExperienceItem {
  company?: string;
  role?: string;
  title?: string;
  dates?: string;
  duration?: string;
  location?: string;
  bulletPoints?: string[];
  bullets?: string[];
  description?: string;
}

export interface ProjectItem {
  name?: string;
  title?: string;
  description?: string;
  technologies?: string;
  link?: string;
}

export interface SkillCategoryItem {
  category?: string;
  skills?: string[];
  name?: string;
}

export interface CertificationItem {
  name?: string;
  title?: string;
  issuer?: string;
  date?: string;
}

export interface AchievementItem {
  title?: string;
  description?: string;
}

export interface LanguageItem {
  language?: string;
  proficiency?: string;
}

export interface LinkItem {
  label?: string;
  url?: string;
}

export interface CanonicalResumeData {
  personalInfo?: PersonalInfoData;
  summary?: string;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  skills?: (SkillCategoryItem | string)[];
  certifications?: (CertificationItem | string)[];
  achievements?: (AchievementItem | string)[];
  languages?: (LanguageItem | string)[];
  links?: LinkItem[];
}

export interface ExportPdfOptions {
  template?: 'executive' | 'modern' | 'classic' | 'minimalist';
  paperSize?: 'a4' | 'letter';
  title?: string;
  version?: number;
}

export class ResumeExportService {
  /**
   * Generates an ATS-safe, multi-page vector PDF Blob from canonical resume data
   */
  public async generateResumePdfBlob(
    data: CanonicalResumeData,
    options: ExportPdfOptions = {}
  ): Promise<Blob> {
    const paperSize = options.paperSize === 'letter' ? 'letter' : 'a4';
    const template = options.template || 'executive';

    // Page dimensions in mm
    const format = paperSize === 'letter' ? [215.9, 279.4] : [210, 297];
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const maxY = pageHeight - margin;

    let y = margin;

    // Helper: Page Break Check
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > maxY) {
        doc.addPage();
        y = margin;
      }
    };

    // Sanitize text for PDF rendering
    const cleanText = (str: any): string => {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/[\u2013\u2014]/g, '-') // replace en/em dashes
        .replace(/[\u2018\u2019]/g, "'") // replace smart quotes
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/₹/g, 'INR')
        .replace(/®/g, '(R)')
        .replace(/©/g, '(C)')
        .trim();
    };

    // Styling Tokens based on Template
    const primaryColor = template === 'modern' ? [2, 132, 199] : template === 'minimalist' ? [51, 65, 85] : [11, 25, 44];
    const accentColor = template === 'modern' ? [14, 165, 233] : [2, 132, 199];

    // 1. CANDIDATE NAME & CONTACT HEADER
    const personal = data.personalInfo || {};
    const fullName = cleanText(personal.fullName || 'Candidate Name');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(fullName, margin, y);
    y += 8;

    // Contact Line
    const contactParts = [
      cleanText(personal.email),
      cleanText(personal.phone),
      cleanText(personal.location),
      cleanText(personal.linkedin),
      cleanText(personal.github)
    ].filter(Boolean);

    if (contactParts.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const contactStr = contactParts.join('  |  ');
      doc.text(contactStr, margin, y);
      y += 6;
    }

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Helper: Draw Section Header
    const drawSectionHeader = (title: string) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.text(title.toUpperCase(), margin, y);
      y += 2;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    // 2. PROFESSIONAL SUMMARY
    const summaryText = cleanText(data.summary);
    if (summaryText) {
      drawSectionHeader('Professional Summary');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(summaryText, contentWidth);
      checkPageBreak(lines.length * 4.5);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 4;
    }

    // 3. TECHNICAL SKILLS
    const skillsList = data.skills ?? [];
    if (skillsList.length > 0) {
      drawSectionHeader('Technical Skills');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      const skillStrings = skillsList.map(s => {
        if (typeof s === 'string') return cleanText(s);
        if (s && typeof s === 'object') {
          if (s.category && s.skills) return `${cleanText(s.category)}: ${s.skills.map(cleanText).join(', ')}`;
          return cleanText(s.name || s.category || '');
        }
        return '';
      }).filter(Boolean);

      const skillsLine = skillStrings.join('  •  ');
      const lines = doc.splitTextToSize(skillsLine, contentWidth);
      checkPageBreak(lines.length * 4.5);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 4;
    }

    // 4. WORK EXPERIENCE
    const experiences = data.experience ?? [];
    if (experiences.length > 0) {
      drawSectionHeader('Professional Experience');

      experiences.forEach((exp) => {
        const role = cleanText(exp.role || exp.title || 'Role');
        const company = cleanText(exp.company || 'Company');
        const dates = cleanText(exp.dates || exp.duration || '');
        const loc = cleanText(exp.location || '');

        checkPageBreak(14);

        // Role & Company
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${role} - ${company}`, margin, y);

        // Dates on Right
        if (dates) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(dates, pageWidth - margin, y, { align: 'right' });
        }
        y += 4.5;

        // Location subtitle
        if (loc) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(loc, margin, y);
          y += 4;
        }

        // Bullet points
        const bullets = Array.isArray(exp.bulletPoints) ? exp.bulletPoints : (Array.isArray(exp.bullets) ? exp.bullets : []);
        if (bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);

          bullets.forEach((bullet) => {
            const bulletStr = cleanText(bullet);
            if (!bulletStr) return;

            const lines = doc.splitTextToSize(bulletStr, contentWidth - 6);
            checkPageBreak(lines.length * 4 + 2);

            // Draw bullet dot
            doc.text('•', margin + 2, y);
            doc.text(lines, margin + 6, y);
            y += lines.length * 4 + 1.5;
          });
        } else if (exp.description) {
          const descStr = cleanText(exp.description);
          const lines = doc.splitTextToSize(descStr, contentWidth);
          checkPageBreak(lines.length * 4 + 2);
          doc.text(lines, margin, y);
          y += lines.length * 4 + 2;
        }

        y += 3;
      });
    }

    // 5. PROJECTS
    const projects = data.projects ?? [];
    if (projects.length > 0) {
      drawSectionHeader('Key Projects');

      projects.forEach((proj) => {
        const name = cleanText(proj.name || proj.title || 'Project');
        const tech = cleanText(proj.technologies || '');
        const desc = cleanText(proj.description || '');

        checkPageBreak(12);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(name, margin, y);

        if (tech) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`(${tech})`, pageWidth - margin, y, { align: 'right' });
        }
        y += 4.5;

        if (desc) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          const lines = doc.splitTextToSize(desc, contentWidth);
          checkPageBreak(lines.length * 4 + 2);
          doc.text(lines, margin, y);
          y += lines.length * 4 + 3;
        }
      });
    }

    // 6. EDUCATION
    const education = data.education ?? [];
    if (education.length > 0) {
      drawSectionHeader('Education');

      education.forEach((edu) => {
        const degree = cleanText(edu.degree || 'Degree');
        const school = cleanText(edu.institution || edu.school || 'University');
        const year = cleanText(edu.year || edu.dates || '');

        checkPageBreak(10);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${degree} - ${school}`, margin, y);

        if (year) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(year, pageWidth - margin, y, { align: 'right' });
        }
        y += 5.5;
      });
    }

    // 7. CERTIFICATIONS & ACHIEVEMENTS
    const certs = data.certifications ?? [];
    if (certs.length > 0) {
      drawSectionHeader('Certifications');

      certs.forEach((cert) => {
        const certName = typeof cert === 'string' ? cleanText(cert) : cleanText(cert.name || cert.title || '');
        checkPageBreak(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        doc.text(`•  ${certName}`, margin, y);
        y += 4.5;
      });
    }

    // Output PDF Blob
    return doc.output('blob');
  }

  /**
   * Validates data, saves latest editor state to Supabase, generates PDF blob, and triggers browser download
   */
  public async exportAndDownloadPdf(
    userId: string,
    resumeId: string,
    currentData: CanonicalResumeData,
    options: ExportPdfOptions = {}
  ): Promise<void> {
    if (!currentData || typeof currentData !== 'object') {
      throw new Error('Valid resume data is required for PDF export.');
    }

    // 1. Save latest in-memory editor data before exporting
    try {
      if (userId && resumeId) {
        await resumeServiceInstance.updateResume({
          userId,
          resumeId,
          content: currentData,
          incrementVersion: false
        });
      }
    } catch (saveErr: any) {
      console.warn('[ResumeExportService Save Note]:', saveErr?.message || saveErr);
    }

    // 2. Generate ATS Vector PDF Blob
    const pdfBlob = await this.generateResumePdfBlob(currentData, options);

    // 3. Construct Sanitized Filename
    const personal = currentData.personalInfo || {};
    const rawName = personal.fullName || options.title || 'Candidate';
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const versionStr = options.version ? `_v${options.version}` : '';
    const filename = `${sanitizedName || 'Lumina'}_Resume${versionStr}.pdf`;

    // 4. Trigger Browser Blob Download
    const blobUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  }
}

export const resumeExportServiceInstance = new ResumeExportService();
