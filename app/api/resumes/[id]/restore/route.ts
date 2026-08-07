import { NextResponse } from 'next/server';
import { resumeServiceInstance } from '../../../../../src/services/ResumeService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'mock-user-1';

    const restored = await resumeServiceInstance.restoreResume(userId, id);

    return NextResponse.json({
      success: true,
      data: restored
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to restore resume' },
      { status: 500 }
    );
  }
}
