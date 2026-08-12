import { NextResponse } from 'next/server';
import { resumeNormalizationServiceInstance } from '../../../../src/services/ResumeNormalizationService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawText = body.rawText || body.text;
    const title = body.title || body.name;

    if (!rawText) {
      return NextResponse.json(
        { success: false, error: 'rawText field is required in JSON payload.' },
        { status: 400 }
      );
    }

    const normalizedJson = await resumeNormalizationServiceInstance.normalizeRawText(rawText, title);

    return NextResponse.json({
      success: true,
      data: normalizedJson
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/normalize Error]:', error.message);
    const status = error.name === 'ValidationError' ? 400 : 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to normalize resume text' },
      { status }
    );
  }
}
