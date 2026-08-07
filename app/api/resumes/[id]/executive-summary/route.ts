import { NextResponse } from 'next/server';
import { executiveSummaryServiceInstance } from '../../../../../src/services/ExecutiveSummaryService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';
    const targetRole = body.targetRole;

    const summaryOutput = await executiveSummaryServiceInstance.generateExecutiveSummary(userId, id, targetRole);

    return NextResponse.json({
      success: true,
      data: summaryOutput
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/executive-summary Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate executive summary' },
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

    const latestSummary = await executiveSummaryServiceInstance.getLatestExecutiveSummary(userId, id);

    return NextResponse.json({
      success: true,
      data: latestSummary
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch latest executive summary' },
      { status }
    );
  }
}
