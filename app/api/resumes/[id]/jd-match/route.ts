import { NextResponse } from 'next/server';
import { jdMatchServiceInstance } from '../../../../../src/services/JdMatchService';

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
        { success: false, error: 'jobDescription is required in request body' },
        { status: 400 }
      );
    }

    const matchOutput = await jdMatchServiceInstance.matchJobDescription(userId, id, jobDescriptionText, targetRole);

    return NextResponse.json({
      success: true,
      data: matchOutput
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/jd-match Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute JD matching analysis' },
      { status }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'mock-user-1';

    const latestJdMatch = await jdMatchServiceInstance.getLatestJdMatchResult(userId, id);

    return NextResponse.json({
      success: true,
      data: latestJdMatch
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch latest JD match result' },
      { status }
    );
  }
}
