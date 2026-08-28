# Demo Script — 3–5 min live run (FL-09) — no slides, real thing

> **Record:** Loom or YouTube unlisted, 1080p, mic on, share the live production URL: https://cinescope-phi-ebon.vercel.app
> **Upload and replace this placeholder with the public link in `INDEX.md` and the portal.**
> Narration below is ~4:10 spoken at natural pace. Show one decision + one limitation on camera (marked).

---

### 0:00–0:25 — Intro (what it is, for whom)

*On camera:* Home at `/` — 20 titles already there.

> “I’m Aditya — this is CineScope, a movie discovery + AI chat I built for the FlyRank Frontend AI capstone. It’s for someone who wants to pick one film fast — you get 20 discovery titles on load, search any OMDb title, save per-user favourites, and ask AI that stays constrained to what’s on screen. Repo and production URL are in the README — a stranger can clone and run from mocks without keys. Stack is Vite + React + MVVM, OMDb + Firebase with localStorage fallback, Claude on edge with Zod tools.”

Show `README.md` Quick start for 2s, then back to live site.

### 0:25–1:10 — Home + Favourites (the real product loop)

- *Search:* type “Inception” → grid updates, skeletons → posters, hover lift. Clear → back to 20 random (4 seeds → Promise.all → deduped/shuffled).
- *Favourite:* click heart on a card → toast → go to `/favourites` (protected → if logged out, bounced to `/auth` — show that once). Log in (demo account) → favourite persists (Firestore if configured, else `cinescope_favs_{uid}` in localStorage — open DevTools Application → Local Storage to show).
- *Empty/garbage:* search `!!!@@@` → “No movies found. Showing curated titles.” — not a crash.

### 1:10–2:05 — AI Picks (structured, validated)

*Scroll to AiPanel on Home.*

> “This is the constrained AI — type a mood, not a generic chatbot.”

- Input: `cozy weekend thriller under 2 hours` → Ask AI → 3 picks appear with `reason` + `moodFit` + overall `insight`, each is an `imdbID` from the 20 on screen. Click a pick → poster card.

- **[DECISION on camera]** “Decision I want to call out: I validate every ID. `aiService` strips fences, parses JSON, checks length 3 and required fields, and *rejects any imdbID not in the catalogue I sent* — hallucination falls back to a deterministic sort by Year. That’s why the provider badge says ‘Claude’ or ‘Fallback (reason)’ — honest about what ran.”

### 2:05–3:10 — Chat — streaming + tools as generative UI (FE-06/07)

*Go to `/chat`.*

- Show streaming: type “cozy thriller for tonight” → tokens stream, `role=log aria-live=polite`, Stop button autoFocus → hit Stop → partial stays, input re-enables. Type again → streams to completion.

- Tools — four states, each visually distinct:
  - `lookup Dune` → input-streaming (pulsing dot) → input-available (blue JSON) → output-available (green poster card).
  - `score Inception as intense` → score card + hand-rolled SVG bars + verdict.
  - `lookup asdf-not-a-film` → output-error (red alert, `role=alert`) + retry guidance — designed error, not crash.
  - “Add to watchlist” confirm dialog → requires Confirm/Cancel before execute (user-interaction tool).

- Abuse caps: mention `maxLength 2000` on input, paste 5k → truncated, mention server: edge `maxDuration 30`, 15/min/IP → 429 + Retry-After before spend.

### 3:10–3:50 — Polish — Shader + 3D (responsible shipping)

- `/shader` (also `/hero`): fullscreen GLSL aurora — `u_time` + `u_mouse` + `u_resolution`. Move cursor → ribbons tug. Mention DPR capped 1.5, rAF paused on `hidden`, `prefers-reduced-motion` → static CSS gradient + same scrim (text stays 7:1). Click “View shader source” → show commented `shader.ts`.

- `/3d`: procedural torusKnot hero by default (never empty), drag-drop a `.glb` or click DamagedHelmet/Avocado sample, configurator (color/metalness/roughness/wireframe/env). Note lazy `ViewerCanvas` (282kB gzip) only at `/3d` so Home not penalized.

### 3:50–4:10 — Limitations + close (honesty reads as credibility)

> **[LIMITATION on camera]** “One limitation I’m not hiding: the main chunk is still ~1 MB (React 19 + Firebase) — Lighthouse Home is 93 perf not 100, TBT 180ms. I lazy-split 3D/shader and image sizing (CLS 0.08→0.01, LCP 3.1→2.2s), but a proper `manualChunks` split for Firebase is next. Also, without `VITE_OMDB_API_KEY` it’s 8 mocks — demo mode — so niche search returns curated titles, not live data. Both are in `HARDENING.md` as known limitations.”

- Close on production URL + README + `INDEX.md` (one link per deliverable) + `RETROSPECTIVE.md`.

> “Full setup/usage/arch/eval/limitations and the honest ‘how AI built this’ table are in the README — clone, `npm i`, `cp .env.example .env`, `npm run dev` reproduces everything. Thanks — link + timestamps are in the description.”

---

### Checklist before you hit record

- [ ] `npm run build` passes, `https://cinescope-phi-ebon.vercel.app` + `/chat` + `/shader` + `/3d` all 200
- [ ] If Vercel age header >1h, Redeploy so `index-yJ-mYIyQ.js` is live
- [ ] DevTools → no console errors on Home → Chat → Shader flow
- [ ] Mic test, 1080p, production URL visible in address bar the whole time (no localhost)
- [ ] Say the decision + limitation lines verbatim (evaluation criteria)
- [ ] Keep to 3–5 min (use timestamps above — skip a tool demo if over)

