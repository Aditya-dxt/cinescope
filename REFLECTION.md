# Reflection — CineScope (1 page)

**What was hardest? Why?**
Making AI *useful* not decorative. A generic chatbot is easy; a mood → 3 picks that never hallucinates outside the current OMDb result set is harder. I had to enforce structured JSON, validate every imdbID against the 20 titles in view, strip code fences, and fall back deterministically when the key is missing or rate-limited so reviewers see working AI even without a key. Edge-state design (loading skeletons, error banners, N/A posters, fallback badge) took longer than happy-path.

**What would I do differently next time?**
Split the JS bundle early (lazy AiPanel + Favourites), add a small API proxy so the Anthropic key never touches the browser, and store favourites with optimistic UI + undo. I would also add Playwright for one critical e2e (search → AI → favourite → persists after reload) instead of only unit tests, and run Lighthouse in CI to block regressions.

**One thing that surprised me**
How far MVVM + a single source of truth (services → models → viewModels) gets you with AI-assisted coding: I could regenerate a slice (e.g., aiService) without touching views, and reviewers can run `VITE_OMDB_API_KEY="" npm run dev` and still see a complete demo via mock + fallback. The discipline (prompt → validate → fallback) matters more than the model.
