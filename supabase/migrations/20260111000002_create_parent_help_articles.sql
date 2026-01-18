-- Create parent_help_articles table for FAQ content
CREATE TABLE IF NOT EXISTS public.parent_help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question_pattern TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_parent_help_category ON public.parent_help_articles(category);
CREATE INDEX IF NOT EXISTS idx_parent_help_keywords ON public.parent_help_articles USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_parent_help_search ON public.parent_help_articles USING GIN(to_tsvector('english', question_pattern || ' ' || answer));

-- Enable RLS
ALTER TABLE public.parent_help_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (FAQs are public)
CREATE POLICY "Allow public read access" ON public.parent_help_articles
  FOR SELECT
  USING (true);

-- Service role can insert/update
CREATE POLICY "Service role can manage" ON public.parent_help_articles
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

COMMENT ON TABLE public.parent_help_articles IS 'Pre-generated FAQ articles for parents - closed loop cost savings';
