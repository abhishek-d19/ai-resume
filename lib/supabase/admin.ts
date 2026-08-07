import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getAdminEnv() {
  if (typeof window !== 'undefined') {
    throw new Error(
      '[SECURITY VIOLATION]: Supabase Admin Client was imported on the client browser! Service role keys must NEVER be exposed to the client.'
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      '[Supabase Infrastructure Error]: NEXT_PUBLIC_SUPABASE_URL is missing. Please define it in server environment settings.'
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      '[Supabase Infrastructure Error]: SUPABASE_SERVICE_ROLE_KEY is missing. Please define it in server-only environment settings.'
    );
  }

  return { url, serviceRoleKey };
}

let adminClientInstance: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (adminClientInstance) return adminClientInstance;

  const { url, serviceRoleKey } = getAdminEnv();

  adminClientInstance = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return adminClientInstance;
}
