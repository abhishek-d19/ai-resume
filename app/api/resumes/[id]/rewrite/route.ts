import { NextResponse } from 'next/server';
import { resumeRewriteServiceInstance } from '../../../../../src/services/ResumeRewriteService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';
    const action = body.action || 'generate';

    if (action === 'apply') {
      const approvedIds = body.approvedIds || [];
      const suggestions = body.suggestions || [];
      const updatedResume = await resumeRewriteServiceInstance.applyRewriteSuggestions(userId, id, approvedIds, suggestions);
      return NextResponse.json({
        success: true,
        data: updatedResume
      });
    }

    const jobDescriptionText = body.jobDescription || body.jobDescriptionText;
    const result = await resumeRewriteServiceInstance.generateRewriteSuggestions(userId, id, jobDescriptionText);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/rewrite Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute AI resume rewrite' },
      { status }
    );
  }
}
