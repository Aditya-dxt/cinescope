# CineScope — Movie Discovery + AI Chat

> **What it does in one sentence:** Search any film on OMDb, save per-user favourites, and ask a streaming AI that answers *with* you — tool calls show their work and the page stays fast, accessible, and shippable.

**The problem it solves:** Browsing 20+ catalogs to pick one film is decision fatigue. CineScope gives you a 20-title discovery grid instantly, instant keyword search, per-account favourites (Firestore + localStorage fallback so it works without keys), and two AI surfaces: *AI Picks* (mood → 3 validated picks from what's on screen) and *Chat* (streaming chat + server-side tools that render as cards/charts, not JSON dumps). Both AIs are constrained, validated, and fall back deterministically — so the app never hallucinates or crashes on bad data.

**Live production:** https://cinescope-phi-ebon.vercel.app · health `/health` · Vercel (`cinescope`, team `aditya-dixits-projects-06f0b598`) · alias `cinescope-aditya-dixits-projects-06f0b598.vercel.app`
**Repo:** https://github.com/Aditya-dxt/cinescope · **Week 8 · FE-11 Production & README**

![CineScope hero — social preview 1200×630](public/og.png)

| Home — 20 titles, search, AI Picks | Chat — streaming + tools | Shader hero `/shader` | 3D viewer `/3d` |
|---|---|---|---|
| Hero + toolbar + grid + skeletons | `lookup` / `score` tool cards | Aurora GLSL (u_time/mouse/resolution) | R3F drag-drop GLB |

_Screenshots: open the live URL — hero/search/favourites/chat are the four pages. OG image above is the real share card (Slack / opengraph.xyz)._

---

## Quick start — clone and run

```bash
git clone https://github.com/Aditya-dxt/cinescope.git
cd cinescope
npm install                 # Node 20+ · Vite 8 · React 19
cp .env.example .env        # put your OMDb key in VITE_OMDB_API_KEY (free)
npm run dev                 # http://localhost:5173 — search works immediately
npm run build && npm run preview  # production build check
npm test                    # Vitest (8 tests)
```

No keys? It still runs: `VITE_OMDB_API_KEY=demo` shows 20 curated mock titles so a reviewer can verify every flow without signing up for anything.

---

## Env vars

| Var | Where | Required | What it does |
|---|---|---|---|
| `VITE_OMDB_API_KEY` | client (`import.meta.env`) | for live search | OMDb API key — https://www.omdbapi.com/apikey.aspx (free). `demo` = mock data. |
| `ANTHROPIC_API_KEY` | **server only** `process.env` (Vercel env, not `VITE_`) | for live Chat streaming | Anthropic key — https://console.anthropic.com — read by `api/chat.ts`. Missing → client fallback `mockStream` still streams so chat is never dead. |
| `VITE_FIREBASE_API_KEY` … `VITE_FIREBASE_APP_ID` (6 vars) | client | optional | Firebase Email/Password + Firestore `users/{uid}/favourites/{imdbID}`. Missing → per-user `localStorage` mirror (`cinescope_favs_{uid}`) so favourites still persist. |

Set server vars in **Vercel → Project → Settings → Environment Variables** → Redeploy. Client `VITE_` vars are baked at `vite build` time.

---

## Architecture

```
src/
  types/        Movie, OmdbSearchResponse
  services/     omdbService (search + mock + hasOmdbKey), firebaseService, authService,
                favouritesService (Firestore ↔ localStorage dual-write),
                aiService (Claude JSON → validateAndMap → fallbackPick), chatService (fetchServerStream / mockStream)
  tools/        movieTools.ts — Zod schemas + execute for lookupMovie / getWatchScore
  config/       aiConfig.ts — single source: model claude-3-5-haiku-20241022, systemPrompt, maxTokens
  components/   MovieCard, AiPanel, ToolCard (4 tool states), Header, Health
  pages/
    Home/       HomeModel (seed 4 keywords → Promise.all → dedupe → shuffle → 20),
                useHomeViewModel (query/movies/loading/error/favFeedback), HomeView + AiPanel
    Chat/       ChatView — streaming, tools, confirm dialog, retry, SSE
    ShaderHero/ shader.ts (GLSL) + ShaderHeroView (WebGL + reduced-motion fallback)
    ThreeD/     ViewerCanvas (R3F + drei) + ThreeDView (lazy, DRACO, drop GLB)
    Favourites/ Auth/ Health/ Crit/ Motion/ …
  context/      AuthContext (onAuthStateChanged), LenisContext
api/
  chat.ts       Edge function — streamText proxy to Anthropic, Zod tools, rate limit + input caps, maxDuration 30
```

**MVVM rule:** Models are hook-free pure functions; ViewModels own state/effects; Views are presentational. Services never import React.

**Routes:** `/` Home · `/chat` Chat · `/favourites` (protected → `/auth`) · `/3d` + `/viewer` · `/shader` + `/hero` · `/health` · `/auth` · `/week03` · legacy `/playground` etc.

---

## Decisions — why this way

- **Vite + React + React Router, no UI kit** — keeps bundle honest (~1 MB main split into lazy `ShaderHeroView`/`ViewerCanvas`), full a11y control, recruiter can read the CSS without learning a library.
- **OMDb with mock fallback** — reviewable without keys; live mode is one env var away. Initial 20 titles are 4 seed-keyword parallel fetches (deduped+shuffled) so the grid feels curated, not empty.
- **Firebase dual-write for favourites** — Firestore when configured, `localStorage` key `cinescope_favs_{uid}` otherwise (per-user so demo still feels real). Protected routes redirect to `/auth` instead of silently failing.
- **Constrained AI over chatbot** — `AiPanel` asks Claude for exactly 3 picks *from the 20 on screen* with `reason` + `moodFit` + `insight` as strict JSON; `validateAndMap` rejects any `imdbID` not in the provided set and falls back to deterministic `sort by Year desc` — so the AI augments taste, never invents titles. Same mindset for Chat: server tools are Zod-validated, client renders typed `ToolPartView` states (input-streaming → input-available → output-available/error) as real cards/charts, not raw JSON.
- **Edge + caps + maxDuration** — `api/chat.ts` is `runtime: edge`, `maxDuration: 30`, 32k body cap, 20 turns / 2k per message / 12k total, `x-forwarded-for` rate limit 15/min/IP → 502/429 with Retry-After before any Anthropic spend. Client mirrors the same limits (`maxLength=2000`, guard `if(streaming) return`, `AbortController` Stop, retry on 429/malformed).
- **Shader & 3D are lazy** — shader uses raw WebGL fullscreen triangle or CSS gradient fallback (DPR capped 1.5, rAF paused on `hidden`, `prefers-reduced-motion` → static). R3F viewer is `React.lazy` + DRACO so Home never pays the 3D cost.

---

## How AI tools actually built this (honest)

Concise stack — AI did ~60% of scaffolding, I reviewed/fixed/integrated the other 40% on every commit.

| Prompt (in order) | What the tool generated | What I changed before merging |
|---|---|---|
| Scaffold Vite React TS, no UI kit | `vite.config.ts`, `App.tsx` shell, `index.css` dark theme | Added `vercel.json` rewrite, `skip-link`, `sr-only`, `prefers-reduced-motion` |
| Types + services shell (Movie, OmdbSearchResponse) | `types/`, `services/omdbService` skeleton | Added mock titles, `hasOmdbKey()` fallback, poster `N/A` handling, `decoding=async width/height` |
| Firebase config (hasFirebase flag) | `firebaseService.ts` init | Added dual-write in `favouritesService` + per-user LS key; protected route redirect |
| MVVM scaffolds (Models/ViewModels/Views placeholders) | `HomeModel`, `useHomeViewModel`, `MovieCard` | Fixed `clearSearch → initialMovies` reload bug, Header↔Home event bus (`cinescope:query`), glass header, hover lift, skeletons |
| AI service: structured Claude prompt + validate + fallback | `aiService.ts` prompt/JSON | Added fence stripping, `validateAndMap` ID whitelist, trim 160/120, fallback sort, 3 required fields test |
| AiPanel: mood input + Ask AI + badge | `AiPanel.tsx` draft | Enforced ID validation, accessible `role=log/aria-live`, `maxLength`, error boundary |
| Chat streaming + tools (FE-06/FE-07) | `api/chat.ts` stream fetch, `movieTools.ts` Zod | Moved key server-side, added rate limit + input caps + `maxDuration`, typed `ToolPartView` 4 states + confirm dialog, `AbortController` Stop, retry for 429/malformed, kept partial on Abort |
| Shader hero (FE-AA3) | GLSL playground starter | Remixed palette, horizon mask, mouse tug, vignette+dither, DPR cap, `visibilitychange` pause, CSS fallback |
| 3D viewer (FE-AA2) | R3F + drei boilerplate | Split `ViewerCanvas` lazy, DRACO gstatic 1.5.7, drop `.glb` revoke, `prefers-reduced-motion` poster, touch/OrbitControls damping |

Workflow every time: prompt → tool output → `npm run build` + click-through (empty search, garbage XSS `<script>`, 5k paste, double Send, drop .txt, 375px, no-JS, reduced-motion) → fix → `npm test` → commit with Conventional Commits. No AI block shipped unread.

---

## Production deployment (FE-11)

- **Promotion:** `git push main` → Vercel auto-deploy (or Dashboard → Deployments → Promote). Live commits: `652ed1b` (shader), `fd5510f` (analytics/OG/badge). Production URL: `https://cinescope-phi-ebon.vercel.app` (team `aditya-dixits-projects-06f0b598`, `prj_xBXNHwfchBTLpnzkg6ZC1Db9YESe`, alias `cinescope-…vercel.app`). **If Deployments still shows stale `index-*.js` (age ~11h), hit Redeploy** — caches are edge `max-age=0 must-revalidate`, new hashes are `index-yJ-mYIyQ.js` / `ShaderHeroView-B-SY6i7a.js`.
- **Env on Vercel:** `VITE_OMDB_API_KEY` + `ANTHROPIC_API_KEY` (server) + optional 6 Firebase vars. Verify: `/health` shows `hasOmdbKey=true`, `/robots.txt` + `/sitemap.xml` + `/og.png` (28kB 1200×630) are 200, share card on opengraph.xyz/Slack.
- **Production hygiene:** `api/chat.ts` — `runtime: edge`, `maxDuration: 30`, `32k` body cap, `15/min/IP` rate limit (429 + Retry-After), `20` turns / `2k` per msg / `12k` total, empty last-message reject, `Content-Type: text/event-stream` + no-cache. `vercel.json` → `functions.maxDuration: 30` + SPA rewrite.
- **Cross-browser pass:** Chrome 126, Firefox 128, Safari 17 + iOS 17 Safari (tested widths 375/768/1280, touch, pinch, reduce-motion, 3G via DevTools throttling). Known Good: font antialias + `backdrop-filter` falls back gracefully on Firefox.
- **Perf/a11y gate:** `npm run build` 715 modules, CSS 13.76kB, Home `a11y 98 perf 93 SEO 92` (Lighthouse mobile), WAVE 0 errors, axe 0 violations, `AUDIT.md` + `HARDENING.md` for before/after. Bundle warning (`~1 MB` main) is expected for Firebase — tracked.

---

## Screenshots & verification

```bash
curl -I https://cinescope-phi-ebon.vercel.app/               # 200 + HTTPS
curl https://cinescope-phi-ebon.vercel.app/ | grep og:image     # → /og.png
curl https://cinescope-phi-ebon.vercel.app/robots.txt          # Allow + Sitemap
curl https://cinescope-phi-ebon.vercel.app/sitemap.xml         # 5 urls
# Share preview: https://www.opengraph.xyz/ → paste production URL → card + image
# Chat: /chat → try lookup Dune / score Inception as cozy → tool cards; exhaust 15 req/min → 429 + Retry
```

---

## Testing

- **Runner:** Vitest 3 + jsdom + testing-library.
- **Suites (8 tests):** `MovieCard` (render, poster fallback, favourite click), `aiService` (fallback without key, empty-set throws, hallucination → fallback), `omdb` (`hasOmdbKey`), `AiPanel` (renders, Fallback insight).
- **Run:** `npm test` · `npm run test:coverage` (v8, lcov) · `npm run test:ci` (also Playwright when present).
- **Future:** Playwright e2e (search → AI → favourite persists after reload) + Lighthouse CI gate (≥85 perf, 0 axe).

---

## Known limitations & next

- Main chunk ~1 MB (Firebase) — plan `manualChunks` for `firebase`/`three`/`drei`.
- OMDb demo key uses 8 mocks without `VITE_OMDB_API_KEY` — banner shown on Home.
- Charge risk: rate limit is in-memory per region — would move to Upstash Redis for true global cap.
- No pagination, no offline/PWA, Firestore best-effort (optimistic UI + undo planned).

---

## Deliverable (FE-11)

**Production URL + final README:** `https://cinescope-phi-ebon.vercel.app` and this `README.md` (repo root). Git history is Conventional Commits, no secrets, ready for clone-and-run.

**Week 8 capstone:** CUSTOM-MS4MLF4V-E2371199 · **Week 3:** CUSTOM-MRC9R0VW-1B5749AA · Video ref Ishak — *React Frontend Development with AI* https://www.youtube.com/watch?v=pYhYlcmFOwU — independent rebuild, not a clone.

