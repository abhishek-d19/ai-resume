-- ============================================================================
-- LUMINA AI RESUME PLATFORM — EXECUTIVE SUMMARIES TABLE MIGRATION
-- Table: public.executive_summaries
-- Description: Stores separate 150-250 word supportive recruiter-friendly
--              executive summaries generated post-resume analysis.
-- ============================================================================

-- 1. Create Table Definition
CREATE TABLE IF NOT EXISTS public.executive_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    hiring_confidence_score INTEGER NOT NULL CHECK (hiring_confidence_score >= 0 AND hiring_confidence_score <= 100),
    summary_json JSONB NOT NULL,
    provider TEXT NOT NULL DEFAULT 'openai',
    model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_exec_summary_resume_id ON public.executive_summaries(resume_id);
CREATE INDEX IF NOT EXISTS idx_exec_summary_created_at ON public.executive_summaries(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.executive_summaries ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policies

-- Policy A: Users can SELECT executive summaries for their own resumes
CREATE POLICY "Users can view executive summaries for their own resumes"
    ON public.executive_summaries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.executive_summaries.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy B: Users can INSERT executive summaries for their own resumes
CREATE POLICY "Users can insert executive summaries for their own resumes"
    ON public.executive_summaries
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.executive_summaries.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy C: Service Role full admin access
CREATE POLICY "Service Role full access on executive_summaries"
    ON public.executive_summaries
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
