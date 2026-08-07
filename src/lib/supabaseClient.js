import { createClient } from '@supabase/supabase-js';

// Environment Configuration for Live Supabase Project cxaaxiygfidsmigoefos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cxaaxiygfidsmigoefos.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Yu2C3M13TPskA_evpm7ojA_59iR6o9f';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
