# Deployment Checklist (FE-11) — CineScope

Date: 2026-08-27 · Owner: Aditya Dixit (adityadxt1910@gmail.com) · Env: production · URL: https://cinescope-phi-ebon.vercel.app

## Pre-deploy
- [x] `npm run build` passes (tsc -b + vite), no TS errors
- [x] `npm test` passes (8 tests, 4 suites) — MovieCard, aiService, omdb, AiPanel
- [x] `VITE_OMDB_API_KEY` set in Vercel env (fallback mock works without it, but prod has key)
- [x] `VITE_FIREBASE_*` set (Auth + Firestore); fallback to localStorage verified (demo without keys works)
- [x] `VITE_ANTHROPIC_API_KEY` optional — AI panel validates structured JSON and falls back deterministically when missing/429/parse fail; never hallucinates outside current result set
- [x] Routes: /, /favourites (protected), /auth, /health, /week03, /identity, /next-case — all lazy-safe, no 404 on refresh (Vercel rewrites)
- [x] A11y: labels on search + AI mood input, aria-busy on AI button, alt on posters, keyboard-accessible buttons (WCAG 2.1 AA — see audit)
- [x] Error states: OMDb error banner, empty state, offline-friendly skeletons, poster N/A fallback, AI fallback banner
- [x] Performance: lazy poster, no UI lib, 10kB CSS, 800kB JS (single chunk — future split). Lighthouse mobile 92 perf / 100 a11y aspirant (see below)

## Deploy
- [x] Connected GitHub Aditya-dxt/cinescope → Vercel project cinescope (aditya-dixits-projects-06f0b598)
- [x] Trigger: `git push main` → auto deploy; `vercel --prod` also works
- [x] Alias: cinescope-phi-ebon.vercel.app → current prod deployment (e.g. cinescope-bfxind4rw)
- [x] Env vars added in Vercel Dashboard → Production

## Verify (post-deploy)
- [x] `curl https://cinescope-phi-ebon.vercel.app/health` → 200
- [x] Home loads 20 random titles, search works, favourites per-user (register → add → persist on refresh)
- [x] AI Picks: enter mood → Ask AI → 3 structured cards + insight; without key shows Fallback badge
- [x] /favourites without auth redirects to /auth; logged-in persists
- [x] Lighthouse (run: `npx lighthouse https://cinescope-phi-ebon.vercel.app --view`): Perf 91-94, A11y 100, Best Practices 100, SEO 91 (see screenshot artifacts)
- [x] axe/WAVE: 0 violations on Home (landmarks, label, alt)

## Rollback / Monitor
- Rollback: Vercel → Deployments → previous Ready → Promote to Production (instant, <30s). Or `vercel rollback` / `git revert HEAD && git push`.
- Monitoring: Vercel Analytics + Web Vitals enabled; runtime errors logged to console + Vercel Functions logs (no PII). Health route doubles as uptime check.
- Known limitations documented in README.

Signed: Aditya Dixit — 2026-08-27
