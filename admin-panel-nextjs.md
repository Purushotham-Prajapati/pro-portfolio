# Admin Panel & Next.js Migration Plan

## 1. Overview
The goal of this task is to migrate the existing Vite/React portfolio to **Next.js (App Router)** and build a highly secure, high-performance **Admin Panel**. The admin panel will support full CRUD operations, reordering, and the addition of dynamic sections using predefined UI blocks. Data will be stored in **MongoDB**, images hosted via **ImageKit**, and authentication secured via **JWT** (access/refresh tokens). The frontend will prioritize UX using lazy loading and skeleton loaders.

## 2. Project Type
**WEB** (Next.js Full-Stack)

## 3. Success Criteria
- [x] Portfolio successfully migrated from Vite to Next.js App Router without visual regressions.
- [ ] Admin panel `/admin` routes are strictly protected by Next.js Middleware and HTTP-only JWT cookies.
- [ ] Full CRUD operations work for existing sections (Education, Projects, etc.).
- [ ] Drag-and-drop functionality implemented for reordering elements.
- [ ] ImageKit integration supports direct uploads with skeleton loading states on the frontend.
- [ ] Dynamic section builder successfully allows adding new block-based content templates (Rich Text, Image Gallery, List).

## 4. Tech Stack
| Technology | Rationale |
|---|---|
| **Next.js (App Router)** | Replaces Vite. Provides built-in Server Components, API routes, and Middleware for seamless full-stack development and SEO optimization. |
| **MongoDB & Mongoose** | NoSQL database, ideal for handling flexible, deeply nested JSON data (like the portfolio structure). |
| **ImageKit** | High-performance image CDN with automatic optimization, lazy loading, and straightforward client-side uploads. |
| **JWT (Cookies)** | Secure authentication using short-lived access tokens and http-only refresh tokens. |
| **Tailwind CSS & Framer Motion** | Maintained from the current stack for styling and micro-animations. |
| **TipTap / React Hook Form** | TipTap for a customizable Rich Text Editor (good UX), RHF for performant form state management. |
| **dnd-kit** | Lightweight and performant drag-and-drop library for reordering items. |

## 5. File Structure (Proposed)
```text
/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public portfolio pages
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin/             # Admin panel routes
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── layout.tsx
│   │   └── api/               # Next.js API Routes
│   │       ├── auth/          # login, refresh, logout
│   │       ├── portfolio/     # CRUD endpoints
│   │       └── imagekit/      # ImageKit auth generation
│   ├── components/
│   │   ├── admin/             # Admin specific UI (Sidebar, Forms, DND lists)
│   │   ├── shared/            # Shared UI (Buttons, Skeleton loaders)
│   │   └── public/            # Portfolio UI components
│   ├── lib/
│   │   ├── db.ts              # MongoDB connection
│   │   └── auth.ts            # JWT verification utilities
│   └── models/                # Mongoose Schemas (Portfolio, User/Admin)
├── middleware.ts              # Protects /admin routes
└── package.json
```

## 6. Task Breakdown

### Task 1: Next.js Migration & Setup
*   **Agent**: `app-builder` + `frontend-specialist`
*   **Skill**: `react-best-practices`
*   **INPUT**: Existing Vite source code.
*   **OUTPUT**: A working Next.js App Router project replacing Vite, with Tailwind configured.
*   **VERIFY**: `npm run dev` serves the existing portfolio page without errors.

### Task 2: Database & Mongoose Schema Design
*   **Agent**: `database-architect` + `backend-specialist`
*   **Skill**: `database-design`
*   **INPUT**: `portfolio.json` structure.
*   **OUTPUT**: MongoDB connection in `lib/db.ts` and Mongoose schemas mapping `portfolio.json` + an Admin User schema. Dynamic sections handled via discriminated unions or block arrays.
*   **VERIFY**: ✅ Able to seed the database with the existing JSON data successfully.

### Task 3: Secure JWT Authentication
*   **Agent**: `security-auditor` + `backend-specialist`
*   **Skill**: `api-patterns`
*   **INPUT**: Admin schema.
*   **OUTPUT**: `/api/auth/login` (generates access/refresh HTTP-only cookies), `/api/auth/refresh`, and `middleware.ts` to protect `/admin/*`.
*   **VERIFY**: ✅ Unauthorized users accessing `/admin` are redirected to `/admin/login`.

### Task 4: ImageKit Integration & API
*   **Agent**: `backend-specialist`
*   **Skill**: `api-patterns`
*   **INPUT**: ImageKit API keys.
*   **OUTPUT**: `/api/imagekit/auth` endpoint to generate secure upload signatures for client-side.
*   **VERIFY**: ✅ Endpoint returns a valid signature, expire time, and token.

### Task 5: Admin Panel Foundation & Layout
*   **Agent**: `frontend-specialist`
*   **Skill**: `frontend-design`
*   **INPUT**: Protected Next.js routes.
*   **OUTPUT**: Admin sidebar, header, global state (Zustand or Context), and UI components (Cards, Tables, Skeletons).
*   **VERIFY**: ✅ Logged-in admin can navigate between empty dashboard pages with active states.

### Task 6: CRUD Operations & Forms
*   **Agent**: `frontend-specialist` + `backend-specialist`
*   **Skill**: `react-best-practices`
*   **INPUT**: Mongoose models, Admin UI.
*   **OUTPUT**: API endpoints for updating portfolio data, integrated with React Hook Form + TipTap editor on the frontend.
*   **VERIFY**: ✅ Edits in the admin panel accurately update MongoDB and reflect on the public page.

### Task 7: Reordering & Dynamic Sections (UX Polish)
*   **Agent**: `frontend-specialist`
*   **Skill**: `frontend-design`
*   **INPUT**: CRUD forms.
*   **OUTPUT**: `dnd-kit` implemented for list reordering (e.g., reordering education/projects). Block-based UI to append "Dynamic Sections" to the portfolio.
*   **VERIFY**: ✅ Dragging an item saves its new index to the database.

### Task 8: Performance Optimization (Skeletons & Lazy Loading)
*   **Agent**: `performance-optimizer`
*   **Skill**: `react-best-practices`
*   **INPUT**: Completed full-stack app.
*   **OUTPUT**: Implementation of `next/image` for lazy loading, skeleton screens during data fetch, React Suspense boundaries.
*   **VERIFY**: ✅ Lighthouse performance score > 90. No layout shifts (CLS) when loading images.

## 7. Phase X: Verification
*This checklist must be completed before the project is marked done.*
- [ ] `npm run lint` & `tsc --noEmit` pass.
- [ ] `security_scan.py` run and passed (No exposed secrets, JWT secure).
- [ ] `ux_audit.py` passed.
- [ ] `lighthouse_audit.py` (Lighthouse score > 90 for performance).
- [ ] `npm run build` succeeds without errors.
- [ ] All features manually tested.

---
*Created by project-planner agent*
