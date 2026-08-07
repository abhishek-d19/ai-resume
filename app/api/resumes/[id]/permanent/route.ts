import { NextResponse } from 'next/server';
import { resumeServiceInstance } from '../../../../../src/services/ResumeService';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'mock-user-1';

    await resumeServiceInstance.permanentlyDeleteResume(userId, id);

    return NextResponse.json({
      success: true,
      message: 'Resume permanently destroyed'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to permanently delete resume' },
      { status: 500 }
    );
  }
}
