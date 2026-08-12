import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { clerkId, email, name } = body;

    if (!clerkId || !email) {
      console.error('[Server User Sync Error]: Missing clerkId or email in request body');
      return NextResponse.json(
        { success: false, error: 'clerkId and email are required for user synchronization.' },
        { status: 400 }
      );
    }

    const urlStr = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const hostname = urlStr ? new URL(urlStr).hostname : 'unknown';
    const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log('[Server User Sync Diagnostic]:', {
      operation: 'upsert public.users',
      hostname,
      hasServiceRoleKey: hasKey
    });

    // Privileged Supabase Admin Client using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS server-side)
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from('users')
      .upsert(
        {
          clerk_id: clerkId,
          email: email,
          name: name || '',
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'clerk_id'
        }
      )
      .select('*')
      .single();

    if (error) {
      console.error('[Server User Sync Diagnostic Error]:', {
        operation: 'upsert public.users',
        hostname,
        errorName: error.name || 'PostgreSQL Error',
        errorMessage: error.message || String(error)
      });

      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        const localUser = {
          id: `usr_${clerkId}`,
          clerk_id: clerkId,
          email,
          name: name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return NextResponse.json({ success: true, user: localUser, isLocalFallback: true });
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    console.error('[Server User Sync Exception]:', err.message);
    return NextResponse.json(
      { success: false, error: err.message || 'Server user synchronization failed.' },
      { status: 500 }
    );
  }
}
