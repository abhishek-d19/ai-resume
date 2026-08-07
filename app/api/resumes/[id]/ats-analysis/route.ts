import { NextResponse } from 'next/server';
import { atsAnalysisServiceInstance } from '../../../../../src/services/AtsAnalysisService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';
    const targetRole = body.targetRole;

    const atsOutput = await atsAnalysisServiceInstance.analyzeAtsCompliance(userId, id, targetRole);

    return NextResponse.json({
      success: true,
      data: atsOutput
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/ats-analysis Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute ATS compliance audit' },
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

    const latestAtsAnalysis = await atsAnalysisServiceInstance.getLatestAtsAnalysis(userId, id);

    return NextResponse.json({
      success: true,
      data: latestAtsAnalysis
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch latest ATS compliance audit' },
      { status }
    );
  }
}
