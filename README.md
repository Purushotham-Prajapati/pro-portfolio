# Dr. M. Madhu Bala Academic Portfolio

A database-driven academic portfolio and lightweight CMS for Dr. M. Madhu Bala. The public site presents academic profile content, research impact, awards, teaching work, contact details, and timeline milestones, while the protected admin area lets editors manage portfolio data, navigation, page blocks, settings, and media.

## Features

- Public academic portfolio pages for Home, Journey, Research, Awards, Teaching, and Contact.
- MongoDB-backed portfolio data with a flexible `Portfolio` schema for profile, research, awards, navigation, SEO, and media fields.
- Dynamic page system using editable block types: `HERO`, `TIMELINE`, `GRID`, `RICH_TEXT`, and `LIST`.
- Protected admin dashboard under `/admin/dashboard` with sections for personal info, about, journey, research, awards, teaching, contact, navigation, content, media, and settings.
- JWT cookie authentication for admin routes, with password hashes stored in MongoDB.
- ImageKit integration for media uploads, delivery, thumbnails, and deletion.
- Route handlers for portfolio updates, page CRUD, media management, ImageKit auth, login/logout, auth settings, and cache revalidation.
- Route-level loading states and reusable skeleton/admin UI components.
- TypeScript-first Next.js App Router implementation.

## Tech Stack

- Next.js 16 with App Router
- React 18
- TypeScript
- MongoDB and Mongoose
- JWT authentication with `jose`
- Password hashing with `bcryptjs`
- ImageKit media storage and delivery
- Tiptap rich text editing
- dnd-kit drag and drop
- Lucide React icons
- Tailwind CSS 4/PostCSS

## Project Structure

```text
.
|-- src/
|   |-- app/
|   |   |-- page.tsx                 # Home page
|   |   |-- journey/                 # Public journey timeline page
|   |   |-- research/                # Public research page
|   |   |-- awards/                  # Public awards page
|   |   |-- teaching/                # Public teaching page
|   |   |-- contact/                 # Public contact page
|   |   |-- [slug]/                  # Dynamic CMS-managed pages
|   |   |-- admin/                   # Admin login and dashboard
|   |   |-- api/                     # Route handlers
|   |   `-- globals.css
|   |-- components/                  # Public UI sections and shared admin components
|   |-- hooks/                       # UI hooks
|   |-- lib/                         # Database, auth, and data helpers
|   |-- models/                      # Mongoose models
|   `-- scripts/                     # Database seed scripts
|-- design-system/                   # Admin panel design notes
|-- portfolio.json                   # Legacy/source portfolio data for page seeding
|-- package.json
`-- README.md
```

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Home hero and about sections from the portfolio record |
| `/journey` | Education, career, awards, and research timeline |
| `/research` | Research metrics, interests, projects, and publications |
| `/awards` | Awards and recognition |
| `/teaching` | Teaching and academic leadership content |
| `/contact` | Academic profiles and contact information |
| `/:slug` | Published dynamic page rendered from CMS blocks |

## Admin Routes

| Route | Purpose |
| --- | --- |
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Dashboard metrics |
| `/admin/dashboard/personal` | Personal profile details |
| `/admin/dashboard/about` | About section content |
| `/admin/dashboard/journey` | Timeline and journey content |
| `/admin/dashboard/research` | Research content |
| `/admin/dashboard/awards` | Awards content |
| `/admin/dashboard/teaching` | Teaching content |
| `/admin/dashboard/contact` | Contact content |
| `/admin/dashboard/navigation` | Navigation items |
| `/admin/dashboard/content` | CMS page block editing |
| `/admin/dashboard/media` | ImageKit media management |
| `/admin/dashboard/settings` | Site/admin settings |

## API Routes

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/portfolio` | `GET`, `PUT`, `PATCH` | Read or update the main portfolio document |
| `/api/pages` | `GET`, `POST` | List pages or create a new CMS page |
| `/api/pages/[slug]` | `GET`, `PUT`, `DELETE` | Read, update, or delete a CMS page |
| `/api/media` | `GET`, `POST`, `DELETE` | Manage authenticated media uploads and records |
| `/api/imagekit/auth` | `GET` | Generate ImageKit client auth parameters |
| `/api/auth/login` | `POST` | Authenticate an admin and set the auth cookie |
| `/api/auth/logout` | `POST` | Clear the auth cookie |
| `/api/auth/settings` | varies | Admin settings/auth utilities |
| `/api/revalidate` | `POST` | Revalidate cached portfolio content with a secret |

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB connection string
- ImageKit account for media uploads

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

NEXT_PUBLIC_BASE_URL=http://localhost:3000
REVALIDATE_SECRET=replace_with_a_random_revalidation_secret
```

`MONGODB_URI`, `JWT_SECRET`, and the ImageKit values are required for the full app. `NEXT_PUBLIC_BASE_URL` is used by the shared portfolio fetcher, and `REVALIDATE_SECRET` protects `/api/revalidate`.

### Seed Data

Seed the portfolio document:

```bash
npx tsx src/scripts/seedPortfolio.ts
```

Seed CMS pages from `portfolio.json`:

```bash
npx tsx src/scripts/seedPages.ts
```

Create the initial admin user:

```bash
npx tsx src/scripts/seedAdmin.ts
```

The admin seed creates `admin` / `password123` if no admin exists. Change this password immediately after first setup or replace it with a stronger seeded credential before deployment.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the CMS.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run TypeScript type checking with `tsc --noEmit` |

## Data Model Overview

- `Portfolio`: flexible portfolio document with sections for profile details, education, research interests, technical skills, publications, funded projects, awards, roles, teaching subjects, timeline events, contact details, navigation, site metadata, dynamic sections, and media.
- `Page`: CMS page model with `slug`, `title`, `isPublished`, and ordered content blocks.
- `Admin`: admin user model with `username`, `passwordHash`, and role.

## Deployment

The app is designed for Vercel or any Node-compatible Next.js host.

1. Provision MongoDB and ImageKit.
2. Add all required environment variables to the deployment platform.
3. Build with `npm run build`.
4. Run the seed scripts against the production database when initializing the site.
5. Deploy the Next.js app.

For Vercel, use the Next.js framework preset and configure the environment variables in the project settings.

## Notes

- Admin pages are protected by `src/middleware.ts`; `/admin/login` remains public.
- Public pages currently read directly from MongoDB and are marked dynamic where needed.
- Uploaded media is stored in ImageKit, while file metadata is kept in the portfolio document.
- `next.config.mjs` allows optimized images from `ik.imagekit.io`.
- This repository is private/proprietary and does not include an open-source license.
