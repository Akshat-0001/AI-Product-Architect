# ARCHIE — Implementation Plan v2.0

> **Open Source · BYOK · Dark Theme · Full Checklist**

---

## 1. Final Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 App Router + TypeScript | File-based routing, SSR for landing page SEO. Free on Vercel. |
| **Styling** | Tailwind CSS v3 | Direct match to Stitch dark theme tokens. All classes match HTML exactly. |
| **Fonts** | Plus Jakarta Sans + Inter + Fira Code | Via Google Fonts + `next/font`. Exact match to new Stitch design. |
| **Icons** | Material Symbols Outlined | Exact match to all Stitch screens. Via Google Fonts CDN. |
| **Animation** | Framer Motion | Orbital animation (generating screen), card hovers, step transitions. |
| **State (global)** | Zustand | Wizard answers, sidebar state, BYOK key management. |
| **State (server)** | TanStack Query v5 | Blueprint fetching, dashboard projects, auto-refetch. |
| **Database** | Supabase (PostgreSQL) | Free tier. Auth, Realtime, Storage, Row-level security. |
| **Auth** | Supabase Auth | GitHub OAuth + email/password. JWT sessions. Middleware protection. |
| **AI — Groq** | Groq API (Llama 3.1 70B / Mixtral) | BYOK. Free tier: 14,400 req/day. Fastest inference. User's own key. |
| **AI — Gemini** | Gemini Flash 2.0 (Google AI SDK) | BYOK. Free tier: 1M tokens/day. Best for large blueprint generation. |
| **Key Storage** | Browser localStorage | BYOK keys stored client-side only. Never sent to Archie servers. |
| **Diagrams** | Mermaid.js (react-mermaid2) | Architecture + ERD diagrams rendered in browser. |
| **Code Highlighting** | Shiki | Syntax highlighting for code scaffold. Zero runtime weight. |
| **Hosting** | Vercel (Hobby plan) | Free. 100GB bandwidth. Auto-deploys from GitHub. |
| **Open Source** | MIT License on GitHub | Public repo, contributing guide, issue templates, Docker self-host. |

### 1.1 Tailwind Config — Dark Theme Setup

The new Stitch design requires explicit dark theme color configuration in `tailwind.config.ts`:

```typescript
/** tailwind.config.ts — Critical dark palette tokens */
colors: {
  'surface': '#0b1326',           // bg
  'surface-container-low': '#131b2e',  // sidebar
  'surface-container': '#171f33',
  'surface-container-high': '#222a3d',
  'surface-container-highest': '#2d3449', // glass base
  'surface-container-lowest': '#060e20',  // code editor
  'primary': '#adc6ff',
  'primary-container': '#005cc6',
  'tertiary': '#ffb695',
  'tertiary-container': '#a44100',
  'on-surface': '#dae2fd',
  'on-surface-variant': '#c7c4d8',
  'outline-variant': '#464555',
  'outline': '#918fa1',
},
borderRadius: {
  DEFAULT: '0.125rem',  // 2px — very angular
  lg: '0.25rem',        // 4px
  xl: '0.5rem',         // 8px
  full: '0.75rem',      // 12px
},
```

---

## 2. BYOK Implementation

### 2.1 Key Storage Architecture

All API keys stored in browser localStorage. Never transmitted to Archie's servers.

```typescript
// lib/byok.ts — BYOK key management
const KEYS = {
  groq: 'archie_groq_key',
  gemini: 'archie_gemini_key',
  preference: 'archie_ai_preference', // 'groq' | 'gemini'
};

export const saveKey = (provider, key) =>
  localStorage.setItem(KEYS[provider], key);

export const getKey = (provider) =>
  localStorage.getItem(KEYS[provider]);

export const hasAnyKey = () =>
  !!(getKey('groq') || getKey('gemini'));

export const getActiveProvider = () =>
  localStorage.getItem(KEYS.preference) || 'groq';
```

### 2.2 AI Generation Route

Next.js API route receives user's key in Authorization header and proxies to provider:

```typescript
// app/api/generate/route.ts
export async function POST(req: Request) {
  const { idea, answers, style, provider } = await req.json();
  const key = req.headers.get('X-AI-Key'); // User's BYOK key

  if (provider === 'groq') {
    return generateWithGroq(key, { idea, answers, style });
  } else {
    return generateWithGemini(key, { idea, answers, style });
  }
}
```

```typescript
// Client-side call (key never stored server-side)
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-AI-Key': getKey(activeProvider),   // from localStorage
  },
  body: JSON.stringify({ idea, answers, style, provider: activeProvider }),
});
```

### 2.3 First-Time Setup Gate

If no key is configured, redirect to settings before allowing wizard:

```typescript
// middleware.ts
if (pathname === '/new' && !hasKeyConfigured(req)) {
  return NextResponse.redirect('/settings/api-keys?setup=true');
}
```

---

## 3. MVP Implementation Checklist

> Work through phases in order. Each phase is deployable.

### Phase 0: Project Setup (Day 1)

- [ ] `npx create-next-app@latest archie --typescript --tailwind --app` `[MVP]`
- [ ] Install: `zustand`, `@tanstack/react-query`, `framer-motion`, `@supabase/supabase-js`, `@supabase/ssr` `[MVP]`
- [ ] Install: `groq-sdk`, `@google/generative-ai` (for BYOK server-side proxying) `[MVP]`
- [ ] Install: `mermaid`, `shiki`, `react-mermaid2` `[MVP]`
- [ ] Configure `tailwind.config.ts` with complete dark palette (all color tokens from Stitch) `[MVP]`
- [ ] Configure `next/font`: Plus Jakarta Sans (weights 400,500,600,700,800) + Inter (300,400,500,600) `[MVP]`
- [ ] Add Fira Code via CSS `@import` from Google Fonts (for code scaffold) `[MVP]`
- [ ] Configure Material Symbols Outlined via link tag in `layout.tsx` `[MVP]`
- [ ] Add `glass-panel`, `blueprint-grid`, `canvas-dot-grid`, `gradient-button` CSS utilities in `globals.css` `[MVP]`
- [ ] Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_ANON_KEY` (no AI keys — those are BYOK) `[MVP]`
- [ ] Create GitHub repo, push, connect to Vercel `[MVP]`

### Phase 1: Auth + BYOK Setup (Day 1-2)

- [ ] Configure Supabase Auth: email/password + GitHub OAuth `[MVP]`
- [ ] Create `supabase/middleware.ts`: protect `/dashboard`, `/new`, `/project`, `/settings` `[MVP]`
- [ ] Build `/auth` page: glass-panel card, toggle [Log In][Sign Up], GitHub button, email+password form `[MVP]`
- [ ] Auth inputs: `bg-surface-container-highest/40 border-none rounded-xl focus:ring-2 ring-primary/20` + icon transitions `[MVP]`
- [ ] Auth CTA: `gradient-button` class (`135deg adc6ff → 005cc6`), 'Access Workspace' `[MVP]`
- [ ] Auth background: two ambient globs + radial dot-grid at 3% opacity `[MVP]`
- [ ] System status footer: pulsing primary dot + version text + encrypted icon `[MVP]`
- [ ] Create `lib/byok.ts` with `saveKey`, `getKey`, `hasAnyKey`, `getActiveProvider` helpers `[MVP]`
- [ ] Middleware: if `/new` accessed with no key → redirect `/settings/api-keys?setup=true` `[MVP]`

### Phase 2: Layout System (Day 2)

- [ ] `app/(app)/layout.tsx`: primary sidebar (240px, `bg-slate-900`) + content area `[MVP]`
- [ ] Sidebar: gradient logo icon + 'Archie' headline + 'Product Architect' label `[MVP]`
- [ ] Sidebar New Project gradient button (`from-primary to-primary-container rounded-xl`) `[MVP]`
- [ ] Sidebar nav items: active = `text-indigo-400 border-l-4 border-indigo-500 bg-slate-800/50` `[MVP]`
- [ ] Top bar (64px, `bg-slate-950/80 backdrop-blur-xl`): search + notifications + avatar `[MVP]`
- [ ] Wizard layout: fixed top bar (Save Progress + X) + no sidebar + fixed bottom action bar `[MVP]`
- [ ] Bottom wizard bar: `bg-surface-container-lowest/80 backdrop-blur-xl border-t rounded-2xl` `[MVP]`

### Phase 3: Landing Page (Day 2-3)

- [ ] Frosted nav: `bg-slate-950/60 backdrop-blur-xl`, logo + center links + Log In + gradient CTA `[MVP]`
- [ ] Hero: centered `max-w-4xl`, H1 `5xl-7xl extrabold tracking-tighter`, gradient text span on key phrase `[MVP]`
- [ ] Hero ambient globs: two absolute positioned blurs (`primary/10`, `tertiary/5`) `[MVP]`
- [ ] 16:9 hero image card: `rounded-2xl border-outline-variant/10` gradient fade bottom `[MVP]`
- [ ] Social proof: 42,840+ blueprints + 98.4% accuracy (`opacity-70`) `[MVP]`
- [ ] 3-step explainer: glass-panel cards, icon in `surface-container-highest` 56px `rounded-2xl` `[MVP]`
- [ ] Style preview strip: horizontal scroll of 6 thumbnails, `scale-105` hover `[MVP]`
- [ ] Final CTA: glass-panel `rounded-[3rem]`, tertiary glow, gradient button `[MVP]`

### Phase 4: Settings — API Keys (Day 3) ⚡ Critical

- [ ] Settings sidebar: Profile / Architecture / API Metrics / Security / API Keys / Help items `[MVP]`
- [ ] API Keys page (`/settings/api-keys`): 'Your AI Keys' section header `[MVP]`
- [ ] Groq key input: masked field + show/hide toggle + Validate button + green check/red X indicator `[MVP]`
- [ ] Gemini key input: same pattern as Groq `[MVP]`
- [ ] Active provider toggle: 'Prefer Groq' / 'Prefer Gemini' — saves to localStorage `[MVP]`
- [ ] Fallback toggle: 'Auto-fallback if preferred provider fails' `[MVP]`
- [ ] Privacy notice card: 'Your key is stored only in this browser and sent directly to the AI provider. Archie never stores or logs your API keys.' `[MVP]`
- [ ] Quick links: 'Get free Groq key →' (`console.groq.com`) and 'Get free Gemini key →' (`aistudio.google.com`) `[MVP]`
- [ ] Setup mode (`?setup=true`): show prominent onboarding banner 'Set up a key to start generating blueprints' `[MVP]`

### Phase 5: Dashboard (Day 3-4)

- [ ] Fetch projects from Supabase: display in bento grid (1/2/3 col responsive) `[MVP]`
- [ ] Greeting: 'Good morning, [name]' Plus Jakarta `4xl extrabold` `[MVP]`
- [ ] Filter bar: [All] active=`bg-primary`, [Recent] [Shared] inactive=`text-on-surface-variant` `[MVP]`
- [ ] New Project dashed card: `border-2 border-dashed outline-variant`, hover `border-primary` + `bg-surface-container` `[MVP]`
- [ ] Project cards: `h-64`, status badge absolute top-right, image cover with `opacity-60` + `group-hover:scale-110`, category tags `[MVP]`
- [ ] AI Insights card `col-span-2`: tertiary `auto_awesome`, recommendation text, primary button `[MVP]`
- [ ] FAB: fixed `bottom-8 right-8`, gradient, `rounded-full`, `shadow-2xl shadow-primary/40` `[MVP]`

### Phase 6: Wizard Steps 1-3 (Day 4-5)

- [ ] Zustand store: `{ ideaText, answers[], selectedStyle, currentStep }` `[MVP]`
- [ ] Step 1: gradient glow wrapper around textarea (`group-focus-within:opacity-25`), suggestion chips `rounded-full` `[MVP]`
- [ ] Step 2: conversation history (`opacity-60`), bot gradient avatar, glass-panel question card, 2×2 answer chip grid `[MVP]`
- [ ] Step 2: AI Insight tertiary callout below question `[MVP]`
- [ ] Step 3: left `col-7` grid of 10 style cards with thumbnail previews `[MVP]`
- [ ] Step 3: right `col-5` sticky preview panel with Login + Stats + Deploy action mockups `[MVP]`
- [ ] Step 3: SaaS Modern selected by default with `border-2 primary` + checkmark `-top-2 -right-2` `[MVP]`

### Phase 7: AI Generation (Day 5-7)

- [ ] `POST /api/generate`: receives key via `X-AI-Key` header, routes to Groq or Gemini `[MVP]`
- [ ] Groq client (`groq-sdk`): Llama 3.1 70B for speed. Prompt → 5 sections sequentially. `[MVP]`
- [ ] Gemini client (`@google/generative-ai`): Flash model. Prompt → 5 sections. `[MVP]`
- [ ] `lib/prompts.ts`: separate prompt templates for Overview, Architecture, Database, API, Stories `[MVP]`
- [ ] Save blueprint + each section to Supabase as generation completes `[MVP]`
- [ ] Generating screen: blueprint-grid bg, orbital animation with Framer Motion `[MVP]`
- [ ] Terminal log: shows active provider ('Using Groq: llama-3.1-70b-versatile') + timestamps `[MVP]`
- [ ] Auto-fallback: if Groq returns 429/error, retry with Gemini (and vice versa) `[MVP]`
- [ ] Blueprint Ready: mesh bg, success check circle, View + Share CTAs, 5-dot footer `[MVP]`

### Phase 8: Blueprint Workspace (Day 7-11)

- [ ] Three-panel layout: sidebar (240px) + inner nav + content `[MVP]`
- [ ] Blueprint inner nav: `text-xs uppercase tracking-widest` labels, active=`indigo-400 bg-indigo-500/10` `[MVP]`
- [ ] Overview section: AI Insights sparkle, project purpose card, metrics (LoC, microservices, health), tech stack icons, activity feed `[MVP]`
- [ ] Architecture section: dot-grid canvas, SVG connections, node cards glass-panel, AI insight panel `[MVP]`
- [ ] Database section: ERD canvas (`erd-canvas` dot grid), draggable table cards, SVG crow's feet, right detail panel `[MVP]`
- [ ] API Endpoints: 3-panel layout, endpoint list with method badges, documentation + code blocks (Fira Code, syntax colors) `[MVP]`
- [ ] User Stories: 60/40 split, epic groups, story cards with priority/status badges, acceptance criteria detail panel `[MVP]`
- [ ] Code Scaffold: file explorer + Fira Code editor (dark `surface-container-lowest`) + metadata sidebar `[MVP]`
- [ ] Top bar: Regenerate (ghost) + Share (ghost) + Export (primary-container) buttons `[MVP]`
- [ ] Share: generate `share_id` → `/b/[shareId]` public read-only view `[MVP]`

### Phase 9: Polish + Open Source (Day 11-14)

- [ ] Dark mode is default and only mode — remove any light mode toggle (or keep as future feature) `[MVP]`
- [ ] Remove ALL pricing/plan/quota UI — settings has no Manage Plan section `[MVP]`
- [ ] Public `/b/[shareId]` page: read-only workspace + 'Built with Archie (open source)' banner `[MVP]`
- [ ] `README.md`: setup guide, BYOK instructions, self-host with Docker, contributing guide `[MVP]`
- [ ] `LICENSE`: MIT `[MVP]`
- [ ] `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY` (no AI keys — those are BYOK) `[MVP]`
- [ ] GitHub repo: public, issue templates, PR template, `CONTRIBUTING.md` `[MVP]`
- [ ] Loading skeletons: dark `surface-container-high` animated pulse placeholders `[MVP]`
- [ ] Toast notifications: dark glass-panel style (matching overall aesthetic) `[MVP]`

---

## 4. Timeline & Launch

| Day | Phase | Deliverables |
|-----|-------|-------------|
| Day 1 | Setup + Auth | Repo, Tailwind dark config, Supabase, auth flow, `lib/byok.ts` |
| Day 2 | Layout + Landing | Sidebar, topbar, landing page live on Vercel |
| Day 3 | Settings + BYOK | API Keys page, validation, localStorage, first-time setup gate |
| Day 3-4 | Dashboard | Project grid, filter bar, AI insights card, FAB |
| Day 4-5 | Wizard Steps 1-3 | Idea input, questioning engine, style picker — all interactive |
| Day 5-7 | AI Generation | Groq + Gemini BYOK routes, generating screen, blueprint ready |
| Day 7-11 | Blueprint Workspace | All 6 sections, share links, regenerate |
| Day 11-14 | Polish + OS | README, LICENSE, public GitHub, Docker, toast, skeletons |

### 4.1 Launch Strategy — Open Source

#### Day 14: GitHub Launch

- Push to public GitHub repo with full README, setup guide, and BYOK instructions
- Post in `r/selfhosted`, `r/webdev`, `r/SideProject`
- Share in indie hacker communities (Indie Hackers, Hacker News Show HN)

#### Week 3-4: Product Hunt

- List as open source tool — 'AI Product Architect. Free. BYOK. No paywalls.'
- Target: 200+ upvotes = front page = 2,000-5,000 signups

#### Ongoing: Developer Communities

- Hackathon Discord servers — direct high-urgency users
- College tech clubs via LinkedIn — students are your primary base
- Twitter/X case study posts: 'Here's what Archie generated for a Uber clone (free, open source)'

### 4.2 Self-Hosting

- `Dockerfile` included in repo
- `docker-compose.yml` for local dev with Supabase
- 'Deploy to Vercel' button in README
- Environment variables: only Supabase keys needed — AI keys are BYOK per user

> **CORE PRINCIPLE:** Zero cost to run. Users bring their own Groq or Gemini keys. Archie runs entirely on free tiers for hosting, DB, and auth. Open source MIT.
