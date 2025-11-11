# TinyTalks English Course Website

A modern, full-featured website for TinyTalks with a public marketing site and an integrated admin panel powered by Supabase for auth, database, and storage.

## Features

### Public Website
- Hero, About, Pricing, Reviews, Blog Preview, Contact form
- Fully responsive design

### Admin Panel
- Dashboard with quick stats
- Blog management with TipTap rich text editor and image upload
- Contact messages inbox
- Google Analytics 4 integration (optional)

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Supabase (Auth, Postgres, Storage)
- TipTap Editor
- Heroicons
- Google Analytics 4 (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier is fine)
- Optional: Google Analytics 4 property

### Installation

1) Clone and install
```bash
cd tinytalks
npm install
```

2) Configure environment variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3) Initialize database (recommended)
- Run the SQL in `supabase-setup.sql` (and other provided SQL files) in Supabase SQL Editor
- Create an admin user and set `user_metadata.role = 'admin'` (see `create-admin-user.sql`)

4) Start the dev server
```bash
npm run dev
```

Open:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Project Structure

```
tinytalks/
├── app/
│   ├── admin/
│   │   ├── blog/
│   │   ├── dashboard/
│   │   ├── messages/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── auth/
│   │   └── callback/route.ts      # Supabase OAuth callback
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   └── public/
├── lib/
│   ├── analytics.ts
│   └── supabase.ts                # Supabase client and helpers
├── types/
└── public/
```

## Usage Notes

- Admin access requires a Supabase user with `user_metadata.role = 'admin'`
- Non-admin users are redirected to `/dashboard`
- Image uploads use Supabase Storage
- Real-time updates use Supabase channels

## Deployment

Deploy on Vercel:
```bash
npm run build
npm start
# Or via Vercel CLI
npm i -g vercel && vercel
```
Remember to set the environment variables in your hosting provider.

## Support

- Supabase: configure URL and ANON KEY in `.env.local`
- For SQL schema and policies, see the SQL files in the repo and `SUPABASE_SETUP.md`
- Frontend issues: check the browser console and Next.js docs

## License

© 2024 TinyTalks. All rights reserved.

---

Built with ❤️ for English learners worldwide
