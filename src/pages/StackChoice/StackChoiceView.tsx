export function StackChoiceView(){
  return (
    <div className="page" style={{maxWidth:900, margin:"0 auto"}}>
      <div className="card" style={{padding:24}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>GENERAL AI FLUENCY · WEEK 4 · THREE ROADS: CHOOSE YOUR STACK WITH AI</div>
        <h1 style={{margin:"8px 0 6px", fontSize:28, fontWeight:800, letterSpacing:"-0.02em"}}>Stack Rationale — Why Vite + React on Vercel</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · Constraints given to AI: <strong>free only</strong> · skill: React 19 + TS, Firebase basics, full-stack but solo · portfolio needs: Home (hero + Work grid) / Work (case studies lead strongest) / About / Contact, each with ordered sections + CTA laddering to "Start your build" · work must show as <strong>image galleries (1280/375 clean captures), embedded live demo, code repo link, long-form 3-beat case study</strong> · dynamic yet? favourites per-user only, no CMS yet. Source: <a href="https://aifluency.flyrank.ai/week-04.html#three-roads" target="_blank" rel="noopener" style={{color:"#06b6d4"}}>week-04.html#three-roads</a></p>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>Constraints I pasted to AI (verbatim)</h2>
        <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12, marginTop:10, fontFamily:"monospace", fontSize:12, lineHeight:1.6, whiteSpace:"pre-wrap"}}>{`Free only. Honest skill: Intermediate React 19 + TS (Vite), Tailwind, Firebase Auth/Firestore basics, GSAP/Three for portfolio — no DevOps team, solo. Portfolio sitemap: Home (Hero > Selected Work grid lead CineScope > How I work > Stack > Final CTA), Work (CineScope lead > Brew & Co > CivicSentinel > Archive), About (bio + timeline + testimonials), Contact (form + links). Every page has a named CTA, all ladder to "Start your build → email". Work display: clean cropped screenshots (1280 + 375, no browser chrome), embedded live demo iframe/link, GitHub repo link, 3-beat reading (Problem → What I did → What came of it) + metrics. Dynamic yet? Only favourites per-user (Firestore + LS fallback), otherwise static.`}</div>
        <div className="muted small" style={{marginTop:8}}>I asked AI: "Give me three stack options simplest → most powerful, each: how build, where host free, needs backend? trade-off."</div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>Three options AI laid out (I pressure-tested)</h2>
        <div style={{display:"grid", gap:12, marginTop:12}}>

          <div style={{background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:14}}>
            <div style={{fontWeight:800, fontSize:13, color:"#38bdf8"}}>A · Simplest — Static HTML + GitHub Pages (no build)</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}>
              <strong>Build:</strong> one index.html + CSS, copy-paste sections, images in /images. <strong>Host:</strong> GitHub Pages (free, same repo). <strong>Backend?</strong> No.<br/>
              <strong>Trade-off:</strong> Cheapest, zero tooling, fastest to ship — but no components, no reusable case template, every edit is manual HTML; galleries become hand-cut, no lazy/route, and adding a second case is copy-paste. Shows work as images but not as code quality.
            </div>
            <div style={{fontSize:12, color:"#f5d76e", marginTop:6}}><strong>Pressure test:</strong> Breaks when I need the second case — I would duplicate HTML and drift. Maintainable for 1 page, not for 4 cases + responsive + a11y.</div>
          </div>

          <div style={{background:"#0f2a14", border:"1px solid #1a4a22", borderRadius:10, padding:14}}>
            <div style={{fontWeight:800, fontSize:13, color:"#4ade80"}}>B · Chosen — Vite + React 19 + TS (SPA) + Vercel + Firebase client-only ★</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}>
              <strong>Build:</strong> Vite SPA, React Router, MVVM (Model/ViewModel/View), Tailwind, single source <code>portfolio.ts</code> / <code>cinescope services</code>. <strong>Host:</strong> Vercel (free hobby, auto-deploy on git push, CDN, alias). <strong>Backend?</strong> Not yet — Firestore client SDK + localStorage fallback for favourites; env read-only; no server. API (OMDb, Anthropic) called client-side with key guard + mock fallback.<br/>
              <strong>Trade-off:</strong> Real component reuse (MovieCard, AiPanel), responsive grid, a11y, fast edits (add case = one object in data). Free, fits my React skill, shows code + live demo + images together. Cost: 800k JS chunk until code-split; key is client-side until I add a proxy — acceptable for portfolio/demo.
            </div>
            <div style={{fontSize:12, color:"#c9f5c9", marginTop:6}}><strong>Pressure test:</strong> Simplest that still displays work properly — galleries as lazy images, demo as link/embed, repo linked, 3-beat reading in data. Can finish in 2 weeks (I did). Maintainability: high — one data file, one build, Vercel rollback in 30s. If I need SSR later, I can migrate to Next.js without rewriting cases.</div>
          </div>

          <div style={{background:"#1a1200", border:"1px solid #3a3000", borderRadius:10, padding:14}}>
            <div style={{fontWeight:800, fontSize:13, color:"#fbbf24"}}>C · Most powerful — Next.js 14 + Vercel + Serverless (API routes) + DB + Auth</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}>
              <strong>Build:</strong> Next App Router, SSR/ISR for SEO, API routes for /api/chat proxy (hides Anthropic key), DB (Postgres/PlanetScale) + Auth. <strong>Host:</strong> Vercel (free but functions + DB free tier limits). <strong>Backend?</strong> Yes — serverless functions, env server-only, streaming SSE.<br/>
              <strong>Trade-off:</strong> Best SEO, hides keys, can stream properly, scales — but I maintain server code, env, migrations, and Next cache; finish in 2 weeks is tight solo, and overkill when portfolio is mostly static galleries + one client-side favourites feature.
            </div>
            <div style={{fontSize:12, color:"#f5d76e", marginTop:6}}><strong>Pressure test:</strong> Most powerful to maintain: more moving parts, more docs, slower iteration. I would pick it only when I need hidden keys + SEO at scale — not for Week 4 "show work as galleries/demo/repo". It would delay shipping.</div>
          </div>

        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>Decision — in my own words</h2>
        <div style={{background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:10, padding:14, marginTop:10, fontSize:13, lineHeight:1.7}}>
          <p style={{margin:0}}><strong>Chosen: B — Vite + React 19 + TS on Vercel, client-only Firebase.</strong> Why: it is free, matches what I already ship (aditya-dixit.vercel.app and cinescope-phi-ebon.vercel.app both on this stack), and displays my kind of work the way it needs to be shown — responsive image galleries, embedded demo link, repo link, and long-form case study from one data source. I did not choose A because hand HTML would break the moment I add the second case and would not prove React skill. I did not choose C because I can not maintain a DB + API layer in two weeks solo, and I do not yet need a backend — favourites already work via Firestore client + LS fallback, and chat streams via client mock with server fallback later. The honest backend answer is <strong>"not yet"</strong>.</p>
          <p style={{margin:"10px 0 0"}}><strong>Can I maintain this?</strong> Yes — one Vite build, one <code>src/data/portfolio.ts</code> (or <code>src/services</code> for cinescope), Vercel auto-deploy + one-click rollback, no server to patch. Next case is a short paste, not a rebuild. If I need to hide the Anthropic key or add SSR, I can extend B into C later without rewriting cases.</p>
          <p style={{margin:"10px 0 0"}}><strong>Does it show my work well?</strong> Yes — galleries are clean crops at 1280/375, demo is live at / and /chat, repo is linked, and the 3-beat case study lives beside the screenshots. That is exactly what a Frontend AI Engineering reviewer needs to click.</p>
        </div>
        <div className="muted small" style={{marginTop:8}}>Live evidence: Vercel deployments 541d8ab → cinescope-phi-ebon.vercel.app (also aditya-dixit.vercel.app) · Source: src/config/aiConfig.ts, api/chat.ts, src/playground/ · This page is the rationale. AI gave options; I decided.</div>
      </div>
    </div>
  );
}
