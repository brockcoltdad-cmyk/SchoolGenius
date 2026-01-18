# WRITING SEEDING - COMPLETE GUIDE

**Subject:** Writing
**Grades:** K-7 (Under 13)
**Target:** 11,500 items
**Standard Type:** Arizona ELA Standards (W - Writing, L - Language)
**Last Updated:** 2026-01-17
**Status:** COMPLETE (11,700 items - 101.7%)

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
│  4. Writing uses ARIZONA ELA - W (Writing) + L (Language) standards         │
│  5. Visual types: sentence_builder, paragraph_structure, grammar_highlight  │
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

## SECTION 3: STANDARDS (Arizona ELA)

### Writing Uses W (Writing) + L (Language) Standards

| Domain | Full Name | Use |
|--------|-----------|-----|
| W | Writing | Text types, production, research |
| L | Language | Grammar, usage, conventions |

### Standards by Grade

**Kindergarten**
| Standard | Skill |
|----------|-------|
| W.K.1 | Opinion writing (topic + opinion) |
| W.K.2 | Informative writing (topic + facts) |
| W.K.3 | Narrative writing (event + reaction) |
| L.K.1 | Grammar (nouns, verbs) |
| L.K.2 | Capitalization, punctuation |
| L.K.2.A | Capitalize first word, I |
| L.K.2.B | End punctuation |

**Grade 1**
| Standard | Skill |
|----------|-------|
| W.1.1 | Opinion with reasons |
| W.1.2 | Informative with facts |
| W.1.3 | Narrative with sequence |
| L.1.1 | Grammar (nouns, verbs, adjectives) |
| L.1.1.J | Produce complete sentences |
| L.1.2 | Capitalization, punctuation, spelling |
| L.1.2.B | End punctuation for sentence types |

**Grade 2**
| Standard | Skill |
|----------|-------|
| W.2.1 | Opinion with reasons and linking words |
| W.2.2 | Informative with facts and definitions |
| W.2.3 | Narrative with sequence and details |
| L.2.1 | Grammar (collective nouns, irregular plurals, reflexive pronouns) |
| L.2.1.F | Produce compound sentences |
| L.2.2 | Capitalization, punctuation |
| L.2.2.A | Capitalize holidays, product names |

**Grade 3**
| Standard | Skill |
|----------|-------|
| W.3.1 | Opinion with organizational structure |
| W.3.2 | Informative with clear organization |
| W.3.3 | Narrative with dialogue and description |
| L.3.1 | Grammar (nouns, pronouns, verbs, adjectives, adverbs) |
| L.3.1.A | Explain function of nouns/pronouns |
| L.3.1.I | Produce simple and compound sentences |
| L.3.2 | Capitalization, punctuation (dialogue) |

**Grade 4**
| Standard | Skill |
|----------|-------|
| W.4.1 | Opinion with clear reasons and evidence |
| W.4.2 | Informative with related ideas grouped |
| W.4.3 | Narrative with clear event sequences |
| L.4.1 | Grammar (relative pronouns, progressive tense) |
| L.4.1.F | Produce complete sentences (fragments, run-ons) |
| L.4.2 | Punctuation (commas, quotations) |
| L.4.3 | Formal vs informal language |

**Grade 5**
| Standard | Skill |
|----------|-------|
| W.5.1 | Opinion with logically organized support |
| W.5.2 | Informative with formatting and multimedia |
| W.5.3 | Narrative with pacing and description |
| L.5.1 | Grammar (conjunctions, perfect tense, verb tense consistency) |
| L.5.1.E | Use correlative conjunctions |
| L.5.2 | Punctuation (commas, titles) |
| L.5.3 | Expand and combine sentences |

**Grade 6**
| Standard | Skill |
|----------|-------|
| W.6.1 | Argument with clear claims and evidence |
| W.6.2 | Informative with analysis of topic |
| W.6.3 | Narrative with effective techniques |
| L.6.1 | Grammar (subjective/objective pronouns, intensive pronouns) |
| L.6.2 | Punctuation, spelling |
| L.6.3 | Vary sentence patterns for meaning |

**Grade 7**
| Standard | Skill |
|----------|-------|
| W.7.1 | Argument with acknowledged counterclaims |
| W.7.2 | Informative with relevant content |
| W.7.3 | Narrative with precise words and details |
| L.7.1 | Grammar (phrases, clauses, sentence types) |
| L.7.2 | Spelling |
| L.7.3 | Concise language |

---

## SECTION 4: VISUAL TYPES

### Writing Visual Types (3 types)

**1. sentence_builder**
```json
{
  "type": "sentence_builder",
  "data": {
    "parts": ["The", "cat", "sat", "on", "the", "mat"],
    "part_types": ["article", "noun", "verb", "preposition", "article", "noun"],
    "correct_order": [0, 1, 2, 3, 4, 5],
    "punctuation": "."
  }
}
```

**2. paragraph_structure**
```json
{
  "type": "paragraph_structure",
  "data": {
    "topic_sentence": "Dogs make great pets.",
    "detail_sentences": [
      "They are loyal and friendly.",
      "Dogs love to play fetch.",
      "They keep you company."
    ],
    "concluding_sentence": "Everyone should have a dog.",
    "highlight": "topic_sentence"
  }
}
```

**3. grammar_highlight**
```json
{
  "type": "grammar_highlight",
  "data": {
    "sentence": "The happy dog ran quickly.",
    "highlights": [
      { "word": "happy", "type": "adjective" },
      { "word": "dog", "type": "noun" },
      { "word": "ran", "type": "verb" },
      { "word": "quickly", "type": "adverb" }
    ]
  }
}
```

---

## SECTION 5: SKILLS BY GRADE

### Kindergarten (1,000 lessons)
- Writing letters (uppercase/lowercase)
- Writing name
- Writing simple sentences
- Using spaces between words
- Capitalization (first word, I)
- Ending punctuation (period)
- Drawing to express ideas

### Grade 1 (1,500 lessons)
- Complete sentences
- Capitalization (names, dates)
- Punctuation (. ? !)
- Nouns (common, proper)
- Verbs (action words)
- Adjectives
- Writing opinions
- Writing informative text
- Writing narratives
- Sequencing ideas

### Grade 2 (1,500 lessons)
- Sentence types (statement, question, exclamation, command)
- Compound sentences (and, but, or)
- Collective nouns
- Irregular plural nouns
- Past tense verbs
- Adverbs
- Apostrophes (contractions, possessives)
- Commas in greetings/closings
- Paragraph structure
- Topic sentences
- Supporting details

### Grade 3 (2,000 lessons)
- Simple and compound sentences
- Subject-verb agreement
- Pronoun-antecedent agreement
- Comparative/superlative adjectives
- Coordinating conjunctions
- Commas in addresses
- Commas in dialogue
- Quotation marks
- Paragraph organization
- Introduction writing
- Conclusion writing
- Linking words

### Grade 4 (1,500 lessons)
- Complex sentences
- Run-on sentences
- Sentence fragments
- Relative pronouns (who, which, that)
- Progressive verb tenses
- Modal auxiliaries (can, may, must)
- Prepositional phrases
- Commas with introductory elements
- Formal vs informal language
- Paragraphing
- Transitions between paragraphs
- Evidence and examples

### Grade 5 (1,500 lessons)
- Compound-complex sentences
- Perfect verb tenses
- Verb tense consistency
- Correlative conjunctions (either/or)
- Interjections
- Commas (all uses)
- Titles (italics, quotation marks)
- Varying sentence structure
- Voice (active/passive)
- Thesis statements
- Counterclaims
- Concluding statements

### Grade 6 (1,500 lessons)
- Subjective/objective/possessive pronouns
- Intensive pronouns
- Sentence patterns
- Punctuation for effect
- Varying sentence patterns for meaning
- Style and tone
- Argument structure
- Claim and counterclaim
- Formal style
- Cohesion and clarity

### Grade 7 (1,000 lessons)
- Advanced sentence patterns
- Phrases and clauses
- Concise language
- Precise vocabulary
- Advanced argument structure
- Literary analysis writing
- Research writing basics

---

## SECTION 6: REQUIRED FORMAT

Every writing item MUST follow this exact JSON structure:

```json
{
  "id": "WRITE-G2-SENT-0001",
  "subject": "writing",
  "grade": 2,
  "skill": "compound sentences",
  "standard": "L.2.1.F",
  "question": "Combine these sentences using 'and':\nI like pizza. I like tacos.",
  "answer": "I like pizza and tacos.",
  "tier1": {
    "teach": "Use 'and' to join two sentences that go together. Put the ideas in one sentence.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "sentence_builder",
          "data": {
            "parts": ["I", "like", "pizza", "and", "tacos"],
            "part_types": ["pronoun", "verb", "noun", "conjunction", "noun"],
            "correct_order": [0, 1, 2, 3, 4],
            "punctuation": "."
          }
        },
        "voice_text": "Both sentences say I like something. Put them together with AND.",
        "duration": 5000
      }
    ]
  },
  "tier2": {
    "teach": "When two sentences are about the same thing, glue them with AND.",
    "steps": [
      {
        "step": 1,
        "visual": {
          "type": "grammar_highlight",
          "data": {
            "sentence": "I like pizza AND tacos.",
            "highlights": [
              { "word": "AND", "type": "conjunction" }
            ]
          }
        },
        "voice_text": "AND is the glue word. I like pizza AND tacos.",
        "duration": 5000
      }
    ]
  }
}
```

---

## SECTION 7: ID FORMAT

```
WRITE-G{GRADE}-{SKILL_CODE}-{4_DIGIT_NUMBER}

Examples:
- WRITE-G0-LETR-0001 (Kindergarten, letter writing)
- WRITE-G2-SENT-0042 (Grade 2, sentences)
- WRITE-G5-PARA-0156 (Grade 5, paragraphs)
```

**Skill Codes:**
| Code | Skill |
|------|-------|
| LETR | Letter formation |
| SENT | Sentences |
| COMP | Compound sentences |
| CPLX | Complex sentences |
| FRAG | Fragments/run-ons |
| NOUN | Nouns |
| VERB | Verbs |
| ADJ | Adjectives |
| ADV | Adverbs |
| PRON | Pronouns |
| PREP | Prepositions |
| CONJ | Conjunctions |
| CAPS | Capitalization |
| PUNC | Punctuation |
| APOS | Apostrophes |
| QUOT | Quotation marks |
| PARA | Paragraphs |
| INTR | Introductions |
| CONC | Conclusions |
| OPIN | Opinion writing |
| INFO | Informative writing |
| NARR | Narrative writing |
| ARGU | Argument writing |

---

## SECTION 8: TEACHING METHODOLOGY

### 6-Phase Lesson Structure

```
Phase 1: RULES (2-3 min)
   └── Show the grammar/writing rule
   └── Visual demonstration

Phase 2: EXAMPLES (3-5 min)
   └── 3 correct examples
   └── 1-2 incorrect examples (what NOT to do)

Phase 3: GUIDED PRACTICE (5 min)
   └── 5 problems with hints
   └── Fix sentences, combine sentences, etc.

Phase 4: INDEPENDENT PRACTICE (10-15 min)
   └── 15 problems without hints
   └── Track accuracy

Phase 5: QUIZ (5 min)
   └── 10 questions
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
| K | 1,000 | 1,000 | DONE (100%) |
| 1 | 1,500 | 1,500 | DONE (100%) |
| 2 | 1,500 | 1,500 | DONE (100%) |
| 3 | 2,000 | 2,000 | DONE (100%) |
| 4 | 1,600 | 1,500 | DONE (107%) |
| 5 | 1,600 | 1,500 | DONE (107%) |
| 6 | 1,500 | 1,500 | DONE (100%) |
| 7 | 1,000 | 1,000 | DONE (100%) |
| **TOTAL** | **11,700** | **11,500** | **101.7%** |

---

## SECTION 10: CHECKLIST (Must Complete Before Seeding)

| # | Task | Status | Date |
|---|------|--------|------|
| 1 | README file created | [x] DONE | 2026-01-16 |
| 2 | Skills list defined by grade | [x] DONE | 2026-01-16 |
| 3 | Arizona W/L standards mapped | [x] DONE | 2026-01-16 |
| 4 | Visual types defined (3 types) | [x] DONE | 2026-01-16 |
| 5 | tier1/tier2 example created | [x] DONE | 2026-01-16 |
| 6 | ID format defined | [x] DONE | 2026-01-16 |
| 7 | Skill codes defined | [x] DONE | 2026-01-16 |
| 8 | Teaching methodology defined | [x] DONE | 2026-01-16 |
| 9 | Generate seed content | [x] DONE | 2026-01-17 |
| 10 | Audit content matches format | [x] DONE | 2026-01-17 |
| 11 | Check database format | [x] DONE | 2026-01-17 |
| 12 | Upload to database | [x] DONE | 2026-01-17 |
| 13 | Verify upload correct | [x] DONE | 2026-01-17 |
| 14 | Update checklist file | [x] DONE | 2026-01-17 |
| 15 | Move to library/ folder | [x] DONE | 2026-01-17 |

---

## SECTION 11: CHANGE LOG

### 2026-01-17
- Created 8 writing template files (library/templates/writing/)
- Created generate-writing-content.mjs generator script
- Generated 11,700 writing items for grades K-7
- All grades at 100%+ coverage
- Visual types: sentence_builder, paragraph_structure, grammar_highlight
- tier1/tier2 format with proper visuals
- Checklist items 9-15 complete
- **WRITING SEEDING COMPLETE**

### 2026-01-16
- Created README-WRITING-SEEDING.md
- Mapped Arizona W/L standards
- Defined 3 visual types
- Created tier1/tier2 example
- Defined skill codes and ID format
- Checklist items 1-8 complete

---

## SECTION 12: COMPLETED TASKS (Strikethrough When Done)

~~Generate writing seed content for Grade K~~
~~Generate writing seed content for Grade 1~~
~~Generate writing seed content for Grade 2~~
~~Generate writing seed content for Grade 3~~
~~Generate writing seed content for Grade 4~~
~~Generate writing seed content for Grade 5~~
~~Generate writing seed content for Grade 6~~
~~Generate writing seed content for Grade 7~~
~~Audit the generated content~~
~~Upload to database~~
~~Verify upload correct~~

---

## SECTION 13: NEXT STEPS

**WRITING SEEDING IS COMPLETE!**

All 11,700 writing items have been seeded:
- Templates in: library/templates/writing/
- Generator: generate-writing-content.mjs
- Database: practice_problems table (subject='writing')

---

*ALL checklist items are [x] DONE. Templates moved to library/ folder.*
