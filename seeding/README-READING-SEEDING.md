# READING SEEDING - COMPLETE GUIDE

**Subject:** Reading
**Grades:** K-7 (Under 13)
**Target:** 52,000 items
**Standard Type:** Arizona ELA Standards + Lexile Levels
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
│  4. Reading uses ARIZONA ELA STANDARDS + LEXILE LEVELS                      │
│  5. EVERY reading item MUST have a Lexile level                             │
│  6. Visual types: phonics, word_building, sight_word, syllable,             │
│     text_highlight, comprehension_question                                  │
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

## SECTION 3: LEXILE LEVELS (CRITICAL)

### Lexile Levels by Grade

**EVERY reading item MUST include `lexile_level` field.**

| Grade | Lexile Range | Mid-Point | Fluency Goal (WPM) |
|-------|--------------|-----------|-------------------|
| K | BR-200L | BR (Beginning Reader) | 30 WPM |
| 1 | 200L-400L | 300L | 60 WPM |
| 2 | 400L-500L | 450L | 90 WPM |
| 3 | 500L-700L | 600L | 120 WPM |
| 4 | 700L-850L | 775L | 140 WPM |
| 5 | 850L-950L | 900L | 150 WPM |
| 6 | 950L-1050L | 1000L | 160 WPM |
| 7 | 1050L-1150L | 1100L | 170 WPM |

**Lexile Format in JSON:** `"lexile_level": "450L"` or `"lexile_level": "BR"` for kindergarten

---

## SECTION 4: STANDARDS (Arizona ELA)

### Arizona ELA Standard Domains

| Domain Code | Domain Name | Grades |
|-------------|-------------|--------|
| RF | Reading: Foundational Skills | K-5 |
| RL | Reading: Literature | K-7 |
| RI | Reading: Informational Text | K-7 |
| L | Language | K-7 |

### Standards by Grade

**Kindergarten (Phonics Focus)**
| Standard | Skill |
|----------|-------|
| RF.K.1 | Print concepts (left to right, top to bottom) |
| RF.K.2 | Phonological awareness (rhyming, blending) |
| RF.K.3 | Phonics (letter-sound correspondence) |
| RF.K.4 | Read emergent texts |
| RL.K.1 | Ask/answer questions about text |
| RL.K.2 | Retell stories |
| RL.K.3 | Identify characters, setting, events |

**Grade 1**
| Standard | Skill |
|----------|-------|
| RF.1.2 | Phonological awareness (phonemes) |
| RF.1.3 | Phonics (digraphs, CVCe, vowel teams) |
| RF.1.4 | Fluency (60 WPM) |
| RL.1.1 | Ask/answer questions about key details |
| RL.1.2 | Retell with central message |
| RL.1.3 | Describe characters, settings, events |
| RL.1.7 | Use illustrations to understand |

**Grade 2**
| Standard | Skill |
|----------|-------|
| RF.2.3 | Phonics (prefixes, suffixes, multisyllable) |
| RF.2.4 | Fluency (90 WPM) |
| RL.2.1 | Ask/answer who, what, where, when, why |
| RL.2.2 | Recount stories with central message |
| RL.2.3 | Describe character responses |
| RL.2.5 | Story structure (beginning, middle, end) |
| RI.2.1 | Ask/answer questions about informational text |

**Grade 3**
| Standard | Skill |
|----------|-------|
| RF.3.3 | Phonics (Latin/Greek roots) |
| RF.3.4 | Fluency (120 WPM) |
| RL.3.1 | Ask/answer questions, refer to text |
| RL.3.2 | Recount with central message/theme |
| RL.3.3 | Describe characters, explain actions |
| RL.3.5 | Parts of stories (chapter, scene) |
| RI.3.2 | Main idea and supporting details |
| RI.3.8 | Describe logical connections |

**Grade 4**
| Standard | Skill |
|----------|-------|
| RF.4.3 | Advanced phonics patterns |
| RF.4.4 | Fluency (140 WPM) |
| RL.4.1 | Refer to text for inferences |
| RL.4.2 | Determine theme, summarize |
| RL.4.3 | Describe character/setting/event in depth |
| RL.4.6 | Compare/contrast point of view |
| RI.4.2 | Main idea with details |
| RI.4.5 | Text structure |

**Grade 5**
| Standard | Skill |
|----------|-------|
| RF.5.3 | Advanced word analysis |
| RF.5.4 | Fluency (150 WPM) |
| RL.5.1 | Quote accurately from text |
| RL.5.2 | Determine theme from details |
| RL.5.3 | Compare/contrast characters/settings |
| RL.5.6 | Narrator's point of view |
| RI.5.2 | Main ideas across multiple paragraphs |
| RI.5.8 | Explain how author uses evidence |

**Grade 6**
| Standard | Skill |
|----------|-------|
| RL.6.1 | Cite textual evidence |
| RL.6.2 | Determine theme, analyze development |
| RL.6.3 | Describe how plot unfolds |
| RL.6.4 | Determine word meanings (figurative) |
| RL.6.5 | Analyze structure |
| RI.6.1 | Cite evidence for inferences |
| RI.6.2 | Central idea and development |
| RI.6.6 | Determine author's point of view |

**Grade 7**
| Standard | Skill |
|----------|-------|
| RL.7.1 | Cite several pieces of evidence |
| RL.7.2 | Analyze theme development |
| RL.7.3 | Analyze character/story development |
| RL.7.4 | Analyze impact of word choice |
| RL.7.6 | Analyze how author develops POV |
| RI.7.2 | Analyze central idea development |
| RI.7.5 | Analyze text structure |
| RI.7.8 | Trace/evaluate argument |

---

## SECTION 5: VISUAL TYPES

### Reading Visual Types (6 types)

**1. phonics**
```json
{
  "type": "phonics",
  "data": {
    "sound": "sh",
    "examples": ["ship", "shell", "fish"],
    "mouth_position": "teeth together, blow air"
  }
}
```

**2. word_building**
```json
{
  "type": "word_building",
  "data": {
    "letters": ["c", "a", "t"],
    "blend_points": [0, 1],
    "final_word": "cat"
  }
}
```

**3. sight_word**
```json
{
  "type": "sight_word",
  "data": {
    "word": "the",
    "sentence": "The dog ran fast.",
    "highlight_in_sentence": true
  }
}
```

**4. syllable**
```json
{
  "type": "syllable",
  "data": {
    "word": "elephant",
    "syllables": ["el", "e", "phant"],
    "clap_count": 3
  }
}
```

**5. text_highlight**
```json
{
  "type": "text_highlight",
  "data": {
    "text": "The brave knight saved the princess.",
    "highlight_words": ["brave", "knight"],
    "highlight_type": "character_trait"
  }
}
```

**6. comprehension_question**
```json
{
  "type": "comprehension_question",
  "data": {
    "passage": "The cat sat on the mat. It was a sunny day.",
    "question": "Where did the cat sit?",
    "answer": "on the mat",
    "evidence_sentence": 1
  }
}
```

---

## SECTION 6: SKILLS BY GRADE

### Kindergarten (8,000 lessons)
- Letter recognition (uppercase/lowercase)
- Letter sounds (consonants, vowels)
- Rhyming words
- Beginning/ending sounds
- CVC words
- Sight words (Dolch Pre-Primer)
- Story elements (characters, setting)
- Picture clues
- Sequencing (3 events)

### Grade 1 (10,000 lessons)
- Short/long vowel sounds
- Consonant blends (bl, cr, st)
- Consonant digraphs (sh, ch, th, wh)
- CVCe words (silent e)
- Vowel teams (ai, ea, oa)
- R-controlled vowels
- Sight words (Dolch Primer + G1)
- Main idea, supporting details
- Cause and effect
- Making predictions

### Grade 2 (10,000 lessons)
- Prefixes (un-, re-, pre-)
- Suffixes (-ful, -less, -ly)
- Compound words
- Context clues
- Synonyms/antonyms
- Main idea and details
- Summarizing
- Text features
- Fiction vs nonfiction

### Grade 3 (8,000 lessons)
- Root words
- Greek/Latin roots
- Figurative language (similes)
- Central message/theme
- Character development
- Text structure
- Using text evidence
- Point of view

### Grade 4 (6,000 lessons)
- Advanced roots
- Figurative language (metaphors, idioms)
- Theme
- Summarizing fiction/nonfiction
- Text structure (problem/solution)
- Poetry elements
- Point of view comparison

### Grade 5 (5,000 lessons)
- Word relationships (analogies)
- Connotation/denotation
- Figurative language (hyperbole, personification)
- Theme across texts
- Analyzing multiple accounts
- Author's argument

### Grade 6 (3,000 lessons)
- Etymology
- Academic vocabulary
- Theme development
- Plot development
- Author's purpose
- Evaluating arguments

### Grade 7 (2,000 lessons)
- Advanced analysis
- Theme development analysis
- Character/story development
- Word choice impact
- Point of view development

---

## SECTION 7: WORD LISTS (Kid-Safe)

### Available in library/ folder:

| File | Words | Grades | Use For |
|------|-------|--------|---------|
| `dolch-sight-words.json` | 315 | Pre-K to 3rd | Sight word lessons |
| `fry-1000-sight-words.json` | 1,000 | K-10 | Sight word lessons |
| `academic-word-list.json` | 570 | 6-12+ | Academic vocabulary |

**Total: 1,885 kid-safe words**

---

## SECTION 8: REQUIRED FORMAT

Every reading item MUST follow this exact JSON structure:

```json
{
  "id": "READ-G2-COMP-0001",
  "subject": "reading",
  "grade": 2,
  "skill": "main idea",
  "standard": "RI.2.2",
  "lexile_level": "450L",
  "question": "What is the main idea of this passage?\n\nDogs make great pets. They are loyal and friendly. Dogs love to play and go for walks.",
  "answer": "Dogs make great pets.",
  "tier1": {
    "teach": "The main idea is what the whole passage is about. Look for what most sentences talk about.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "text_highlight",
          "data": {
            "text": "Dogs make great pets. They are loyal and friendly. Dogs love to play and go for walks.",
            "highlight_words": ["Dogs", "pets", "loyal", "friendly", "play", "walks"],
            "highlight_type": "main_idea_clues"
          }
        },
        "voice_text": "Every sentence talks about dogs. The main idea is about dogs being great pets.",
        "duration": 5000
      }
    ]
  },
  "tier2": {
    "teach": "What is the whole story about? That is the main idea.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "comprehension_question",
          "data": {
            "passage": "Dogs make great pets. They are loyal and friendly.",
            "question": "What is this about?",
            "answer": "Dogs",
            "evidence_sentence": 1
          }
        },
        "voice_text": "All the sentences are about dogs. Dogs is the main idea.",
        "duration": 5000
      }
    ]
  }
}
```

---

## SECTION 9: ID FORMAT

```
READ-G{GRADE}-{SKILL_CODE}-{4_DIGIT_NUMBER}

Examples:
- READ-G0-PHON-0001 (Kindergarten, phonics)
- READ-G2-COMP-0042 (Grade 2, comprehension)
- READ-G5-THEM-0156 (Grade 5, theme)
```

**Skill Codes:**
| Code | Skill |
|------|-------|
| PHON | Phonics |
| LETR | Letter recognition |
| BLND | Blending |
| DGPH | Digraphs |
| VWEL | Vowels |
| SGHT | Sight words |
| SYLL | Syllables |
| PREF | Prefixes |
| SUFF | Suffixes |
| ROOT | Root words |
| COMP | Comprehension |
| MAIN | Main idea |
| DETA | Details |
| THEM | Theme |
| CHAR | Characters |
| SETT | Setting |
| PLOT | Plot |
| POV | Point of view |
| INFER | Inferences |
| VOCAB | Vocabulary |

---

## SECTION 10: TEACHING METHODOLOGY

### 6-Phase Lesson Structure

```
Phase 1: RULES (2-3 min)
   └── Show the reading rule/skill
   └── Visual demonstration

Phase 2: EXAMPLES (3-5 min)
   └── 3 worked examples
   └── Read-aloud by Gigi

Phase 3: GUIDED PRACTICE (5 min)
   └── 5 questions with hints
   └── Feedback after each

Phase 4: INDEPENDENT PRACTICE (10-15 min)
   └── 15 questions without hints
   └── Track accuracy and time

Phase 5: QUIZ (5 min)
   └── 10 questions
   └── 70% to pass

Phase 6: COMPLETE
   └── Celebration
   └── Coins + XP awarded
```

---

## SECTION 11: CURRENT STATUS

### Database Status

| Grade | Items in DB | Target | Status |
|-------|-------------|--------|--------|
| K | 0 | 8,000 | EMPTY |
| 1 | 0 | 10,000 | EMPTY |
| 2 | 0 | 10,000 | EMPTY |
| 3 | 0 | 8,000 | EMPTY |
| 4 | 0 | 6,000 | EMPTY |
| 5 | 0 | 5,000 | EMPTY |
| 6 | 0 | 3,000 | EMPTY |
| 7 | 0 | 2,000 | EMPTY |
| **TOTAL** | **0** | **52,000** | **0%** |

---

## SECTION 12: CHECKLIST (Must Complete Before Seeding)

| # | Task | Status | Date |
|---|------|--------|------|
| 1 | README file created | [x] DONE | 2026-01-16 |
| 2 | Skills list defined by grade | [x] DONE | 2026-01-16 |
| 3 | Arizona ELA standards mapped | [x] DONE | 2026-01-16 |
| 4 | **Lexile levels defined by grade** | [x] DONE | 2026-01-16 |
| 5 | Visual types defined (6 types) | [x] DONE | 2026-01-16 |
| 6 | tier1/tier2 example created | [x] DONE | 2026-01-16 |
| 7 | ID format defined | [x] DONE | 2026-01-16 |
| 8 | Skill codes defined | [x] DONE | 2026-01-16 |
| 9 | Word lists linked | [x] DONE | 2026-01-16 |
| 10 | Teaching methodology defined | [x] DONE | 2026-01-16 |
| 11 | Generate seed content | [ ] NOT DONE | |
| 12 | Audit content matches format | [ ] NOT DONE | |
| 13 | Check database format | [ ] NOT DONE | |
| 14 | Upload to database | [ ] NOT DONE | |
| 15 | Verify upload correct | [ ] NOT DONE | |
| 16 | Update checklist file | [ ] NOT DONE | |
| 17 | Move to library/ folder | [ ] NOT DONE | |

---

## SECTION 13: CHANGE LOG

### 2026-01-16
- Created README-READING-SEEDING.md
- Defined Lexile levels by grade (CRITICAL)
- Mapped Arizona ELA standards (RF, RL, RI)
- Defined 6 visual types
- Created tier1/tier2 example with lexile_level
- Linked to word lists in library/
- Checklist items 1-10 complete

---

## SECTION 14: COMPLETED TASKS (Strikethrough When Done)

When a task is complete, move it here with strikethrough:

~~Example: Task that was completed~~

---

## SECTION 15: NEXT STEPS

1. Generate reading seed content for Grade K first (phonics focus)
2. Ensure ALL items have lexile_level field
3. Audit the generated content
4. Upload to database
5. Verify and repeat for grades 1-7

---

*When ALL checklist items are [x] DONE, move this file to library/ folder.*
