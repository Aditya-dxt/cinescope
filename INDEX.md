# Final Package — Index of Every Deliverable (FL-10)

> One link for every checkpoint. If it’s not here, it doesn’t exist. → **Start here:** https://cinescope-phi-ebon.vercel.app

**Repo:** https://github.com/Aditya-dxt/cinescope · **Main @ 9e6fc7e** (FE-11) + this index · **Live production:** https://cinescope-phi-ebon.vercel.app

---

## 0) How to run (stranger test)

```bash
git clone https://github.com/Aditya-dxt/cinescope.git && cd cinescope
npm install
cp .env.example .env   # VITE_OMDB_API_KEY=demo already works (mocks); add real key for live OMDb
npm run dev            # http://localhost:5173
npm run build && npm run preview  # prod check
```

---

## 1) Track deliverables — every assignment linked

| # | Track / Code | Assignment | Live URL | Source / Docs |
|---|---|---|---|---|
| 1 | FE Week 3 | Home — OMDb search + 20 discovery titles + favourites | [/](https://cinescope-phi-ebon.vercel.app/) · [/health](https://cinescope-phi-ebon.vercel.app/health) | `src/pages/Home/` · `src/services/omdbService.ts` |
| 2 | FE Week 3 | Favourites per-user (Firestore + localStorage) + Auth | [/favourites](https://cinescope-phi-ebon.vercel.app/favourites) · [/auth](https://cinescope-phi-ebon.vercel.app/auth) | `src/pages/Favourites/` `src/pages/Auth/` `src/services/favouritesService.ts` |
| 3 | FE-06/07 Week 8 | Streaming Chat + server tools (Zod, 4 states) | [/chat](https://cinescope-phi-ebon.vercel.app/chat) | `api/chat.ts` (edge, 30s, rate limit) · `src/tools/movieTools.ts` · `src/pages/Chat/ChatView.tsx` |
| 4 | FE-AA2 Week 7 | 3D Product Viewer (R3F + drei, drag-drop GLB, configurator) | [/3d](https://cinescope-phi-ebon.vercel.app/3d) · [/viewer](https://cinescope-phi-ebon.vercel.app/viewer) | `src/pages/ThreeD/` (lazy ViewerCanvas) |
| 5 | FE-AA3 Week 8 | Shader Hero — fullscreen GLSL aurora (u_time/mouse/resolution) | [/shader](https://cinescope-phi-ebon.vercel.app/shader) · [/hero](https://cinescope-phi-ebon.vercel.app/hero) | `src/pages/ShaderHero/shader.ts` + `ShaderHeroView.tsx` |
| 6 | FE-10 Week 7 | A11y + Perf Audit | Live + [AUDIT.md](./AUDIT.md) | `AUDIT.md` — Lighthouse 93/98, WAVE 0, keyboard pass |
| 7 | GAF Week 7 | Break Your Own Site — Hardening | Live + [HARDENING.md](./HARDENING.md) | `HARDENING.md` — 9 fix-now vs 6 known limitations |
| 8 | GAF Week 7 | Plant Your Flag — Domain + Badge + Analytics | [Production](https://cinescope-phi-ebon.vercel.app) · [/robots.txt](https://cinescope-phi-ebon.vercel.app/robots.txt) · [/sitemap.xml](https://cinescope-phi-ebon.vercel.app/sitemap.xml) · [/og.png](https://cinescope-phi-ebon.vercel.app/og.png) | `index.html` (OG/Twitter/canonical/json-ld), `public/` assets, `src/App.tsx` (`<Analytics />` + badge footer + titles) |
| 9 | FE-11 Week 8 | Production + README (this checkpoint) | [Production](https://cinescope-phi-ebon.vercel.app) · [README.md](./README.md) | `README.md` (FE-11 gate) · `vercel.json` (`maxDuration:30`) · `api/chat.ts` (rate limit + caps) |
| 10 | FL-09 Week 8 | Documentation + Demo (this package) | [README.md](./README.md) · [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) · Demo video (link below) | See §2 |
| 11 | FL-10 Week 8 | Retrospective + Final Package + Post | [RETROSPECTIVE.md](./RETROSPECTIVE.md) · [POST.md](./POST.md) · This index | See §3 |

---

## 2) FL-09 — README + Demo

- **README:** [`README.md`](./README.md) — what it does / for whom, setup a stranger can follow, usage examples, architecture sketch, **eval results (v2)** (Lighthouse before/after, WAVE, axe, TBT/CLS/LCP), limitations, and honest AI usage table (How AI tools actually built this).
- **Eval results (v2, summarized — full in `AUDIT.md`):** Home mobile 78→93 perf / 82→98 a11y, Chat 79→92/84→98, 3D 71→88/86→98; CLS 0.08→0.01 (width/height), LCP 3.1s→2.2s (preconnect + lazy), TBT 420→180ms; WAVE 4→0 errors; main 1,018kB (302kB gzip) + lazy ViewerCanvas 282kB gzip + ShaderHero 4.5kB gzip.
- **Demo video (3–5 min, live run, no slides):** **TODO — record and replace this line with Loom/YouTube link** — script in [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) (timestamps, narration, one decision + one limitation on camera). Until uploaded, verify live via Section 4 below.

---

## 3) FL-10 — Retrospective + Hours + Site + Post

- **Retrospective (500–800 words, written for Week-1 me):** [`RETROSPECTIVE.md`](./RETROSPECTIVE.md) — what I set out to do, what changed, what I'd build next, 3 most transferable learnings.
- **Hours log:** Completed in **internship.flyrank.ai → Schedule/Hours** — cross-check timestamps vs git log (`git log --oneline --since="2026-08-01"` shows ~30h build+polish; plausible against portal).
- **Live site on FlyRank domain:** https://cinescope-phi-ebon.vercel.app (clean fallback subdomain — acceptable per Plant Your Flag brief; personal domain is pizza-cost, fallback allowed. To point `cinescope.yourdomain.com`: Vercel → cinescope → Settings → Domains → Add → `cname.vercel-dns.com` → 2 min, no code change — canonical already set).
- **Build-in-public post (one real decision + one real limitation):** [`POST.md`](./POST.md) — draft for LinkedIn/X + FlyRank showcase thread. Publish and paste URL here: **TODO — post link**.

---

## 4) Quick verify (reviewer — 5 minutes)

```bash
curl -I https://cinescope-phi-ebon.vercel.app/                # 200 + HTTPS
curl https://cinescope-phi-ebon.vercel.app/robots.txt             # Allow + Sitemap
curl https://cinescope-phi-ebon.vercel.app/sitemap.xml            # 5 urls
open https://www.opengraph.xyz/ → paste URL → card + og.png
# App: / → search "Inception" → favourite (needs /auth if logged out) → /chat → try "lookup Dune" / "score Dune as intense" → tool cards
# Polish: /shader → move cursor → ribbons tug; /3d → drop a .glb or use samples
```

Vercel project `prj_xBXNHwfchBTLpnzkg6ZC1Db9YESe` · team `aditya-dixits-projects-06f0b598` · if Deployments shows stale `index-*.js` (age header >1h), **Redeploy** — new hashes `index-yJ-mYIyQ.js` / `ShaderHeroView-B-SY6i7a.js`.

---

## 5) Submission package (what to paste in portal)

- **Deliverable (FL-09):** `https://github.com/Aditya-dxt/cinescope` (README) + demo video link (`DEMO_SCRIPT.md` until uploaded)
- **Final (FL-10):** This index + `RETROSPECTIVE.md` + hours log (portal) + `https://cinescope-phi-ebon.vercel.app` + `POST.md` link
- **Pass gate:** Every link above is 200, stranger can `git clone → npm i → cp .env.example .env → npm run dev`, eval + limitations not hidden, video is live run with narration.

