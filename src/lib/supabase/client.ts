import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates browser Supabase environment variables.
 * Throws descriptive errors if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.
 */
function getBrowserEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY);

  if (!url) {
    throw new Error(
      '[Supabase Infrastructure Error]: NEXT_PUBLIC_SUPABASE_URL is missing. Please define it in your .env.local or environment settings.'
    );
  }

  if (!anonKey) {
    throw new Error(
      '[Supabase Infrastructure Error]: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Please define it in your .env.local or environment settings.'
    );
  }

  return { url, anonKey };
}

let browserClient: SupabaseClient | null = null;

/**
 * Creates or returns the singleton Supabase browser client.
 * Safe for client-side rendering, React components, and user interaction.
 */
export function createBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const { url, anonKey } = getBrowserEnv();

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return browserClient;
}

export const supabaseClient = createBrowserClient();
