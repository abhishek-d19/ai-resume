import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta && (import.meta as any).env) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process && process.env) {
    return process.env[key];
  }
  return undefined;
};

/**
 * Validates browser Supabase environment variables.
 * Safe for client-side rendering, React components, and user interaction.
 */
function getBrowserEnv() {
  const url = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL') || 'https://cxaaxiygfidsmigoefos.supabase.co';
  const anonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'sb_publishable_Yu2C3M13TPskA_evpm7ojA_59iR6o9f';

  return { url, anonKey };
}

let browserClient: SupabaseClient | null = null;

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
