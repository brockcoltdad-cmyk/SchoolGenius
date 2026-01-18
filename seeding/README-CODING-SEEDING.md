# CODING SEEDING - COMPLETE GUIDE

**Subject:** Coding
**Grades:** K-7 (Under 13)
**Target:** 12,000 items
**Standard Type:** ISTE Standards (International - Arizona adopted ISTE)
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
│  4. Coding uses ISTE Standards (Arizona adopted ISTE, no state-specific)    │
│  5. Visual types: code_block, variable_box, loop_animation, conditional,    │
│     output                                                                  │
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

## SECTION 3: STANDARDS (ISTE)

### Arizona Uses ISTE Standards for Computer Science

Arizona adopted the **ISTE (International Society for Technology in Education)** standards. There are no Arizona-specific coding standards.

| Grade | ISTE Standard | Focus |
|-------|---------------|-------|
| K | 1A-AP-08 | Sequences, patterns |
| 1 | 1A-AP-10 | Algorithms, simple loops |
| 2 | 1A-AP-11 | Loops, events |
| 3 | 1A-AP-12, 1B-AP-10 | Conditionals, variables |
| 4 | 1B-AP-11 | Nested loops, functions |
| 5 | 1B-AP-12 | Functions, lists |
| 6 | 1B-AP-13, 1B-AP-14 | Text-based coding (Python) |
| 7 | 1B-AP-15 | Debugging, projects |

**Standard field format:** `"standard": "1B-AP-10"` (ISTE code)

---

## SECTION 4: VISUAL TYPES

### Coding Visual Types (5 types)

**1. code_block**
```json
{
  "type": "code_block",
  "data": {
    "language": "python|javascript|scratch",
    "code": "for i in range(5):\n    print(i)",
    "highlight_lines": [1, 2],
    "output": "0\n1\n2\n3\n4"
  }
}
```

**2. variable_box**
```json
{
  "type": "variable_box",
  "data": {
    "name": "score",
    "value": 10,
    "type": "number|string|boolean",
    "show_update": true,
    "new_value": 15
  }
}
```

**3. loop_animation**
```json
{
  "type": "loop_animation",
  "data": {
    "iterations": 5,
    "action": "print star",
    "emoji": "⭐",
    "current_iteration": 3
  }
}
```

**4. conditional**
```json
{
  "type": "conditional",
  "data": {
    "condition": "score > 10",
    "if_true": "You win!",
    "if_false": "Try again",
    "current_value": 15,
    "result": "true"
  }
}
```

**5. output**
```json
{
  "type": "output",
  "data": {
    "lines": ["Hello", "World", "!"],
    "typing_effect": true
  }
}
```

---

## SECTION 5: SKILLS BY GRADE

### Kindergarten (1,000 lessons)
- Sequences (step by step instructions)
- Patterns (AB, ABC, AABB)
- Giving instructions
- Following instructions
- Basic debugging (finding mistakes)
- Cause and effect

### Grade 1 (1,500 lessons)
- Algorithms (step-by-step plans)
- Sequences in Scratch Jr
- Simple loops (repeat)
- Events (when clicked)
- Basic sprites and backgrounds
- Debugging simple programs

### Grade 2 (1,500 lessons)
- Loops with numbers (repeat 5 times)
- Events (multiple triggers)
- Simple conditionals (if touching edge)
- Animation basics
- Sound blocks
- Creating stories in Scratch

### Grade 3 (2,000 lessons)
- Conditionals (if/then)
- Conditionals (if/else)
- Variables introduction
- Keeping score
- User input
- Broadcast messages
- Simple games
- Debugging strategies

### Grade 4 (1,500 lessons)
- Nested loops
- Complex conditionals
- Variables (numbers and strings)
- Operators (math, comparison)
- Random numbers
- Cloning sprites
- Game design
- Functions (custom blocks)

### Grade 5 (1,500 lessons)
- Functions with inputs
- Return values
- Lists/arrays introduction
- String operations
- Coordinate system
- Game physics basics
- Intro to text-based coding (Python basics)
- Comments and documentation

### Grade 6 (1,500 lessons)
- Python fundamentals
- Variables and data types
- Input and output
- Conditionals in Python
- Loops in Python (for, while)
- Functions in Python
- Lists in Python
- Basic debugging in Python
- Simple projects

### Grade 7 (1,000 lessons)
- Python intermediate
- Dictionaries
- File handling basics
- Error handling (try/except)
- Modular code
- Project planning
- Code review basics

---

## SECTION 6: REQUIRED FORMAT

Every coding item MUST follow this exact JSON structure:

```json
{
  "id": "CODE-G3-COND-0001",
  "subject": "coding",
  "grade": 3,
  "skill": "conditionals if/else",
  "standard": "1B-AP-10",
  "question": "What will this code print if score is 15?\n\nif score > 10:\n    print('You win!')\nelse:\n    print('Try again')",
  "answer": "You win!",
  "tier1": {
    "teach": "If the condition is true, run the first block. If false, run the else block.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "conditional",
          "data": {
            "condition": "score > 10",
            "if_true": "You win!",
            "if_false": "Try again",
            "current_value": 15,
            "result": "true"
          }
        },
        "voice_text": "Score is 15. Is 15 greater than 10? Yes! So we run the IF part.",
        "duration": 5000
      },
      {
        "step": 2,
        "visual": {
          "type": "output",
          "data": {
            "lines": ["You win!"],
            "typing_effect": true
          }
        },
        "voice_text": "The output is: You win!",
        "duration": 3000
      }
    ]
  },
  "tier2": {
    "teach": "Check if something is true. If yes, do one thing. If no, do something else.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "conditional",
          "data": {
            "condition": "15 > 10",
            "if_true": "You win!",
            "if_false": "Try again",
            "current_value": 15,
            "result": "true"
          }
        },
        "voice_text": "Is 15 bigger than 10? Yes! So we print You win!",
        "duration": 5000
      }
    ]
  }
}
```

---

## SECTION 7: ID FORMAT

```
CODE-G{GRADE}-{SKILL_CODE}-{4_DIGIT_NUMBER}

Examples:
- CODE-G0-SEQ-0001 (Kindergarten, sequences)
- CODE-G3-COND-0042 (Grade 3, conditionals)
- CODE-G6-PYTH-0156 (Grade 6, Python)
```

**Skill Codes:**
| Code | Skill |
|------|-------|
| SEQ | Sequences |
| PATT | Patterns |
| ALGO | Algorithms |
| LOOP | Loops |
| EVNT | Events |
| COND | Conditionals |
| VAR | Variables |
| FUNC | Functions |
| LIST | Lists/Arrays |
| DBUG | Debugging |
| SCRA | Scratch |
| PYTH | Python |
| GAME | Game design |
| PROJ | Projects |

---

## SECTION 8: TEACHING METHODOLOGY

### 6-Phase Lesson Structure

```
Phase 1: RULES (2-3 min)
   └── Explain the coding concept
   └── Show visual of how it works

Phase 2: EXAMPLES (3-5 min)
   └── Show working code
   └── Trace through step by step

Phase 3: GUIDED PRACTICE (5 min)
   └── Student predicts output
   └── Feedback after each answer

Phase 4: INDEPENDENT PRACTICE (10-15 min)
   └── Student solves coding problems
   └── Track accuracy

Phase 5: QUIZ (5 min)
   └── 10 questions on concept
   └── 70% to pass

Phase 6: COMPLETE
   └── Celebration
   └── Coins + XP awarded
```

---

## SECTION 9: CURRENT STATUS

### Database Status

| Grade | Items in DB | Target | Status |
|-------|-------------|--------|--------|
| K | 0 | 1,000 | EMPTY |
| 1 | 0 | 1,500 | EMPTY |
| 2 | 0 | 1,500 | EMPTY |
| 3 | 0 | 2,000 | EMPTY |
| 4 | 0 | 1,500 | EMPTY |
| 5 | 0 | 1,500 | EMPTY |
| 6 | 0 | 1,500 | EMPTY |
| 7 | 0 | 1,000 | EMPTY |
| **TOTAL** | **0** | **12,000** | **0%** |

---

## SECTION 10: PROJECT TEMPLATES (Reusable Assets)

**Location:** `library/templates/coding/`

All 40 project templates (5 per grade, 8 grades) are saved as reusable JSON files.

| File | Grade | Projects | Tool |
|------|-------|----------|------|
| coding-templates-K.json | Kindergarten | 5 (sequences, patterns, instructions, debugging) | Scratch Jr/Unplugged |
| coding-templates-G1.json | Grade 1 | 5 (loops, events, sprites, algorithms, debugging) | Scratch Jr |
| coding-templates-G2.json | Grade 2 | 5 (loops, events, conditionals, animation, stories) | Scratch |
| coding-templates-G3.json | Grade 3 | 5 (if/else, variables, debugging, clones, combined) | Scratch |
| coding-templates-G4.json | Grade 4 | 5 (nested loops, AND/OR, operators, random, functions) | Scratch |
| coding-templates-G5.json | Grade 5 | 5 (functions+inputs, lists, strings, physics, Python intro) | Scratch + Python |
| coding-templates-G6.json | Grade 6 | 5 (variables, loops, functions, lists, combined) | Python |
| coding-templates-G7.json | Grade 7 | 5 (dictionaries, files, errors, modules, capstone) | Python |

**Themed Projects Include:**
- K: Animal Dance Party, Color Pattern Maker, Robot Helper, Follow the Cat, Fix the Silly Story
- G3: Space Dodger, Virtual Pet, Bug Hunter, Cookie Rain Collector, Dungeon Escape
- G6-G7: Mad Libs, Password Generator, Contact Book, Quiz App, Personal Project

**Usage:** Each template contains Phase 1 (Rule Teaching), Phase 3 (Guided Practice), and Phase 6 (Completion) data. Reusable for grades 8-12 expansion later.

---

## SECTION 11: CHECKLIST (Must Complete Before Seeding)

| # | Task | Status | Date |
|---|------|--------|------|
| 1 | README file created | [x] DONE | 2026-01-16 |
| 2 | Skills list defined by grade | [x] DONE | 2026-01-16 |
| 3 | ISTE standards mapped | [x] DONE | 2026-01-16 |
| 4 | Visual types defined (5 types) | [x] DONE | 2026-01-16 |
| 5 | tier1/tier2 example created | [x] DONE | 2026-01-16 |
| 6 | ID format defined | [x] DONE | 2026-01-16 |
| 7 | Skill codes defined | [x] DONE | 2026-01-16 |
| 8 | Teaching methodology defined | [x] DONE | 2026-01-16 |
| 9 | Project templates created (40 total) | [x] DONE | 2026-01-16 |
| 10 | Templates saved to library/templates/ | [x] DONE | 2026-01-16 |
| 11 | Generate seed content | [ ] NOT DONE | |
| 12 | Audit content matches format | [ ] NOT DONE | |
| 13 | Check database format | [ ] NOT DONE | |
| 14 | Upload to database | [ ] NOT DONE | |
| 15 | Verify upload correct | [ ] NOT DONE | |
| 16 | Update checklist file | [ ] NOT DONE | |
| 17 | Move to library/ folder | [ ] NOT DONE | |

---

## SECTION 12: CHANGE LOG

### 2026-01-16 (Night)
- Created 40 project templates (5 per grade, K-7)
- Saved all templates to library/templates/
- Updated README with template locations
- Checklist items 9-10 complete

### 2026-01-16
- Created README-CODING-SEEDING.md
- Mapped ISTE standards by grade
- Defined 5 visual types
- Created tier1/tier2 example
- Defined skill codes and ID format
- Checklist items 1-8 complete

---

## SECTION 13: COMPLETED TASKS (Strikethrough When Done)

When a task is complete, move it here with strikethrough:

~~Example: Task that was completed~~

---

## SECTION 14: NEXT STEPS

1. **Database Check** - Verify practice_problems table exists and has correct columns
2. **Generate Content** - Use templates in library/templates/ to generate 12,000 items
3. **Audit** - Verify all items match required JSON format
4. **Upload** - Insert into Supabase practice_problems table
5. **Verify** - Confirm upload successful, update status

---

*When ALL checklist items are [x] DONE, move this file to library/ folder.*
