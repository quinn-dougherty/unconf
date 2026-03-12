# UNCONF FOR NO REASON

A chaotic unconference scheduling app where there are no accounts, no permissions, and no rules. Anyone can claim a talk slot. Anyone can hijack someone else's slot. You can voluntell your friends to give talks they never agreed to. This is PVP scheduling.

Built with Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, [Effect](https://effect.website), Supabase (database + realtime), and canvas-confetti. Brutalist dark UI. Real-time sync across all clients.

## Features

- **No auth, just vibes** — pick any name, that's your identity now
- **Password-gated site** — one shared password keeps out randos, not chaos
- **Single-track schedule** — lightning (10min), standard (20min), and micro (5min) slots
- **Anyone can edit anything** — claim empty slots, hijack existing ones, rewrite descriptions
- **PVP voluntelling** — nominate someone else to give a talk via the bounty board
- **Auto-bounties** — list someone else as a speaker and a bounty is created automatically
- **Emoji reactions** — with confetti, obviously
- **Comments** — with community flagging and auto-hide for the truly unhinged
- **Real-time sync** — Supabase realtime keeps everyone's chaos in sync
- **Admin delete** — one hardcoded admin name can delete things (change it in `lib/constants.ts`)

## Deploy Your Own

### 1. Fork & install

```bash
git clone <your-fork-url>
cd unconf
pnpm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --include-seed
```

The `--include-seed` flag pushes migrations and seeds your time slots from `supabase/seed.sql`.

### 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in these three values:

```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project settings
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase project settings > API
NEXT_PUBLIC_SITE_PASSWORD=        # whatever you want the gate password to be
```

### 4. Run locally

```bash
pnpm dev
```

### 5. Deploy to Vercel

Connect your repo to [Vercel](https://vercel.com). Add the same 3 env vars above. Done.

## Customize

| What | Where |
|---|---|
| Event name, date, location | `lib/constants.ts` |
| Time slots and counts | `supabase/seed.sql` (re-run `npx supabase db push --include-seed` after editing) |
| Site gate password | `NEXT_PUBLIC_SITE_PASSWORD` env var |
| Admin user | `lib/constants.ts` (hardcoded to `"quinn"` by default) |

## Stack

| | |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Data/effects | [Effect](https://effect.website) |
| Database + realtime | Supabase |
| Confetti | canvas-confetti |
| Package manager | pnpm |
