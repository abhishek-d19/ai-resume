import { NextResponse } from 'next/server';
import { pdfParserServiceInstance } from '../../../../src/services/PdfParserService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = (formData.get('userId') as string) || request.headers.get('x-user-id') || 'default-user';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Please select a PDF resume file to upload.' },
        { status: 400 }
      );
    }

    // 1. File Validation
    pdfParserServiceInstance.validatePdfFile({
      name: file.name,
      size: file.size,
      type: file.type || 'application/pdf'
    });

    // 2. Convert Web File ArrayBuffer to Node Server Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Server-side PDF Parsing & Text Extraction into Canonical Resume JSON
    const { canonicalContent } = await pdfParserServiceInstance.extractTextAndConvertToCanonicalJson(
      buffer,
      file.name
    );

    const title = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    return NextResponse.json({
      success: true,
      title,
      canonicalContent
    });
  } catch (err: any) {
    console.error('[Server PDF Upload Endpoint Error]:', err.message);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process PDF resume on server.' },
      { status: 500 }
    );
  }
}
