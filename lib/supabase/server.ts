import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getServerEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY);

  if (!url) {
    throw new Error(
      '[Supabase Infrastructure Error]: NEXT_PUBLIC_SUPABASE_URL is missing. Please define it in environment settings.'
    );
  }

  if (!anonKey) {
    throw new Error(
      '[Supabase Infrastructure Error]: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Please define it in environment settings.'
    );
  }

  return { url, anonKey };
}

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
