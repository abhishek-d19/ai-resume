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
 * Validates server Supabase environment variables.
 */
function getServerEnv() {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || 'https://cxaaxiygfidsmigoefos.supabase.co';
  const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_Yu2C3M13TPskA_evpm7ojA_59iR6o9f';

  return { url, anonKey };
}

/**
 * Creates an authenticated Supabase server client.
 */
export function createServerClient(accessToken?: string): SupabaseClient {
  const { url, anonKey } = getServerEnv();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    }
  });
}
