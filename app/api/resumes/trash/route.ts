import { NextResponse } from 'next/server';
import { resumeServiceInstance } from '../../../../src/services/ResumeService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || '';

    const trashedResumes = await resumeServiceInstance.listTrashedResumesForUser(userId);

    return NextResponse.json({
      success: true,
      data: trashedResumes
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch trashed resumes' },
      { status: 500 }
    );
  }
}
