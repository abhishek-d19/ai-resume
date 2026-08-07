import { NextResponse } from 'next/server';
import { resumeServiceInstance, ValidationError, ForbiddenError, NotFoundError } from '../../../src/services/ResumeService';
import { createResumeSchema } from '../../../src/lib/validations/resume';

// Helper to extract authenticated userId from headers/session
function getAuthenticatedUserId(req: Request): string {
  const authHeader = req.headers.get('x-user-id') || req.headers.get('authorization');
  if (!authHeader) {
    return 'mock-user-1'; // Fallback for dev environment testing
  }
  return authHeader.replace('Bearer ', '').trim();
}

/**
 * GET /api/resumes
 * Lists all non-deleted resumes for the authenticated user.
 */
export async function GET(req: Request) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Authentication token missing.' },
        { status: 401 }
      );
    }

    const resumes = await resumeServiceInstance.listResumesForUser(userId);

    return NextResponse.json(
      { success: true, data: resumes },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resumes
 * Creates a new resume for the authenticated user.
 */
export async function POST(req: Request) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Authentication token missing.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 1. Zod Input Validation
    const validationResult = createResumeSchema.safeParse(body);
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
    const newResume = await resumeServiceInstance.createResume({
      userId,
      title: validationResult.data.title,
      content: validationResult.data.content
    });

    return NextResponse.json(
      { success: true, data: newResume },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
