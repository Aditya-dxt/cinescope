export function AgentSpecView(){
  return (
    <div className="page" style={{maxWidth:900, margin:"0 auto"}}>
      <div className="card" style={{padding:24}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>FL-06 · DESIGN YOUR PERSONAL AGENT · WEEK 5 · 4H · 1-2 PAGE SPEC</div>
        <h1 style={{margin:"8px 0 6px", fontSize:30, fontWeight:800}}>CineScope Scout — Weekly Watchlist & Portfolio Draft Scout</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · Deliverable: agent design doc, done my way. Scope: <strong>~10 build hours</strong>. Spec covers job, user, frequency, tools/data + access, instructions, 5 eval cases, risks & guardrails, platform justification.</p>
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <span className="alert" style={{background:"#0f2a14", border:"1px solid #1a4a22", fontSize:11}}>Job: research scout</span>
          <span className="alert" style={{fontSize:11}}>10h scope</span>
          <span className="alert" style={{fontSize:11}}>5 eval cases pre-build</span>
          <span className="alert" style={{background:"#0f172a", border:"1px solid #1e293b", fontSize:11}}>Guardrails + platform justified</span>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>1 · Job for the agent</h2>
        <div style={{fontSize:13.5, lineHeight:1.7, marginTop:8}}>
          <p style={{margin:0}}><strong>Job:</strong> Research Scout that runs weekly and delivers two things in one draft: (a) <strong>5 watchlist candidates</strong> tailored to my vibe (cozy/intense/fun/mind-bending) with OMDb-grounded cards, and (b) one <strong>portfolio case draft</strong> from my newest GitHub repo + live URL — so I never stare at a blank portfolio page. The agent does gather → filter → draft; I decide to publish.</p>
          <p style={{margin:"8px 0 0"}}>Open proposal welcome — scope consciously sized to ~10h: no inbox write, no auto-publish, no training. It drafts, I approve. If the brief takes longer than 10h I cut the case-draft part and ship watchlist-only first.</p>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>2 · User · Frequency</h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:8}}>
          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12}}>User</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}>Me (Aditya) — Frontend AI Engineering intern, solo builder. Reads brief on phone, edits on laptop. Wants 5 tasteful picks + one case paragraph without hunting 20 tabs.</div>
          </div>
          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12}}>Frequency</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}><strong>Weekly, Sunday 9am Asia/Kolkata, plus on-demand</strong> via "Run scout now" button in /chat. Weekly cadence matches watchlist refresh + portfolio shipping rhythm; on-demand covers new repo pushes.</div>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>3 · Tools · Data needed · Access plan (every source has a plan)</h2>
        <div style={{display:"grid", gap:10, marginTop:10}}>
          <div style={{background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:12}}>Tools (MCP / connectors the agent may call)</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li><strong>lookupMovie</strong> — <code>src/tools/movieTools.ts</code> Zod <code>{`{title}`}</code> → OMDb fetch; agent chooses it to ground picks. Access: <code>VITE_OMDB_API_KEY</code> already in Vercel env; mock fallback if missing.</li>
              <li><strong>getWatchScore</strong> — Zod <code>{`{title, vibe}`}</code> → score + chart breakdown; agent scores vibe fit.</li>
              <li><strong>read_file / search_files</strong> (filesystem MCP) — read <code>src/data/portfolio.ts</code>, README, screenshots existence.</li>
              <li><strong>web_extract / fetch</strong> — pull live URL + GitHub README for portfolio case draft.</li>
              <li><strong>write_draft</strong> (local file, not publish) — writes to <code>/drafts/scout-YYYY-MM-DD.md</code> for human review. Never <code>git push</code> directly.</li>
            </ul>
          </div>
          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12}}>Data needed</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li>Watch history/vibe: localStorage <code>cinescope_chat</code> + vibe enum (cozy/intense/fun/mind-bending) — free, local.</li>
              <li>OMDb catalog: 20 titles from <code>initialMovies</code> seed + on-demand search — free tier, already integrated.</li>
              <li>Portfolio source: GitHub repo file list + live URL crawl + 2 screenshots (1280/375) — filesystem + fetch, free.</li>
              <li>No email/paid DB needed for v1 — keeps scope to 10h and free paths.</li>
            </ul>
          </div>
          <div style={{background:"#0f2a14", border:"1px solid #1a4a22", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12}}>Access plan (realistic)</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li>OMDb: env key on Vercel; if 429 → backoff + mock; if missing → mock with "mock" badge (no break).</li>
              <li>Filesystem: Hermes/MCP <code>read_file</code> allowlist to <code>~/projects/cinescope</code> + <code>portfolio</code> — no secrets read.</li>
              <li>Web: <code>web_extract</code> with 15s timeout, 15k char cap — no paywall bypass.</li>
              <li>Claude: <code>ANTHROPIC_API_KEY</code> server-side in <code>api/chat.ts</code> (streamText + tools) — never VITE_. Local mock when absent.</li>
              <li>All free: GitHub free, Vercel hobby, Anthropic free tier + mock, no n8n cloud needed.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>4 · Draft instructions (what the agent is told)</h2>
        <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12, marginTop:10, fontFamily:"monospace", fontSize:12, lineHeight:1.6, whiteSpace:"pre-wrap"}}>{`You are CineScope Scout, a concise research scout (not a publisher).

Context: portfolio palette #0A0A0F/#FFFBF5, Inter font, quiet frame so work is loudest; vibe enum cozy|intense|fun|mind-bending.

On trigger (weekly Sunday 9am or "Run scout now"):
1. Read last 10 chat vibes from localStorage; pick dominant vibe or ask if tie.
2. Call lookupMovie for 8 candidates from OMDb seed, filter to 5 with getWatchScore (keep score>=6.5, diverse genres).
3. Draft watchlist brief: 5 cards (Title Year Rated Runtime Genre imdbRating Poster Plot 1-line Score+verdict), no hallucinations — cite OMDb Source.
4. If a new repo exists since last draft (git log), call web_extract on its live URL + README, draft one portfolio case in 3-beat (Problem 1 line, What I did 2 bullets, What came of it + live/repo/metric) 110-140w. If missing screenshot/metric write [NEED: ...] — never invent.
5. Write both to /drafts/scout-YYYY-MM-DD.md and show in /chat as tool cards + brief. Do not git push. Ask: "Publish watchlist? Draft case?" — wait for human Confirm.

Style: concise, no adjectives without citation, prefer verbs first.`}</div>
        <div className="muted small" style={{marginTop:6}}>Instructions are the triad's third leg (model + tools + instructions) — small, testable, versioned in <code>src/config/aiConfig.ts</code> next to systemPrompt.</div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>5 · Five eval cases (defined before building — Your AI Product Needs Evals)</h2>
        <div style={{display:"grid", gap:8, marginTop:10}}>
          {[
            {id:"E1", name:"Happy path — cozy", input:"History: cozy ×3, prompt: Run scout now", expect:"5 cards, all Score>=6.5, diverse genres, one case draft from newest repo (SneakerVault) with real OMDb Source, no [NEED] when screenshots exist", pass:"All cards render as ToolCard output-available, case 110-140w, file written to /drafts/"},
            {id:"E2", name:"Input streaming visible", input:"Type 'lookup Dune' slowly", expect:"Tool shows input-streaming → input-available → output-available with distinct visuals, 200ms morph, not JSON dump", pass:"Checked in /chat demo: lookup Inception morphs"},
            {id:"E3", name:"No new repo", input:"No git diff since last draft", expect:"Watchlist still delivers 5, portfolio section says '[No new repo since YYYY-MM-DD — watchlist only]'", pass:"No hallucinated case; brief still useful"},
            {id:"E4", name:"OMDb 429 / offline + malformed", input:"Throttle network, or type __fail_mid__ / __fail_malformed__", expect:"Mid-stream shows designed 'Stream interrupted' + Retry (not crash); malformed tool → output-error red card with retry; Retry re-sends only failed message, partial preserved", pass:"FE-08 checkpoint already verified: Retry works, double-click safe"},
            {id:"E5", name:"Missing screenshot/metric guardrail", input:"New repo but no 1280 screenshot", expect:"Case draft contains [NEED: screenshot 1280] and does not invent metric; draft not auto-pushed; human gate required", pass:"Agent writes draft only, never git push; human must Confirm"},
          ].map(e=>(
            <div key={e.id} style={{border:"1px solid var(--border)", borderRadius:10, padding:12}}>
              <div style={{fontWeight:800, fontSize:12}}>{e.id} — {e.name}</div>
              <div style={{fontSize:12, marginTop:4}}><strong>Input:</strong> {e.input}</div>
              <div style={{fontSize:12}}><strong>Expected:</strong> {e.expect}</div>
              <div style={{fontSize:12, color:"#4ade80"}}><strong>Pass:</strong> {e.pass}</div>
            </div>
          ))}
        </div>
        <div className="muted small" style={{marginTop:8}}>5+ cases before build — includes edge + failure + guardrail. E2 and E4 map to FE-07/08 tool states.</div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>6 · Risks & guardrails (what it must confirm, what it must never do)</h2>
        <div style={{display:"grid", gap:10, marginTop:10}}>
          <div style={{background:"#1a0f0f", border:"1px solid #7f1d1d", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:12, color:"#fca5a5"}}>Must NEVER do</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li>Never <code>git push</code> or publish portfolio without human Confirm (write_draft only).</li>
              <li>Never read secrets (<code>.env</code>, <code>ANTHROPIC_API_KEY</code> via VITE_) — server-side only.</li>
              <li>Never invent OMDb fields or Lighthouse scores — if missing, emit <code>[NEED]</code> and stop.</li>
              <li>Never call tools in a loop &gt;3 times without human review (loop budget).</li>
              <li>Never exfiltrate chat history — local only, no external DB in v1.</li>
            </ul>
          </div>
          <div style={{background:"#1a1a0f", border:"1px solid #92400e", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12, color:"#f5d76e"}}>Must CONFIRM before</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li>Publishing watchlist or case draft → dialog "Confirm publish?" (like /chat's "Add to watchlist?" tool).</li>
              <li>Overwriting an existing <code>/drafts/</code> file — ask to version instead.</li>
              <li>Using a new OMDb title outside the 20 seed set — show card first, confirm relevance.</li>
            </ul>
          </div>
          <div style={{background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12, color:"#38bdf8"}}>How guardrails are enforced</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li>Tool allowlist in <code>api/chat.ts</code> (only lookupMovie/getWatchScore/read_file/web_extract) — push not allowlisted.</li>
              <li>Instructions include "Do not git push. Ask: Publish?" — evaluated by E5.</li>
              <li>UI: confirmation dialog pattern already in /chat (role=dialog, Confirm/Cancel) — reused.</li>
              <li>Budget: agent loop max 3 tool calls, then "Need human review" message.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:16, fontWeight:800}}>7 · Build platform choice (justified vs alternative) — free paths only</h2>
        <div style={{display:"grid", gap:10, marginTop:10}}>
          <div style={{background:"#0f2a14", border:"1px solid #1a4a22", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:12, color:"#4ade80"}}>Chosen: Claude Project with connectors + Hermes-style scripted loop (free) ★</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}>
              <strong>How:</strong> Claude Project stores instructions + knowledge (identity kit, week-03 content map) + connectors for file/web; <code>api/chat.ts</code> streams with tools (lookupMovie/getWatchScore) via <code>streamText</code>; client at <code>/chat</code> renders tool parts. Scheduler is Vercel Cron (or manual "Run now"). All free: Vercel hobby, GitHub free, Anthropic free tier + mock fallback, no paid plan.
              <br/><strong>Why:</strong> I already ship this stack (cinescope-phi-ebon.vercel.app, 860k JS, Tailwind, Firebase free) — no new infra, no vendor lock, and tool cards already prove typed tool parts. 10h scope fits: 2h tools, 3h prompt, 3h UI/error states (reuse FE-07/08), 2h evals.
            </div>
          </div>
          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:12}}>Alternative considered: n8n agent workflow (self-hosted, free) — not chosen</div>
            <div style={{fontSize:13, lineHeight:1.6, marginTop:6}}>
              n8n would give visual scheduling and webhook triggers without code, and its free self-host covers the loop. <strong>Trade-off:</strong> adds a separate runtime to maintain, needs hosting/port mapping, and debugging tool Zod schemas is harder in a canvas than in <code>movieTools.ts</code>. For a research scout that mostly drafts markdown, the Project + scripted loop is simpler to review and to sabotage-test (FE-08 checklist) in one repo. I keep n8n as Phase 2 if weekly automation needs to run without me pressing a button.
            </div>
          </div>
          <div style={{fontSize:12, lineHeight:1.6}}>
            <strong>Also considered and rejected:</strong> Custom GPT (requires paid ChatGPT) and Claude Code (paid plan) — both violate "free paths only" and would not be runnable for reviewers without payment. Platform choice therefore meets "free, actually runnable" + scope ≈10h.
          </div>
        </div>
      </div>

      <div className="muted small" style={{textAlign:"center"}}>Scope ≈10h: tools 2h + instructions 1h + wiring streamText 2h + UI/error/empty 3h + evals 2h · All tools/data have realistic free access · 5 evals pre-build · Guardrails + platform vs alternative — all evaluation criteria covered.</div>
    </div>
  );
}
