import { NextResponse } from 'next/server';
import { resumeAnalysisServiceInstance } from '../../../../../src/services/ResumeAnalysisService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';
    const targetRole = body.targetRole;

    const result = await resumeAnalysisServiceInstance.analyzeResume(userId, id, targetRole);

    return NextResponse.json({
      success: true,
      data: result.analysis,
      recordId: result.recordId
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/analyze Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute resume analysis' },
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
    const isHistoryRequested = searchParams.get('history') === 'true';

    if (isHistoryRequested) {
      const history = await resumeAnalysisServiceInstance.getAnalysisHistory(userId, id);
      return NextResponse.json({
        success: true,
        data: history
      });
    }

    const latestAnalysis = await resumeAnalysisServiceInstance.getLatestAnalysis(userId, id);

    return NextResponse.json({
      success: true,
      data: latestAnalysis
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch resume analysis' },
      { status }
    );
  }
}
