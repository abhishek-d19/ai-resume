import { NextResponse } from 'next/server';
import { resumeExportServiceInstance, PdfTemplateType } from '../../../../../src/services/ResumeExportService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '';
    const template = (searchParams.get('template') as PdfTemplateType) || 'ats';
    const format = searchParams.get('format') || 'html';

    const renderedHtml = await resumeExportServiceInstance.generateResumeHtml(userId, id, { template });

    if (format === 'html') {
      return new NextResponse(renderedHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Default download payload response
    return NextResponse.json({
      success: true,
      template,
      html: renderedHtml,
      downloadUrl: `/api/resumes/${id}/export?format=html&template=${template}`
    });
  } catch (error: any) {
    console.error('[GET /api/resumes/:id/export Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate resume export' },
      { status }
    );
  }
}
