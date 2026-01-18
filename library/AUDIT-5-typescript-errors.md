# AUDIT 5: TypeScript Errors
**Date:** 2026-01-17
**Command:** `npx tsc --noEmit`
**Total Errors:** 57

---

## Summary by Category

| Category | Count | Files Affected |
|----------|-------|----------------|
| Missing database tables in types | 18 | monitoring, syllabus, ModeSwitcher |
| Confetti prop 'active' missing | 10 | games/*, stories, WritingLessonPlayer |
| Possibly null/undefined | 8 | chat/route.ts, ReadingLessonPlayer |
| Type mismatch | 8 | settings, layout, syllabus |
| Set iteration (ES target) | 2 | weekly-test/page.tsx |
| Other | 11 | various |

---

## CATEGORY 1: Missing Database Tables (18 errors)

Tables referenced in code but NOT in Supabase types:

| Table | Files Using It |
|-------|---------------|
| `families` | monitoring/page.tsx |
| `monitoring_alerts` | monitoring/page.tsx |
| `syllabus_settings` | syllabus/[childId]/page.tsx, ModeSwitcher.tsx |
| `custom_syllabus` | syllabus/[childId]/page.tsx, SimpleSyllabusEditor.tsx |
| `scanned_homework` | syllabus pages, ScannedSyllabusViewer.tsx |
| `daily_schedule` | syllabus/page.tsx, ScannedSyllabusViewer.tsx |

**Fix:** Either create these tables in Supabase OR update types OR remove references.

---

## CATEGORY 2: Confetti Component (10 errors)

All games and some pages use `<Confetti />` without required `active` prop.

**Files:**
- app/kid/[id]/games/math-facts/page.tsx:206
- app/kid/[id]/games/number-patterns/page.tsx:201
- app/kid/[id]/games/sight-words/page.tsx:211
- app/kid/[id]/games/spelling-bee/page.tsx:173
- app/kid/[id]/games/typing-race/page.tsx:203
- app/kid/[id]/games/word-scramble/page.tsx:158
- app/kid/[id]/reading/quiz/[storyId]/page.tsx:218
- app/kid/[id]/stories/[storyId]/page.tsx:184
- components/lesson/WritingLessonPlayer.tsx:551, 625

**Fix:** Add `active={true}` or `active={showConfetti}` to all Confetti components.

---

## CATEGORY 3: Possibly Null (8 errors)

| File | Line | Issue |
|------|------|-------|
| app/api/chat/route.ts | 123-124 | `recentLessons.length` possibly undefined |
| components/lesson/ReadingLessonPlayer.tsx | 1020, 1024, 1077, 1082, 1098, 1105 | `story` possibly null |

**Fix:** Add null checks or optional chaining (`?.`).

---

## CATEGORY 4: Type Mismatches (8 errors)

| File | Line | Issue |
|------|------|-------|
| app/dashboard/monitoring/page.tsx | 143-144 | `last_activity_at` column doesn't exist |
| app/dashboard/syllabus/[childId]/page.tsx | 90 | grade_level can be null |
| app/kid/[id]/layout.tsx | 64 | String not assignable to ThemeId |
| app/kid/[id]/settings/page.tsx | 301, 315, 329, 343 | `textPrimary` doesn't exist on colors |

**Fix:** Update types or handle nullable values.

---

## CATEGORY 5: Set Iteration (2 errors)

| File | Line | Issue |
|------|------|-------|
| app/kid/[id]/weekly-test/page.tsx | 445, 645 | Set needs `--downlevelIteration` |

**Fix:** Add to tsconfig.json: `"downlevelIteration": true` OR use `Array.from(set)`.

---

## CATEGORY 6: Other (11 errors)

| File | Line | Issue |
|------|------|-------|
| app/kid/[id]/layout.tsx | 54 | Function declaration in block |
| components/parent/ScannedSyllabusViewer.tsx | 48 | Type instantiation too deep |
| components/parent/SimpleSyllabusEditor.tsx | 67 | `subjects` property doesn't exist |

---

## Priority Fixes

### Quick Wins (30 minutes)
1. Add `active` prop to all Confetti components (10 errors)
2. Add `downlevelIteration` to tsconfig (2 errors)
3. Add null checks to ReadingLessonPlayer (6 errors)

### Medium Effort (2 hours)
4. Fix type mismatches in settings/layout (6 errors)
5. Fix chat route null checks (2 errors)

### Requires Database Work (4+ hours)
6. Create missing tables OR remove unused code (18 errors)
   - families
   - monitoring_alerts
   - syllabus_settings
   - custom_syllabus
   - scanned_homework
   - daily_schedule

---

## Note

**Build still passes** because TypeScript checking is disabled in next.config.
These errors don't block the app but should be fixed for code quality.

```js
// next.config.js likely has:
typescript: {
  ignoreBuildErrors: true,
}
```
