import { resumeServiceInstance, ValidationError } from './ResumeService';

export type PdfTemplateType = 'ats' | 'modern' | 'minimal';

export interface ExportPdfOptions {
  template?: PdfTemplateType;
  primaryColor?: string;
}

export class ResumeExportService {
  /**
   * Generates a print-ready self-contained HTML document for PDF rendering
   */
  public async generateResumeHtml(
    userId: string,
    resumeId: string,
    options: ExportPdfOptions = {}
  ): Promise<string> {
    if (!userId || !resumeId) {
      throw new ValidationError('userId and resumeId are required for PDF export.');
    }

    const template = options.template || 'ats';
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);
    const content = resume.content || {};

    if (template === 'modern') {
      return this.renderModernTemplate(resume.title, content, options.primaryColor || '#032D30');
    } else if (template === 'minimal') {
      return this.renderMinimalTemplate(resume.title, content);
    }

    // Default: ATS-friendly Template
    return this.renderAtsFriendlyTemplate(resume.title, content);
  }

  /**
   * ATS-Friendly Template: Single column, high parseability, standard fonts, clear headings
   */
  private renderAtsFriendlyTemplate(title: string, content: any): string {
    const p = content.personalInfo || {};
    const summary = content.summary || p.summary || '';
    const expList = Array.isArray(content.experience) ? content.experience : [];
    const eduList = Array.isArray(content.education) ? content.education : [];
    const projectList = Array.isArray(content.projects) ? content.projects : [];
    const skillsList = Array.isArray(content.skills) ? content.skills : [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeXml(title)}</title>
  <style>
    @page { size: letter; margin: 0.5in; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      font-size: 10.5pt;
      line-height: 1.45;
      margin: 0;
      padding: 0;
    }
    a { color: #111827; text-decoration: underline; }
    h1 { font-size: 20pt; text-transform: uppercase; margin: 0 0 4px 0; letter-spacing: 0.5px; }
    h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1.5px solid #111827; padding-bottom: 2px; margin: 16px 0 8px 0; letter-spacing: 0.5px; }
    .contact-line { font-size: 9.5pt; color: #374151; margin-bottom: 12px; }
    .contact-line span { margin: 0 4px; }
    .entry-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px; }
    .entry-sub { display: flex; justify-content: space-between; font-style: italic; color: #4B5563; margin-bottom: 4px; font-size: 9.5pt; }
    ul { margin: 4px 0 8px 0; padding-left: 18px; }
    li { margin-bottom: 3px; }
    .section-block { page-break-inside: avoid; }
    .skills-list { font-size: 10pt; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header style="text-align: center;">
    <h1>${this.escapeXml(p.fullName || title)}</h1>
    <div class="contact-line">
      ${p.email ? `<a href="mailto:${this.escapeXml(p.email)}">${this.escapeXml(p.email)}</a>` : ''}
      ${p.phone ? `<span>•</span><a href="tel:${this.escapeXml(p.phone)}">${this.escapeXml(p.phone)}</a>` : ''}
      ${p.location ? `<span>•</span>${this.escapeXml(p.location)}` : ''}
      ${p.website ? `<span>•</span><a href="${this.escapeXml(p.website)}" target="_blank">${this.escapeXml(p.website)}</a>` : ''}
      ${p.linkedin ? `<span>•</span><a href="${this.escapeXml(p.linkedin)}" target="_blank">LinkedIn</a>` : ''}
    </div>
  </header>

  <!-- SUMMARY -->
  ${summary ? `<section class="section-block">
    <h2>Professional Summary</h2>
    <p>${this.escapeXml(summary)}</p>
  </section>` : ''}

  <!-- EXPERIENCE -->
  ${expList.length > 0 ? `<section>
    <h2>Work Experience</h2>
    ${expList.map((item: any) => `
      <div class="section-block" style="margin-bottom: 10px;">
        <div class="entry-header">
          <span>${this.escapeXml(item.role || item.title || '')}</span>
          <span>${this.escapeXml(item.period || item.dates || '')}</span>
        </div>
        <div class="entry-sub">
          <span>${this.escapeXml(item.company || '')}</span>
          <span>${this.escapeXml(item.location || '')}</span>
        </div>
        ${Array.isArray(item.bullets) ? `<ul>${item.bullets.map((b: string) => `<li>${this.escapeXml(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </section>` : ''}

  <!-- PROJECTS -->
  ${projectList.length > 0 ? `<section>
    <h2>Projects</h2>
    ${projectList.map((item: any) => `
      <div class="section-block" style="margin-bottom: 8px;">
        <div class="entry-header">
          <span>${this.escapeXml(item.name || item.title || '')}</span>
          <span>${item.link ? `<a href="${this.escapeXml(item.link)}" target="_blank">View Project</a>` : ''}</span>
        </div>
        <p style="margin: 2px 0 4px 0; font-size: 9.5pt; color: #374151;">${this.escapeXml(item.description || '')}</p>
      </div>
    `).join('')}
  </section>` : ''}

  <!-- EDUCATION -->
  ${eduList.length > 0 ? `<section>
    <h2>Education</h2>
    ${eduList.map((item: any) => `
      <div class="section-block" style="margin-bottom: 6px;">
        <div class="entry-header">
          <span>${this.escapeXml(item.degree || '')}</span>
          <span>${this.escapeXml(item.year || item.dates || '')}</span>
        </div>
        <div class="entry-sub">
          <span>${this.escapeXml(item.institution || item.school || '')}</span>
        </div>
      </div>
    `).join('')}
  </section>` : ''}

  <!-- SKILLS -->
  ${skillsList.length > 0 ? `<section class="section-block">
    <h2>Skills & Competencies</h2>
    <p class="skills-list">
      <strong>Technical Skills:</strong> ${skillsList.map((s: any) => this.escapeXml(typeof s === 'string' ? s : s.name)).join(', ')}
    </p>
  </section>` : ''}

</body>
</html>`;
  }

  /**
   * Modern Template: Accent branding header, clean typography, executive layout
   */
  private renderModernTemplate(title: string, content: any, brandColor: string): string {
    const p = content.personalInfo || {};
    const summary = content.summary || p.summary || '';
    const expList = Array.isArray(content.experience) ? content.experience : [];
    const eduList = Array.isArray(content.education) ? content.education : [];
    const skillsList = Array.isArray(content.skills) ? content.skills : [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeXml(title)}</title>
  <style>
    @page { size: letter; margin: 0.5in; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
      font-size: 10pt;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    a { color: ${brandColor}; text-decoration: none; font-weight: 500; }
    .header-banner {
      background: ${brandColor};
      color: #FFFFFF;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .header-banner h1 { margin: 0 0 6px 0; font-size: 22pt; font-weight: 700; tracking-tight: -0.5px; }
    .header-banner a { color: #38E8F5; }
    .contact-grid { display: flex; flex-wrap: wrap; gap: 12px; font-size: 9pt; opacity: 0.9; }
    h2 { font-size: 11pt; font-weight: 700; text-transform: uppercase; color: ${brandColor}; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin: 16px 0 10px 0; letter-spacing: 0.5px; }
    .entry-title { font-weight: 700; color: #0F172A; }
    .entry-meta { font-size: 8.5pt; color: #64748B; font-weight: 500; }
    ul { margin: 4px 0 8px 0; padding-left: 16px; }
    li { margin-bottom: 4px; color: #334155; }
    .skill-pill { display: inline-block; background: #F1F5F9; border: 1px solid #CBD5E1; color: #334155; padding: 2px 8px; border-radius: 12px; font-size: 8.5pt; font-weight: 500; margin: 2px 2px; }
    .section-block { page-break-inside: avoid; }
  </style>
</head>
<body>

  <div class="header-banner">
    <h1>${this.escapeXml(p.fullName || title)}</h1>
    <div class="contact-grid">
      ${p.email ? `<div>Email: <a href="mailto:${this.escapeXml(p.email)}">${this.escapeXml(p.email)}</a></div>` : ''}
      ${p.phone ? `<div>Phone: <a href="tel:${this.escapeXml(p.phone)}">${this.escapeXml(p.phone)}</a></div>` : ''}
      ${p.location ? `<div>Location: ${this.escapeXml(p.location)}</div>` : ''}
      ${p.website ? `<div>Portfolio: <a href="${this.escapeXml(p.website)}" target="_blank">${this.escapeXml(p.website)}</a></div>` : ''}
    </div>
  </div>

  ${summary ? `<div class="section-block">
    <h2>Executive Profile</h2>
    <p style="color: #334155; font-size: 9.5pt;">${this.escapeXml(summary)}</p>
  </div>` : ''}

  ${expList.length > 0 ? `<div>
    <h2>Experience</h2>
    ${expList.map((item: any) => `
      <div class="section-block" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="entry-title">${this.escapeXml(item.role || item.title || '')}</span>
          <span class="entry-meta">${this.escapeXml(item.period || item.dates || '')}</span>
        </div>
        <div class="entry-meta" style="color: ${brandColor}; font-weight: 600; margin-bottom: 4px;">
          ${this.escapeXml(item.company || '')} ${item.location ? `• ${this.escapeXml(item.location)}` : ''}
        </div>
        ${Array.isArray(item.bullets) ? `<ul>${item.bullets.map((b: string) => `<li>${this.escapeXml(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${skillsList.length > 0 ? `<div class="section-block">
    <h2>Technical Skills & Core Competencies</h2>
    <div>
      ${skillsList.map((s: any) => `<span class="skill-pill">${this.escapeXml(typeof s === 'string' ? s : s.name)}</span>`).join('')}
    </div>
  </div>` : ''}

  ${eduList.length > 0 ? `<div class="section-block">
    <h2>Education</h2>
    ${eduList.map((item: any) => `
      <div style="margin-bottom: 6px;">
        <span class="entry-title">${this.escapeXml(item.degree || '')}</span>
        <span class="entry-meta"> — ${this.escapeXml(item.institution || item.school || '')} (${this.escapeXml(item.year || item.dates || '')})</span>
      </div>
    `).join('')}
  </div>` : ''}

</body>
</html>`;
  }

  /**
   * Minimal Template: Generous whitespace, elegant serif/sans typography, subtle borders
   */
  private renderMinimalTemplate(title: string, content: any): string {
    const p = content.personalInfo || {};
    const summary = content.summary || p.summary || '';
    const expList = Array.isArray(content.experience) ? content.experience : [];
    const eduList = Array.isArray(content.education) ? content.education : [];
    const skillsList = Array.isArray(content.skills) ? content.skills : [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeXml(title)}</title>
  <style>
    @page { size: letter; margin: 0.6in; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      color: #18181B;
      font-size: 10pt;
      line-height: 1.55;
      margin: 0;
      padding: 0;
    }
    a { color: #18181B; text-decoration: none; border-bottom: 1px dotted #71717A; }
    h1 { font-size: 22pt; font-weight: normal; margin: 0 0 6px 0; text-align: center; }
    h2 { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #52525B; margin: 18px 0 10px 0; border-top: 1px solid #E4E4E7; padding-top: 6px; }
    .contact-line { text-align: center; font-size: 9pt; color: #71717A; margin-bottom: 16px; font-family: sans-serif; }
    ul { margin: 4px 0 8px 0; padding-left: 16px; }
    li { margin-bottom: 3px; }
    .section-block { page-break-inside: avoid; }
  </style>
</head>
<body>

  <h1>${this.escapeXml(p.fullName || title)}</h1>
  <div class="contact-line">
    ${p.email ? `<a href="mailto:${this.escapeXml(p.email)}">${this.escapeXml(p.email)}</a>` : ''}
    ${p.phone ? ` • <a href="tel:${this.escapeXml(p.phone)}">${this.escapeXml(p.phone)}</a>` : ''}
    ${p.location ? ` • ${this.escapeXml(p.location)}` : ''}
    ${p.website ? ` • <a href="${this.escapeXml(p.website)}" target="_blank">${this.escapeXml(p.website)}</a>` : ''}
  </div>

  ${summary ? `<div class="section-block">
    <h2>Summary</h2>
    <p style="margin: 0 0 10px 0;">${this.escapeXml(summary)}</p>
  </div>` : ''}

  ${expList.length > 0 ? `<div>
    <h2>Experience</h2>
    ${expList.map((item: any) => `
      <div class="section-block" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between;">
          <strong>${this.escapeXml(item.role || item.title || '')}</strong>
          <span style="font-size: 8.5pt; color: #71717A; font-family: sans-serif;">${this.escapeXml(item.period || item.dates || '')}</span>
        </div>
        <div style="font-style: italic; color: #52525B; font-size: 9.5pt; margin-bottom: 4px;">
          ${this.escapeXml(item.company || '')} ${item.location ? `— ${this.escapeXml(item.location)}` : ''}
        </div>
        ${Array.isArray(item.bullets) ? `<ul>${item.bullets.map((b: string) => `<li>${this.escapeXml(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${skillsList.length > 0 ? `<div class="section-block">
    <h2>Skills</h2>
    <p style="margin: 0; font-family: sans-serif; font-size: 9.5pt; color: #3F3F46;">
      ${skillsList.map((s: any) => this.escapeXml(typeof s === 'string' ? s : s.name)).join('  •  ')}
    </p>
  </div>` : ''}

  ${eduList.length > 0 ? `<div class="section-block">
    <h2>Education</h2>
    ${eduList.map((item: any) => `
      <div style="margin-bottom: 6px;">
        <strong>${this.escapeXml(item.degree || '')}</strong> — ${this.escapeXml(item.institution || item.school || '')} (${this.escapeXml(item.year || item.dates || '')})
      </div>
    `).join('')}
  </div>` : ''}

</body>
</html>`;
  }

  /**
   * Escape XML/HTML special characters to prevent injection & preserve formatting
   */
  private escapeXml(unsafe: string): string {
    if (!unsafe || typeof unsafe !== 'string') return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export const resumeExportServiceInstance = new ResumeExportService();
