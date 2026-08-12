import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process && process.env) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && import.meta && (import.meta as any).env) {
    return (import.meta as any).env[key];
  }
  return undefined;
};

/**
 * Validates admin environment variables.
 * CRITICAL SECURITY GUARD: Throws runtime error if executed on client browser environment.
 */
function getAdminEnv() {
  if (typeof window !== 'undefined') {
    throw new Error(
      '[SECURITY VIOLATION]: Supabase Admin Client was imported on the client browser! Service role keys must NEVER be exposed to the client.'
    );
  }

  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || 'https://cxaaxiygfidsmigoefos.supabase.co';
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      '[Supabase Infrastructure Error]: SUPABASE_SERVICE_ROLE_KEY is missing. Please define it in server-only environment settings.'
    );
  }

  return { url, serviceRoleKey };
}

let adminClientInstance: SupabaseClient | null = null;

/**
 * Creates or returns the privileged Supabase Admin client using SUPABASE_SERVICE_ROLE_KEY.
 * Restricted to backend server routes, webhooks, and administrative background tasks.
 */
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
