import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createClient } from '@supabase/supabase-js';

function userSyncApiPlugin() {
  return {
    name: 'user-sync-api',
    configureServer(server) {
      server.middlewares.use('/api/users/sync', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        let bodyStr = '';
        req.on('data', chunk => { bodyStr += chunk; });
        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyStr || '{}');
            const { clerkId, email, name } = body;

            if (!clerkId || !email) {
              console.error('[Server User Sync Error]: Missing clerkId or email in request body');
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'clerkId and email are required for user synchronization.' }));
            }

            const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
            const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
            const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

            if (!supabaseUrl || !serviceRoleKey) {
              console.error('[Server User Sync Error]: Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL in server environment');
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'Server environment configuration error.' }));
            }

            const hostname = new URL(supabaseUrl).hostname;
            console.log('[Server User Sync Diagnostic]:', {
              operation: 'upsert public.users',
              hostname,
              hasServiceRoleKey: Boolean(serviceRoleKey && serviceRoleKey.length > 0)
            });

            const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
              auth: { persistSession: false, autoRefreshToken: false }
            });

            const { data, error } = await adminSupabase
              .from('users')
              .upsert(
                {
                  clerk_id: clerkId,
                  email,
                  name: name || '',
                  updated_at: new Date().toISOString()
                },
                { onConflict: 'clerk_id' }
              )
              .select('*')
              .single();

            if (error) {
              console.error('[Server User Sync Diagnostic Error]:', {
                operation: 'upsert public.users',
                hostname,
                errorName: error.name || 'PostgreSQL Error',
                errorMessage: error.message
              });
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: error.message }));
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true, user: data }));
          } catch (err) {
            console.error('[Server User Sync Error]:', err.message);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      userSyncApiPlugin()
    ],
    define: {
      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY || env.VITE_OPENAI_API_KEY || ''),
      'process.env.OPENAI_MODEL': JSON.stringify(env.OPENAI_MODEL || env.VITE_OPENAI_MODEL || 'gpt-4o-mini')
    },
    server: {
      port: 5173,
      cors: true
    }
  };
});
