-- =============================================================================
-- Lumina AI — Production-Grade Row Level Security (RLS) for Resumes Table
-- Enforces Strict Per-User Access Control Mapped to Clerk Authentication
-- Operations: SELECT, INSERT, UPDATE, DELETE
-- =============================================================================

-- Ensure RLS is Enabled on Resumes Table
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Force RLS for Table Owners & Service Queries
ALTER TABLE public.resumes FORCE ROW LEVEL SECURITY;

-- Drop Existing Overlap Policies
DROP POLICY IF EXISTS "resumes_select_policy" ON public.resumes;
DROP POLICY IF EXISTS "resumes_insert_policy" ON public.resumes;
DROP POLICY IF EXISTS "resumes_update_policy" ON public.resumes;
DROP POLICY IF EXISTS "resumes_delete_policy" ON public.resumes;
DROP POLICY IF EXISTS "Users can access their own non-deleted resumes" ON public.resumes;

-- -----------------------------------------------------------------------------
-- 1. SELECT POLICY: Users can ONLY read their own non-deleted resumes
-- -----------------------------------------------------------------------------
CREATE POLICY "resumes_select_policy"
  ON public.resumes
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.users 
      WHERE clerk_id = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
         OR id::text = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
    )
    AND deleted_at IS NULL
  );

-- -----------------------------------------------------------------------------
-- 2. INSERT POLICY: Users can ONLY insert resumes belonging to themselves
-- -----------------------------------------------------------------------------
CREATE POLICY "resumes_insert_policy"
  ON public.resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.users 
      WHERE clerk_id = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
         OR id::text = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
    )
  );

-- -----------------------------------------------------------------------------
-- 3. UPDATE POLICY: Users can ONLY update their own non-deleted resumes
-- -----------------------------------------------------------------------------
CREATE POLICY "resumes_update_policy"
  ON public.resumes
  FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.users 
      WHERE clerk_id = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
         OR id::text = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.users 
      WHERE clerk_id = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
         OR id::text = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
    )
  );

-- -----------------------------------------------------------------------------
-- 4. DELETE POLICY: Users can ONLY delete (hard or soft) their own resumes
-- -----------------------------------------------------------------------------
CREATE POLICY "resumes_delete_policy"
  ON public.resumes
  FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.users 
      WHERE clerk_id = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
         OR id::text = (NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''))
    )
  );
