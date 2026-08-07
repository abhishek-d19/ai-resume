-- ============================================================================
-- LUMINA AI RESUME PLATFORM — JD MATCHES TABLE MIGRATION
-- Table: public.jd_matches
-- Description: Stores AI Job Description competency match results, raw job
--              description inputs, match scores, analysis JSON, and LLM provider metrics.
-- ============================================================================

-- 1. Create Table Definition
CREATE TABLE IF NOT EXISTS public.jd_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    analysis_json JSONB NOT NULL,
    provider TEXT NOT NULL DEFAULT 'openai',
    model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Performance Indexes (Supporting fast historical queries & score trend analysis)
CREATE INDEX IF NOT EXISTS idx_jd_matches_resume_id ON public.jd_matches(resume_id);
CREATE INDEX IF NOT EXISTS idx_jd_matches_created_at ON public.jd_matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jd_matches_score ON public.jd_matches(match_score);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.jd_matches ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policies

-- Policy A: Users can SELECT JD match records for their own resumes
CREATE POLICY "Users can view JD matches for their own resumes"
    ON public.jd_matches
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.jd_matches.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy B: Users can INSERT JD match records for their own resumes
CREATE POLICY "Users can insert JD matches for their own resumes"
    ON public.jd_matches
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.jd_matches.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy C: Service Role full admin access
CREATE POLICY "Service Role full access on jd_matches"
    ON public.jd_matches
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
