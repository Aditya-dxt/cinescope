export function LaunchPlanView(){
  return (
    <div className="page" style={{maxWidth:900, margin:"0 auto"}}>
      <div className="card" style={{padding:24}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>GENERAL AI FLUENCY · WEEK 8 CAPSTONE</div>
        <h1 style={{margin:"8px 0 6px", fontSize:28, fontWeight:800, letterSpacing:"-0.02em"}}>Send the Link: Launch, Demo & Story — Next Case Plan</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · Portfolio: <a href="https://aditya-dixit.vercel.app" target="_blank" rel="noopener" style={{color:"#3b82f6"}}>aditya-dixit.vercel.app</a> · Repo: <a href="https://github.com/Aditya-dxt/Portfolio" target="_blank" rel="noopener" style={{color:"#3b82f6"}}>Aditya-dxt/Portfolio</a> · Folder: <code>C:/Users/adity/OneDrive/Desktop/portfolio</code></p>
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <span className="alert" style={{background:"#0f2a14", border:"1px solid #1a4a22", fontSize:12}}>Launch live</span>
          <span className="alert" style={{background:"var(--surface-2)", fontSize:12}}>Claude Project preserved: CLAUDE.md + AGENTS.md</span>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>1 · How to add the next case (concrete, not vague)</h2>
        <p className="muted small" style={{margin:"6px 0 0"}}>Where it goes + steps (reuse Week 2 three-beat shape: Problem → What you did → What came of it)</p>
        <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, padding:14, marginTop:12, fontSize:13, lineHeight:1.7}}>
          <div style={{fontWeight:700}}>Where:</div>
          <div>File: <code>src/data/portfolio.ts</code> → <code>portfolio.projects</code> array. Insert new object at index 0 (so it leads), before CivicSentinel AI. Assets: <code>/public/images/cinescope-preview.png</code> (1280px clean capture).</div>
          <div style={{marginTop:10, fontWeight:700}}>Steps (3-beat):</div>
          <ol style={{margin:"6px 0 0 18px"}}>
            <li><strong>Problem:</strong> fast movie discovery with per-user favourites, OMDb + Firebase.</li>
            <li><strong>What you did:</strong> MVVM, OMDb service with mock fallback, Firestore + LS dual-write, protected routes.</li>
            <li><strong>What came of it:</strong> Live URL + repo, Lighthouse perf, responsive 375/1280 proof.</li>
          </ol>
          <div style={{marginTop:10, fontWeight:700}}>Do then check:</div>
          <div>1) Add object → 2) npm run build → 3) capture 1280 + 375 → 4) git commit & push → 5) Vercel deploy → 6) paste new live link.</div>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>2 · Named next piece + why it is real</h2>
        <div style={{background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:12, padding:14, marginTop:12, display:"grid", gap:8}}>
          <div style={{fontWeight:700, fontSize:15}}>CineScope — Movie Discovery (FlyRank Week 3 React + AI, MVVM, OMDb, Firebase)</div>
          <div className="muted small" style={{lineHeight:1.6}}>Why next: already shipped and live at <a href="https://cinescope-phi-ebon.vercel.app" target="_blank" rel="noopener" style={{color:"#3b82f6"}}>cinescope-phi-ebon.vercel.app</a> + <a href="https://github.com/Aditya-dxt/cinescope" target="_blank" rel="noopener" style={{color:"#3b82f6"}}>Aditya-dxt/cinescope</a> with health check at /health and identity kit at /identity. Strongest proof not yet in portfolio.</div>
          <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:4}}>
            <span className="alert" style={{background:"#0f0f14", fontSize:12}}>Live: cinescope-phi-ebon.vercel.app</span>
            <span className="alert" style={{background:"#0f0f14", fontSize:12}}>Repo: Aditya-dxt/cinescope</span>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>3 · Reminder set — evidence</h2>
        <div style={{background:"#1a1a12", border:"1px solid #3a3000", borderRadius:12, padding:14, marginTop:12}}>
          <div style={{fontWeight:700, fontSize:13, color:"#f5d76e"}}>Concrete reminder (not vague intention)</div>
          <div style={{marginTop:8, fontSize:13, lineHeight:1.7}}>
            <div>• <strong>Cron:</strong> cinescope-next-case — daily 09:00 UTC from 2026-09-10 until shipped</div>
            <div>• <strong>Calendar:</strong> 2026-09-10 10:00 Asia/Kolkata — "Add CineScope case to portfolio"</div>
            <div>• <strong>Recurring note:</strong> weekly Friday check in portfolio README</div>
          </div>
          <div style={{marginTop:10, fontFamily:"monospace", fontSize:12, background:"#0f0f14", border:"1px solid var(--border)", borderRadius:8, padding:10, color:"#c9d1c9"}}>
            cron: cinescope-next-case · schedule: 0 9 * * * · next: 2026-09-10 09:00 UTC
          </div>
        </div>
        <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, padding:12, marginTop:12}}>
          <div style={{fontWeight:700, fontSize:13}}>Build context preserved</div>
          <div className="muted small" style={{marginTop:6, lineHeight:1.6}}>Claude Project = portfolio/CLAUDE.md + AGENTS.md + src/data/portfolio.ts. Knows voice, stack, identity kit. Next case is short conversation.</div>
        </div>
      </div>

      <div className="muted small" style={{textAlign:"center"}}>Deliverable for https://aifluency.flyrank.ai/week-10.html#send-the-link</div>
    </div>
  );
}
