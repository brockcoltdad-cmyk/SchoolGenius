# APPLY PHASE 2 DATABASE MIGRATION

## Quick Instructions

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/eczpdbkslqbduiesbqcm/sql/new

2. **Copy the migration SQL:**
   - Open: `supabase/migrations/20260111_phase2_multilevel_explanations.sql`
   - Copy ALL contents (Ctrl+A, Ctrl+C)

3. **Paste and Run:**
   - Paste into the SQL Editor
   - Click "Run" button

4. **Verify:**
   - Run: `SELECT COUNT(*) FROM explanation_library;`
   - Run: `SELECT COUNT(*) FROM mistake_patterns;`
   - Both should return a count (at least 1 from sample data)

## ✅ What This Creates

- **explanation_library** table: Stores multi-level explanations (6 types)
- **mistake_patterns** table: Stores common wrong answers with feedback
- **Helper views**: explanation_coverage, common_mistakes
- **Sample data**: Test entries for immediate testing

## 🔍 Troubleshooting

If you see errors like "already exists":
- This is normal - tables may be partially created
- Continue anyway - the script uses "IF NOT EXISTS" clauses

If migration fails:
- Check you're using the Service Role key (not anon key)
- Verify you have database permissions
- Try running sections individually

## 📊 After Migration

Run these queries to verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('explanation_library', 'mistake_patterns');

-- Check sample data
SELECT * FROM explanation_library LIMIT 1;
SELECT * FROM mistake_patterns LIMIT 1;

-- Check views
SELECT * FROM explanation_coverage;
```

## ✅ Success Indicators

You'll know it worked when:
1. No red error messages in SQL Editor
2. Both tables return data when queried
3. Views return results
4. Test script shows green checkmarks

## 🚀 Next Step

After successful migration, run:
```bash
cd "C:\Users\Dad\Desktop\SchoolGenius-Final"
node test-phase2-deployment.mjs
```

All tests should pass with ✅ green checkmarks.
