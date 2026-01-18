# 🚀 Your Development Workflow Guide

## The Safe Way to Work with Bolt + GitHub

---

## 📋 Quick Reference Checklist

### Every Time You Work in Bolt:
- [ ] Make changes in Bolt
- [ ] Test in Bolt preview
- [ ] Download to local machine
- [ ] Test locally (npm run dev)
- [ ] Review all changed files
- [ ] Commit with GitHub Desktop
- [ ] Push to GitHub

---

## 🔄 Step-by-Step Workflow

### 1️⃣ **Making Changes in Bolt**
```
✏️ Work in Bolt
├── Ask me to add features
├── Test in Bolt's preview
└── Make sure everything works
```

**What to test:**
- Does the UI look right?
- Do buttons work?
- No console errors?
- Database changes work?

---

### 2️⃣ **Download Your Code**
```
📥 Click "Download Code" in Bolt
├── Saves as a .zip file
└── Extract to your project folder
```

**Pro Tip:**
Create a dedicated folder structure:
```
Documents/
  SchoolGenius/
    ├── current-version/     ← Your working code
    └── bolt-downloads/      ← Keep backups here
```

---

### 3️⃣ **Test Locally (CRITICAL)**
```bash
cd your-project-folder
npm install        # Only needed first time or if package.json changed
npm run dev        # Start local server
```

**Open:** http://localhost:3000

**Test everything again:**
- Click through all pages
- Test new features
- Check console for errors
- Make sure database still works

---

### 4️⃣ **Review Changes in GitHub Desktop**

**Open GitHub Desktop and check:**
- [ ] Which files changed?
- [ ] Do the changes make sense?
- [ ] Any files that shouldn't be there? (uncheck them)
- [ ] Any sensitive data exposed? (**NEVER commit .env files with real keys**)

**Common files to IGNORE:**
- `.env.local` (if it has real keys)
- `node_modules/` (should be in .gitignore already)
- Any test files you created

---

### 5️⃣ **Commit with a Good Message**

**BAD commit messages:**
- "updates"
- "changes"
- "fixed stuff"

**GOOD commit messages:**
- "Add visual lesson player for grade 4-12 content"
- "Fix leaderboard loading for Minecraft theme"
- "Update database schema to add lesson visuals"
- "Add anime theme dashboard template"

**Format:**
```
Short summary (50 chars or less)

- Detailed point 1
- Detailed point 2
- What was changed and why
```

---

### 6️⃣ **Push to GitHub**

Click **"Push origin"** in GitHub Desktop

✅ Your changes are now backed up!

---

## 🗄️ Database Changes - EXTRA CAREFUL

### When I Create Database Migrations:

**Before pushing:**
1. Check the migration file in `supabase/migrations/`
2. Read through the SQL
3. Make sure you understand what it does
4. Test in Bolt first
5. If it works, THEN download and push

**Migration files are named like:**
```
20260109035323_add_lang_skills_grades_4_12.sql
```

**They contain:**
- New tables
- New columns
- Security policies (RLS)
- Data inserts

**NEVER manually edit old migrations.** If you need to change something, ask me to create a NEW migration.

---

## 🛡️ Safety Checklist Before Pushing

- [ ] Code tested in Bolt preview
- [ ] Code tested locally (npm run dev)
- [ ] No console errors
- [ ] Database queries work
- [ ] No .env files with real keys
- [ ] Commit message is clear
- [ ] Only relevant files included

---

## 🔥 Emergency Rollback

**If you push bad code:**

1. **In GitHub Desktop:** Right-click the commit → Revert
2. **Or use git:** `git revert HEAD`
3. **Then push again**

**For database issues:**
- Supabase has point-in-time recovery
- Contact me and I'll help write a fix migration

---

## 📊 Your Project Structure

```
your-project/
├── .bolt/                    ← Project docs (this file)
├── app/                      ← Next.js pages
├── components/               ← React components
├── lib/                      ← Utilities and helpers
├── supabase/migrations/      ← DATABASE CHANGES (be careful!)
├── .env                      ← NEVER COMMIT WITH REAL KEYS
├── package.json              ← Dependencies
└── README.md                 ← Project overview
```

---

## 🎯 Best Practices

### DO:
✅ Test everything before pushing
✅ Write clear commit messages
✅ Keep .env files private
✅ Review changed files before committing
✅ Push regularly (daily if you're working)
✅ Keep backups of working versions

### DON'T:
❌ Push untested code
❌ Commit .env files with real credentials
❌ Use vague commit messages
❌ Push database migrations you don't understand
❌ Work directly in production
❌ Delete files without checking if they're needed

---

## 📞 When to Ask for Help

**Ask me if:**
- Database migration fails
- Deployment breaks
- You're not sure what a file does
- You want to rollback a change
- Something in .env should/shouldn't be committed
- You need to understand a piece of code

---

## 🎓 Why This Workflow Matters

**Your app has:**
- Real student data
- Parent accounts
- Database with important information
- Payment features (future)
- Multiple themes and complex logic

**One bad push could:**
- Break the app for all users
- Lose data
- Expose sensitive info
- Require hours to fix

**This workflow prevents that.** 🛡️

---

## Quick Command Reference

```bash
# Start local development
npm run dev

# Check for TypeScript errors
npm run typecheck

# Build for production (test before pushing)
npm run build

# Install dependencies
npm install
```

---

## Your Workflow in One Image

```
┌─────────────┐
│   Bolt.new  │
│  (develop)  │
└──────┬──────┘
       │ Download
       ▼
┌─────────────┐
│    Local    │
│ (test here) │
└──────┬──────┘
       │ If working
       ▼
┌─────────────┐
│   GitHub    │
│  Desktop    │
└──────┬──────┘
       │ Review & Commit
       ▼
┌─────────────┐
│   GitHub    │
│  (backup)   │
└─────────────┘
```

---

**Remember:** Going slow = going safe. Taking 5 minutes to review is better than spending 5 hours fixing a broken deploy.

**Questions?** Just ask! I'm here to help.
