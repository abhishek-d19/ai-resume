-- ============================================================================
-- LUMINA AI RESUME PLATFORM — JD MATCH RESULTS TABLE MIGRATION
-- Table: public.jd_match_results
-- Description: Stores AI Job Description competency match results, matched/missing
--              skill gaps, keyword coverage, and LLM provider metrics.
-- ============================================================================

-- 1. Create Table Definition
CREATE TABLE IF NOT EXISTS public.jd_match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    keyword_coverage INTEGER NOT NULL CHECK (keyword_coverage >= 0 AND keyword_coverage <= 100),
    match_json JSONB NOT NULL,
    provider TEXT NOT NULL DEFAULT 'openai',
    model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_jd_match_resume_id ON public.jd_match_results(resume_id);
CREATE INDEX IF NOT EXISTS idx_jd_match_created_at ON public.jd_match_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jd_match_score ON public.jd_match_results(match_score);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.jd_match_results ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policies

-- Policy A: Users can SELECT JD match results for their own resumes
CREATE POLICY "Users can view JD match results for their own resumes"
    ON public.jd_match_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.jd_match_results.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy B: Users can INSERT JD match results for their own resumes
CREATE POLICY "Users can insert JD match results for their own resumes"
    ON public.jd_match_results
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.jd_match_results.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy C: Service Role full admin access
CREATE POLICY "Service Role full access on jd_match_results"
    ON public.jd_match_results
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
