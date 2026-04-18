# ARCHIE — Design Specification v2.0

> Based on Updated Stitch Dark Theme — 16 Screens
>
> **Dark Mode First · Plus Jakarta Sans + Inter · Open Source**

---

## 1. Design System

### 1.1 Color Palette — Dark Theme

All tokens extracted from the new Stitch dark HTML. This replaces the previous light Material You palette entirely.

| Token | Hex | Usage | Example Component |
|-------|-----|-------|-------------------|
| `primary` | `#ADC6FF` | CTA text, links, active nav, focus rings | Gradient button text, active sidebar border |
| `primary-container` | `#005CC6` | Gradient end, icon backgrounds | CTA gradient, icon bg in sidebar logo |
| `surface` (bg) | `#0B1326` | Main page background | Body bg, wizard canvas, dashboard bg |
| `surface-container-low` | `#131B2E` | Sidebar background | Left nav, settings sidebar |
| `surface-container` | `#171F33` | Primary cards | Project cards base, info panels |
| `surface-container-high` | `#222A3D` | Hovered/elevated cards | Tab headers, active filter bg |
| `surface-container-highest` | `#2D3449` | Top-level surfaces, glass base | Glass-panel base color, style cards |
| `surface-container-lowest` | `#060E20` | Deepest elements | Code editor bg, terminal log bg |
| `on-surface` | `#DAE2FD` | Primary text | Headings, body copy, nav labels |
| `on-surface-variant` | `#C7C4D8` | Secondary text | Descriptions, subtitles, timestamps |
| `outline-variant` | `#464555` | Subtle borders | Card borders (10-20% opacity), dividers |
| `outline` | `#918FA1` | Medium emphasis borders | Input ring, section dividers |
| `tertiary` | `#FFB695` | Warm accents, AI insights, alerts | auto_awesome icon, Review Required badge, AI Insight callout |
| `tertiary-container` | `#A44100` | Tertiary bg for badges | Category tag bg, tertiary-tinted cards |
| `error` | `#FFB4AB` | Destructive actions, errors | Delete buttons, validation errors |

#### Glass Panel Formula

```css
background: rgba(45, 52, 73, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(70, 69, 85, 0.15);
```

> Applied to wizard cards, floating tooltips, terminal log, auth card

#### CTA Gradient

```css
background: linear-gradient(135deg, #adc6ff 0%, #005cc6 100%);
```

> Used on all primary action buttons, FAB, wizard continue, generate button

### 1.2 Typography

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display / Headlines | Plus Jakarta Sans | 500, 600, 700, 800 | Page H1/H2, card titles, logo wordmark, nav labels, step titles, CTA text |
| Body / Labels | Inter | 300, 400, 500, 600 | Body copy, descriptions, form labels, metadata, timestamps, badge text |
| Code / Mono | Fira Code | 400, 500 | API routes, DB field names, code scaffold editor, terminal log, JSON examples |

### 1.3 Border Radius — Angular/Sharp Aesthetic

The new design is significantly more angular than the previous rounded Material You system:

| Token | Value | Usage |
|-------|-------|-------|
| `DEFAULT` | `0.125rem / 2px` | Inline badges, method labels, micro elements |
| `lg` | `0.25rem / 4px` | Input fields, small buttons, table cells, file tree items |
| `xl` | `0.5rem / 8px` | Standard cards, nav items, buttons, chip filters |
| `full` | `0.75rem / 12px` | Pills, status badges, FAB-adjacent buttons, avatar circles |

> **Note:** `rounded-full` in Tailwind (9999px) is used for true circles (FAB, avatar). The design avoids the very large 2-3rem radius used in the previous Stitch version.

### 1.4 Iconography

- **Icon library:** Material Symbols Outlined (same as before)
- **Key variation settings:**
  ```css
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  ```
- **Filled variant** (`FILL 1`) used for: active nav items, logo architecture icon, selected state icons.

---

## 2. Layout System

### 2.1 Layout Types

| Layout | Pages | Structure |
|--------|-------|-----------|
| **Public Layout** | `/`, `/b/[shareId]` | No sidebar. Sticky frosted nav (`bg-slate-950/60 backdrop-blur-xl`). Full-width content. Footer. |
| **App Layout** | `/dashboard`, `/project/[id]`, `/settings` | Fixed dark sidebar (240px, `bg-slate-900` / `#131b2e`) + sticky top bar (64px) + scrollable content area. |
| **Wizard Layout** | `/new` | No sidebar. Fixed top bar (Save Progress + X). Centered content. Fixed bottom action bar. |
| **Auth Layout** | `/auth` | No sidebar, no nav. Centered glass-panel card with ambient glow bg. |
| **Blueprint Layout** | `/project/[id]/*` | Three-panel: Global sidebar (240px) + Blueprint inner nav (varies by section) + Content. |

### 2.2 Primary Sidebar Specification

- **Width:** 240px
- **Background:** `bg-slate-900` (approx `#0f172a`). Always visible in App Layout.
- **Logo area:** 8px rounded `bg-gradient-to-br from-primary to-primary-container` (32px), 'Archie' headline bold tracking-tight, 'Product Architect' 10px uppercase muted
- **Primary CTA:** gradient button (`from-primary to-primary-container`), `rounded-xl`, 'New Project' with add icon
- **Nav items** (140px × 48px): icon + label
  - **Active** = `indigo-400` text + `border-l-4 border-indigo-500` + `bg-slate-800/50`
  - **Inactive** = `slate-400`, hover = `bg-slate-800` + `text-slate-100`
- **Bottom:** Settings, Profile, Theme Toggle — same inactive style
- **Collapsed variant** (icon-only 64px): used in API Endpoints Blueprint screen only

### 2.3 Top Bar Specification

- **Height:** 64-80px (varies: wizard = 64px with `py-4`, blueprint = 80px with `h-20`)
- **Background:** `bg-slate-950/80` or `bg-surface-container-low`
- **Left:** logo/breadcrumb. Blueprint workspace shows project name (`xl extrabold`) + version badge
- **Center:** search input (hidden on most pages, visible on API Blueprint, Settings, Database Schema)
- **Right:** action buttons (Share ghost / Export primary-container) + notifications + account

### 2.4 Wizard Layout Bottom Bar

- Fixed at bottom (`z-50`)
- Background: `bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline-variant/10`
- **Left:** Previous Question button (`arrow_back` + label)
- **Center:** step label + dot indicator (active dot = wider pill `w-4`, primary color + glow shadow)
- **Right:** Skip text button + Continue gradient button

---

## 3. Screen-by-Screen Specification

### 3.1 Landing Page (`/`)

- **Nav:** frosted dark (`bg-slate-950/60` + `backdrop-blur-xl`). Logo left (Plus Jakarta, `xl bold tracking-tighter`). Center links (`indigo-400` active, `slate-400` inactive). Right: Log In + Get Started gradient button.
- **Hero:** centered `max-w-4xl`. H1 (`5xl-7xl`, `extrabold`, `tracking-tighter`, `leading-tight`) with gradient text span (`bg-clip-text bg-gradient-to-r from-primary to-primary-container`). Subtitle (`on-surface-variant`, `lg-xl`). Two CTAs. Social proof counter (42,840+ blueprints, 98.4% accuracy).
- **Hero visual:** 16:9 `aspect-ratio` image card below hero, `rounded-2xl`, `border border-outline-variant/10`, gradient fade from bottom.
- **3-Step Explainer:** glass-panel cards (`rgba(45,52,73,0.6)`), `border-outline-variant/10`, hover = `border-primary/30`. Step icons in `surface-container-highest` 56px `rounded-2xl`. Titles 'Describe / Answer / Get Blueprint'.
- **Style Preview Strip:** horizontal scroll, 6 thumbnail images (256px wide, 160px tall), `rounded-xl`, hover `scale-105`. Section header: 'Output Formats' in primary uppercase `tracking-[0.3em]`.
- **Final CTA:** glass-panel `rounded-[3rem]`, `border outline-variant/10`, H2 extrabold, `tertiary/10` ambient glow top-right, large white CTA button.
- **Footer:** 6-column grid. Logo + description + social icons left (`col-span-2`). Platform / Company / Legal / Status columns. Bottom: copyright + version badge.

### 3.2 Authentication (`/auth`)

- **Background:** `#0b1326` + two ambient globs (`primary-container/10` 600px top-right, `tertiary-container/5` 500px bottom-left). Dot-grid overlay (`radial-gradient #adc6ff 1px, 40px grid, 3% opacity`).
- **Branding:** 'Archie' (Plus Jakarta, `4xl extrabold tracking-tighter`) + 'Product Architect Console' (label, `sm`, `tracking-widest uppercase`, 70% opacity).
- **Card:** glass-panel (`rgba(45,52,73,0.6)` + `backdrop-blur-20px`), ghost-border (`1px solid rgba(70,69,85,0.15)`), `rounded-xl`, 32-40px padding. Decorative glow blob inside card bottom-right.
- **Toggle:** [Log In] [Sign Up] — pill container `bg-surface-container-low`. Active = `bg-surface-container` white, `text-primary`. Inactive = `text-on-surface-variant`.
- **GitHub button:** `bg-surface-container-highest/50`, GitHub SVG icon, ghost-border. Input fields: `bg-surface-container-highest/40`, `border-none`, `rounded-xl`, `focus-ring-2 ring-primary/20`. Icon inside field (right side, transitions to primary on `group-focus-within`).
- **CTA:** gradient-button (`135deg adc6ff → 005cc6`), `text-on-primary`, `font-headline bold`, hover `scale-[1.01]`, active `scale-[0.99]`.
- **System status footer:** pulsing dot + 'Archie Core 2.4.0 Online' | encrypted icon + 'Secure Handshake'.

### 3.3 Dashboard (`/dashboard`)

- **Primary sidebar:** `slate-900`, 240px. Top bar: `slate-950`, `h-16`, search input + notification + account.
- **Header:** 'Good morning, [Name]' (`4xl headline extrabold`) + subtitle. Filter bar: `bg-surface-container-low p-1 rounded-xl`, active = `bg-primary text-on-primary shadow`, inactive = `text-on-surface-variant`.
- **Bento grid** (1/2/3 col responsive): New Project button (dashed `border-2 outline-variant`, hover `border-primary` + `bg-surface-container`, 64px `rounded-full` add icon). Project cards (`surface-container-low rounded-2xl`, `h-64`, absolute status badge top-right, image cover `h-32 opacity-60` + scale on `group-hover`, tags, team avatars, timestamp).
- **AI Insights card** (`col-span-2`): gradient `bg-surface-container-low` to `surface-container-highest`, tertiary icon, recommendation text, primary filled button. Decorative large `query_stats` icon at 40% opacity.
- **FAB:** fixed `bottom-8 right-8`, gradient `from-primary to-primary-container`, `rounded-full`, `shadow-2xl shadow-primary/40`, hover `scale-110`.

### 3.4 Wizard — Idea Input (Step 1)

- **Fixed top nav:** 'Architect Canvas' + Save Progress + X close button.
- **Centered content:** 'What are we building today?' (`4xl-5xl extrabold tracking-tight`). Subtitle (`on-surface-variant`, `lg`, `font-light`).
- **Textarea:** relative group wrapper with `-inset-0.5` gradient glow blur (`primary` to `primary-container`, `opacity-10 → opacity-25` on focus). Inner: `bg-surface-container-highest rounded-xl`, transparent bg textarea, 48px padding, 192px height.
- **Suggestion chips:** `rounded-full`, `bg-surface-container-low border-outline-variant/20`, hover = `bg-surface-variant` + `text-primary`.
- **Fixed bottom bar** (`bg-surface-container-lowest/80 backdrop-blur-md`, `rounded-2xl`, `border outline-variant/10`): Back arrow | Step 1 of 5 center | Next gradient button (disabled/`opacity-50` when empty).
- **Bottom nav steps** shown as icons with labels: lightbulb (active, primary) / architecture / visibility (inactive, `slate-500 opacity-50`).

### 3.5 Wizard — Questioning Engine (Step 2)

- **Header left:** 'New Project Wizard' (Plus Jakarta, `2xl bold primary`) + 'Step 2: The Questioning Engine' (uppercase `tracking-widest`). Right: 'Question 3 of 7' (`bold lg primary`) + progress bar (42% fill).
- **Dot stepper** below header: `w-3 h-3` circles — `primary/40` for done, `primary` for active, `border-outline-variant` for pending.
- **Conversation history** (`opacity-60`): user responses right-aligned in `surface-container-high` bubble. Bot responses with gradient avatar (architecture icon) + `surface-container-low` bubble.
- **Active question:** gradient avatar (larger, psychology icon filled) + glass-panel card. H2 (`xl semibold slate-50`). Answer chips as 2×2 grid of 104px-ish buttons: `surface-container-highest`, `border outline-variant/20`, hover `border-primary/50`. Each chip: icon (primary, scale on `group-hover`) + title (`slate-100 medium sm`) + subtitle (`on-surface-variant xs`).
- **AI Insight callout:** flex items `bg-tertiary/10 border-tertiary/20 rounded-full`, `auto_awesome` icon, `tertiary-fixed` text, 'Archie Insight: This choice will impact...'

### 3.6 Wizard — Style Picker (Step 3)

- **Left sidebar** (240px dark) shows wizard context nav. Top bar shows 'Architect Canvas' + nav links.
- **Main content:** 'Pick your visual direction' (`4xl extrabold`) + subtitle. Grid of 10 style cards (`cols 7`) + sticky live preview panel (`cols 5`).
- **Style card unselected:** `bg-surface-container-low`, `border-outline-variant/10`, hover `border-primary/40`, `rounded-xl`, `p-3`. Thumbnail `aspect-square rounded-lg` + name bold white + description xs muted.
- **Style card selected** (SaaS Modern shown): `bg-surface-container-high`, `border-2 border-primary`, `shadow-[0_0_20px_rgba(173,198,255,0.15)]`, checkmark circle (`-top-2 -right-2`, `bg-primary`, `rounded-full`, 24px).
- **Live Preview:** sticky `top-28`. Header 'Live Preview: SaaS Modern' + 'Active Theme' badge. Preview container: `bg-surface-container p-8 rounded-2xl border outline-variant/15`. Contains: Login card mockup + 2-tile stats grid + Deploy action card.
- **Fixed bottom bar:** Back ghost button | Step 3 of 5 dot indicator (active = wider `w-4` pill + glow) | Continue gradient button.

### 3.7 Wizard — Generating (Step 4)

- **Full-screen.** `blueprint-grid` background (`linear-gradient to-right and to-bottom`, `outline-variant/10` lines, 40px grid).
- **Ambient glows:** 800px `primary/5` radial blur center + 400px `tertiary/5` quarter-left.
- **Central animation structure** (384px container): outer `animate-ping` ring (`inset-0`) + `animate-pulse` ring (`inset-8`) + core 256px card (`surface-container-highest/40 backdrop-blur-xl`, `rounded-2xl border outline-variant/20`) + 3D image with SVG overlay circles/lines.
- **Hub icon** (`text-6xl animate-pulse`) + 3 orbiting node badges: database top-right `animate-bounce` + code bottom-left `animate-bounce` (1s delay) + api left `animate-pulse`.
- **Status section:** H2 'Designing architecture...' (`3xl bold tracking-tight`) + pulsing dot + subtitle with project name.
- **Progress bar:** relative `h-1.5 bg-surface-container-highest rounded-full`. Fill: absolute `from-primary-container via-primary to-white`, `w-65%`, glow shadow.
- **Labels row:** 'Initiated' | '65% Optimized' (primary) | 'Deploying'.
- **Terminal log** (dark glass, monospace xs): timestamp in `primary/60` + message text + status label (SUCCESS `tertiary`, IN PROGRESS `primary`, pending muted italic).
- **Floating cards** (xl screens only): Processing Power (bottom-left) + AI Integrity (bottom-right) with semi-transparent bg.

### 3.8 Wizard — Blueprint Ready (Step 5)

- `bg-mesh` overlay: `radial-gradient(circle at 50% 50%, rgba(0, 92, 198, 0.15) 0%, rgba(11, 19, 38, 0) 70%)`.
- **Main image card:** `max-w-lg aspect-video`, `bg-surface-container-low`, `border outline-variant/10`, `mix-blend-luminosity opacity-40` image. Gradient fade from bottom. Floating overlays: 'Compiled' badge top-right (primary icon + progress bar) + 'Schema.v5' card bottom-left.
- **Central success circle:** 80px gradient `from-primary to-primary-container`, `check_circle` icon (`wght 600`), `shadow-[0_0_40px_rgba(0,92,198,0.4)]`.
- **H1:** `4xl-6xl extrabold tracking-tight leading-[1.1]`.
- **Two CTAs:** [View Blueprint] gradient `w-full sm:w-auto` + [Share Blueprint] border `outline-variant/30`.
- **Footer:** 5-dot progress (all `outline-variant/30` except last = primary + `ring-4 ring-primary/20`) + 'Step 5 of 5' label.

### 3.9 Blueprint Workspace — Architecture Section

- **Three panels:** Primary sidebar (240px `slate-900`) + Blueprint inner nav (256px `slate-900 border-r slate-800/50`) + Content (`flex-1 bg-surface`).
- **Blueprint inner nav items:** icon + `sm font-medium` label. Active = `text-indigo-400 bg-indigo-500/10 rounded-lg`. Inactive = `text-slate-400 hover-bg-slate-800`. Bottom: AI Insight glass-panel with tertiary bolt icon.
- **Top bar** (80px, `bg-slate-950/80`): project name + version badge on left. Regenerate / Share ghost + Export primary-container right.
- **Content:** 'Architecture Matrix' `4xl extrabold tracking-tighter`. Node/latency stat chips (`bg-surface-container-low`, `border-slate-800`).
- **Diagram:** `aspect-video bg-surface-container-low rounded-2xl`, 1px `opacity-10` dot-grid bg. SVG paths with gradient stroke. Node cards: glass-panel `rounded-xl border-white/5`, icon+label, hover `border-primary/40`.
- **Bento info grid:** 8/12 = Logical Component Tree card (`surface-container-low`, component list with primary dots). 4/12 = Stack Overview card + `indigo-500/10` Architect's Note card.

### 3.10 Database Schema View

- **Full-width layout** (no secondary inner nav). Main: ERD canvas (`erd-canvas` class = `radial-gradient #2d3449 1px dots, 32px grid`).
- **SVG connections:** `stroke outline-variant`, `stroke-width 2`, crow's foot arrowheads. Circle endpoints with primary fill.
- **Table cards** (absolute positioned, draggable): header bar (`surface-container-high`, icon+name, `drag_indicator`). Field rows: PK field = `bg-primary/5` with key icon tertiary. FK field = `bg-secondary-container/30` with link icon primary. Normal field = no bg.
- **Active/selected table:** `border-2 border-primary/40` + `ring-4 ring-primary/10`.
- **Right sidebar panel** (glass-panel `border-l outline-variant/15`, 320px absolute): identity fields (name input, description textarea), performance toggles, relationships with directional icons. Footer: SQL Preview ghost + Save Changes primary buttons.
- **Floating zoom/pan controls:** glass-panel bottom-left, `bg-surface-variant` hover.

### 3.11 API Endpoints View

- **Four panels:** Primary sidebar (240px) + Secondary blueprint nav (200px) + Endpoint list (320px) + Documentation panel (`flex-1`).
- **Secondary blueprint nav:** 10px font uppercase `tracking-widest` labels. Active = `text-[#4F46E5] bg-white/5`. Inactive = `text-slate-500 hover text-slate-200`.
- **Endpoint list:** grouped by resource (auth, users, orders) with folder icon + resource name label. Each endpoint row: glass-panel `rounded-xl`, method badge (POST = `primary-container` bg, GET/other = `surface-container-highest`), mono route, hover transition.
- **Documentation panel:** method badge (`sm font-black mono px-3 py-1 rounded`) + H2 `3xl extrabold` + description. 'Try it' button (`tertiary` bg, `rounded-full`, `play_arrow` icon). Two columns: left = headers/body schema/responses. Right = code blocks (dark `surface-container-lowest`, pre syntax-colored, Fira Code).
- **Request example:** `primary-fixed` color for braces. `Tertiary-fixed` for keys. `emerald-400` for string values. `secondary` for booleans.
- **Architect Tip panel:** glass-panel bottom of right column, lightbulb icon bg.

### 3.12 User Stories View

- **Split 60/40 layout.** Left: story list with Epic group headers (icon + title + count badge). Right: detail panel with acceptance criteria.
- **Story cards:** `rounded-2xl`, `surface-container-low`, `border-transparent` hover `border-primary/20`. Active = `surface-container-high border-primary/40 shadow-xl`.
- **Priority badges:** High = `bg-error/10 text-error`, Medium = `bg-tertiary/10 text-tertiary`, Low = `bg-outline-variant/20 text-outline`.
- **Status badges:** Validated = `primary-container/20 text-primary`, Proposed = `surface-container-highest text-outline`.
- **Story ID:** `font-mono xs on-surface-variant` right-aligned. Story text: `on-surface-variant` with semantic spans highlighted in `text-on-surface font-semibold`.
- **Right panel:** acceptance criteria (checkboxes with `check_box` filled = primary, outline = muted). Linked Architecture 2-col grid (`surface-container-high` cards with schema/api icons). Footer: Discard + Save Progress buttons.
- **FAB:** fixed `bottom-10 right-10`, `bg-tertiary rounded-2xl`, 56px, `psychiatry` icon (tertiary theme).

### 3.13 Code Scaffold View

- **Three panels:** file explorer (256px `surface-container-low`) + code editor (`flex-1 surface-container`) + metadata sidebar (320px `surface-container-low`).
- **File explorer:** `bg-surface-container-low border-r`. Tree items: icon + label. Active file: `bg-primary/10 text-primary-fixed-dim font-medium`. Folders: primary-colored icons when expanded.
- **Code editor tab bar:** `surface-container-high`, active tab = `bg-surface text-primary-fixed-dim border top+sides`. Tabs show filename. Copy + Maximize action buttons.
- **Code content:** `bg-surface-container-lowest/50 p-6`, Fira Code `sm leading-relaxed`. Syntax colors:
  - `tertiary` for import/keywords
  - `secondary` for booleans
  - `primary-fixed` for braces/delimiters
  - `primary-fixed-dim` for variables/functions
  - `emerald-400` for strings
  - `outline-variant` for comments
- **Floating indicator:** `bottom-6 right-6`, glass `bg-surface-container-highest/80` + `backdrop-blur`, pulsing dot, 'Blueprint Synthesis Complete'.
- **Metadata sidebar:** architecture pattern card, stack selection chip grid (`primary-container/20`), build status progress bar (84%), Download Full Repo gradient button, Deploy to Vercel ghost button, AI Insight panel (tertiary, 'Apply Recommendation' link).

### 3.14 Settings Page (`/settings`)

- **Sidebar:** 240px `bg-surface-container-low` (`#131b2e`). Items: Profile, Architecture, API Metrics, Security, API Keys (NEW — primary section), Help. Active = `text-indigo-400 border-l-4 border-indigo-500 bg-indigo-500/10`. Bottom: Upgrade Plan button REMOVED — replaced with 'GitHub' and 'Documentation' links.
- **Top bar:** 'Account Settings' headline. Search, notifications, history, avatar.
- **Profile glass-card** (8/12): avatar (128px `rounded-2xl` with edit pencil overlay), name (`3xl extrabold`), role (`indigo-400`), 'Pro Member' REPLACED with 'Open Source Contributor' badge. Email + location metadata grid.
- **API Keys section** (NEW — replaces all pricing content): Groq key input (masked, validate button, green check on success), Gemini key input (same pattern). Active provider indicator. Fallback toggle. Links to Groq Console + Google AI Studio.
- **API Usage section** (4/12): simple token counter from the user's provider, NOT from Archie. Shows 'Usage tracked by your provider — check Groq Console or Google AI Studio for details.'
- **Export Preferences:** language selector chips (React active, Node.js, Python). Auto-README toggle. Docker/K8s toggle.
- **Security:** 2FA card, password reset card. Danger Zone: delete account (error border/bg).
- **NO** Manage Plan, **NO** pricing tiers, **NO** subscription UI — completely absent.

---

## 4. Component Library

### 4.1 Buttons

| Variant | Key Styles | Usage |
|---------|-----------|-------|
| **CTA Gradient** | `bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl` | Wizard Continue, Generate, Save, View Blueprint, New Project |
| **Ghost** | `border border-outline-variant/20 text-on-surface hover:bg-surface-variant` | Regenerate, Share, Back, secondary actions |
| **Primary-container** | `bg-primary-container text-on-primary-container` | Export button in top bar |
| **Text/Link** | `text-primary hover:underline` (or just color) | Skip, Forgot password, Apply Recommendation |
| **FAB** | `gradient rounded-full shadow-2xl shadow-primary/40 fixed bottom-8 right-8` | Dashboard new project, User Stories add |
| **Tertiary FAB** | `bg-tertiary rounded-2xl text-on-tertiary` | User Stories (psychiatry icon) |

### 4.2 Status Badges

| Badge | Colors | Usage |
|-------|--------|-------|
| In Progress | `bg-primary/10 text-primary`, `rounded-full px-3 py-1` | Project cards |
| Review Required | `bg-tertiary/10 text-tertiary` | Project cards needing attention |
| Archived | `bg-on-surface-variant/20 text-on-surface-variant` | Old/inactive project cards |
| High Priority | `bg-error/10 text-error`, `rounded px-2 py-0.5` | User story priority |
| Validated | `bg-primary-container/20 text-primary` | User story validation status |
| Proposed | `bg-surface-container-highest text-outline` | Draft story status |
| Version badge | `bg-surface-container-highest/50 text-primary border border-primary/20`, `rounded-full` | Blueprint workspace version |

### 4.3 API Method Badges

| Method | Style | Notes |
|--------|-------|-------|
| `POST` | `bg-primary-container text-on-primary-container`, `text-[9px] font-black px-1.5 py-0.5 rounded` | Create operations — indigo deep bg |
| `GET` | `bg-surface-container-highest text-slate-400` | Read operations — dark muted |
| `PATCH`/`PUT` | `bg-surface-container-highest text-slate-400` | Update operations |
| `DELETE` | `bg-error-container/30 text-error` | Destructive — error tinted |

### 4.4 Background Patterns

| Pattern | CSS |
|---------|-----|
| **Blueprint Grid** | `linear-gradient(to right, rgba(70,69,85,0.1) 1px, transparent 1px), same to bottom; 40px 40px` — Wizard generating screen |
| **Dot Grid (Architecture)** | `radial-gradient(circle, #1e293b 1px, transparent 1px); 32px 32px` — Architecture canvas |
| **Canvas Dot Grid (ERD)** | `radial-gradient(#2d3449 1px, transparent 1px); 32px 32px` — Database schema canvas |
| **Auth Dot Grid** | `radial-gradient(circle, #adc6ff 1px, transparent 1px); 40px 40px; 3% opacity` — Auth page bg |
| **Ambient Glow** | Absolute positioned divs: 600px circles, `bg-primary/5 blur-[120px] rounded-full` — Landing, Auth, Blueprint Ready |
