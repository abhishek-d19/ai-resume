-- ============================================================================
-- LUMINA AI RESUME PLATFORM — RESUME ANALYSIS TABLE MIGRATION
-- Table: public.resume_analysis
-- Description: Stores append-only historical AI resume analyses, ATS scores,
--              structured JSON audits, executive summaries, and LLM prompt metadata.
-- ============================================================================

-- 1. Create Table Definition
CREATE TABLE IF NOT EXISTS public.resume_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
    analysis_json JSONB NOT NULL,
    executive_summary TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'openai',
    model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    prompt_version TEXT NOT NULL DEFAULT '2.1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Performance Indexes (Supporting fast history timeline queries & score analytics)
CREATE INDEX IF NOT EXISTS idx_resume_analysis_resume_id ON public.resume_analysis(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_created_at ON public.resume_analysis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_scores ON public.resume_analysis(overall_score, ats_score);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policies

-- Policy A: Users can SELECT analysis history belonging to their own resumes
CREATE POLICY "Users can view their own resume analysis history"
    ON public.resume_analysis
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.resume_analysis.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy B: Users can INSERT new analysis records for their own resumes
CREATE POLICY "Users can insert analysis for their own resumes"
    ON public.resume_analysis
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE public.resumes.id = public.resume_analysis.resume_id
              AND public.resumes.user_id IN (
                  SELECT id FROM public.users WHERE clerk_id = auth.uid()::text
              )
        )
    );

-- Policy C: Service Role full admin access
CREATE POLICY "Service Role full access on resume_analysis"
    ON public.resume_analysis
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
