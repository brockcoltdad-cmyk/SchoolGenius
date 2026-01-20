-- SchoolGenius Missing Tables Migration
-- Run this in Supabase SQL Editor
-- Generated: January 19, 2026

-- ============================================
-- 1. THEMES - Theme catalog
-- ============================================
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  is_free BOOLEAN DEFAULT false,
  price_coins INTEGER DEFAULT 0,
  min_grade INTEGER DEFAULT 0,
  max_grade INTEGER DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default free themes
INSERT INTO themes (id, name, emoji, is_free, price_coins) VALUES
  ('default', 'Default', '🎓', true, 0),
  ('dinosaur', 'Dinosaur', '🦕', true, 0),
  ('space', 'Space', '🚀', true, 0),
  ('unicorn', 'Unicorn', '🦄', true, 0),
  ('robot', 'Robot', '🤖', true, 0),
  ('pirate', 'Pirate', '🏴‍☠️', true, 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. STUDENT_THEMES - Theme ownership/purchases
-- ============================================
CREATE TABLE IF NOT EXISTS student_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, theme_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_student_themes_student ON student_themes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_themes_active ON student_themes(student_id, is_active) WHERE is_active = true;

-- ============================================
-- 3. FAMILIES - Family grouping for monitoring
-- ============================================
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_families_parent ON families(parent_id);

-- ============================================
-- 4. MONITORING_ALERTS - AI monitoring alerts
-- ============================================
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'struggle', 'achievement', 'concern', 'milestone'
  severity TEXT DEFAULT 'info', -- 'info', 'warning', 'urgent'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_child ON monitoring_alerts(child_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_alerts_unread ON monitoring_alerts(child_id, is_read) WHERE is_read = false;

-- ============================================
-- 5. MONITORING_INSIGHTS - AI insights
-- ============================================
CREATE TABLE IF NOT EXISTS monitoring_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'learning_style', 'strength', 'improvement_area'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.5,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitoring_insights_child ON monitoring_insights(child_id);

-- ============================================
-- 6. NOTIFICATION_PREFERENCES - Email settings
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_daily_summary BOOLEAN DEFAULT true,
  email_weekly_report BOOLEAN DEFAULT true,
  email_achievements BOOLEAN DEFAULT true,
  email_concerns BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 7. SYLLABUS_SETTINGS - Custom syllabus modes
-- ============================================
CREATE TABLE IF NOT EXISTS syllabus_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mode TEXT DEFAULT 'standard', -- 'standard', 'custom', 'scanned'
  subjects_enabled JSONB DEFAULT '["math", "reading", "spelling", "typing", "coding"]',
  daily_goal_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id)
);

-- ============================================
-- 8. CUSTOM_SYLLABUS - Custom curriculum content
-- ============================================
CREATE TABLE IF NOT EXISTS custom_syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  week_number INTEGER,
  content JSONB NOT NULL,
  source TEXT DEFAULT 'manual', -- 'manual', 'scanned', 'ai_generated'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_syllabus_child ON custom_syllabus(child_id);

-- ============================================
-- 9. DAILY_SUMMARIES - Daily progress summaries
-- ============================================
CREATE TABLE IF NOT EXISTS daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lessons_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  subjects_practiced JSONB DEFAULT '[]',
  highlights JSONB DEFAULT '[]',
  areas_to_improve JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, summary_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_summaries_child_date ON daily_summaries(child_id, summary_date DESC);

-- ============================================
-- 10. SHOP_ITEMS - Shop items (non-theme)
-- ============================================
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'accessory', -- 'accessory', 'power_up', 'cosmetic'
  price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. STUDENT_PURCHASES - Purchase history
-- ============================================
CREATE TABLE IF NOT EXISTS student_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, item_id)
);

-- ============================================
-- 12. STUDENT_SKINS - Character skins
-- ============================================
CREATE TABLE IF NOT EXISTS student_skins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  skin_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, theme_id, skin_id)
);

CREATE INDEX IF NOT EXISTS idx_student_skins_student ON student_skins(student_id);

-- ============================================
-- 13. COIN_TRANSACTIONS - Coin history
-- ============================================
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = earned, negative = spent
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coin_transactions_student ON coin_transactions(student_id, created_at DESC);

-- ============================================
-- Enable RLS on all new tables
-- ============================================
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Themes: Anyone can read
CREATE POLICY "Themes are viewable by everyone" ON themes FOR SELECT USING (true);

-- Student themes: Parents can manage their children's themes
CREATE POLICY "Parents can view children themes" ON student_themes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = student_themes.student_id AND c.parent_id = auth.uid()
  ));

CREATE POLICY "Parents can insert children themes" ON student_themes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM children c WHERE c.id = student_themes.student_id AND c.parent_id = auth.uid()
  ));

CREATE POLICY "Parents can update children themes" ON student_themes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = student_themes.student_id AND c.parent_id = auth.uid()
  ));

-- Families: Parents can manage their own families
CREATE POLICY "Users can view own families" ON families FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Users can create own families" ON families FOR INSERT WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own families" ON families FOR UPDATE USING (parent_id = auth.uid());

-- Monitoring alerts: Parents can view alerts for their children
CREATE POLICY "Parents can view children alerts" ON monitoring_alerts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = monitoring_alerts.child_id AND c.parent_id = auth.uid()
  ));

CREATE POLICY "Parents can update children alerts" ON monitoring_alerts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = monitoring_alerts.child_id AND c.parent_id = auth.uid()
  ));

-- Notification preferences: Users manage their own
CREATE POLICY "Users can manage own notification prefs" ON notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- Syllabus settings: Parents can manage for their children
CREATE POLICY "Parents can manage children syllabus settings" ON syllabus_settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = syllabus_settings.child_id AND c.parent_id = auth.uid()
  ));

-- Custom syllabus: Parents can manage for their children
CREATE POLICY "Parents can manage children custom syllabus" ON custom_syllabus
  FOR ALL USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = custom_syllabus.child_id AND c.parent_id = auth.uid()
  ));

-- Daily summaries: Parents can view their children's summaries
CREATE POLICY "Parents can view children summaries" ON daily_summaries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = daily_summaries.child_id AND c.parent_id = auth.uid()
  ));

-- Shop items: Everyone can view active items
CREATE POLICY "Shop items viewable by everyone" ON shop_items FOR SELECT USING (is_active = true);

-- Student purchases: Parents can view/manage children's purchases
CREATE POLICY "Parents can manage children purchases" ON student_purchases
  FOR ALL USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = student_purchases.student_id AND c.parent_id = auth.uid()
  ));

-- Student skins: Parents can manage children's skins
CREATE POLICY "Parents can manage children skins" ON student_skins
  FOR ALL USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = student_skins.student_id AND c.parent_id = auth.uid()
  ));

-- Coin transactions: Parents can view children's transactions
CREATE POLICY "Parents can view children transactions" ON coin_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM children c WHERE c.id = coin_transactions.student_id AND c.parent_id = auth.uid()
  ));

CREATE POLICY "System can insert transactions" ON coin_transactions FOR INSERT WITH CHECK (true);

-- ============================================
-- Done!
-- ============================================
SELECT 'Migration complete! Created 13 tables with RLS policies.' as status;
