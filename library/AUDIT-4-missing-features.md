# AUDIT 4: Missing Features
**Date:** 2026-01-17
**Source:** SCHOOLGENIUS-MASTER-IMPLEMENTATION.md vs Actual Codebase

---

## CRITICAL MISSING: Database Tables

| Table | Target Rows | Actual Rows | Status |
|-------|-------------|-------------|--------|
| rule_teaching_scripts | 150 | 0 | NOT CREATED |
| demo_problems | 500 | 0 | NOT CREATED |
| guided_practice | 750 | 0 | NOT CREATED |
| weekly_quizzes | 600 | 0 | NOT CREATED |
| monthly_reviews | 150 | 0 | NOT CREATED |
| practice_problems | 200,000 | 320,652 | EXCEEDS TARGET |

---

## CRITICAL MISSING: 6-Phase Lesson Flow

The master file defines a 6-phase gradual release model. Current implementation skips phases.

| Phase | Name | Description | Status |
|-------|------|-------------|--------|
| 0 | Placement Test | Determine starting level | EXISTS at /kid/[id]/placement-test |
| 1 | Rule Teaching (I DO) | Gigi teaches, kid watches | NOT IMPLEMENTED |
| 2 | Demo Problems (I DO) | Gigi solves 3 examples | NOT IMPLEMENTED |
| 3 | Guided Practice (WE DO) | Kid tries 5 with hints | NOT IMPLEMENTED |
| 4 | Independent Practice (YOU DO) | Kid does 10-20 alone | EXISTS |
| 5 | Rule Quiz | 80% to pass | EXISTS at /kid/[id]/weekly-test |
| 6 | Weekly Rules Test | Test all week's rules | EXISTS |
| 7 | Monthly Review | Comprehensive test | NOT IMPLEMENTED |
| 8 | Mastery Practice Modes | Unlocked after passing | NOT IMPLEMENTED |

**Impact:** Currently kids jump straight to practice without learning the rules first. This defeats the "Rules-First" philosophy.

---

## MISSING: Practice Modes (After Mastery)

Master file defines 8 practice modes that unlock after 80% quiz pass:

| Mode | Description | Status |
|------|-------------|--------|
| Quick Quiz | 10 random questions, 5 min | NOT IMPLEMENTED |
| Speed Run | Beat the clock, 3 min | NOT IMPLEMENTED |
| Accuracy Challenge | No mistakes allowed | NOT IMPLEMENTED |
| Mixed Review | All mastered skills, 10 min | NOT IMPLEMENTED |
| Boss Battle | Harder problems | NOT IMPLEMENTED |
| Daily Challenge | New every day, 5 min | NOT IMPLEMENTED |
| Beat Your Score | Personal best | NOT IMPLEMENTED |
| Mystery Challenge | Random mix, 5 min | NOT IMPLEMENTED |

---

## MISSING: Special Features

| Feature | Description | Status |
|---------|-------------|--------|
| Certificate System | Printable certificates for mastery | NOT IMPLEMENTED |
| Review Session | Review rules before weekly/monthly tests | NOT IMPLEMENTED |
| Cross-Subject Integration | Typing feeds into Spelling/Writing | NOT IMPLEMENTED |
| Rive AI Animations | High-quality educational animations | NOT IMPLEMENTED |
| Parent Progress Report | Detailed weekly reports | PARTIAL - basic data view exists |

---

## MISSING: Content Types

| Content Type | Purpose | Count Needed | Status |
|--------------|---------|--------------|--------|
| Rule Teaching Scripts | Phase 1 teaching | 150 | NOT CREATED |
| Demo Problem Walkthroughs | Phase 2 examples | 500 | NOT CREATED |
| Guided Practice Problems | Phase 3 with hints | 750 | NOT CREATED |
| Weekly Quiz Templates | Phase 5 assessments | 600 | NOT CREATED |
| Monthly Review Tests | Phase 7 comprehensive | 150 | NOT CREATED |

---

## PAGES EXIST BUT MISSING NAVIGATION

| Page | Path | Nav Link |
|------|------|----------|
| Syllabus | /kid/[id]/syllabus | NO LINK |
| Progress | /kid/[id]/progress | NO LINK |
| Achievements | /kid/[id]/achievements | NO LINK |
| Start Day | /kid/[id]/start-day | NO LINK |
| Games | /kid/[id]/games | NO LINK |

---

## TWO-TIER EXPLANATION SYSTEM

**Defined in master file:**
- tier1: Standard explanation (max 25 words)
- tier2: SIMPLER explanation (max 20 words)
- 3 wrong → Back to Rule Teaching

**Current status:** tier1/tier2 fields exist in practice_problems but Rule Teaching phase doesn't exist to return to.

---

## COPPA COMPLIANCE GAPS

| Requirement | Status |
|-------------|--------|
| NO LIVE AI for under 13 | PARTIAL - Chat uses Haiku |
| All content pre-seeded | PARTIAL - missing phases 1-3, 7 |
| Gigi = pre-scripted only | NOT ENFORCED |
| Button-only for under 13 | NOT ENFORCED |
| Max Grade 7 cap | NOT ENFORCED |

---

## CONTENT COUNT GAPS

**Master file targets:**

| Subject | Target | Current Estimate |
|---------|--------|------------------|
| Math | 138,000 | ~250,000 practice |
| Reading | 82,000 | ~30,000 |
| Spelling | 41,000 | ~30,000 |
| Writing | 20,000 | ~5,000 |
| Coding | 17,000 | ~5,000 |
| Typing | 20,000 | ~10,500 |
| **TOTAL** | **318,000** | **~330,000** |

Practice problems exist but Phases 1-3, 5, 7 content is MISSING.

---

## PRIORITY FIX ORDER

### P0 - CRITICAL (Blocks core functionality)
1. Create rule_teaching_scripts table and content (Phase 1)
2. Create demo_problems table and content (Phase 2)
3. Create guided_practice table and content (Phase 3)
4. Update lesson player to use 6-phase flow

### P1 - HIGH (Core features)
5. Create weekly_quizzes content (Phase 5)
6. Create monthly_reviews content (Phase 7)
7. Implement practice modes (Phase 8)
8. Add navigation to hidden pages

### P2 - MEDIUM (Polish)
9. Certificate system
10. Parent progress reports
11. Review session before tests
12. Cross-subject integration

### P3 - LOW (Future)
13. Rive AI animations
14. Advanced gamification

---

## SUMMARY

**What's built:** Practice problems, basic lesson flow, themes, shop, chat
**What's missing:** The entire gradual release teaching model (Phases 1-3, 7, 8)

**The app has content but lacks the TEACHING methodology that makes SchoolGenius unique.**

Kids currently jump straight to practice without:
- Learning the rules first
- Seeing worked examples
- Getting guided practice with hints

This is the #1 gap to fix.
