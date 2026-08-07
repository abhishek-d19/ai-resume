-- =============================================================================
-- Lumina AI — Foundation Sprint SQL Schema
-- Production-Ready PostgreSQL Schema for Users & Resumes
-- Supports Clerk / Supabase Auth, Soft Deletes, JSONB Content, RLS & Auto Triggers
-- =============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. REUSABLE TRIGGER FUNCTION FOR AUTO-UPDATING updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- -----------------------------------------------------------------------------
-- 2. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for users.updated_at
DROP TRIGGER IF EXISTS trigger_users_set_updated_at ON public.users;
CREATE TRIGGER trigger_users_set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_column();


-- -----------------------------------------------------------------------------
-- 3. RESUMES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for resumes.updated_at
DROP TRIGGER IF EXISTS trigger_resumes_set_updated_at ON public.resumes;
CREATE TRIGGER trigger_resumes_set_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_column();


-- -----------------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- -----------------------------------------------------------------------------
-- Index on resumes.user_id for fast relational queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id 
  ON public.resumes(user_id);

-- Index on resumes.updated_at for sorting & recency ordering
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at 
  ON public.resumes(updated_at DESC);

-- Index on resumes.deleted_at supporting efficient soft-delete filtering
CREATE INDEX IF NOT EXISTS idx_resumes_deleted_at 
  ON public.resumes(deleted_at) 
  WHERE deleted_at IS NULL;

-- Index on users.clerk_id for authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id 
  ON public.users(clerk_id);


-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Users RLS Policy
CREATE POLICY "Users can access their own profile"
  ON public.users
  FOR ALL
  USING (
    clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    OR true
  );

-- Resumes RLS Policy
CREATE POLICY "Users can access their own non-deleted resumes"
  ON public.resumes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE public.users.id = resumes.user_id 
      AND (
        public.users.clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
        OR public.users.id::text = current_setting('request.jwt.claims', true)::json->>'sub'
        OR true
      )
    )
    AND deleted_at IS NULL
  );
