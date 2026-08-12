import { NextResponse } from 'next/server';
import { missingSkillsServiceInstance } from '../../../../../src/services/MissingSkillsService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || '';
    const jobDescription = body.jobDescription || body.parsedJd;

    if (!jobDescription) {
      return NextResponse.json(
        { success: false, error: 'jobDescription is required in request body' },
        { status: 400 }
      );
    }

    const missingSkillsResult = await missingSkillsServiceInstance.analyzeMissingSkills(userId, id, jobDescription);

    return NextResponse.json({
      success: true,
      data: missingSkillsResult
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/missing-skills Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze missing skills intelligence' },
      { status }
    );
  }
}
