# TYPING SEEDING - COMPLETE GUIDE

**Subject:** Typing
**Grades:** K-7 (Under 13)
**Target:** 10,000 items
**Standard Type:** Industry Standard (WPM Goals) - No state standards exist
**Last Updated:** 2026-01-16
**Status:** BUILDING

---

## SECTION 1: CRITICAL RULES

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BEFORE YOU DO ANYTHING                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. This is for UNDER 13 (K-7) - NO LIVE AI allowed                         │
│  2. ALL content must be PRE-SEEDED                                          │
│  3. Must use tier1/tier2 format with visuals                                │
│  4. Typing has NO state standards - use WPM goals instead                   │
│  5. Only visual type: "keyboard"                                            │
│                                                                             │
│  DO NOT generate content until all checklist items below are [x]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 2: PHIL'S 99/1 RULE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WORK DISTRIBUTION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Claude does 99%: code, research, debugging, seeding, everything            │
│  Phil does 1%: API keys, approving decisions, "yes/no"                      │
│                                                                             │
│  DO NOT ask Phil to read code or make technical decisions.                  │
│  JUST DO IT. Report results when done.                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 3: STANDARDS

### Typing Has NO State Standards

Arizona (and most states) do not have official typing standards. Typing is taught using **industry-standard WPM (Words Per Minute) goals**.

| Grade | WPM Goal | Accuracy Goal | Focus |
|-------|----------|---------------|-------|
| K | 5 WPM | 80% | Finding letters, spacebar |
| 1 | 5-10 WPM | 85% | Home row (asdf jkl;) |
| 2 | 10-15 WPM | 85% | All letter rows |
| 3 | 15-20 WPM | 90% | Numbers, punctuation |
| 4 | 20-25 WPM | 90% | Speed building |
| 5 | 25-30 WPM | 95% | Fluency |
| 6 | 30-35 WPM | 95% | Professional typing |
| 7 | 35-40 WPM | 95% | Document formatting |

**Standard field value:** `"standard": "WPM-G{grade}"` (e.g., "WPM-G3" for Grade 3)

---

## SECTION 4: VISUAL TYPES

### Only ONE Visual Type for Typing: `keyboard`

```json
{
  "type": "keyboard",
  "data": {
    "highlight_keys": ["f", "j"],
    "finger_labels": true,
    "home_row": true,
    "target_key": "g",
    "finger_to_use": "left index"
  }
}
```

**Data fields:**
| Field | Type | Description |
|-------|------|-------------|
| `highlight_keys` | array | Keys to highlight on keyboard |
| `finger_labels` | boolean | Show which finger to use |
| `home_row` | boolean | Highlight home row keys |
| `target_key` | string | The key student needs to press |
| `finger_to_use` | string | Which finger ("left index", "right pinky", etc.) |

---

## SECTION 5: SKILLS BY GRADE

### Kindergarten (1,000 lessons)
- Finding letters on keyboard
- Spacebar
- Enter key
- Letter recognition while typing
- Typing name
- Typing simple words (CVC: cat, dog, run)

### Grade 1 (1,500 lessons)
- Home row keys (asdf jkl;)
- Proper finger placement
- Typing without looking (home row only)
- Spacebar with thumbs
- Shift key introduction
- Simple words using home row

### Grade 2 (2,000 lessons)
- Top row keys (qwerty...)
- Bottom row keys (zxcv...)
- All letters practiced
- Capital letters with shift
- Basic punctuation (period, comma)
- Typing short sentences

### Grade 3 (2,000 lessons)
- Number row (1-0)
- Common punctuation (! ? ' ")
- Typing sentences
- Accuracy focus
- Speed building exercises
- Paragraph typing introduction

### Grade 4 (1,500 lessons)
- Special characters (@ # $ % etc.)
- Typing paragraphs
- Speed and accuracy balance
- Keyboard shortcuts (Ctrl+C, Ctrl+V)
- Typing from copy text

### Grade 5 (1,000 lessons)
- Advanced punctuation (; : - _)
- Typing from dictation
- Timed typing tests
- Error correction strategies
- Building consistent speed

### Grade 6 (1,000 lessons)
- Professional typing
- Document formatting basics
- Speed refinement
- 95%+ accuracy maintenance
- Extended typing sessions

### Grade 7 (500 lessons)
- Advanced document typing
- Speed optimization
- Professional formatting
- Typing endurance
- Real-world applications

---

## SECTION 6: REQUIRED FORMAT

Every typing item MUST follow this exact JSON structure:

```json
{
  "id": "TYPE-G1-HOME-0001",
  "subject": "typing",
  "grade": 1,
  "skill": "home row keys",
  "standard": "WPM-G1",
  "question": "Place your fingers on the home row and type: asdf",
  "answer": "asdf",
  "tier1": {
    "teach": "Home row is where your fingers rest. Left hand: A-S-D-F. Right hand: J-K-L-;",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "keyboard",
          "data": {
            "highlight_keys": ["a", "s", "d", "f", "j", "k", "l", ";"],
            "finger_labels": true,
            "home_row": true,
            "target_key": "a",
            "finger_to_use": "left pinky"
          }
        },
        "voice_text": "Put your left pinky on A. This is home row.",
        "duration": 4000
      },
      {
        "step": 2,
        "visual": {
          "type": "keyboard",
          "data": {
            "highlight_keys": ["a", "s", "d", "f"],
            "finger_labels": true,
            "home_row": true,
            "target_key": "f",
            "finger_to_use": "left index"
          }
        },
        "voice_text": "Left hand covers A, S, D, F. Your index finger is on F.",
        "duration": 4000
      }
    ]
  },
  "tier2": {
    "teach": "Rest your fingers on the bumpy keys F and J. Those are home.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "keyboard",
          "data": {
            "highlight_keys": ["f", "j"],
            "finger_labels": true,
            "home_row": true,
            "target_key": "f",
            "finger_to_use": "left index"
          }
        },
        "voice_text": "Feel the bumps on F and J. Those help you find home.",
        "duration": 5000
      }
    ]
  }
}
```

---

## SECTION 7: ID FORMAT

```
TYPE-G{GRADE}-{SKILL_CODE}-{4_DIGIT_NUMBER}

Examples:
- TYPE-G0-FIND-0001 (Kindergarten, finding letters)
- TYPE-G1-HOME-0042 (Grade 1, home row)
- TYPE-G3-NUMS-0156 (Grade 3, number row)
```

**Skill Codes:**
| Code | Skill |
|------|-------|
| FIND | Finding letters |
| HOME | Home row |
| TOP | Top row |
| BOT | Bottom row |
| NUMS | Number row |
| PUNC | Punctuation |
| SPEC | Special characters |
| SHFT | Shift key |
| SPCE | Spacebar |
| ENTR | Enter key |
| SHRT | Shortcuts |
| PARA | Paragraphs |
| ACCU | Accuracy |
| SPED | Speed |

---

## SECTION 8: TEACHING METHODOLOGY

### 6-Phase Lesson Structure

```
Phase 1: RULES (2-3 min)
   └── Show finger placement rule
   └── Visual of keyboard with highlighted keys

Phase 2: EXAMPLES (3-5 min)
   └── Demonstrate typing the target keys
   └── Show proper finger movement

Phase 3: GUIDED PRACTICE (5 min)
   └── Student types with on-screen hints
   └── Feedback after each keystroke

Phase 4: INDEPENDENT PRACTICE (10-15 min)
   └── Student types without hints
   └── Track WPM and accuracy

Phase 5: QUIZ (5 min)
   └── Timed typing test
   └── Meet WPM goal for grade

Phase 6: COMPLETE
   └── Show WPM achieved
   └── Coins + XP awarded
```

---

## SECTION 9: CURRENT STATUS

### Database Status

| Grade | Items in DB | Target | Status |
|-------|-------------|--------|--------|
| K | 0 | 1,000 | EMPTY |
| 1 | 0 | 1,500 | EMPTY |
| 2 | 0 | 2,000 | EMPTY |
| 3 | 0 | 2,000 | EMPTY |
| 4 | 0 | 1,500 | EMPTY |
| 5 | 0 | 1,000 | EMPTY |
| 6 | 0 | 1,000 | EMPTY |
| 7 | 0 | 500 | EMPTY |
| **TOTAL** | **0** | **10,500** | **0%** |

---

## SECTION 10: CHECKLIST (Must Complete Before Seeding)

| # | Task | Status | Date |
|---|------|--------|------|
| 1 | README file created | [x] DONE | 2026-01-16 |
| 2 | Skills list defined by grade | [x] DONE | 2026-01-16 |
| 3 | WPM goals defined by grade | [x] DONE | 2026-01-16 |
| 4 | Visual type defined (keyboard) | [x] DONE | 2026-01-16 |
| 5 | tier1/tier2 example created | [x] DONE | 2026-01-16 |
| 6 | ID format defined | [x] DONE | 2026-01-16 |
| 7 | Skill codes defined | [x] DONE | 2026-01-16 |
| 8 | Teaching methodology defined | [x] DONE | 2026-01-16 |
| 9 | Generate seed content | [ ] NOT DONE | |
| 10 | Audit content matches format | [ ] NOT DONE | |
| 11 | Check database format | [ ] NOT DONE | |
| 12 | Upload to database | [ ] NOT DONE | |
| 13 | Verify upload correct | [ ] NOT DONE | |
| 14 | Update checklist file | [ ] NOT DONE | |
| 15 | Move to library/ folder | [ ] NOT DONE | |

---

## SECTION 11: CHANGE LOG

### 2026-01-16
- Created README-TYPING-SEEDING.md
- Defined WPM goals by grade (industry standard)
- Defined keyboard visual type
- Created tier1/tier2 example
- Defined skill codes and ID format
- Defined teaching methodology (6-phase)
- Checklist items 1-8 complete

---

## SECTION 12: COMPLETED TASKS (Strikethrough When Done)

When a task is complete, move it here with strikethrough:

~~Example: Task that was completed~~

---

## SECTION 13: NEXT STEPS

1. Generate typing seed content for Grade K first
2. Audit the generated content
3. Upload to database
4. Verify and repeat for grades 1-7

---

*When ALL checklist items are [x] DONE, move this file to library/ folder.*
