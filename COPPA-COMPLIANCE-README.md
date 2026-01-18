# SchoolGenius COPPA Compliance Documentation

## What is COPPA?

**COPPA** = Children's Online Privacy Protection Act

A US federal law that protects the privacy of children under 13 years old online. It regulates the collection, use, and disclosure of personal information from children.

### Key Requirements
1. **Verifiable Parental Consent** - Must get parent permission BEFORE collecting any data from kids under 13
2. **Clear Privacy Policy** - Must disclose what data is collected and how it's used
3. **Data Minimization** - Only collect what's necessary
4. **Data Security** - Must protect children's data
5. **Parental Rights** - Parents can review, delete, and revoke consent anytime

### 2025 COPPA Updates (Effective June 2025)
- Penalties up to **$50,120 per violation**
- Must disclose data retention policy to parents
- Must delete personal info after request fulfilled
- Open chat must "take reasonable measures to delete all personal info"

---

## What Counts as Personal Information (PII)?

Under COPPA, these are considered Personally Identifiable Information:
- Full name
- Home address
- Email address
- Phone number
- Social Security Number
- Photos or videos of the child
- Geolocation data
- Persistent identifiers (cookies, device IDs) used for tracking
- Voice recordings
- Chat transcripts that reveal identifying info

---

## How SchoolGenius Implements COPPA Compliance

### 1. Age-Based Login System

| Age Group | Login Method | Account Setup | COPPA Status |
|-----------|--------------|---------------|--------------|
| Under 13 (K-7th) | Name + PIN | Parent creates first | Fully Compliant |
| 13+ (8th-12th) | Own credentials | Can create own | Less strict |
| 14+ (High School) | Independent account | Full self-signup | Teen rules |

**How It Works:**
1. Parent creates account first (email, password, payment/consent)
2. Parent adds child to their account (name, grade, optional PIN)
3. Parent explicitly approves child's access
4. THEN child can log in with their PIN (parent set it up)

**Key Point:** Parent consent happens BEFORE any child data is collected.

### 2. Kid Login Page (`/login/kid`)

```
Child enters: Name + PIN (that parent created)
System verifies: PIN matches what parent set in database
Result: Child accesses their dashboard
```

**File:** `app/login/kid/page.tsx`

**Why This Is Compliant:**
- Parent already consented during signup
- No new personal info collected from child
- PIN was created by parent, not child
- Parent can disable/change PIN anytime

### 3. Teen Signup (`/signup/teen`)

High schoolers (14+) can sign up independently:
- Own email/password credentials
- Grade selection (9th-12th)
- Optional parent email for oversight
- No parent PIN required

**File:** `app/signup/teen/page.tsx`

---

## COPPA-Compliant Chat System (Gigi AI)

### The Challenge

AI chat can collect personal info if kids share:
- Their real name, school, address
- Photos or files
- Chat messages with identifying info

### Our Solution: Age-Based Chat Rules

**File:** `lib/coppa-chat-helper.ts`

#### Grade-to-Age Mapping

| Grades | Assumed Age | Chat Mode |
|--------|-------------|-----------|
| K-7th | Under 13 | COPPA Mode (restricted) |
| 8th-12th | 13+ | Full Features |

#### What Under-13 Users Get:

```typescript
{
  canStoreHistory: false,      // NO database storage
  canUploadFiles: false,       // NO file/image uploads
  filterPII: true,             // Removes personal info
  sessionOnly: true,           // Only sessionStorage
  maxHistoryLength: 50,        // Limited messages
  autoDeleteMinutes: 30,       // Auto-clear after 30 min
}
```

#### What 13+ Users Get:

```typescript
{
  canStoreHistory: true,       // Can save to database
  canUploadFiles: true,        // Can upload files
  filterPII: false,            // No filtering
  sessionOnly: false,          // Database storage OK
  maxHistoryLength: 500,       // More history
  autoDeleteMinutes: 0,        // No auto-delete
}
```

### PII Filtering

For under-13 users, these are automatically removed from chat messages:

```typescript
// Phone numbers (various formats)
(555) 123-4567 → [phone removed]

// Email addresses
kid@email.com → [email removed]

// Social Security Numbers
123-45-6789 → [SSN removed]

// Street addresses
123 Main Street → [address removed]

// ZIP codes
90210 → [zip removed]
```

**File:** `lib/coppa-chat-helper.ts` - `filterPII()` function

### Session-Only Storage

For under-13:
- Chat stored in `sessionStorage` (browser memory)
- Automatically deleted when browser closes
- No permanent database storage
- Parent already consented to platform during signup

```typescript
// Store in session only
sessionStorage.setItem('gigi-chat-childId', JSON.stringify(messages));

// Clears when browser closes - COPPA compliant!
```

### Inactivity Timer

Chat auto-clears after 30 minutes of no activity for under-13:

```typescript
// After 30 minutes of no messages
setTimeout(() => {
  setMessages([]);
  sessionStorage.removeItem('gigi-chat-childId');
}, 30 * 60 * 1000);
```

### AI System Prompt (COPPA Rules)

Added to the AI system prompt for under-13 users:

```
IMPORTANT CHILD SAFETY RULES:
- NEVER ask for personal information (real name, address, school name, phone number, email)
- If a child shares personal information, acknowledge briefly but do NOT repeat it back
- Do NOT store or reference any personal details shared in previous messages
- Keep all responses focused on educational content and the lesson at hand
- If asked about personal topics, gently redirect to learning
- Be encouraging and supportive but maintain appropriate boundaries
```

**File:** `lib/coppa-chat-helper.ts` - `COPPA_SYSTEM_PROMPT`

---

## Implementation Files

### Core COPPA Helper
**File:** `lib/coppa-chat-helper.ts`

Functions:
- `isUnder13(gradeLevel)` - Returns true for K-7th grade
- `getChatConfig(gradeLevel)` - Returns appropriate settings
- `filterPII(text)` - Removes personal info from text
- `saveChatToSession(childId, messages)` - Session storage
- `loadChatFromSession(childId)` - Load from session
- `clearChatSession(childId)` - Clear session
- `getSystemPromptForAge(prompt, grade)` - Add COPPA rules
- `useChatCompliance(grade, childId)` - React hook for components
- `createInactivityTimer(minutes, callback)` - Auto-clear timer

### Chat Component Integration
**File:** `components/GigiLiveChat.tsx`

What it does:
1. Passes `gradeLevel` prop to determine COPPA mode
2. Uses `processMessage()` to filter PII before sending
3. Uses `saveChat()`/`loadChat()` for session storage
4. Creates inactivity timer for auto-clear
5. Shows "Kid Safe" badge for under-13 users
6. Passes `isUnder13` flag to API

### Chat API Integration
**File:** `app/api/chat/route.ts`

What it does:
1. Receives `isUnder13` flag from frontend
2. Adds `COPPA_SYSTEM_PROMPT` to AI instructions for under-13
3. AI follows child safety rules in responses

### Login Pages
- **Parent Login:** `app/login/page.tsx`
- **Kid Login:** `app/login/kid/page.tsx`
- **Teen Signup:** `app/signup/teen/page.tsx`

---

## Usage Example

### In Your Components

```typescript
import { useChatCompliance } from '@/lib/coppa-chat-helper';

function MyChat({ childId, gradeLevel }) {
  const {
    config,           // COPPA settings
    isUnder13,        // boolean
    processMessage,   // Filter PII
    saveChat,         // Save to session
    loadChat,         // Load from session
    clearChat,        // Clear session
    getSystemPrompt,  // Add COPPA rules to AI prompt
  } = useChatCompliance(gradeLevel, childId);

  // Check what's allowed
  if (config.canStoreHistory) {
    // Save to database (13+ only)
  }

  // Process message before storing
  const safeMessage = processMessage(userInput);

  // Get AI prompt with COPPA rules
  const systemPrompt = getSystemPrompt(basePrompt);
}
```

### In GigiLiveChat

```tsx
<GigiLiveChat
  childId={child.id}
  childName={child.name}
  gradeLevel={child.grade_level}  // "K", "1", "2"... "12"
  pageContext="dashboard"
/>
```

---

## Database Schema Changes

Added to `children` table:
- `is_independent_teen` (boolean) - True for 14+ independent accounts
- `linked_parent_email` (text) - Optional parent email for oversight

Added to `profiles` table:
- `account_type` (text) - 'parent' or 'teen'

**Migration:** `supabase/migrations/20260114_add_independent_teen_columns.sql`

---

## Compliance Checklist

### Before Collecting Any Child Data:
- [x] Parent creates account first
- [x] Parent explicitly adds child
- [x] Parent sets child's PIN (not child)
- [x] Consent recorded before child uses platform

### During Child's Use:
- [x] PII filtered from chat (under 13)
- [x] No permanent chat storage (under 13)
- [x] Auto-clear after inactivity (under 13)
- [x] AI doesn't ask for personal info (under 13)
- [x] No file/image uploads (under 13)

### Parent Rights:
- [x] Can view child's account
- [x] Can change/disable child's PIN
- [x] Can delete child's account
- [x] Can revoke access anytime

---

## Industry Examples

These platforms use similar approaches:
- **ABCmouse** - Parent account first, then add kids
- **Khan Academy Kids** - Parent consent flow
- **PBS Kids** - Age-gated content
- **YouTube Kids** - Parental controls

---

## Resources

- [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [COPPA Rule Text](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312)
- [2024 COPPA Updates](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)

---

## Quick Reference

| Feature | Under 13 | 13+ |
|---------|----------|-----|
| Chat Storage | Session only | Database OK |
| PII Filtering | Yes | No |
| File Uploads | No | Yes |
| Auto-clear | 30 min | Never |
| Parent Required | Yes | No |
| AI Safety Rules | Enforced | Standard |

---

*Last Updated: January 2026*
*SchoolGenius - COPPA Compliant Educational Platform*
