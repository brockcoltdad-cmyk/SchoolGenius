# 🔐 .env File Safety Guide

## CRITICAL: Never Commit Real Credentials!

---

## What's in Your .env File?

Your `.env` file contains sensitive credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...long key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...SUPER SECRET KEY...
```

---

## The Rules

### ✅ SAFE to Commit:
- `.env.example` (with fake values as examples)
- `.gitignore` (which ignores .env files)

### ❌ NEVER Commit:
- `.env`
- `.env.local`
- `.env.production`
- Any file with real API keys

---

## How GitHub Desktop Shows .env Files

**If you see this in GitHub Desktop:**

```
Changes:
  ☑ .env
```

**UNCHECK IT IMMEDIATELY!** ⚠️

The checkbox should be EMPTY for .env files.

---

## Why This Matters

**If you commit .env with real keys:**
1. Anyone can see your database credentials
2. Anyone can read/write/delete your data
3. Anyone can impersonate your service
4. You'll need to rotate all keys (regenerate them)
5. Your app could be compromised

**This is SERIOUS.** Never do it.

---

## Good Practices

### 1. Keep .env Local Only
Your `.env` file should ONLY exist on your computer.

### 2. Use .env.example for Documentation
Create a `.env.example` file with fake values:

```env
# .env.example - Safe to commit
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Check .gitignore
Your `.gitignore` already includes:
```
.env
.env*.local
```

This means git will automatically ignore these files.

---

## What to Do If You Accidentally Commit .env

### If You HAVEN'T Pushed Yet:
1. In GitHub Desktop: Right-click the commit → Undo commit
2. Uncheck .env file
3. Commit again without it

### If You HAVE Pushed to GitHub:
1. **IMMEDIATELY** go to Supabase dashboard
2. Go to Settings → API
3. Click "Reset" on all keys
4. Update your local .env with new keys
5. The old keys are now useless (good!)
6. Remove .env from git history (ask me for help)

---

## Quick Check Before Every Push

**Open your .env file and look for:**
- Real Supabase URLs? → Don't commit
- Real API keys? → Don't commit
- Any "secret" or "password"? → Don't commit

**In GitHub Desktop:**
- Is .env checked? → UNCHECK IT
- Is .env.local checked? → UNCHECK IT
- Is .env.example checked? → OK to commit

---

## Your Workflow

```
┌──────────────────────────────────────┐
│  Download from Bolt                  │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  .env file has placeholder values    │
│  (safe for now)                      │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  YOU add real keys locally           │
│  (never commit these!)               │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Push to GitHub                      │
│  .gitignore prevents .env upload     │
└──────────────────────────────────────┘
```

---

## Red Flag Checklist

🚨 **STOP and remove from commit if you see:**

- [ ] .env file with real Supabase URL
- [ ] Any file with "SUPABASE_SERVICE_ROLE_KEY"
- [ ] API keys that look real (long random strings)
- [ ] Database passwords
- [ ] Stripe keys (when you add payments)
- [ ] Any credential for any service

---

## Testing: Is My .env Safe?

**Run this check:**

1. Open GitHub Desktop
2. Make a small change to any file
3. Check the "Changes" tab
4. Is .env listed?
   - YES → 🚨 DANGER! Check your .gitignore
   - NO → ✅ You're safe

Your `.gitignore` should prevent .env from appearing at all.

---

## Environment Variables in Bolt

**Bolt automatically provides:**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

**When you download:**
- These come as placeholders
- YOU need to add real values locally
- NEVER commit the real values

---

## Questions to Ask Yourself

Before every push:
1. "Did I check if .env is included?"
2. "Am I 100% sure no secrets are in this commit?"
3. "Would I be OK if this code was posted publicly?"

If you answer NO to question 3, DON'T PUSH.

---

## Remember

**Pushing code with secrets is like:**
- Posting your house keys on Instagram
- Sharing your bank password on Twitter
- Leaving your car unlocked with keys inside

**Don't do it.** ⚠️

Take 30 seconds before every push to check. Those 30 seconds could save you hours of recovery work.

---

## Need Help?

If you're ever unsure about whether something is safe to commit, **ASK ME FIRST.**

Better to ask than to expose credentials!
