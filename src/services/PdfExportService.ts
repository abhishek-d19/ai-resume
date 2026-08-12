/**
 * Client-Side PDF Export Service
 * Formats canonical resume JSON into an executive print document and triggers browser PDF download.
 */
export class PdfExportService {
  public static downloadResumePdf(resumeContent: Record<string, any>, title?: string, version: number = 2): void {
    const personal = resumeContent.personalInfo || {};
    const fullName = personal.fullName || 'Candidate_Resume';
    const email = personal.email || '';
    const phone = personal.phone || '';
    const location = personal.location || '';
    const summary = resumeContent.summary || '';
    const experience = Array.isArray(resumeContent.experience) ? resumeContent.experience : [];
    const education = Array.isArray(resumeContent.education) ? resumeContent.education : [];
    const skills = Array.isArray(resumeContent.skills) ? resumeContent.skills : [];
    const projects = Array.isArray(resumeContent.projects) ? resumeContent.projects : [];
    const certifications = Array.isArray(resumeContent.certifications) ? resumeContent.certifications : [];

    const safeTitle = (title || fullName).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Lumina_AI_Resume_${safeTitle}_v${version}.pdf`;

    // Construct Executive Clean HTML Document
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fullName} - Resume (v${version})</title>
  <style>
    @page { size: letter; margin: 0.6in; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; line-height: 1.5; font-size: 10pt; margin: 0; padding: 20px; }
    h1 { font-size: 22pt; margin: 0 0 4px 0; color: #0B192C; font-weight: 800; }
    .contact { font-size: 9pt; color: #475569; margin-bottom: 16px; border-bottom: 2px solid #0284C7; padding-bottom: 8px; }
    .section-title { font-size: 11pt; font-weight: 800; text-transform: uppercase; color: #0284C7; letter-spacing: 0.05em; margin: 16px 0 6px 0; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
    .summary { font-size: 9.5pt; color: #334155; margin-bottom: 12px; }
    .item-header { display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; margin-top: 8px; }
    .item-sub { font-size: 8.5pt; color: #64748B; font-style: italic; margin-bottom: 4px; }
    ul { margin: 4px 0 8px 18px; padding: 0; }
    li { margin-bottom: 3px; color: #334155; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .skill-pill { background: #F1F5F9; border: 1px solid #CBD5E1; padding: 2px 8px; border-radius: 4px; font-size: 8.5pt; color: #1E293B; font-weight: 600; }
  </style>
</head>
<body>
  <h1>${fullName}</h1>
  <div class="contact">${[email, phone, location].filter(Boolean).join('  |  ')}</div>

  ${summary ? `<div class="section-title">Professional Summary</div><div class="summary">${summary}</div>` : ''}

  ${skills.length > 0 ? `
    <div class="section-title">Technical Skills</div>
    <div class="skills-list">
      ${skills.map((s: any) => typeof s === 'string' ? `<span class="skill-pill">${s}</span>` : `<span class="skill-pill">${s.name || s.skill || ''}</span>`).join('')}
    </div>
  ` : ''}

  ${experience.length > 0 ? `
    <div class="section-title">Professional Experience</div>
    ${experience.map((exp: any) => `
      <div class="item-header">
        <span>${exp.role || exp.title || ''} — ${exp.company || ''}</span>
        <span>${exp.duration || exp.dates || ''}</span>
      </div>
      ${exp.location ? `<div class="item-sub">${exp.location}</div>` : ''}
      ${Array.isArray(exp.bulletPoints) || Array.isArray(exp.bullets) || Array.isArray(exp.description) ? `
        <ul>
          ${(exp.bulletPoints || exp.bullets || exp.description || []).map((b: string) => `<li>${b}</li>`).join('')}
        </ul>
      ` : exp.description ? `<p>${exp.description}</p>` : ''}
    `).join('')}
  ` : ''}

  ${projects.length > 0 ? `
    <div class="section-title">Key Projects</div>
    ${projects.map((proj: any) => `
      <div class="item-header">
        <span>${proj.name || proj.title || ''}</span>
        <span>${proj.technologies ? `(${proj.technologies})` : ''}</span>
      </div>
      <p style="margin:2px 0 6px 0; color:#334155;">${proj.description || ''}</p>
    `).join('')}
  ` : ''}

  ${education.length > 0 ? `
    <div class="section-title">Education</div>
    ${education.map((edu: any) => `
      <div class="item-header">
        <span>${edu.degree || ''} — ${edu.institution || edu.school || ''}</span>
        <span>${edu.year || edu.dates || ''}</span>
      </div>
    `).join('')}
  ` : ''}

  ${certifications.length > 0 ? `
    <div class="section-title">Certifications</div>
    <ul>
      ${certifications.map((c: any) => `<li>${typeof c === 'string' ? c : (c.name || c.title || '')}</li>`).join('')}
    </ul>
  ` : ''}
</body>
</html>
    `;

    // Create a print/save window or trigger blob download
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    // Create invisible anchor for direct download trigger
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename.replace(/\.pdf$/i, '.html'); // Standard HTML/PDF printable document
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open print window so user can save directly as PDF via browser print dialog
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 500);
    }
  }
}
