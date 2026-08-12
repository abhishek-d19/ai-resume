import { createClient } from '@supabase/supabase-js';

/**
 * Safe Environment Variable Resolver for dual Browser/Node environments.
 * Prevents "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')" errors in Node server runtimes.
 */
const getEnv = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Environment Configuration for Live Supabase Project cxaaxiygfidsmigoefos
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL') || 'https://cxaaxiygfidsmigoefos.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'sb_publishable_Yu2C3M13TPskA_evpm7ojA_59iR6o9f';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
