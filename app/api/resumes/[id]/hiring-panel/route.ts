import { NextResponse } from 'next/server';
import { hiringPanelServiceInstance } from '../../../../../src/services/HiringPanelService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';
    const targetRole = body.targetRole;

    const consensus = await hiringPanelServiceInstance.evaluateHiringPanel(userId, id, targetRole);

    return NextResponse.json({
      success: true,
      data: consensus
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/hiring-panel Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute hiring panel evaluation' },
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

    const latestPanelResult = await hiringPanelServiceInstance.getLatestHiringPanelResult(userId, id);

    return NextResponse.json({
      success: true,
      data: latestPanelResult
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch latest hiring panel result' },
      { status }
    );
  }
}
