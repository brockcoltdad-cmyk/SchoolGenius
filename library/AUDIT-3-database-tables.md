# AUDIT 3: Database Tables
**Date:** 2026-01-17
**Database:** Supabase (PostgreSQL)

---

## Table Row Counts

| TABLE NAME | ROW COUNT | STATUS |
|------------|-----------|--------|
| practice_problems | 320,652 | SEEDED |
| mistake_patterns | 3,214 | SEEDED |
| explanation_library | 358 | SEEDED |
| stories | 302 | SEEDED |
| lesson_content | 123 | SEEDED |
| parent_help_articles | 60 | SEEDED |
| qa_library | 20 | SEEDED |
| achievements | 16 | SEEDED |
| themes | 6 | SEEDED |
| children | 2 | TEST DATA |
| profiles | 1 | TEST DATA |
| coins_transactions | 0 | EMPTY |
| prizes | null | NOT CREATED |
| learning_profiles | null | NOT CREATED |
| answer_attempts | null | NOT CREATED |
| audio_cache | null | NOT CREATED |
| documents | null | NOT CREATED |
| custom_skins | null | NOT CREATED |
| weekly_test_results | null | NOT CREATED |
| syllabi | null | NOT CREATED |
| daily_schedules | null | NOT CREATED |
| child_themes | null | NOT CREATED |
| child_achievements | null | NOT CREATED |

---

## Summary

### Content Tables (SEEDED)
- **Total rows:** 324,751
- **Biggest table:** practice_problems (320,652)
- **Tables with data:** 11

### Empty/Missing Tables
- **Empty:** coins_transactions
- **Not created:** 11 tables

---

## Tables Needing Creation

1. **prizes** - Prize catalog for coin redemption
2. **learning_profiles** - Adaptive learning data
3. **answer_attempts** - Track every answer
4. **audio_cache** - TTS caching
5. **documents** - Scanned documents
6. **custom_skins** - User-created themes
7. **weekly_test_results** - Test scores
8. **syllabi** - Custom syllabi
9. **daily_schedules** - Daily lesson schedules
10. **child_themes** - Purchased themes per child
11. **child_achievements** - Earned achievements per child

---

## Content Breakdown

| Subject | practice_problems |
|---------|------------------|
| Math K-12 | ~250,000+ |
| Typing K-7 | ~10,500 |
| Spelling | ~30,000+ |
| Reading | ~30,000+ |

---

## Database Health: GOOD

Core content is seeded. Missing tables are for features not yet implemented.
