import { NextResponse } from 'next/server';
import { resumeServiceInstance, ValidationError, ForbiddenError, NotFoundError } from '../../../../src/services/ResumeService';
import { updateResumeSchema } from '../../../../src/lib/validations/resume';

function getAuthenticatedUserId(req: Request): string {
  const authHeader = req.headers.get('x-user-id') || req.headers.get('authorization');
  if (!authHeader) {
    return 'mock-user-1';
  }
  return authHeader.replace('Bearer ', '').trim();
}

/**
 * GET /api/resumes/[id]
 * Fetches a single resume by ID for the authenticated user.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Authentication token missing.' },
        { status: 401 }
      );
    }

    const resumeId = params.id;
    const resume = await resumeServiceInstance.getResumeForUser(userId, resumeId);

    return NextResponse.json(
      { success: true, data: resume },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/resumes/[id]
 * Updates resume title or content for the authenticated user.
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Authentication token missing.' },
        { status: 401 }
      );
    }

    const resumeId = params.id;
    const body = await req.json();

    // 1. Zod Input Validation
    const validationResult = updateResumeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // 2. Delegate to ResumeService -> ResumeRepository
    const updatedResume = await resumeServiceInstance.updateResume({
      userId,
      resumeId,
      title: validationResult.data.title,
      content: validationResult.data.content
    });

    return NextResponse.json(
      { success: true, data: updatedResume },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id]
 * Performs a soft delete on a resume for the authenticated user.
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Authentication token missing.' },
        { status: 401 }
      );
    }

    const resumeId = params.id;
    await resumeServiceInstance.deleteResume(userId, resumeId);

    return NextResponse.json(
      { success: true, message: `Resume ${resumeId} soft-deleted successfully.` },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
