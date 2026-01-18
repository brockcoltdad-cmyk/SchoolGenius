# GRADUAL RELEASE FORMAT - SAVED FOR LATER

**Purpose:** Documentation for the i_do/we_do/you_do teaching format
**Status:** BACKED UP - Not currently in use, implement later

---

## WHAT IS THIS?

We discovered 45,291 items in a different teaching format called **Gradual Release**.
These were removed from the database but SAVED for future use.

```
┌─────────────────────────────────────────────────────────────────┐
│              GRADUAL RELEASE MODEL                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  I DO    → Teacher demonstrates (scripted example)              │
│  WE DO   → Guided practice with hints                           │
│  YOU DO  → Independent practice                                 │
│  CHECK   → Assessment question                                  │
│                                                                 │
│  This is a valid teaching model, just different from tier1/tier2│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FORMAT STRUCTURE

```json
{
  "id": "MATH-G3-MATH-R-MULT2-P666",
  "subject": "math",
  "grade": 3,
  "rule_id": "MATH-R-MULT2",
  "question": "What is 8 × 2?",
  "answer": "16",
  "options": ["12", "16", "18", "20"],

  "i_do": {
    "explanation": "Today, we are learning how to multiply numbers by 2. Multiplication by 2 means adding a number to itself.",
    "example": {
      "problem": "What is 4 × 2?",
      "answer": "8",
      "solution": "Step 1: Think of 4 added to itself.\nStep 2: 4 + 4 = 8."
    }
  },

  "we_do": {
    "problem": "What is 6 × 2?",
    "hints": [
      "Think of adding 6 to itself.",
      "What is 6 + 6?"
    ],
    "answer": "12",
    "solution": "Step 1: Add 6 to itself.\nStep 2: 6 + 6 = 12."
  },

  "you_do": [
    {
      "problem": "What is 3 × 2?",
      "answer": "6",
      "explanation": "3 added to itself is 3 + 3 = 6."
    },
    {
      "problem": "What is 5 × 2?",
      "answer": "10",
      "explanation": "5 added to itself is 5 + 5 = 10."
    },
    {
      "problem": "What is 7 × 2?",
      "answer": "14",
      "explanation": "7 added to itself is 7 + 7 = 14."
    }
  ],

  "check_question": {
    "question": "What is 8 × 2?",
    "options": ["12", "16", "18", "20"],
    "correct": "16",
    "explanation": "8 added to itself is 8 + 8 = 16, so 8 × 2 = 16."
  }
}
```

---

## COMPARISON: tier1/tier2 vs Gradual Release

| Feature | tier1/tier2 | Gradual Release |
|---------|-------------|-----------------|
| Teaching Style | Visual + Voice steps | Example + Guided + Independent |
| Visual Components | YES (array, number_line, etc.) | NO |
| Voice Narration | YES (voice_text field) | NO |
| Timing | YES (duration in ms) | NO |
| Hints | In tier2 (simpler steps) | In we_do.hints array |
| Practice Problems | Separate | Built-in (you_do array) |
| Multiple Choice | Optional | YES (options array) |
| Scripted Examples | In steps | In i_do.example |

---

## WHAT'S IN THE BACKUP

**File:** `backups/gradual-release-format-items.json`

| Grade | Items |
|-------|-------|
| 1 | 3,717 |
| 2 | 9,305 |
| 3 | 3,372 |
| 4 | 5,735 |
| 6 | 3,112 |
| 7 | 5,792 |
| NULL | 14,258 |
| **TOTAL** | **45,291** |

---

## HOW TO USE LATER

### Option 1: Convert to tier1/tier2

Write a script to transform:
- `i_do.explanation` → `tier1.teach`
- `i_do.example.solution` → `tier1.steps`
- `we_do.hints` → `tier2.steps`

Would need to ADD:
- `visual` objects
- `voice_text` narration
- `duration` timing

### Option 2: Build Separate Lesson Player

Create a new component that uses this format directly:
- `GradualReleaseLessonPlayer.tsx`
- Shows i_do phase (teacher models)
- Shows we_do phase (guided practice)
- Shows you_do phase (independent)
- Shows check_question (assessment)

### Option 3: Use for 14+ Only

Since 14+ can use live AI:
- Use these as a cache
- The structure isn't critical
- Just provides scripted content

---

## TO IMPLEMENT LATER

1. Decide which approach (convert, new player, or 14+ cache)
2. Create the implementation
3. Re-import from `backups/gradual-release-format-items.json`

**ASK PHIL** before implementing - this was set aside for now.

---

## WHY WE REMOVED THESE

1. **COPPA Compliance:** Under-13 requires tier1/tier2 with visuals for the lesson player
2. **Consistency:** Current lesson players expect tier1/tier2 format
3. **Focus:** Working on tier1/tier2 seeding first
4. **Not Deleted:** Saved to backup file for future use

---

## BACKUP LOCATION

```
C:\Users\DAD\Desktop\SchoolGenius-Final\backups\
├── gradual-release-format-items.json  (45,291 items)
└── simple-format-items.json           (996 items)
```

---

*Last Updated: January 2026*
*DO NOT implement without asking Phil first.*
