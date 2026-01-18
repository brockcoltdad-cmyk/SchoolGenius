# SchoolGenius - Claude Instructions

## STOP! READ THESE FILES FIRST

Before doing ANY work, you MUST read these files in order:

1. **LESSONS-LEARNED.md** (this project root)
   - Contains mistakes from previous sessions
   - DO NOT repeat these mistakes

2. **knowledge-library/schoolgenius/MASTER-RULES-CHECKLIST.md**
   - Validation checklist for ALL features
   - Every feature must pass this checklist

3. **GROK-PROMPT-REQUIREMENTS.md** (this project root)
   - Subject-specific content generation requirements
   - Required before ANY Grok content generation

## Project Overview

**SchoolGenius** is a K-12 adaptive learning platform for homeschool and supplemental education.

**Key Features:**
- 6 subjects: Math, Reading, Spelling, Typing, Coding, Language Arts
- 80+ kid themes (Fortnite, Minecraft, Princess, Dinosaur, etc.)
- Theme-based feedback and encouragement
- Tiered AI system (Haiku/Opus/Grok)
- Arizona curriculum standards (NOT Common Core)
- Lexile-leveled reading content

## MANDATORY Rules

### Rule 1: Checklist Before Building
NEVER build a feature without:
1. Reading MASTER-RULES-CHECKLIST.md
2. Writing out the specific checklist for this feature
3. Showing the checklist to the user
4. Getting approval before coding

### Rule 2: Cache First
Before ANY AI call:
1. Check library tables first (qa_library, explanation_library, etc.)
2. If found, use cached response (FREE)
3. If not found, generate and SAVE to library
4. Goal: First request costs $$, all future = FREE

### Rule 3: Subject-Specific Interfaces
NEVER use generic multiple choice for:
- **Math** → Use visual manipulatives (CountingObjects, NumberLine, etc.)
- **Typing** → Use interactive keyboard with WPM tracking
- **Spelling** → Use audio + text input, type 3 times
- **Coding** → Use actual code editor with execution
- **Reading** → Use story reader with comprehension questions

### Rule 4: Theme-Based Feedback
NEVER use generic "Good job!" messages.
ALWAYS use: `getSmartThemeMessage(context)` from `lib/theme-encouragement-messages.ts`

### Rule 5: No Orphaned Code
When you build something:
1. Build the component
2. IMMEDIATELY integrate it
3. Test end-to-end
4. Don't say "done" until it's actually USED

### Rule 6: Save Brainstorms
When user says "save this" or brainstorms ideas:
1. Save IMMEDIATELY to a file
2. Use descriptive filename
3. Save EVERYTHING (don't summarize)
4. Confirm with user

## User Preferences (Dad/Phillip)

- Prefers SIMPLE over complex
- Wants everything cached (cost-conscious)
- Kids' themes are CRITICAL
- No coin penalties (earn only, never lose)
- Rules taught FIRST, then practice
- Arizona standards, NOT Common Core
- Visual learning for K-5
- Everything must be tested end-to-end

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + Auth)
- **AI:** Anthropic (Haiku/Opus), xAI (Grok), Google (Gemini for OCR)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion
- **TTS:** ElevenLabs

## Key Directories

```
SchoolGenius-Final/
├── app/                    # Next.js pages
│   ├── kid/[id]/          # Kid-facing pages
│   ├── dashboard/         # Parent dashboard
│   └── api/               # API routes
├── components/
│   ├── lesson/            # Lesson players (Math, Spelling, Typing)
│   └── ui/                # shadcn components
├── lib/
│   ├── theme-encouragement-messages.ts  # Themed feedback
│   └── supabase/          # Database client
├── supabase/
│   └── functions/         # Edge functions (Grok)
└── knowledge-library/     # Saved documentation
```

## Before Every Session

1. Read LESSONS-LEARNED.md
2. Ask user: "What are we working on today?"
3. Create task checklist
4. Get approval
5. Build with checklist validation
6. Test end-to-end
7. Update LESSONS-LEARNED.md if new mistakes found

## Remember

- You DON'T have persistent memory across sessions
- This file IS your memory
- LESSONS-LEARNED.md is how you avoid repeating mistakes
- When in doubt, READ before building
- Save important things IMMEDIATELY
