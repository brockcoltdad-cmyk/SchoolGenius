# Schema Migration Quick Reference Guide

**For Developers:** This is your quick reference for the database schema changes.

---

## 🔄 Table Name Changes

Use this as a cheat sheet when working with the codebase:

| If you see in old code... | Use this instead... | Notes |
|---------------------------|---------------------|-------|
| `story_attempts` | `student_stories_read` | Tracks story completions |
| `owned_themes` | `student_themes` | Tracks purchased themes |
| `disabled_themes` | `student_themes` WHERE `is_active = false` | No separate table |
| `lesson_progress` | `student_skill_progress` | Tracks skill completion |
| `extracted_calendar_events` | `kid_school_events` | Calendar events |
| `scanned_homework` | `kid_scanned_docs` | Scanned documents |

## 🔄 Column Name Changes

| Table | Old Column | New Column | Type |
|-------|-----------|------------|------|
| `children` | `selected_theme_skin` | Use `student_skins` table | - |
| `children` | `theme_xp` | `xp` | number |
| `children` | `theme_level` | `level` | number |
| `stories` | `lexile_band` | `reading_level` | string |
| `stories` | `expected_time_minutes` | Calculate from `word_count` | - |
| `stories` | `coins_reward` | Calculate dynamically | - |
| `stories` | `bonus_coins` | Calculate dynamically | - |
| `curriculum_skills` | `skill_code` | `id` | UUID |

## 🗃️ Tables That Don't Exist

These tables are referenced in code but don't exist. Features using them are disabled:

- ❌ `story_questions` - Questions stored as JSON in `stories.comprehension_questions`
- ❌ `reading_progress` - Calculate from `student_stories_read`
- ❌ `notification_settings` - Needs to be created
- ❌ `answer_attempts` - Needs to be created
- ❌ `learning_profiles` - Needs to be created

## 📝 How to Query Data

### Get Student's Owned Themes
```typescript
// OLD (broken)
const { data } = await supabase
  .from('owned_themes')
  .select('theme_id')
  .eq('child_id', childId);

// NEW (working)
const { data } = await supabase
  .from('student_themes')
  .select('theme_id')
  .eq('student_id', childId);
```

### Get Disabled Themes
```typescript
// OLD (broken)
const { data } = await supabase
  .from('disabled_themes')
  .select('theme_id')
  .eq('child_id', childId);

// NEW (working)
const { data } = await supabase
  .from('student_themes')
  .select('theme_id')
  .eq('student_id', childId)
  .eq('is_active', false);
```

### Get Student's Equipped Skin
```typescript
// OLD (broken)
const { data } = await supabase
  .from('children')
  .select('selected_theme_skin')
  .eq('id', childId)
  .single();

// NEW (working)
const { data } = await supabase
  .from('student_skins')
  .select('skin_id')
  .eq('student_id', childId)
  .eq('equipped', true)
  .maybeSingle();
```

### Track Story Completion
```typescript
// OLD (broken)
const { data } = await supabase
  .from('story_attempts')
  .insert({
    child_id: childId,
    story_id: storyId,
    started_at: new Date(),
    completed_at: new Date(),
    score: 85,
    coins_earned: 50,
  });

// NEW (working)
const { data } = await supabase
  .from('student_stories_read')
  .insert({
    student_id: childId,
    story_id: storyId,
    completed: true,
    rating: 5,
    read_at: new Date().toISOString(),
  });
```

### Track Lesson Progress
```typescript
// OLD (broken)
const { data } = await supabase
  .from('lesson_progress')
  .upsert({
    child_id: childId,
    skill_id: skillId,
    completed: true,
    score: 90,
  });

// NEW (working)
const { data } = await supabase
  .from('student_skill_progress')
  .upsert({
    student_id: childId,
    skill_code: skillId,
    completed: true,
    best_score: 90,
    questions_correct: 9,
    questions_answered: 10,
    last_practiced: new Date().toISOString(),
  });
```

### Get Story Questions
```typescript
// OLD (broken)
const { data: questions } = await supabase
  .from('story_questions')
  .select('*')
  .eq('story_id', storyId);

// NEW (working)
const { data: story } = await supabase
  .from('stories')
  .select('comprehension_questions')
  .eq('id', storyId)
  .single();

const questions = story.comprehension_questions as QuestionType[];
```

## 🔧 Common Fixes

### Fix: Type Error on Database Query
```typescript
// If you see: "Type 'X' is not assignable to type 'Y'"
// Add type casting:
const { data } = await supabase.from('children').select('*');
setChildren((data || []) as unknown as Child[]);
```

### Fix: Null/Undefined Property Access
```typescript
// OLD (risky)
const grade = child.grade_level;

// NEW (safe)
const grade = child.grade_level || '';
const coins = child.coins || 0;
```

### Fix: Story Field Access
```typescript
// OLD (broken)
const level = story.lexile_band;
const time = story.expected_time_minutes;

// NEW (working)
const level = story.reading_level || '';
const time = Math.ceil((story.word_count || 0) / 200); // ~200 words/min
```

## 🎨 Theme Colors Access

Themes now store colors as JSON:

```typescript
// OLD (broken)
const color = theme.primaryColor;

// NEW (working)
const themeColors = theme.colors as any;
const color = themeColors.primaryColor || '#3B82F6';
```

## 🚨 Important Notes

1. **Always use `student_id`** instead of `child_id` in new tables
2. **Check for null values** - many fields are nullable now
3. **Use type casting** when TypeScript complains about query results
4. **Regenerate types** after any schema changes: `supabase gen types typescript`
5. **Test database operations** - schema changes may affect existing queries

## 📦 Type Imports

```typescript
// Import from types/database.ts
import type {
  Child,
  Story,
  Theme,
  OwnedTheme,  // Alias for student_themes
  Profile
} from '@/types/database';

// For database operations
import type { Database } from '@/types/database';
type Tables = Database['public']['Tables'];
```

## 🔍 Finding What Changed

Search for these patterns in git diff to see what was changed:
- `owned_themes` → `student_themes`
- `disabled_themes` → `is_active`
- `story_attempts` → `student_stories_read`
- `lesson_progress` → `student_skill_progress`
- `child_id` → `student_id`

---

**Last Updated:** January 11, 2026
**See Also:** FIXES_SUMMARY.md for complete details
