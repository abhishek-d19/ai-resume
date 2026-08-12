import { NextResponse } from 'next/server';
import { resumeImprovementServiceInstance } from '../../../../../src/services/ResumeImprovementService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || '';
    const jobDescriptionText = body.jobDescription || body.jobDescriptionText;

    const result = await resumeImprovementServiceInstance.generateImprovements(userId, id, jobDescriptionText);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/improve Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate AI resume improvements' },
      { status }
    );
  }
}
