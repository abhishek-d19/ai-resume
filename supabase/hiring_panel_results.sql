-- ============================================================================
-- LUMINA AI RESUME PLATFORM — HIRING PANEL RESULTS TABLE MIGRATION
-- Table: public.hiring_panel_results
-- Description: Stores AI hiring panel evaluations, 3-reviewer persona critiques,
--              consensus decisions, confidence scores, and LLM provider metrics.
-- ============================================================================

-- 1. Create Table Definition
CREATE TABLE IF NOT EXISTS public.hiring_panel_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('Strong Hire', 'Hire', 'Maybe', 'No Hire')),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    reviewer_outputs JSONB NOT NULL,
    consensus JSONB NOT NULL,
    provider TEXT NOT NULL DEFAULT 'openai',
    model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_hiring_panel_resume_id ON public.hiring_panel_results(resume_id);
CREATE INDEX IF NOT EXISTS idx_hiring_panel_created_at ON public.hiring_panel_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hiring_panel_decision ON public.hiring_panel_results(decision);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.hiring_panel_results ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policies

-- Policy A: Users can SELECT panel results for their own resumes
CREATE POLICY "Users can view hiring panel results for their own resumes"
    ON public.hiring_panel_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.hiring_panel_results.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy B: Users can INSERT panel results for their own resumes
CREATE POLICY "Users can insert hiring panel results for their own resumes"
    ON public.hiring_panel_results
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.hiring_panel_results.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy C: Service Role full admin access
CREATE POLICY "Service Role full access on hiring_panel_results"
    ON public.hiring_panel_results
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
