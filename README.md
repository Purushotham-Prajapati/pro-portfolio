# Dr. M. Madhu Bala - Academic Portfolio

A modern, high-performance academic portfolio and content management system for Dr. M. Madhu Bala. Built from the ground up using **Next.js 16 (App Router)** and **TypeScript**, showcasing 21+ years of academic excellence, research publications, and technological milestones.

---

## 🚀 Features

- **Blazing Fast Performance**: Leverages Next.js server-side rendering (SSR) and React Server Components for optimal load times.
- **Dynamic Content Management (CMS)**: Features a robust, custom-built Admin Dashboard tailored for academia. Administrators can dynamically edit Awards, Journey timelines, Contact info, Teaching schedules, and Research publications.
- **Media Optimization**: Integrated with **ImageKit** for on-the-fly image optimization and delivery, tightly coupled with a MongoDB metadata layer.
- **Advanced SEO**: Out-of-the-box Search Engine Optimization with Next.js Metadata, rich OpenGraph tags, Twitter Cards, and canonical URLs.
- **Responsive Aesthetics**: A beautiful, custom UI designed with pure CSS inline architectures and `lucide-react` icons. Fully responsive across all desktop, tablet, and mobile breakpoints.
- **Seamless Loading States**: Employs mathematically precise skeleton loaders specific to individual route layouts (e.g., timeline skeletons for the Journey page, grid skeletons for Awards), eliminating layout shift.

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB & Mongoose
- **Authentication:** Custom JWT-based Admin Auth (using `jose` and `jsonwebtoken`)
- **Media Storage & Delivery:** ImageKit
- **Rich Text Editor:** Tiptap
- **Icons:** Lucide React
- **Drag & Drop:** dnd-kit

---

## 🏗️ Project Structure

```text
├── src/
│   ├── app/
│   │   ├── (public pages)  # journey, research, awards, contact, teaching routes
│   │   ├── admin/          # Secure admin dashboard and CMS views
│   │   ├── api/            # Next.js Route Handlers (auth, media, pages, portfolio)
│   │   └── loading.tsx     # Specialized route-level skeleton loaders
│   ├── components/         # Reusable UI components (HeroSection, Navbar, Skeletons)
│   ├── hooks/              # Custom React hooks (useCountUp, useScrollReveal)
│   ├── lib/                # Core utilities (db.ts, auth.ts)
│   └── models/             # Mongoose schemas (Portfolio.ts)
└── public/                 # Static assets
```

## ⚙️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Cluster (or local instance)
- ImageKit Account

### 1. Clone the repository
```bash
git clone https://github.com/Purushotham-Prajapati/pro-portfolio.git
cd pro-portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and configure the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

### 5. Accessing the Admin Panel
Navigate to `http://localhost:3000/admin/login` to access the Content Management System. You must configure your admin credentials directly in the database or via your initial seeding script.

---

## 📈 Deployment

This project is optimized for deployment on **Vercel**. 
1. Connect the GitHub repository to your Vercel account.
2. Ensure the Framework Preset is set to **Next.js**.
3. Add your Environment Variables in the Vercel project settings.
4. Deploy!

*(Note: Legacy configurations like `vercel.json` routing rules have been intentionally removed to allow Vercel to auto-detect the Next.js App Router environment).*

---

## 📄 License
This project is proprietary and confidential. All content related to Dr. M. Madhu Bala is strictly protected.
