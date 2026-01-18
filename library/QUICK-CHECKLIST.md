# ✅ Quick Push Checklist

Print this out and keep it next to your computer!

---

## Before Every Push:

### 1. Test in Bolt
- [ ] Feature works in Bolt preview
- [ ] No visible errors
- [ ] Looks good on desktop
- [ ] Looks good on mobile (if applicable)

### 2. Download & Test Locally
- [ ] Downloaded latest code from Bolt
- [ ] Extracted to project folder
- [ ] Ran `npm install` (if package.json changed)
- [ ] Ran `npm run dev`
- [ ] Tested at http://localhost:3000
- [ ] Everything still works

### 3. Review Changes
- [ ] Opened GitHub Desktop
- [ ] Reviewed all changed files
- [ ] Understand what each change does
- [ ] No .env files with real keys selected
- [ ] No unnecessary files selected

### 4. Database Safety (if migrations exist)
- [ ] Read the migration SQL
- [ ] Understand what it changes
- [ ] Know it won't delete data
- [ ] Tested in Bolt first

### 5. Commit
- [ ] Written clear commit message
- [ ] Message explains WHAT and WHY
- [ ] Message is specific, not vague

### 6. Final Check
- [ ] One last look at changed files
- [ ] Confident this won't break anything
- [ ] Ready to push

### 7. Push!
- [ ] Click "Push origin"
- [ ] Wait for confirmation
- [ ] Changes are now on GitHub

---

## Red Flags - STOP and Ask for Help

🚨 **STOP if you see:**
- .env file with `SUPABASE_SERVICE_ROLE_KEY` selected
- Migration that says `DROP TABLE`
- Migration that says `DELETE FROM`
- Files you don't recognize
- Hundreds of changed files unexpectedly
- Error messages you don't understand

---

## Good Commit Message Examples

✅ "Add visual lesson components for math and reading"
✅ "Fix leaderboard crash when no students exist"
✅ "Update database schema for grades 4-12 skills"
✅ "Improve anime theme dashboard layout"

❌ "updates"
❌ "fix"
❌ "changes stuff"
❌ "idk"

---

## Time Estimates

- Quick UI fix: 5 minutes
- New feature: 10-15 minutes
- Database changes: 15-20 minutes (extra careful!)

**Taking your time = Staying safe**

---

Keep this checklist handy and you'll never push broken code!
