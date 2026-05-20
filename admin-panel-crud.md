# Plan: Admin Panel CRUD, Media Manager & Settings

Detailed plan to implement complete CRUD capabilities, ImageKit media manager, and global settings/credentials editor in Next.js.

## Project Type
**WEB** (Next.js App Router)

## Success Criteria
- [ ] Admin panel supports full CRUD operations on all pages and components.
- [ ] Media Manager `/admin/dashboard/media` connects securely to ImageKit to list, upload, and delete images.
- [ ] Settings screen `/admin/dashboard/settings` supports SEO metadata edits and password changes.
- [ ] Skeleton loading states implemented for all CRUD screens to ensure seamless, premium user experience.
- [ ] Direct image selection from Media Library into SEO metadata and profile fields.

---

## File Structure Changes
```text
src/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       ├── media/
│   │       │   └── page.tsx         # Media Library Dashboard
│   │       └── settings/
│   │           └── page.tsx         # Global SEO & Password settings
│   └── api/
│       ├── media/
│       │   └── route.ts             # API to list & delete ImageKit assets
│       └── auth/
│           └── settings/
│               └── route.ts         # Secure password updater
```

---

## Task Breakdown

### Task 1: Create ImageKit Server-side media API
*   **Agent**: `backend-specialist`
*   **Skill**: `api-patterns`
*   **INPUT**: ImageKit server credentials.
*   **OUTPUT**: `src/app/api/media/route.ts` with GET (listFiles) and DELETE (deleteFile) endpoints.
*   **VERIFY**: API GET request returns lists of uploaded images from ImageKit.

### Task 2: Create Secure Settings and Credentials API
*   **Agent**: `backend-specialist` + `security-auditor`
*   **Skill**: `api-patterns`
*   **INPUT**: Admin model schema, session token.
*   **OUTPUT**: `src/app/api/auth/settings/route.ts` that safely updates the admin password with `bcryptjs` hashing.
*   **VERIFY**: Authenticated users can successfully modify user records, and invalid cookies are rejected.

### Task 3: Build Premium Media Library Dashboard
*   **Agent**: `frontend-specialist`
*   **Skill**: `frontend-design`
*   **INPUT**: ImageKit APIs.
*   **OUTPUT**: `src/app/admin/dashboard/media/page.tsx` with a modern upload zone, copyable links, responsive thumbnail grid, and skeleton loaders.
*   **VERIFY**: Direct upload writes to ImageKit and refreshes the asset grid with smooth transition animations.

### Task 4: Build Global Settings & SEO Suite
*   **Agent**: `frontend-specialist`
*   **Skill**: `frontend-design`
*   **INPUT**: Portfolio schema, Auth API.
*   **OUTPUT**: `src/app/admin/dashboard/settings/page.tsx` editing SEO metrics, site titles, profile picture selectors, and secure credentials resetting forms.
*   **VERIFY**: Changes update the database instantly and reflect on public landing page meta tags.

---

## Phase X: Verification Plan
- [ ] Run typescript checks: `npx tsc --noEmit`
- [ ] Run security & lint audits: `python .agent/scripts/checklist.py .`
- [ ] Build production package: `npm run build`
