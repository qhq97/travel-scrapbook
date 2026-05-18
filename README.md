# Travel Scrapbook

A shared travel memory app for small groups. Create a trip, invite your crew with a code, and collect photos, notes, quotes, and places in one mobile-friendly scrapbook.

## Features

- **Trips** — Create trips with a title, subtitle, and cover image; switch between trips from the header.
- **Invite codes** — Share an invite code so others can join the same trip.
- **Feed** — Chronological view of entries with comments.
- **Scrapbook** — Grid layout of memories for a trip-at-a-glance feel.
- **Entries** — Add photos, notes, quotes, or places (with optional location and mood).
- **Auth** — Email/password sign-in and sign-up via Supabase.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Supabase](https://supabase.com) (auth, database, storage)
- [Framer Motion](https://www.framer.com/motion/) for UI transitions
- [Vercel Analytics](https://vercel.com/analytics)

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project with the app's tables, RLS policies, storage bucket (`scrapbook-images`), and RPCs configured

### Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in, then create a trip or join one with an invite code.

### Other scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run build` | Production build        |
| `npm run start` | Run production server   |
| `npm run lint`  | Run ESLint              |

## Project structure

```
src/
├── app/              # Next.js app shell (layout, page, styles)
├── components/       # UI (auth, entries, layout, trips)
├── features/scrapbook/  # Main app + data hook
├── lib/              # Supabase client, types, constants
└── services/         # Supabase queries (trips, entries, comments)
```

## Deploy

The app is a standard Next.js deployment. Set the same Supabase environment variables on your host (e.g. [Vercel](https://vercel.com)).
