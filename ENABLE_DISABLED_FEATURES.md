# Enable Disabled Features - Step by Step Guide

Three features were disabled because their database tables don't exist. This guide shows you exactly how to enable them.

---

## 🔐 Feature 1: Parent PIN Authentication

### What It Does
Allows parents to set a PIN that protects child accounts and settings.

### Why It's Disabled
The `profiles` table doesn't have a `parent_pin` column.

### How to Enable

#### Step 1: Run SQL Migration
```sql
-- Add parent_pin column to profiles table
ALTER TABLE profiles
ADD COLUMN parent_pin TEXT;

-- Add index for performance
CREATE INDEX idx_profiles_parent_pin
ON profiles(parent_pin);
```

#### Step 2: Enable Code in `lib/auth-context.tsx`

**Line 81-84:** Uncomment PIN insertion in signup
```typescript
// CURRENTLY:
const { error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: authData.user.id,
    email: email,
    // parent_pin: hashedPin, // Field doesn't exist
  });

// CHANGE TO:
const hashedPin = await hashPIN(pin);

const { error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: authData.user.id,
    email: email,
    parent_pin: hashedPin,
  });
```

**Lines 117-131:** Uncomment verifyParentPIN implementation
```typescript
// CURRENTLY:
const verifyParentPIN = async (pin: string): Promise<boolean> => {
  if (!user) return false;
  console.warn('Parent PIN verification is disabled...');
  return true;
  /* Original implementation - requires parent_pin column:
  ...commented code...
  */
};

// CHANGE TO: (uncomment the original implementation)
const verifyParentPIN = async (pin: string): Promise<boolean> => {
  if (!user) return false;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('parent_pin')
      .eq('id', user.id)
      .single();

    if (error || !data) return false;

    return await verifyPIN(pin, data.parent_pin);
  } catch {
    return false;
  }
};
```

**Lines 142-159:** Uncomment updateParentPIN implementation
```typescript
// CURRENTLY:
const updateParentPIN = async (newPin: string) => {
  if (!user) return { error: 'Not authenticated' };
  console.warn('Parent PIN update is disabled...');
  return { error: 'PIN functionality is not available...' };
  /* Original implementation...*/
};

// CHANGE TO: (uncomment the original implementation)
const updateParentPIN = async (newPin: string) => {
  if (!user) return { error: 'Not authenticated' };

  try {
    const hashedPin = await hashPIN(newPin);

    const { error } = await supabase
      .from('profiles')
      .update({ parent_pin: hashedPin })
      .eq('id', user.id);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    return { error: error.message || 'Failed to update PIN' };
  }
};
```

#### Step 3: Test
1. Sign up a new account with PIN
2. Try to verify PIN
3. Try to update PIN
4. Verify child protection features work

---

## 🔔 Feature 2: Notification Settings

### What It Does
Allows parents to configure email/SMS notifications for achievements, progress reports, etc.

### Why It's Disabled
The `notification_settings` table doesn't exist.

### How to Enable

#### Step 1: Create Table
```sql
-- Create notification_settings table
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  weekly_report BOOLEAN DEFAULT true,
  achievement_alerts BOOLEAN DEFAULT true,
  progress_alerts BOOLEAN DEFAULT true,
  story_completion_alerts BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for security
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Parents can view their own settings
CREATE POLICY "Users can view their own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = parent_id);

-- Parents can update their own settings
CREATE POLICY "Users can update their own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = parent_id);

-- Parents can insert their own settings
CREATE POLICY "Users can insert their own notification settings"
  ON notification_settings FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Step 2: Enable Code in `lib/auth-context.tsx`

**Lines 88-92:** Uncomment notification settings creation
```typescript
// CURRENTLY:
// Note: notification_settings table doesn't exist in current schema
// If notification settings are needed, create this table first

router.push('/dashboard/add-child');
return {};

// CHANGE TO:
const { error: notifError } = await supabase
  .from('notification_settings')
  .insert({
    parent_id: authData.user.id,
  });

router.push('/dashboard/add-child');
return {};
```

#### Step 3: Create Settings Page (New File)
Create `app/dashboard/settings/page.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    weekly_report: true,
    achievement_alerts: true,
    progress_alerts: true,
    story_completion_alerts: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    if (!user) return;

    const supabase = createClient();
    const { data } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('parent_id', user.id)
      .maybeSingle();

    if (data) {
      setSettings(data);
    }
  }

  async function updateSettings(key: string, value: boolean) {
    if (!user) return;

    const supabase = createClient();
    await supabase
      .from('notification_settings')
      .update({ [key]: value })
      .eq('parent_id', user.id);

    setSettings({ ...settings, [key]: value });
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>

      {/* Add your UI here */}
    </div>
  );
}
```

#### Step 4: Test
1. Sign up new account
2. Check notification_settings table has row
3. Navigate to settings page
4. Toggle notification preferences
5. Verify updates persist

---

## 🧠 Feature 3: Learning Profile Analytics

### What It Does
AI-powered learning style analysis that adapts teaching methods to each child's unique learning patterns.

### Why It's Disabled
Missing `answer_attempts` and `learning_profiles` tables.

### How to Enable

#### Step 1: Create Tables
```sql
-- Table to track every answer attempt
CREATE TABLE answer_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL,
  question_text TEXT,
  answer_given TEXT,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER,
  help_requested BOOLEAN DEFAULT false,
  tutor_intervened BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store learning profile analysis
CREATE TABLE learning_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE UNIQUE,

  -- Learning style assessment
  primary_learning_style TEXT CHECK (primary_learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')),
  secondary_learning_style TEXT CHECK (secondary_learning_style IN ('visual', 'auditory', 'reading', 'kinesthetic')),

  -- Pace and difficulty preferences
  preferred_pace TEXT CHECK (preferred_pace IN ('slow', 'medium', 'fast')),
  frustration_threshold INTEGER DEFAULT 5,

  -- Behavioral preferences
  needs_more_examples BOOLEAN DEFAULT false,
  responds_to_encouragement BOOLEAN DEFAULT true,
  responds_to_challenges BOOLEAN DEFAULT true,

  -- Subject preferences
  strongest_subjects TEXT[] DEFAULT '{}',
  weakest_subjects TEXT[] DEFAULT '{}',
  favorite_subjects TEXT[] DEFAULT '{}',
  preferred_example_types TEXT[] DEFAULT '{}',

  -- Session preferences
  best_time_of_day TEXT CHECK (best_time_of_day IN ('morning', 'afternoon', 'evening')),
  average_session_length INTEGER,

  -- Performance metrics
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  total_questions_answered INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  overall_accuracy NUMERIC(5,2) DEFAULT 0,
  learning_style_confidence NUMERIC(5,2) DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_answer_attempts_child_id ON answer_attempts(child_id);
CREATE INDEX idx_answer_attempts_skill_id ON answer_attempts(skill_id);
CREATE INDEX idx_answer_attempts_created_at ON answer_attempts(created_at);
CREATE INDEX idx_learning_profiles_child_id ON learning_profiles(child_id);

-- Add RLS policies
ALTER TABLE answer_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_profiles ENABLE ROW LEVEL SECURITY;

-- Parents can view their children's data
CREATE POLICY "Parents can view their children's answer attempts"
  ON answer_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = answer_attempts.child_id
      AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children's learning profiles"
  ON learning_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = learning_profiles.child_id
      AND children.parent_id = auth.uid()
    )
  );

-- System can insert/update learning data
CREATE POLICY "System can insert answer attempts"
  ON answer_attempts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can manage learning profiles"
  ON learning_profiles FOR ALL
  USING (true);

-- Trigger to update timestamps
CREATE TRIGGER update_learning_profiles_updated_at
  BEFORE UPDATE ON learning_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Step 2: Enable Code
**Edit `lib/learning-profile-analyzer.ts`:**

Remove the first 5 lines:
```typescript
// DELETE THESE LINES:
// @ts-nocheck
// This file is disabled because it uses tables that don't exist in the current schema:
// - answer_attempts table
// - learning_profiles table
// If you need this functionality, create these tables first or refactor to use existing tables
```

#### Step 3: Track Answer Attempts
In your lesson components, add tracking:

```typescript
// In components/LessonViewer.tsx (or similar)
async function recordAnswerAttempt(
  childId: string,
  skillId: string,
  questionText: string,
  answerGiven: string,
  isCorrect: boolean,
  timeSpent: number
) {
  const supabase = createClient();

  await supabase.from('answer_attempts').insert({
    child_id: childId,
    skill_id: skillId,
    question_text: questionText,
    answer_given: answerGiven,
    is_correct: isCorrect,
    time_spent_seconds: timeSpent,
  });
}
```

#### Step 4: Generate Learning Profiles
```typescript
import { analyzeLearningProfile } from '@/lib/learning-profile-analyzer';

// Call this after a child completes multiple lessons
async function updateChildLearningProfile(childId: string) {
  await analyzeLearningProfile(childId);
}
```

#### Step 5: Create Dashboard View (New File)
Create `app/dashboard/analytics/[childId]/page.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function ChildAnalyticsPage({
  params
}: {
  params: Promise<{ childId: string }>
}) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { childId } = await params;
    const supabase = createClient();

    const { data } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('child_id', childId)
      .maybeSingle();

    setProfile(data);
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Learning Analytics</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h2 className="font-bold">Learning Style</h2>
          <p>{profile.primary_learning_style}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-bold">Preferred Pace</h2>
          <p>{profile.preferred_pace}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-bold">Overall Accuracy</h2>
          <p>{profile.overall_accuracy}%</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-bold">Confidence Level</h2>
          <p>{profile.confidence_level}</p>
        </div>
      </div>
    </div>
  );
}
```

#### Step 6: Test
1. Complete several lessons with a child account
2. Verify answer_attempts are being recorded
3. Run learning profile analysis
4. Check learning_profiles table for generated insights
5. View analytics dashboard

---

## ✅ Verification Checklist

After enabling each feature:

### Parent PIN
- [ ] SQL migration ran successfully
- [ ] Can sign up with PIN
- [ ] PIN is hashed and stored
- [ ] Can verify PIN when accessing protected areas
- [ ] Can update PIN in settings

### Notification Settings
- [ ] Table created successfully
- [ ] Settings created on signup
- [ ] Can view settings page
- [ ] Can toggle preferences
- [ ] Changes persist in database

### Learning Analytics
- [ ] Both tables created successfully
- [ ] Answer attempts are recorded
- [ ] Learning profiles can be generated
- [ ] Analytics dashboard displays data
- [ ] Insights are actionable

---

## 🚨 Troubleshooting

### Issue: SQL Migration Fails
- Check Supabase connection
- Verify you have admin access
- Check for naming conflicts
- Review error messages in Supabase console

### Issue: TypeScript Errors After Enabling
- Regenerate types: `supabase gen types typescript`
- Restart TypeScript server in IDE
- Check imports are correct

### Issue: RLS Policies Block Access
- Check user is authenticated
- Verify parent_id or child_id matches
- Review RLS policies in Supabase console
- Test with service role key temporarily

---

## 📚 Additional Resources

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase TypeScript Support](https://supabase.com/docs/reference/javascript/typescript-support)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Last Updated:** January 11, 2026
**See Also:**
- FIXES_SUMMARY.md - Complete change log
- SCHEMA_MIGRATION_GUIDE.md - Quick reference
