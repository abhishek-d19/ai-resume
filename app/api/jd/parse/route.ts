import { NextResponse } from 'next/server';
import { jdParserServiceInstance } from '../../../../src/services/JdParserService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawJdText = body.jobDescription || body.rawJdText || body.text;

    if (!rawJdText) {
      return NextResponse.json(
        { success: false, error: 'jobDescription text is required in request body' },
        { status: 400 }
      );
    }

    const parsedOutput = await jdParserServiceInstance.parseJobDescription(rawJdText);

    return NextResponse.json({
      success: true,
      data: parsedOutput
    });
  } catch (error: any) {
    console.error('[POST /api/jd/parse Error]:', error.message);
    const status = error.statusCode || 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse job description' },
      { status }
    );
  }
}
