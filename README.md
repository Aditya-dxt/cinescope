# CineScope — Movie Discovery + AI Picks

**One-paragraph brief:** CineScope solves “what to watch now?” for casual viewers overwhelmed by endless catalogs — it gives a fast, tactile grid of 20 discovery titles from OMDb, instant search, and per-user favourites (Firestore + localStorage fallback so it works without keys). The meaningful AI is a mood → 3 structured picks: you type “cozy weekend” or “late-night thriller” and Claude (or a deterministic fallback) picks exactly 3 titles *from your current result set* with a one-sentence reason and overall insight, never hallucinating outside what’s on screen. Built for the FlyRank Frontend AI Engineering capstone to prove accessible, performant, resilient frontend with honest docs and tests. **Why this idea:** small enough to finish well, real OMDb integration, and AI that augments taste rather than replacing choice — each card still shows poster/year/type for human judgment.

**Live, deployed:** https://cinescope-phi-ebon.vercel.app · alias https://cinescope-aditya-dixits-projects-06f0b598.vercel.app · health: /health · also week03 identity at /week03 and /identity, launch plan at /next-case

**Repo:** https://github.com/Aditya-dxt/cinescope

**Assignment:** Frontend AI Engineering — Ship It: Your First Production AI Product (Week 8 Capstone, CUSTOM-MS4MLF4V-E2371199). Also powers Week 3 React + AI (CUSTOM-MRC9R0VW-1B5749AA).

Reference session: Ishak — *React Frontend Development with AI: From Prompt to Working Feature* (https://www.youtube.com/watch?v=pYhYlcmFOwU) — Movie search demo (Vite + React + TS + MVVM + OMDb + Firebase). This is an **independent rebuild** with distinct design, data flow, AI validation and improvements — not a clone.

## Stack
Vite 8 + React 19 + TypeScript + React Router 7 · MVVM (Model / useViewModel / View) · OMDb API · Firebase Auth + Firestore with localStorage fallback · No UI lib — custom CSS (dark cinematic, glass header)

## Features
- Header: Home / Favourites / Auth + global search (desktop pill + mobile sheet), accessible labels, keyboard submit
- Home: 20 random titles on load (4 seed keywords → parallel fetches → dedupe → shuffle), search, skeletons/loading/error/empty/hover lift, poster fallback
- **AI Picks for you** (see below) — mood input → 3 structured recommendations + insight, validated JSON, fallback badge
- MovieCard reusable (poster N/A fallback, lazy, title/year/type, favourite/remove)
- Favourites per-user: `users/{uid}/favourites/{imdbID}` when configured, else `cinescope_favs_{uid}` in localStorage — protected `/favourites` → redirect to `/auth`
- Auth: email/password, AuthContext + onAuthStateChanged, /auth redirects when already signed in
- Demo mode: without VITE_OMDB_API_KEY shows curated mock titles so reviewers can verify without keys

## Run locally
```bash
npm install
cp .env.example .env   # add VITE_OMDB_API_KEY and optionally VITE_FIREBASE_*, VITE_ANTHROPIC_API_KEY
npm run dev            # http://localhost:5173
npm run build && npm run preview
npm test               # vitest run (8 tests, 4 suites)
npm run test:coverage  # with v8 coverage
```

Get OMDb key: https://www.omdbapi.com/apikey.aspx (free). Anthropic key: https://console.anthropic.com (optional — fallback works without it). Firebase: create project → Email/Password Auth + Firestore.

## Env
```
VITE_OMDB_API_KEY=your_key
VITE_ANTHROPIC_API_KEY=sk-ant-...   # optional; omit to use deterministic fallback
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Architecture
```
src/
  types/        Movie, OmdbSearchResponse
  services/     omdbService (search + hasOmdbKey + mock), firebaseService, authService, favouritesService (dual-write), aiService (Claude + fallback + validation)
  components/   MovieCard, AiPanel, Health, Week03, LaunchPlan, Navbar
  pages/
    Home/       HomeModel (getMovies, initialMovies), useHomeViewModel (query/movies/loading/error/favFeedback), HomeView (+ AiPanel)
    Favourites/ FavouritesModel/useFavouritesViewModel/FavouritesView
    Auth/       AuthModel/useAuthViewModel/AuthView + AuthContext
  context/      AuthContext, LenisContext
  __tests__/    MovieCard, aiService, omdb, AiPanel (vitest + jsdom + testing-library)
App.tsx routes: / → Home, /favourites (protected), /auth, /health, /week03, /identity, /next-case, /launch-plan, /playground, /chat, /stack, /workflow, /fl05
```
MVVM rule: Models are hook-free pure functions; ViewModels own state/effects; Views are presentational. Services never import React.

## AI integration — how Claude fits, prompt, why, safety
**What it does:** User enters mood/goal (“cozy weekend, light and uplifting”), clicks Ask AI → service calls Claude with the *current 20 movies as the only catalogue* and returns exactly 3 picks with `reason` + `moodFit` + overall `insight` as structured JSON. UI renders cards inline on Home.

**Why not a chatbot:** A chatbot is generic. A constrained recommender that respects the visible set, validates IDs, and shows rationale demonstrates structured output, guardrails, and user taste — it solves “which of these 20?” not “tell me anything.”

**Model & prompt:**
- Model: `claude-3-5-haiku-20241022` (fast, cheap, JSON-friendly)
- System prompt (versioned in `src/services/aiService.ts`):
```
You are CineScope AI, a concise movie taste assistant. Given user's mood/goal and their current result set (Title, Year, imdbID), pick exactly 3 distinct movies from the provided set and explain each in one sentence. Also write a 1-sentence overall insight. Respond with JSON only: {"recommendations":[{"imdbID":"","Title":"","Year":"","reason":"","moodFit":""}],"insight":""}. No markdown, no extra keys.
```
- User prompt: `Mood/goal: "<query>"\nCatalogue (choose ONLY from these):\n<imdbID | Title (Year) x 20>\nReturn JSON only.`

**Structured output & resilience:**
- Response text stripped of ``` fences, JSON.parse, then `validateAndMap`: checks array length 3, required string fields, trims to 160/120 chars, and **rejects any imdbID not in the provided catalogue** (prevents hallucination → fallback). On HTTP !ok, parse error, or validation fail, returns deterministic `fallbackPick` (sort by Year desc + Title, 3 picks with reason/moodFit, insight). Provider badge shows “Claude” or “Fallback (reason)”.

**Costs & privacy:** Key is `VITE_ANTHROPIC_API_KEY` (client-side for this capstone; production would proxy). No PII sent except mood string + titles.

## FE-07 Tool results and structured output in the UI
Server-side tools defined with Zod + `execute` in `src/tools/movieTools.ts`, wired in `api/chat.ts` via AI SDK `streamText({ tools })`. Client renders typed tool parts from `src/components/ToolCard/ToolCard.tsx` — 200ms morph between states, each answers a different user question.

| Tool | Description | Input schema (Zod) | Return shape | Error case |
|------|-------------|--------------------|--------------|------------|
| `lookupMovie` | Fetch movie metadata for a title (OMDb). Used when user asks "lookup X" or chat needs structured card. | `z.object({ title: z.string().min(1).describe("Exact movie title to lookup via OMDb") })` | `{ Title, Year, Rated, Runtime, Genre, Plot, imdbRating, Poster, Source: 'omdb' \| 'mock' }` | Not found → `Error('Not found')` → renders designed error card, not crash |
| `getWatchScore` | Score a movie for watchlist with vibe weighting. Returns score + breakdown for chart. | `z.object({ title: z.string(), vibe: z.enum(['cozy','intense','fun','mind-bending']).describe("Viewer vibe") })` | `{ title, vibe, score: 0-10, breakdown: {story, rewatch, vibeFit}, verdict }` | Invalid vibe → Zod parse error; missing title → validation error — both typed error states |

Four tool part states each distinct:
- `input-streaming` — dashed border, pulsating dot, "resolving input…" (what is it doing?)
- `input-available` — blue card, monospace JSON of validated input (with what input?)
- `output-available` — green card, renders as component: lookupMovie → poster card, getWatchScore → score card + hand-rolled SVG bars (not JSON dump)
- `output-error` — red alert, `role="alert"` with message + "Retry" guidance (what went wrong?)
- User-interaction tool: "Add to watchlist" confirmation dialog (client tool) — requires user Confirm/Cancel before execute (FE-07 #4 stretch).

Try live: `/chat` → buttons "Demo: lookup Inception" / "Demo: score Dune · intense" / "Demo: failed tool" iterate states; or type `lookup Dune` / `score Inception as cozy`.

## Testing & coverage
- Framework: Vitest 3 + jsdom + @testing-library/react + @testing-library/jest-dom
- Tests (8, 4 suites): `MovieCard.test.tsx` (render, fallback poster, favourite click), `aiService.test.ts` (fallback without key, empty-set throws, hallucination validation → fallback), `omdb.test.ts` (hasOmdbKey), `AiPanel.test.tsx` (renders, Ask AI shows Fallback insight)
- Run: `npm test` / `npm run test:coverage` (v8, lcov). Coverage ≥60% on tested modules — screenshots in repo `coverage/` and deployment checklist.
- Future: Playwright e2e for critical flow (search → AI → favourite → persists after reload).

## Performance & accessibility audit
- Build: `npm run build` → 10kB CSS, ~810kB JS (single chunk — future split). Lazy poster images, no UI lib, CSS-only glass/skeletons.
- Lighthouse (mobile, throttled): **Perf 91-94, A11y 100, Best Practices 100, SEO 91** — run locally: `npx lighthouse https://cinescope-phi-ebon.vercel.app --view`. Fix applied after audit: added `aria-label` to search + AI mood input, `aria-busy` on Ask AI button, `alt` on all posters, focus styles, and color contrast ≥4.5:1 on muted text (was 3.9).
- axe/WAVE: 0 violations on Home (landmarks, labels, alt, button names). Evidence: `DEPLOYMENT_CHECKLIST.md`.

## Deployment & operation
See `DEPLOYMENT_CHECKLIST.md` — pre-deploy, deploy, verify, rollback, monitoring. Vercel auto-deploy on `git push main` to `cinescope` (aditya-dixits-projects-06f0b598), alias `cinescope-phi-ebon.vercel.app`. Rollback: Vercel → Deployments → Promote previous Ready (<30s). Monitoring: Vercel Analytics + Web Vitals + console + /health uptime.

## Known limitations & future improvements
- **Client-side Anthropic key:** demo-simple; would proxy via Vercel function or Edge to hide key and enforce rate limits.
- **Bundle size:** ~810kB single chunk — split AiPanel + Favourites + Auth lazy.
- **OMDb rate limits:** free key throttles — mock fallback helps but live search may 429; needs debounce + cache.
- **No pagination:** OMDb totalResults ignored; would add page param + infinite scroll.
- **No e2e yet:** add Playwright critical path + Lighthouse CI gate (≥85 perf, 0 axe violations).
- **Favourites sync:** LS→Firestore mirror is best-effort; would add optimistic UI + undo + conflict merge.

## Reflection
See `REFLECTION.md` (1 page): hardest was validated structured AI, what I’d do differently (proxy, code-split, Playwright), surprise about MVVM + fallback habit.

## Prompts used (in order)
1. Scaffold Vite React TS, no UI lib
2. Types + services shell (Movie, OmdbSearchResponse)
3. OMDb service (searchMovies, hasOmdbKey, mock)
4. Firebase config (hasFirebase flag)
5. Auth service (register/login/logout, error map)
6. Favourites service (Firestore + LS dual-write)
7. MVVM scaffolds (Models/ViewModels/Views placeholders)
8. HomeModel (getMovies, initialMovies — 4 seeds → Promise.all → dedupe → shuffle → 20)
9. useHomeViewModel (query/movies/loading/error/favFeedback)
10. MovieCard (poster fallback, lazy)
11. HomeView + Header (hero, banner, toolbar, skeletons, toast)
12. Favourites MVVM, Auth MVVM + Context, Routing, Styling
13. AI service: structured Claude prompt + validate + fallback (new for capstone)
14. AiPanel: mood input + Ask AI + validated render + fallback badge
15. Tests (Vitest), Checklist, Reflection

## How AI assisted
- Scaffolding, types, service shells, MVVM folders from concise prompts — saved ~2h.
- Drafted searchMovies + initialMovies parallel logic; I added mock fallback.
- Kept Firebase out of components per MVVM; I added LS fallback.
- Generated AiPanel UI draft; I enforced ID validation and fallback tests.
Workflow: prompt → AI output → manual review → `npm run build` + click-through → fix → commit. Every AI block read, tested, committed by me.

## Manual improvements after reviewing AI code
Demo fallback, per-user dual-write, Home reload bug (clearSearch → loadInitial), poster N/A + onError lazy, Header↔Home events, Auth redirect, glass/pill CSS, AI ID validation + fence stripping + trim, accessible labels + aria-busy.

## Submission
- Live: https://cinescope-phi-ebon.vercel.app (+ https://cinescope-aditya-dixits-projects-06f0b598.vercel.app)
- Health: /health · Identity: /week03 & /identity · Next-case plan: /next-case & /launch-plan
- `npm install && npm run dev` — see Env & Run locally above
- Video ref: https://www.youtube.com/watch?v=pYhYlcmFOwU · Internship: CUSTOM-MS4MLF4V-E2371199 (capstone), CUSTOM-MRC9R0VW-1B5749AA (Week 3)
