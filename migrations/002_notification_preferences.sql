-- Migration: Create notification_preferences table for parent email settings
-- Date: 2025-01-18

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL,
    email TEXT NOT NULL,

    -- Toggle each notification type
    weekly_summary BOOLEAN NOT NULL DEFAULT true,
    achievement_unlocked BOOLEAN NOT NULL DEFAULT true,
    streak_milestone BOOLEAN NOT NULL DEFAULT true,
    test_results BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(parent_id)
);

-- Index for fast lookups by parent
CREATE INDEX idx_notification_preferences_parent_id ON notification_preferences(parent_id);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Parents can only see/edit their own preferences
CREATE POLICY "Users can view their own notification preferences"
    ON notification_preferences FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "Users can insert their own notification preferences"
    ON notification_preferences FOR INSERT
    WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Users can update their own notification preferences"
    ON notification_preferences FOR UPDATE
    USING (parent_id = auth.uid());

CREATE POLICY "Users can delete their own notification preferences"
    ON notification_preferences FOR DELETE
    USING (parent_id = auth.uid());
