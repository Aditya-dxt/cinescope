# Retrospective — written for Week-1 me (FL-10)

*Aditya Dixit · CineScope · Week 8 · ~650 words · Aug 2026*

Week 1 I showed up thinking I was here to ship a “nice movie site” and polish my portfolio templates for Gumroad. I could already build a Vite + React grid, I’d seen the Ishak session (prompt → OMDb search), and I assumed AI would do the heavy lifting if I just prompted well enough. I planned to chase visuals — hero, glass, animations — and treat docs/tests as afterthoughts.

What I actually set out to do by Week 3 was narrower and better: build **one** real production product that a recruiter could clone and run, with AI that *constrains* itself instead of chatting generally. That meant 20 discovery titles on load (not an empty state), per-user favourites that work without Firebase, and two AI surfaces — `AiPanel` (mood → 3 validated picks from what’s on screen) and `/chat` (streaming + server tools that render as cards). The idea was small enough to finish well and real enough to demo honestly.

What changed is how I think about shipping. Four things broke my Week-1 posture:

**1. Validation beats clever prompting.** My first `aiService` draft trusted Claude’s JSON. Week 3 I added `validateAndMap` — strip fences, parse, check length 3 + required fields + trim, and reject any `imdbID` not in the 20 I sent. Hallucination went from “possible” to “caught → deterministic fallback (sort by Year).” Same for chat tools: Zod schemas + `execute` + four rendered states (`input-streaming` → `input-available` → `output-available`/`output-error`) as real components, not dumps. That habit — *don’t trust the model, trust the validator* — is now default.

**2. The full loop matters more than the hero.** I wanted to start with the shader and 3D. The track forced the opposite: load/create geometry → light/stage → interact → ship responsibly. So `/shader` is a raw WebGL fullscreen triangle with `u_time`/`u_mouse`/`u_resolution`, but also DPR capped 1.5, `visibilitychange` pause, `prefers-reduced-motion` CSS fallback, and a dark scrim so the headline stays 7:1. Same for `/3d`: it’s lazy (`ViewerCanvas` 282kB gzip only at `/3d`), DRACO via gstatic, blob URL revoke — so Home stays 93 perf instead of paying the 3D tax. I learned to measure the budget *before* the effect.

**3. “Break your own site” is a skill, not a phase.** Week 7 I stopped demoing the happy path and started trying to break it: empty/200-char email, `!!!@@@`/`<script>`/500-char search, 5k chat paste, double Send while streaming, drop `.txt` on the 3D, 375px + reduced-motion + no-JS + 3G. That found 9 fix-nows (OG/social missing, auth double-submit race, search/Chat caps, `noscript`, etc.) and named 6 known limitations I won’t hide (1 MB main chunk, demo mocks, no pagination). Shipping with a `HARDENING.md` that says “here’s where it breaks” felt more credible than pretending it doesn’t.

**4. Production is a checklist, not vibes.** FE-11 made me treat `api/chat.ts` as a real endpoint: `runtime: edge`, `maxDuration: 30`, 32k body cap, 20 turns/2k per message/12k total, 15/min/IP rate limit with 429 + Retry-After *before* any Anthropic spend, client mirrors the same caps + `AbortController` Stop. Plus `robots.txt`/`sitemap.xml`/`og.png` 1200×630/canonical/json-ld, dynamic titles per route, and a README a stranger can actually follow. Cross-browser pass (Chrome/Firefox/Safari/iOS) on 375/768/1280 is now part of “done.”

What I’d build next: first, split the 1 MB main chunk (`manualChunks` for `firebase`/`three`/`drei`), add `fetchpriority=high` on LCP poster and poster `srcset`, then Playwright e2e (search → AI → favourite persists) + Lighthouse CI gate (≥85 perf, 0 axe). After that, Upstash Redis for global rate limit (in-memory is per-region), OMDb pagination + infinite scroll, and dynamic OG per movie via edge function.

**Three most transferable things I learned:**

1. **MVVM + dual-write as a habit.** Models pure, ViewModels own state, Views presentational; services never import React. Firestore when present, `localStorage` mirror `cinescope_favs_{uid}` otherwise — so auth/favourites work offline and the app never needs keys to be reviewable. I’ll use this shape for every frontend.

2. **Structured output + fallback as respect for the user.** Whether it’s 3 picks or a tool result, validate, map, and fall back deterministically. Show the provider badge (“Claude” vs “Fallback (reason)”) so the UI is honest about what happened. That’s how you keep AI *augmenting* taste instead of replacing judgment.

3. **Docs and demo as part of the product.** `README.md` (setup/usage/arch/decisions/“how AI built this”/eval), `AUDIT.md` (78→93 perf with CLS/LCP deltas), `HARDENING.md` (triage), `INDEX.md` (one link per deliverable), and a 3–5 min live demo with one limitation said out loud — those artifacts keep working after graduation. I used to think building was the proof; now I think *telling the true story* is.

If I could hand Week-1 me one line: “Ship the smallest real thing, validate everything the model returns, and write the index before you think you need it — that’s what makes it hirable.”

