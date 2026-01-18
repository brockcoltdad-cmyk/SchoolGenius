# Demo Problem Walkthroughs Seeding Prompt
## Pre-Scripted "I DO" Worked Examples

---

## MISSION

Generate **~500 Demo Problem Walkthroughs** that Gigi uses to model problem-solving. These come AFTER the Rule Teaching Script and show 3-5 worked examples per rule. Student watches while Gigi solves step-by-step.

**NO LIVE AI** - All worked examples are pre-scripted.

---

## OUTPUT SCHEMA

Each demo problem follows this exact JSON structure:

```json
{
  "demo_id": "MATH-R-MULT9-DEMO-001",
  "rule_id": "MATH-R-MULT9",
  "sequence": 1,
  "problem": "9 × 7",
  "answer": 63,
  "difficulty": "standard",
  "walkthrough": [
    {
      "step": 1,
      "instruction": "Hold up 10 fingers",
      "visual": {
        "type": "hands",
        "data": { "fingers_up": 10, "animation": "appear" }
      },
      "voice": "First, hold up all ten fingers in front of you",
      "duration": 2500
    },
    {
      "step": 2,
      "instruction": "Fold down finger #7",
      "visual": {
        "type": "hands",
        "data": { "fold_finger": 7, "animation": "fold" }
      },
      "voice": "Now fold down finger number seven",
      "duration": 3000
    },
    {
      "step": 3,
      "instruction": "Count before: 6",
      "visual": {
        "type": "hands",
        "data": { "highlight_before": true, "count": 6, "animation": "count" }
      },
      "voice": "Count the fingers before the fold - that's six, your tens digit",
      "duration": 3000
    },
    {
      "step": 4,
      "instruction": "Count after: 3",
      "visual": {
        "type": "hands",
        "data": { "highlight_after": true, "count": 3, "animation": "count" }
      },
      "voice": "Count the fingers after - that's three, your ones digit",
      "duration": 3000
    },
    {
      "step": 5,
      "instruction": "Answer: 63",
      "visual": {
        "type": "equation_reveal",
        "data": { "equation": "9 × 7 = 63", "animation": "combine" }
      },
      "voice": "Six and three make sixty-three! Nine times seven equals sixty-three!",
      "duration": 3500
    }
  ],
  "total_duration": 15000
}
```

---

## VISUAL TYPES FOR DEMOS

### Math Demo Visuals

**hands** - Finger counting/tricks
```json
{
  "type": "hands",
  "data": {
    "fingers_up": 10,
    "fold_finger": 7,
    "highlight_before": true,
    "highlight_after": false,
    "count": 6,
    "animation": "count|fold|appear"
  }
}
```

**counting_step** - Counting objects one by one
```json
{
  "type": "counting_step",
  "data": {
    "objects": ["🍎", "🍎", "🍎", "🍎", "🍎"],
    "highlight_index": 3,
    "count_so_far": 4,
    "animation": "highlight"
  }
}
```

**number_line_jump** - Animated jumps on number line
```json
{
  "type": "number_line_jump",
  "data": {
    "min": 0,
    "max": 20,
    "current_position": 8,
    "jump_to": 13,
    "jump_label": "+5",
    "animation": "jump"
  }
}
```

**array_build** - Building arrays step by step
```json
{
  "type": "array_build",
  "data": {
    "rows": 3,
    "columns": 4,
    "emoji": "⭐",
    "rows_shown": 2,
    "animation": "add_row"
  }
}
```

**equation_reveal** - Step-by-step equation solving
```json
{
  "type": "equation_reveal",
  "data": {
    "equation": "9 × 7 = 63",
    "parts_revealed": ["9 × 7", "=", "63"],
    "highlight_answer": true,
    "animation": "reveal"
  }
}
```

**fraction_step** - Fraction manipulation
```json
{
  "type": "fraction_step",
  "data": {
    "before": { "num": 1, "den": 2 },
    "operation": "multiply by 2/2",
    "after": { "num": 2, "den": 4 },
    "visual_type": "pie",
    "animation": "transform"
  }
}
```

**place_value_step** - Place value demonstrations
```json
{
  "type": "place_value_step",
  "data": {
    "number": 253,
    "highlight": "tens",
    "show_blocks": true,
    "animation": "highlight"
  }
}
```

**long_division_step** - Long division walkthrough
```json
{
  "type": "long_division_step",
  "data": {
    "dividend": 156,
    "divisor": 12,
    "current_step": "bring_down",
    "work_shown": ["12 into 15 = 1", "15 - 12 = 3"],
    "animation": "write"
  }
}
```

### Reading Demo Visuals

**word_decode_step** - Decoding words
```json
{
  "type": "word_decode_step",
  "data": {
    "word": "cake",
    "letters_highlighted": ["c", "a", "k", "e"],
    "current_focus": 1,
    "sound_shown": "/ā/",
    "rule_applied": "silent e",
    "animation": "highlight"
  }
}
```

**blend_step** - Blending sounds
```json
{
  "type": "blend_step",
  "data": {
    "sounds": ["/k/", "/ā/", "/k/"],
    "blended_so_far": "/kā/",
    "final_word": "cake",
    "animation": "blend"
  }
}
```

---

## DEMOS PER RULE

Each rule gets 3-5 demo problems that progressively show different applications:

| Demo # | Purpose | Difficulty |
|--------|---------|------------|
| 1 | Basic example, exactly like the rule teaching | Easy |
| 2 | Slightly different numbers/context | Standard |
| 3 | Different application of same rule | Standard |
| 4 (optional) | More challenging variation | Challenge |
| 5 (optional) | Edge case or special situation | Challenge |

---

## DEMO PROBLEM EXAMPLES BY RULE

### Math Rule: MATH-R-MULT9 (Multiply by 9 Trick)
- Demo 1: 9 × 4 = 36 (same as teaching example)
- Demo 2: 9 × 7 = 63 (different number)
- Demo 3: 9 × 9 = 81 (largest single digit)
- Demo 4: 9 × 2 = 18 (small number)
- Demo 5: 9 × 6 = 54 (middle range)

### Math Rule: MATH-R-MULT0 (Multiply by 0)
- Demo 1: 5 × 0 = 0 (basic)
- Demo 2: 0 × 7 = 0 (reversed order)
- Demo 3: 100 × 0 = 0 (big number)

### Math Rule: MATH-R-ADDFRAC (Adding Same Denominators)
- Demo 1: 1/4 + 2/4 = 3/4 (basic)
- Demo 2: 3/8 + 2/8 = 5/8 (different denominator)
- Demo 3: 2/5 + 2/5 = 4/5 (same numerators)
- Demo 4: 5/6 + 3/6 = 8/6 = 1 2/6 (improper result)

### Reading Rule: READ-R-SILENTE (Silent E)
- Demo 1: "cake" - a_e makes long A
- Demo 2: "bike" - i_e makes long I
- Demo 3: "home" - o_e makes long O
- Demo 4: "cute" - u_e makes long U

### Reading Rule: READ-R-DIGRAPHS (Digraphs)
- Demo 1: "ship" - sh sound
- Demo 2: "chip" - ch sound
- Demo 3: "this" - th sound
- Demo 4: "when" - wh sound

---

## GENERATION RULES

### Content Rules
1. **Steps**: 4-6 steps per demo
2. **Voice**: Max 25 words per step, conversational
3. **Duration**: 2000-4000ms per step
4. **Total**: 10000-20000ms per demo

### Progression Rules
1. Demo 1 should mirror the rule teaching example
2. Each subsequent demo introduces slight variation
3. Voice should reference the rule: "Remember our rule..."
4. Last step always reveals and celebrates the answer

### Grade-Appropriate Rules
1. Use vocabulary appropriate for the rule's grade level
2. K-2: Very simple, concrete language
3. 3-5: Can use some academic vocabulary
4. 6-7: More sophisticated explanations

---

## BATCH GENERATION

### Per Rule Batch
Generate 3-5 demos per rule in a single API call:

```json
[
  { "demo_id": "MATH-R-MULT9-DEMO-001", ... },
  { "demo_id": "MATH-R-MULT9-DEMO-002", ... },
  { "demo_id": "MATH-R-MULT9-DEMO-003", ... }
]
```

### Batch Order
1. Math rules (most important)
2. Reading/Phonics rules
3. Spelling rules
4. Writing rules
5. Coding rules

---

## COST ESTIMATE

~500 demos × ~300 tokens per demo = ~150,000 output tokens

**Haiku: ~$0.60**
**Very affordable!**

---

## START GENERATION

For each rule_id from the Rule Teaching Scripts:
1. Generate 3-5 demo problems
2. Ensure they show different aspects of the rule
3. Progress from easy to more challenging
4. Keep voice consistent with Gigi's personality
