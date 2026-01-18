# OVER 13 SEEDING - COMPLETE REFERENCE (14+)

**Purpose:** Everything needed for 8-12 seeding (High School)
**Last Updated:** 2026-01-16
**Priority:** LOW - Focus on under-13 first

---

## SECTION 1: KEY DIFFERENCE FROM UNDER 13

```
┌─────────────────────────────────────────────────────────────────┐
│                    14+ = LIVE AI ALLOWED                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  • CAN use real-time AI generation                              │
│  • Seeding is OPTIONAL (cost savings only)                      │
│  • Simple format (question/answer) is FINE                      │
│  • tier1/tier2 not required (but nice to have)                  │
│                                                                 │
│  Seeding saves money but isn't required for compliance          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## SECTION 2: PROCEDURES (How To Build)

### Phil's 99/1 Rule

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORK DISTRIBUTION                             │
├─────────────────────────────────────────────────────────────────┤
│  Claude does 99%: code, research, debugging, everything         │
│  Phil does 1%: API keys, approving decisions, "yes/no"          │
│                                                                 │
│  DO NOT ask Phil to read code or make technical decisions.      │
│  JUST DO IT. Report results when done.                          │
└─────────────────────────────────────────────────────────────────┘
```

### Teaching Methodology (Rules-First)

Same 6-phase structure as under-13:

```
Phase 1: RULES (2-3 min)
Phase 2: EXAMPLES (3-5 min)
Phase 3: GUIDED PRACTICE (5 min)
Phase 4: INDEPENDENT PRACTICE (10-15 min)
Phase 5: QUIZ (5 min)
Phase 6: COMPLETE
```

### Age Group Rules (8-12)

| Grades | Ages | Teaching Style |
|--------|------|----------------|
| 8 | 13-14 | Transition - more abstract, 20-25 min lessons |
| 9-10 | 14-16 | Professional tone, college-prep focus, 25-30 min lessons |
| 11-12 | 16-18 | Professional, minimal animations, clean design, full abstract |

### Help System (14+ - Can Use Live AI)

```
┌─────────────────────────────────────────────────────────────────┐
│              HELP FLOW FOR 14+ (LIVE AI ALLOWED)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  2 wrong → Check library first, then live AI if needed          │
│  3 wrong → Level 2 explanation (library or live AI)             │
│  4 wrong → Level 3 detailed (library or live AI)                │
│  5 wrong → Level 4 visual aid (library or live AI)              │
│  5+ wrong → Walk-through or reteach                             │
│                                                                 │
│  ALWAYS check library first (cost savings)                      │
│  Live AI is backup, not primary                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Caching Procedure (Cost Savings)

```typescript
// BEFORE calling live AI - check library
const cached = await supabase
  .from('practice_problems')
  .select('*')
  .eq('skill', skill)
  .eq('grade', grade)
  .limit(1);

if (cached) return cached; // FREE

// If not cached, call live AI (costs money but allowed for 14+)
const response = await callGrok(prompt);

// SAVE back to library for next time
await supabase.from('practice_problems').insert(response);
```

### Gamification Rules

Same as under-13:

| Action | Coins | XP |
|--------|-------|-----|
| Correct answer | 1-5 | 10 |
| Lesson completed | 25 | 100 |
| Perfect quiz (10/10) | 50 | 200 |

---

## SECTION 3: ACCEPTABLE FORMAT (Simple is OK)

For 14+, this simple format works:

```json
{
  "id": "MATH-G10-QUAD-0001",
  "subject": "math",
  "grade": 10,
  "skill": "quadratic equations",
  "question": "Solve: x² + 5x + 6 = 0",
  "answer": "x = -2 or x = -3",
  "explanation": "Factor: (x+2)(x+3) = 0, so x = -2 or x = -3"
}
```

**Why simple is OK for 14+:**
- If found in cache → Return instantly (FREE)
- If NOT found → Call live AI (costs money, but ALLOWED)
- No COPPA violation

**Optional:** tier1/tier2 format still works and provides better UX, just not required.

---

## SECTION 4: SEEDING TARGET

### 150,000 Lessons (8-12)

| Subject | Lessons | Per Grade |
|---------|---------|-----------|
| Math | 70,000 | 14,000 |
| Reading/ELA | 35,000 | 7,000 |
| Writing | 20,000 | 4,000 |
| Science | 15,000 | 3,000 |
| Coding | 10,000 | 2,000 |
| **TOTAL** | **150,000** | |

### Master Seeding Prompt

| File | Coverage |
|------|----------|
| `library/grades_8_12_addendum.md` | 8-12 (150,000) |

---

## SECTION 5: HIGH SCHOOL VISUAL TYPES

| Type | Use For |
|------|---------|
| `chemistry_molecule` | Chemistry structures |
| `physics_diagram` | Vectors, motion |
| `coordinate_plane_advanced` | Algebra/Calculus graphs |
| `unit_circle` | Trigonometry |
| `proof_steps` | Geometry proofs |
| `code_editor` | Advanced coding |
| `data_table` | Science/Stats |
| `timeline` | History/ELA |
| `venn_diagram` | Compare/contrast |
| `flowchart` | Logic/Coding |

---

## SECTION 6: HIGH SCHOOL CURRICULUM

### Math (Grades 9-12)
- **Algebra 1 (G9):** Linear equations, graphing, systems, quadratics, factoring
- **Geometry (G10):** Triangle congruence, circles, trig ratios, area/volume, coordinate geometry
- **Algebra 2 (G11):** Exponentials, logarithms, polynomials, rational expressions, sequences
- **Pre-Calculus (G12):** Limits, derivatives, trig identities, vectors, matrices

### Science (Grades 9-12)
- **Biology:** Cells, genetics, evolution, ecology
- **Chemistry:** Elements, reactions, stoichiometry
- **Physics:** Motion, forces, energy, waves

### Reading/ELA
- Literary analysis, rhetorical devices
- Argument analysis, synthesis
- Research skills, citations

### Writing
- Argumentative essays, research papers
- College essays, professional writing

### Coding
- Python, JavaScript
- Data structures, algorithms
- Web development, databases

---

## SECTION 7: CURRENT STATUS (Updated 2026-01-16)

### What's in Database

| Grade | Items | Format | Status |
|-------|-------|--------|--------|
| 8 | 0 | - | EMPTY |
| 9 | 0 | - | EMPTY (deleted simple) |
| 10 | 0 | - | EMPTY (deleted simple) |
| 11 | 0 | - | EMPTY (deleted simple) |
| 12 | 0 | - | EMPTY (deleted simple) |
| **TOTAL** | **0** | | **0% of 150K target** |

### What Was Backed Up

| File | Items | Notes |
|------|-------|-------|
| `backups/simple-format-items.json` | 996 | High school simple format |

These can be re-imported later when we focus on 14+ seeding.

### Compliance Checklist

- [x] Live AI allowed for 14+
- [x] Simple format acceptable
- [x] Cache-first for cost savings
- [ ] **SEEDING: 0% complete - LOW PRIORITY**

---

## SECTION 8: CHANGE LOG

### 2026-01-16

**What Was Done:**
- Deleted 880 simple format high school items (grades 9-12)
- Backed up to `backups/simple-format-items.json`
- Database cleaned for consistency

**Why:**
- Focusing on under-13 first (COPPA requirement)
- High school content can use live AI, so not urgent
- Will re-seed later with better content

### 2026-01-15 (Night)

- High school items were part of initial upload
- Format was simple (question/answer/explanation)

---

## SECTION 9: COST SAVINGS ESTIMATE

| Scenario | Annual Cost |
|----------|-------------|
| No seeding (all live AI) | ~$10,000/year |
| With seeding (cache first) | ~$500/year |
| **Savings** | **~$9,500/year** |

Seeding is worth it for cost savings, but not urgent like under-13.

---

## SECTION 10: NEXT STEPS

**WAIT** - Focus on under-13 first.

When ready for 14+:
1. Re-import backed up items from `backups/simple-format-items.json`
2. Seed more content using `library/grades_8_12_addendum.md`
3. Simple format is fine, tier1/tier2 is optional

---

## SECTION 11: FILE LOCATIONS

| Purpose | Location |
|---------|----------|
| This README | `README-OVER13-SEEDING.md` |
| Under-13 README | `README-UNDER13-SEEDING.md` |
| Seeding Prompt | `library/grades_8_12_addendum.md` |
| Backup | `backups/simple-format-items.json` |

---

*This is the COMPLETE reference for over-13 seeding. LOW PRIORITY - focus on under-13 first.*
