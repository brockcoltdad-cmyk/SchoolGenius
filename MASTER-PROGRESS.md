# SchoolGenius Master Progress Document

**Last Updated:** January 2026

---

## Quick Status Overview

| Category | Status |
|----------|--------|
| Theme System | DONE |
| Authentication (Parent/Kid/Teen) | DONE |
| COPPA Compliance | DONE |
| Gigi Live Chat | DONE |
| Voice/TTS (Chatterbox) | PARTIAL - Need to install |
| Smart Context API | PENDING |

---

## COMPLETED FEATURES

### 1. Theme Persistence Across Pages
- [x] localStorage sync across all pages
- [x] `localStorage.setItem('schoolgenius-theme', index)` when theme changes
- [x] `localStorage.getItem('schoolgenius-theme')` on page load
- [x] All pages share the same 6 themes and stay in sync

**Files Modified:**
- `app/page.tsx` - Added localStorage save/load
- `app/login/page.tsx` - Added theme picker + localStorage
- `app/signup/page.tsx` - Added theme picker + localStorage
- `app/family/page.tsx` - Added page theme from localStorage

---

### 2. Page Styling - Dark Theme
- [x] Black background (`bg-black`)
- [x] Animated radial gradient glow
- [x] White text with gradient accents
- [x] Dark cards (`bg-black/80 backdrop-blur-xl`)
- [x] Gradient buttons with glow shadows
- [x] `font-black` for bold headlines

---

### 3. Voice Cloning Setup (Chatterbox TTS) - COMPLETED!
- [x] Created `/api/setup/voice-storage/route.ts` - Auto-creates Supabase bucket
- [x] API endpoint ready for Chatterbox TTS
- [x] Mom's voice saved to database
- [x] **Chatterbox installed on RTX 5090 with CUDA 12.8**
- [x] Server running on port 4123
- [x] SchoolGenius `/api/tts` updated to use Chatterbox as PRIMARY
- [x] 28 predefined voices available (Emily = default Gigi voice)
- [x] Voice cloning ready for parent voices
- [x] Falls back to ElevenLabs if Chatterbox unavailable

**Chatterbox Location:** `C:\Users\DAD\Desktop\Chatterbox-TTS-Server`
**To Start:** `venv\Scripts\activate && python server.py`
**URL:** http://localhost:4123

---

### 4. Parent Dashboard Themes
- [x] Added 6 parent-appropriate themes
- [x] Theme picker in navbar

**6 Parent Themes:**
1. Coffee Break (amber/orange) - Warm, cozy vibes
2. Garden Fresh (emerald/green) - Nature inspired
3. Ocean Calm (blue/cyan) - Relaxing blues
4. Creative Studio (purple/pink) - Artistic vibes
5. Sports Fan (yellow/red) - Team spirit
6. Sunset Vibes (orange/pink/purple) - Warm gradients

**File:** `app/dashboard/page.tsx`

---

### 5. Independent Teen Login (14+)
- [x] Created `/signup/teen` page
- [x] Own email/password credentials
- [x] No parent PIN required
- [x] Grade selection (9th-12th)
- [x] Optional parent email for oversight
- [x] Direct access to learning dashboard

**Files Created:**
- `app/signup/teen/page.tsx`
- `supabase/migrations/20260114_add_independent_teen_columns.sql`

**Database Changes:**
- `is_independent_teen` boolean in children table
- `linked_parent_email` text in children table
- `account_type` text in profiles table ('parent' or 'teen')

---

### 6. Kid Login Page (Under 13 - COPPA Compliant)
- [x] Created `/login/kid` page
- [x] Kid enters: Name + PIN (parent-set)
- [x] Verifies against children table
- [x] Only works if parent already approved
- [x] Shows themed interface
- [x] Added "I'm a Kid - Use My PIN" button on main login page

**File:** `app/login/kid/page.tsx`

---

### 7. COPPA-Compliant Chat Helper
- [x] Created `lib/coppa-chat-helper.ts`
- [x] Age-based rules (K-7th = under 13, 8th-12th = 13+)
- [x] PII filtering (phone, email, address, SSN)
- [x] Session-only storage for under 13
- [x] 30-minute inactivity auto-clear
- [x] AI safety prompt for under 13

**Functions Available:**
- `isUnder13(grade)` - Returns true for K-7th grade
- `getChatConfig(grade)` - Returns appropriate settings
- `filterPII(text)` - Removes personal info
- `saveChatToSession()` - Session storage for under 13
- `getSystemPromptForAge()` - Adds COPPA rules to AI prompt
- `createInactivityTimer()` - Auto-clear after timeout
- `useChatCompliance()` - React hook for components

**Full Documentation:** `COPPA-COMPLIANCE-README.md`

---

### 8. COPPA Integration in Gigi Chat
- [x] GigiLiveChat uses COPPA helper
- [x] PII filtered before sending messages (under 13)
- [x] Session storage load/save for under 13
- [x] Inactivity timer (30 min auto-clear)
- [x] "Kid Safe" badge shows for under 13
- [x] API receives `isUnder13` flag
- [x] AI system prompt includes COPPA rules

**Files Modified:**
- `components/GigiLiveChat.tsx`
- `app/api/chat/route.ts`

---

### 9. Gigi Live Chat Component
- [x] Created `components/GigiLiveChat.tsx`
- [x] Themed chat bubbles (uses theme colors)
- [x] Themed Gigi avatar/character
- [x] Message history (scrollable)
- [x] Text input + Send button
- [x] Mic button (voice input with Web Speech API)
- [x] Speaker detection
- [x] Speaker ON/OFF toggle + status display
- [x] Collapse/expand chat
- [x] Auto-collapse when scrolling to bottom
- [x] Connected to `/api/chat` (uses qa_library)
- [x] Navigation detection (go to math, reading, etc.)
- [x] TTS playback when speakers enabled

---

## PENDING FEATURES

### 1. Smart Context API for Gigi
**Status:** NOT STARTED

**Plan from original spec:**
Create `app/api/gigi/context/route.ts` that:
- Returns user history, last lesson, streak
- Generates smart greeting based on context
- Examples:
  - New user: "Hey! I'm Gigi, looks like you're new!"
  - Returning user: "Continue your fractions from yesterday?"
  - Struggling user: "Let's work on that division you had trouble with!"

---

### 2. Add Gigi Chat to All Kid Pages
**Status:** NOT STARTED

**Plan:**
- Modify `app/kid/[id]/layout.tsx`
- Add `<GigiLiveChat />` component to layout
- Chat appears on every kid page (dashboard, math, reading, etc.)

---

### 3. Verification Testing
**Status:** NOT STARTED

**Test Checklist:**
- [ ] Switch themes → Chat colors + Gigi avatar should change
- [ ] No speakers → Shows "Sound OFF", no TTS calls
- [ ] Type message → Get response in chat thread
- [ ] Under 13 user → Shows "Kid Safe" badge, chat clears on close
- [ ] 13+ user → Full features, no restrictions
- [ ] Voice input works (mic button)

---

### 4. Kid PIN Security (DO LAST - Before Go-Live)
**Status:** NOT STARTED - Add after testing complete

**Current Vulnerabilities:**
- No rate limiting (unlimited PIN guesses)
- No account lockout after failed attempts
- 2-4 digit PIN = only 100-10,000 combinations
- Error messages reveal if name exists vs wrong PIN

**Security Features to Add:**
- [ ] Rate limiting: Max 5 attempts per 15 minutes
- [ ] Account lockout: Lock after 3-5 wrong PINs
- [ ] Parent notification: Email parent on lockout
- [ ] Move PIN check to API route (server-side validation)
- [ ] Generic error messages: "Name or PIN incorrect"
- [ ] Optional: Require parent to unlock after lockout

**File to Modify:** `app/login/kid/page.tsx`
**New API Route:** `app/api/auth/kid-login/route.ts`

**NOTE:** Do this LAST so testing isn't interrupted by lockouts!

---

## 6 Kid Themes (Homepage/Login/Signup)

1. Battle Royale (purple/pink) - Fortnite style
2. Block Builder (emerald/green) - Minecraft style
3. Zombie Survival (green/lime)
4. Pirate Adventure (blue/cyan)
5. Wrestling Champ (yellow/red) - WWE style
6. Ninja Training (pink/purple) - Anime style

---

## URLs Reference

| Page | URL |
|------|-----|
| Homepage | http://localhost:3005 |
| Parent Login | http://localhost:3005/login |
| Kid Login | http://localhost:3005/login/kid |
| Parent Signup | http://localhost:3005/signup |
| Teen Signup | http://localhost:3005/signup/teen |
| Family Select | http://localhost:3005/family |
| Parent Dashboard | http://localhost:3005/dashboard |
| Kid Dashboard | http://localhost:3005/kid/[id] |

---

## Key Files Reference

| Purpose | File |
|---------|------|
| COPPA Helper | `lib/coppa-chat-helper.ts` |
| COPPA Documentation | `COPPA-COMPLIANCE-README.md` |
| Gigi Live Chat | `components/GigiLiveChat.tsx` |
| Chat API | `app/api/chat/route.ts` |
| Kid Login | `app/login/kid/page.tsx` |
| Teen Signup | `app/signup/teen/page.tsx` |
| Parent Dashboard | `app/dashboard/page.tsx` |
| Theme Context | `lib/theme-context.tsx` |
| Gigi Characters | `components/animations/GigiCharacter.tsx` |

---

## COPPA Quick Reference

| Feature | Under 13 | 13+ |
|---------|----------|-----|
| Chat Storage | Session only | Database OK |
| PII Filtering | Yes | No |
| File Uploads | No | Yes |
| Auto-clear | 30 min | Never |
| Parent Required | Yes | No |
| AI Safety Rules | Enforced | Standard |

---

*This document tracks all SchoolGenius development progress.*
