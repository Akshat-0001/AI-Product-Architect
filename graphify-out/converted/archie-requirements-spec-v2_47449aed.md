<!-- converted from archie-requirements-spec-v2.docx -->


ARCHIE
AI Product Architect Platform
Product Requirements Specification v2.0

Open Source · Bring Your Own Key (BYOK)
Date: April 18, 2026

# 1. Executive Summary
Archie is an open-source, AI-powered Product Architect platform that transforms raw ideas into complete, execution-ready system blueprints. It is free to use and self-hostable. Users bring their own API keys (Groq or Gemini) — Archie never holds or bills for AI usage.



## 1.1 Problem Statement
Junior developers, students, and indie founders consistently struggle with:
- Knowing what to build before they build it — architecture paralysis
- Structuring their app correctly (database design, API contracts, component breakdown)
- Producing professional documentation (PRDs, HLDs, LLDs) for portfolios or teams
- AI tools that are gated behind expensive subscriptions or token limits

## 1.2 Open Source & BYOK Model
Archie is fully open source (MIT license). The BYOK model means:
- Users configure their own Groq API key and/or Gemini API key in the Settings page
- Archie sends AI requests using the user's own key — never a shared key
- No token quotas, no rate limits imposed by Archie — only by the provider's own free tier
- Groq free tier: 14,400 requests/day, 6,000 tokens/minute — sufficient for heavy daily use
- Gemini Flash free tier: 15 RPM, 1M tokens/day — excellent for large blueprint generation
- Users can configure both keys; Archie falls back to the available one automatically

## 1.3 Target Users

# 2. Feature Requirements
## 2.1 MVP Features
Everything ships together on launch. No gating, no paywalls.

### F-01: Idea Intake
Single large textarea where user describes their product idea in natural language. No forms, no dropdowns.
- ☐ Large focused textarea with placeholder 'Describe your idea...'  [MVP]
- ☐ Character count (minimum 20 chars to proceed)  [MVP]
- ☐ Quick-fill suggestion chips: E-commerce platform, SaaS dashboard, Social network, AI assistant  [MVP]
- ☐ Background glow ambient effect (primary/5 radial blur)  [MVP]
- ☐ Dot-grid subtle background pattern (#adc6ff 0.5px dots, 24px grid)  [MVP]

### F-02: Intelligent Questioning Engine (Core Differentiator)
Conversational Q&A flow that feels like talking to a senior engineer. 7 questions, one at a time.
- ☐ Chat-like UI: previous answers shown above in conversation history (dimmed 60% opacity)  [MVP]
- ☐ Bot avatar: small gradient circle with architecture icon  [MVP]
- ☐ Active question in glass-panel card with answer chips below  [MVP]
- ☐ Answer chips: icon + title + subtitle format (e.g. Professional Architects, Real Estate Clients)  [MVP]
- ☐ AI Insight sparkle callout below question (tertiary color, auto_awesome icon)  [MVP]
- ☐ Progress indicator: 'Question 3 of 7' + progress bar (42% fill)  [MVP]
- ☐ Fixed bottom action bar: Back | Skip | Continue gradient button  [MVP]
- ☐ Question categories: User type, Scale, Real-time needs, Auth, Data model, Monetization, Constraints  [MVP]

### F-03: UI Style Picker
10 pre-built visual style cards. No AI required — static React components. User picks one, gets a live preview on the right.
The 10 styles from the new Stitch design:
- ☐ Glassmorphism — frosted layers, indigo-to-blue gradient bg, soft depth  [MVP]
- ☐ Neo-Brutalism — white bg, bold black border, yellow offset shadow  [MVP]
- ☐ SaaS Modern — deep dark (#0b1326), primary accents, professional (default selected)  [MVP]
- ☐ Deep Ocean — atmospheric gradient, #001e3c to #000d1a  [MVP]
- ☐ Cyberpunk — black bg, pink neon horizontal line, cyan neon vertical line, glow effects  [MVP]
- ☐ Minimalist — light slate-100 bg, single thin square, maximum whitespace  [MVP]
- ☐ Enterprise Dark — #1e1e1e bg, 2x2 subtle grid of dark tiles  [MVP]
- ☐ Pastel Soft — purple-to-rose gradient, warm and inviting  [MVP]
- ☐ High Contrast — pure black, large white circle border, maximum impact  [MVP]
- ☐ Retro Terminal — #0a0a0a, green monospace text, '> system load...' aesthetic  [MVP]
Live Preview Panel specs:
- ☐ Right panel (col 8-12): sticky, shows 'Live Preview: [Style Name]' header + Active Theme badge  [MVP]
- ☐ Preview contains 3 mockups: Login card, Dashboard stats (2 tiles), Deploy action card  [MVP]
- ☐ Selected card: border-2 border-primary + checkmark circle -top-2 -right-2 + shadow glow  [MVP]
- ☐ Fixed bottom bar: Back | Step 3 of 5 dot indicator | Continue gradient button  [MVP]

### F-04: Blueprint Generation
AI generates all sections using the user's configured API key (Groq or Gemini). Full-screen generating state.
- ☐ Full-screen generating page: blueprint-grid background (linear-gradient lines, 40px grid)  [MVP]
- ☐ Central animation: 96px container with 3D crystalline image + SVG overlay circles/lines + hub icon  [MVP]
- ☐ Outer pulse rings: border border-primary/20 animate-ping + border-primary/30 animate-pulse  [MVP]
- ☐ Orbiting node icons: database (top-right, animate-bounce), code (bottom-left, delayed bounce), api (left, animate-pulse)  [MVP]
- ☐ Status text: 'Designing architecture...' + pulsing dot + project name subtitle  [MVP]
- ☐ Progress bar: gradient from primary-container via primary to white, 65% example, glow shadow  [MVP]
- ☐ Terminal log panel: monospace, timestamps, SUCCESS/IN PROGRESS/pending states  [MVP]
- ☐ Floating stats (xl screens): Processing Power card (bottom-left) + AI Integrity card (bottom-right)  [MVP]
- ☐ Uses user's BYOK key — shows which provider is active in terminal log  [MVP]
- ☐ Error handling: retry with fallback to other provider if one key fails  [MVP]

### F-05: Blueprint Ready (Step 5)
- ☐ Full-screen success state with bg-mesh radial gradient (primary-container/15 at center)  [MVP]
- ☐ Blueprint preview image card: aspect-video, border, mix-blend-luminosity opacity-40  [MVP]
- ☐ Floating overlay cards: 'Compiled' (top-right, green check + progress bar) + 'Schema.v5' (bottom-left)  [MVP]
- ☐ Central gradient circle (40px) with check_circle icon  [MVP]
- ☐ Headline: 'Your Blueprint is ready' — 4xl to 6xl, extrabold, tracking-tight  [MVP]
- ☐ Two CTAs: [View Blueprint] primary gradient + [Share Blueprint] ghost outline  [MVP]
- ☐ Minimal footer: 5-dot progress system (all dots primary/30 except last = primary with ring-4)  [MVP]

### F-06: Blueprint Workspace
Three-panel layout: Primary sidebar (240px) + Blueprint inner nav (64px icon-only OR 200px secondary) + Content area.
Blueprint sections (all fully accessible, no gating):
- ☐ Overview — project purpose, core goals, tech stack snapshot, style guide summary, activity feed  [MVP]
- ☐ Architecture Matrix — interactive diagram with SVG connections, node cards, stack overview, architect's note panel  [MVP]
- ☐ Database Schema — ERD canvas with dot-grid bg, draggable table cards, SVG crow's foot connections, right details panel  [MVP]
- ☐ API Endpoints — 3-panel: endpoint list grouped by resource + documentation detail + request/response examples  [MVP]
- ☐ User Stories — left list (60%) + right details panel (40%) with acceptance criteria and linked architecture  [MVP]
- ☐ Code Scaffold — 3-panel: file explorer tree + code editor (dark, syntax highlighted TS) + scaffold metadata  [MVP]
Top bar buttons (all screens):
- Regenerate — ghost pill button
- Share — ghost pill button
- Export — primary-container filled button

### F-07: BYOK Settings (API Key Configuration)
This is a core MVP feature — without keys configured, the app shows a setup prompt instead of the wizard.
- ☐ Settings page has dedicated 'API Keys' section (replacing all pricing/plan content)  [MVP]
- ☐ Groq API key input: masked field, validate button, success/error indicator  [MVP]
- ☐ Gemini API key input: masked field, validate button, success/error indicator  [MVP]
- ☐ Active provider indicator: green dot showing which key is currently active for generation  [MVP]
- ☐ Fallback preference toggle: 'If Groq fails, fall back to Gemini' and vice versa  [MVP]
- ☐ Keys stored in browser localStorage (client-side only — never sent to any server other than provider)  [MVP]
- ☐ Quick links to Groq Console and Google AI Studio for users to get free keys  [MVP]
- ☐ Clear instructions: 'Your API key is only stored in your browser and sent directly to [Provider].'  [MVP]
- ☐ First-time setup wizard: if no key configured, redirect to Settings/API Keys before allowing generation  [MVP]

### F-08: Dashboard
- ☐ Greeting: 'Good morning, [Name]' Archie extrabold 4xl + subtitle  [MVP]
- ☐ Filter bar: [All] [Recent] [Shared] — active = primary bg, inactive = text hover  [MVP]
- ☐ Bento grid: New Project dashed-border CTA card + project cards + AI Insights wide card (col-span-2)  [MVP]
- ☐ Project cards: status badge (In Progress = primary/10, Review Required = tertiary/10, Archived = muted), image cover with opacity-60, category tags, team avatars, timestamp  [MVP]
- ☐ AI Insights card: auto_awesome icon, tertiary accent, recommendation text, Review Suggestion button  [MVP]
- ☐ FAB: bottom-right, gradient from primary to primary-container, + icon, rounded-full, shadow-primary/40  [MVP]

### F-09: Authentication
- ☐ Centered glass-panel card (rgba(45,52,73,0.6) + backdrop-blur-20px)  [MVP]
- ☐ Toggle tabs: [Log In] [Sign Up] — selected = white bg surface-container  [MVP]
- ☐ GitHub OAuth: dark surface-container-highest/50 button with GitHub SVG  [MVP]
- ☐ Email + password form with icon-in-input pattern (alternate_email, lock icons)  [MVP]
- ☐ CTA: gradient-button (135deg adc6ff to 005cc6), 'Access Workspace'  [MVP]
- ☐ Background: two ambient glows (primary-container/10 top-right, tertiary-container/5 bottom-left)  [MVP]
- ☐ Dot-grid background: radial-gradient(#adc6ff 0.5px, transparent 0.5px) at 40px  [MVP]
- ☐ System status: pulsing dot + 'Archie Core 2.4.0 Online' + encrypted icon  [MVP]

### F-10: Settings Page
- ☐ Sidebar items: Profile, Architecture, API Metrics, Security, API Keys (new primary section), Help  [MVP]
- ☐ Profile section: glass-card, avatar with edit button, name, role badge, email + location grid  [MVP]
- ☐ API Keys section: Groq key input + Gemini key input, validate buttons, active provider indicator  [MVP]
- ☐ Export Preferences: default language selector (React/Node.js/Python chips), toggles for README gen, Docker/K8s configs  [MVP]
- ☐ Security section: 2FA status (active/inactive), password reset, Danger Zone (delete account)  [MVP]
- ☐ NO pricing, NO plan management, NO token quota UI — fully removed  [MVP]

# 3. Post-MVP Features
Build after stable launch and user feedback. No timeline gating.

### Phase 2 — After 100 Users
- ☐ Mermaid.js diagram rendering inside Architecture and Database sections  [POST-MVP]
- ☐ Blueprint versioning: re-answer questions, regenerate, compare v1 vs v2  [POST-MVP]
- ☐ Tech stack alternatives: 2-3 stack options with tradeoff tables  [POST-MVP]
- ☐ Additional BYOK providers: OpenAI, Anthropic, Mistral  [POST-MVP]
- ☐ Self-host Docker image with one-command setup  [POST-MVP]
### Phase 3 — After 500 Users
- ☐ Public gallery /explore — community blueprints browseable by category  [POST-MVP]
- ☐ Codebase explainer: paste GitHub URL → get architecture explanation + diagrams  [POST-MVP]
- ☐ Hackathon Mode: speed-optimized 90-second blueprint (fewer questions, faster output)  [POST-MVP]
- ☐ Team collaboration (shared blueprints, comments)  [POST-MVP]

# 4. Non-Functional Requirements
## 4.1 Performance
- Blueprint generation completes within 20s using Groq (fastest inference available)
- Gemini Flash generation: 15-25s for full blueprint (5 sections)
- Page load time < 2 seconds (dark theme, no heavy images on load)
- Smooth 60fps animations for orbital generation screen, card hovers, step transitions

## 4.2 Security (BYOK specific)
- API keys stored ONLY in browser localStorage — never transmitted to Archie's servers
- All AI API calls made client-side or via Next.js API route with user's own key (key passed in request header)
- Clear privacy notice on Settings page explaining key storage
- No analytics on what users generate — blueprints stored only in Supabase under user's own account

## 4.3 Open Source
- MIT license — commercial use allowed
- Public GitHub repo with full source code
- Contributing guide, issue templates, PR workflow
- Self-hosting documentation (Docker + Vercel deploy buttons)
- Environment variable template (.env.example) for self-hosters

# 5. Key User Flows
## 5.1 First-Time User (No API Key)
- User arrives at / landing page → reads hero copy → clicks 'Start Building'
- Redirected to /auth → signs up with GitHub or email
- Redirected to /settings/api-keys → sees 'Set up your API keys to start generating' prompt
- User goes to console.groq.com, gets free API key, pastes into Groq field → validates → green check
- Clicks 'Start Building' → redirected to /dashboard → starts first project

## 5.2 Returning User (Key Already Configured)
- Lands on /dashboard → sees existing projects + 'New Project' CTA
- Clicks new project → Wizard Step 1 (idea input) → Step 2 (questions) → Step 3 (style) → generating → blueprint

## 5.3 Share Flow
- User opens blueprint workspace → clicks 'Share'
- Unique /b/[shareId] link generated → copied to clipboard
- Anyone opens link → read-only blueprint view → 'Made with Archie' banner → converts to user
| CORE PHILOSOPHY |
| --- |
| Open source. No paywalls. No usage limits. Users configure their own Groq or Gemini API keys in Settings and own their AI consumption entirely. |
| ONE-LINE PITCH |
| --- |
| An AI Product Architect that turns your idea into a complete system design, documentation, and code — ready to build. Free forever, powered by your own API keys. |
| User Segment | Primary Need | Why Archie Works |
| --- | --- | --- |
| CS Students | Portfolio-grade project structure | Free, no credit card, BYOK with free Groq tier |
| Hackathon Teams | Fast system design under time pressure | 24-48hr sprints — no signup friction |
| Self-taught Developers | Bridge between coding and architecture | Free forever, open source, self-hostable |
| Early-stage Founders | MVP planning before hiring engineers | No cost, full feature access from day 1 |
| Open Source Contributors | Contribute to a real product-dev tool | MIT licensed, public GitHub repo |