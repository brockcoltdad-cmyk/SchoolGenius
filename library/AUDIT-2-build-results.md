# AUDIT 2: Build Results
**Date:** 2026-01-17
**Command:** `npm run build`
**Result:** SUCCESS (with warnings)

---

## Build Status: PASSED

- 67 static pages generated
- No TypeScript errors
- No fatal errors

---

## Warnings (Non-Blocking)

### 1. Browserslist Outdated
```
Browserslist: caniuse-lite is outdated.
Fix: npx update-browserslist-db@latest
```

### 2. Dynamic Server Usage (2 API routes)
```
app/api/test-themed-content/route.js - uses request.url
app/api/themed-content/route.js - uses request.url
```
These routes can't be statically rendered - this is expected behavior.

### 3. Supabase Realtime Dependency
```
Critical dependency: the request of a dependency is an expression
Location: @supabase/realtime-js/dist/main/RealtimeClient.js
```
This is a known Supabase warning - safe to ignore.

### 4. metadataBase Not Set (11 occurrences)
```
metadata.metadataBase is not set for resolving social open graph or twitter images
Defaulting to: http://localhost:3000
```
Fix: Set metadataBase in layout.tsx for production.

---

## Pages Generated (67 total)

### Static Pages (○)
- / (landing)
- /contact, /help, /safety
- /coppa-compliance, /privacy-policy, /terms-of-service
- /dashboard, /dashboard/add-child, /dashboard/data, etc.
- /demo/* (all demo pages)
- /login, /login/kid, /signup, /signup/teen
- /test-themes, /theme-test

### Dynamic Pages (λ)
- /api/* (all API routes)
- /kid/[id]/* (all kid pages)
- /dashboard/child/[id]/*
- /dashboard/children/[childId]/*

---

## Bundle Sizes

| Page | Size | First Load JS |
|------|------|---------------|
| / | 12.8 kB | 231 kB |
| /kid/[id]/lesson/[skillId] | 56.7 kB | 259 kB |
| /dashboard | 10.9 kB | 211 kB |
| Shared JS | 79.5 kB | - |

---

## Conclusion

**BUILD PASSES** - Ready for deployment.
Minor warnings can be fixed later but don't block functionality.
