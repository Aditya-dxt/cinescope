# Build in Public — draft post (FL-10) — one real decision + one real limitation

> Copy to LinkedIn + X + FlyRank showcase thread. Add links before posting. Keep the video link once recorded.

---

**I shipped my first real production app — CineScope — and learned that validation is the feature.**

For 8 weeks in the FlyRank Frontend AI Internship I kept thinking the demo was the proof. It’s not. The README a stranger can clone from, the hardening doc that says where it breaks, and the 4-minute video where you watch it run — that’s the proof.

**CineScope** → https://cinescope-phi-ebon.vercel.app · repo https://github.com/Aditya-dxt/cinescope
Movie discovery that actually decides: 20 titles on load, instant OMDb search, per-user favourites (Firestore with localStorage fallback so it works without keys), plus AI that *stays in the box* — mood → 3 validated picks from what’s on screen, and a streaming chat with server tools that render as cards, not JSON.

**One decision that changed everything:** I stopped trusting the model and started trusting the validator. `aiService` strips fences, parses JSON, checks exactly 3 picks + required fields, and *rejects any imdbID not in the 20 I sent* — hallucination → deterministic fallback. Chat tools are Zod-validated with four rendered states (input-streaming → input-available → output-available/error) and a confirm dialog before “add to watchlist.” That’s how 3 picks stay honest.

**One limitation I’m saying out loud:** the main chunk is still ~1 MB (React + Firebase) — Lighthouse Home is 93 perf, not 100. I lazy-split the 3D viewer and shader (so Home never pays) and fixed CLS 0.08→0.01 / LCP 3.1→2.2s with image sizing + preconnect, but a proper `manualChunks` split for Firebase is next. Also, no OMDb key = 8 mocks (demo mode) — fine for reviewers, not live data.

**What that unlocked:** fullscreen GLSL aurora at `/shader` (`u_time`/`u_mouse`/`u_resolution`, DPR capped, `prefers-reduced-motion` fallback), drag-drop GLB viewer at `/3d` (lazy), edge streaming at `/chat` with `maxDuration:30` + 15/min/IP rate limit so strangers can’t drain credits, and docs that close the loop — `AUDIT.md` (78→93 perf), `HARDENING.md` (9 fix-now vs 6 known), `RETROSPECTIVE.md` (650 words for Week-1 me).

Built with Claude for scaffolding — every block read, tested, fixed by me. The “How AI built this” table in the README names it (scaffold → review → `npm run build` + break tests → commit). Saying “I built this with Claude and here’s what I checked” reads as credibility, not weakness.

Full package → `INDEX.md` in the repo (one link per deliverable) + demo video (link in comments once rendered) + `RETROSPECTIVE.md`.

Thanks to FlyRank + the cohort — this is the first thing I’ve shipped that I’d hand to a recruiter without caveats. Next: Playwright e2e + Lighthouse CI gate, then Redis global limit.

#BuildInPublic #FrontendAI #WebGL #ShipIt

---
*Tags:* FlyRank AI Internship, Frontend AI Engineering, Week 8 capstone
*Links to add:* Demo video (Loom/YouTube unlisted) · INDEX.md · RETROSPECTIVE.md
*Image:* public/og.png (1200×630) — the real OG share card
