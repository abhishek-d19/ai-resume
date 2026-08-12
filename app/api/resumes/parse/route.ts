import { NextResponse } from 'next/server';
import { resumeParserServiceInstance } from '../../../../src/services/ResumeParserService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawText = body.rawText || body.text;
    const fileName = body.fileName || body.name;

    if (!rawText) {
      return NextResponse.json(
        { success: false, error: 'rawText field is required in JSON payload.' },
        { status: 400 }
      );
    }

    const canonicalJson = await resumeParserServiceInstance.parseRawTextToCanonicalJson(rawText, fileName);

    return NextResponse.json({
      success: true,
      data: canonicalJson
    });
  } catch (error: any) {
    console.error('[POST /api/resumes/parse Error]:', error.message);
    const status = error.name === 'ValidationError' ? 400 : 500;

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse raw resume text' },
      { status }
    );
  }
}
