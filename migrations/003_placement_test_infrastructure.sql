-- Migration: Placement Test Infrastructure
-- Date: 2025-01-18
-- Purpose: Store placement test results and subject-specific grade levels

-- ============================================
-- 1. PLACEMENT_TEST_RESULTS TABLE
-- Stores full placement test results
-- ============================================
CREATE TABLE IF NOT EXISTS placement_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    results JSONB NOT NULL,
    taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_placement_test_results_child_id ON placement_test_results(child_id);
CREATE INDEX idx_placement_test_results_taken_at ON placement_test_results(taken_at);

-- ============================================
-- 2. ADD SUBJECT-SPECIFIC GRADE COLUMNS TO CHILDREN
-- Allows different grade levels per subject
-- ============================================
ALTER TABLE children ADD COLUMN IF NOT EXISTS math_grade INTEGER DEFAULT NULL;
ALTER TABLE children ADD COLUMN IF NOT EXISTS reading_grade INTEGER DEFAULT NULL;
ALTER TABLE children ADD COLUMN IF NOT EXISTS spelling_grade INTEGER DEFAULT NULL;
ALTER TABLE children ADD COLUMN IF NOT EXISTS writing_grade INTEGER DEFAULT NULL;
ALTER TABLE children ADD COLUMN IF NOT EXISTS typing_grade INTEGER DEFAULT NULL;
ALTER TABLE children ADD COLUMN IF NOT EXISTS coding_grade INTEGER DEFAULT NULL;
ALTER TABLE children ADD COLUMN IF NOT EXISTS placement_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE children ADD COLUMN IF NOT EXISTS placement_completed_at TIMESTAMPTZ DEFAULT NULL;

-- ============================================
-- 3. ENABLE RLS
-- ============================================
ALTER TABLE placement_test_results ENABLE ROW LEVEL SECURITY;

-- Parents can view their children's placement results
CREATE POLICY "Users can view their children's placement_test_results"
    ON placement_test_results FOR SELECT
    USING (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));

-- Parents can insert placement results for their children
CREATE POLICY "Users can insert their children's placement_test_results"
    ON placement_test_results FOR INSERT
    WITH CHECK (child_id IN (SELECT id FROM children WHERE parent_id = auth.uid()));
