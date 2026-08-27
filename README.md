# معرض السيارات - Car Dealership Lead Management System

A production-ready Next.js 15 CRM for car dealerships — captures TikTok ad leads via a public Arabic RTL form and manages them through a secure admin dashboard.

---

## Features

- **Public Lead Form** (`/`) — Mobile-first, dark luxury design, Arabic RTL, UTM tracking
- **Admin Dashboard** (`/admin`) — Stats, charts (AreaChart + PieChart), lead table with search/filter, status management
- **Secure Auth** — Supabase Auth with middleware-level route protection
- **Direct Contact** — One-click call (`tel:`) and WhatsApp links per lead
- **Real-time Filters** — Filter by status, date range, or free-text search

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v3 | Styling |
| Supabase (PostgreSQL + Auth) | Database & authentication |
| Recharts | Charts |
| React Hook Form + Zod | Form validation |
| Lucide React | Icons |
| sonner | Toast notifications |

---

## Setup Instructions

### 1. Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Once created, go to **SQL Editor** and run the contents of `supabase/migrations/001_initial.sql`
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Admin User

In Supabase: **Authentication → Users → Add User**
- Enter your admin email and a strong password
- This user can log in at `/admin/login`

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repo to Vercel and add the environment variables in the Vercel dashboard.

---

## TikTok Ad UTM Tracking

Append UTM params to your landing page URL in TikTok Ads Manager:

```
https://your-domain.com/?utm_source=tiktok&utm_campaign=CAMPAIGN_NAME&utm_content=AD_NAME
```

These are captured automatically and stored with each lead.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public lead capture form |
| `/admin` | Admin dashboard (requires login) |
| `/admin/login` | Admin login page |
| `/api/leads` | POST — create a new lead |
| `/api/leads/[id]` | PATCH — update lead status |

---

## Lead Statuses

| Status | Arabic |
|--------|--------|
| `new` | جديد |
| `contacted` | تم التواصل |
| `interested` | مهتم |
| `appointment` | موعد |
| `sold` | تم البيع |
| `not_interested` | غير مهتم |
