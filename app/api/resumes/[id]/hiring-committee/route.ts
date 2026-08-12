import { NextResponse } from 'next/server';
import { hiringCommitteeServiceInstance } from '../../../../../src/services/HiringCommitteeService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || '';
    const targetRole = body.targetRole;

    const result = await hiringCommitteeServiceInstance.evaluateCommittee(userId, id, targetRole);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/hiring-committee Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute hiring committee evaluation' },
      { status }
    );
  }
}
