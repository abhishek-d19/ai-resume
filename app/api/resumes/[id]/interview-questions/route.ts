import { NextResponse } from 'next/server';
import { interviewQuestionServiceInstance } from '../../../../../src/services/InterviewQuestionService';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || '';
    const jobDescriptionText = body.jobDescription || body.jobDescriptionText;

    const result = await interviewQuestionServiceInstance.generateQuestions(userId, id, jobDescriptionText);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/:id/interview-questions Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate interview questions' },
      { status }
    );
  }
}
