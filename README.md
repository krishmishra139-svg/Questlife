# QuestLife — Level Up Your Real Life

A dark-fantasy, tavern-themed Life RPG web app. Turn your daily habits into
quests, earn XP and gold, grow attributes, and level up your character.

DEPLOYED URL : https://questlife-izfs.onrender.com
ILLUSTRATION VIDEO : https://youtu.be/E3y9CJ2LywY

## Tech stack
- Next.js 14 (App Router) + TypeScript
- Supabase (Postgres + Auth, with Row Level Security)
- Tailwind CSS (custom dark-fantasy theme)
- Framer Motion (all animations, drag-to-reorder, modals)
- Zustand (character + quest state, synced to Supabase)
- canvas-confetti (celebration bursts)
- lucide-react (icons)
- Hand-built pixel-art avatar (no external image assets)

## Getting started

1. **Create a Supabase project** at https://supabase.com/dashboard.
2. **Run the schema**: open the SQL Editor in your project and run the
   contents of `supabase/schema.sql`. This creates the `profiles` and
   `quests` tables, enables Row Level Security so each user can only see
   their own rows, and adds a trigger that auto-creates a `profiles` row
   whenever someone signs up.
3. **Set your env vars**: copy `.env.local.example` to `.env.local` and fill
   in your project's URL and anon key (Project Settings → API).
4. **Email confirmation** (optional): by default Supabase requires email
   confirmation before a user can sign in. For quick local testing you can
   disable this under Authentication → Providers → Email → "Confirm email".
5. Install and run:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/login`.

- `/login` — split-screen auth page with animated hero art
- `/dashboard` — the core app: Character Panel, Quest Board, Shop & Stats

## Where things live

```
app/
  login/page.tsx        Auth screen (Supabase email/password signup + login)
  dashboard/page.tsx     Auth-guarded 3-column RPG dashboard (mobile: bottom tab nav)
components/
  AuthProvider.tsx       Hydrates the Supabase session once on app load
  CharacterPanel.tsx     Avatar, level, XP bar, gold, streak, attributes
  AttributeBar.tsx       Reusable attribute progress bar
  QuestBoard.tsx         Header, tabs, drag-to-reorder quest list, empty state
  QuestCard.tsx          Quest card: complete → confetti + floating reward + XP
  AddQuestModal.tsx      Create-quest modal with live reward preview
  Shop.tsx               Tavern shop (buy items with gold) + inventory
  WeeklyChart.tsx        Mon–Sun mini bar chart
  LevelUpModal.tsx       Fullscreen level-up celebration
  MobileNav.tsx          Bottom tab bar (Quests / Character / Shop)
  PixelAvatar.tsx         Hand-coded pixel-art knight avatar
  ui/Button.tsx, Input.tsx, Textarea.tsx   Custom game-styled primitives
store/
  useAuthStore.ts        Supabase auth session, signUp/signIn/signOut
  useCharacterStore.ts   profile row (level/xp/gold/attributes/streak), synced to Supabase
  useQuestStore.ts       quests, add/complete (persisted), local reorder
lib/
  supabase/client.ts     Supabase browser client
  supabase/types.ts      Row types for `profiles` and `quests`
  shopItems.ts           Static shop catalogue
  utils.ts               cn() class helper
supabase/
  schema.sql             Tables, RLS policies, auto-profile trigger
```

## How the game logic works
- **Leveling**: `xp_needed = Math.floor(100 * level^1.5)`. Completing a quest
  adds its `xp` to the profile; if `xp >= xp_needed`, the hero levels up,
  `xp` carries over the remainder (`xp -= xp_needed`), and this repeats in
  case one big reward spans multiple levels. All of this happens in
  `useCharacterStore.applyQuestReward`, in the same call that persists the
  new `level`/`xp`/`gold`/`streak`/attribute to Supabase.
- **Streak**: each profile has a `last_completed_date`. On quest completion,
  if that date is today, the streak is unchanged (one bump per day); if it
  was yesterday, streak += 1; otherwise (missed a day, or first ever quest)
  streak resets to 1.
- **Attributes**: whichever attribute the quest targets (strength / intellect
  / spirit) increases by 5, clamped to 0–100, and is written back to the
  matching `profiles` column.
- **Auth**: `useAuthStore` wraps `supabase.auth` (sign up, sign in, sign out)
  and keeps `user` in sync via `onAuthStateChange`. The dashboard route
  redirects to `/login` if there's no session, then loads that user's
  `profiles` row and `quests` rows.
- **Row Level Security**: every `profiles`/`quests` policy checks
  `auth.uid() = id` / `auth.uid() = user_id`, so a signed-in user can only
  ever read or write their own rows — enforced by Postgres, not just the
  client.
- **Not persisted (by design/scope)**: hero display name, shop inventory,
  and quest ordering are local UI state only, since they weren't part of the
  requested schema. They reset on refresh; add columns/tables for them if
  you want them to stick.
- Completing a quest still triggers the full visual flourish: confetti
  burst, floating "+XP +Gold" text, a bouncy checkbox tick, a spring-animated
  XP bar fill, and — if it pushes you over the threshold — the full-screen
  Level Up modal.
