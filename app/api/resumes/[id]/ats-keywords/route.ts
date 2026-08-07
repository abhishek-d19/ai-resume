import { NextResponse } from 'next/server';
import { atsKeywordServiceInstance } from '../../../../../src/services/AtsKeywordService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';
    const jobDescriptionText = body.jobDescription || body.jobDescriptionText;
    const targetRole = body.targetRole;

    if (!jobDescriptionText) {
      return NextResponse.json(
        { success: false, error: 'jobDescription text is required in request body' },
        { status: 400 }
      );
    }

    const keywordOutput = await atsKeywordServiceInstance.analyzeKeywords(userId, id, jobDescriptionText, targetRole);

    return NextResponse.json({
      success: true,
      data: keywordOutput
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/ats-keywords Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute ATS keyword optimization audit' },
      { status }
    );
  }
}
