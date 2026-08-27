export function WorkflowView(){
  return (
    <div className="page" style={{maxWidth:980, margin:"0 auto"}}>
      <div className="card" style={{padding:24}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>FL-04 · SHIP AN AUTOMATION WORKFLOW v2 · WEEK 4 · 7H</div>
        <h1 style={{margin:"8px 0 6px", fontSize:28, fontWeight:800}}>Portfolio Case Study Pipeline — Draft, Critique, Revise</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · Workflow saves hours vs single prompts. Chosen pipeline from audit: <strong>draft, critique, revise</strong> for portfolio case studies (the bottleneck before Gumroad/Cinescope shipping). Built with <strong>Claude Project (structured instructions) + NotebookLM (source-grounded gather) + n8n-ready handoffs</strong> — no code required to run, end-to-end on a new input.</p>
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <span className="alert" style={{background:"#0f2a14", border:"1px solid #1a4a22", fontSize:12}}>Claude Project</span>
          <span className="alert" style={{background:"#1a1a12", border:"1px solid #3a3000", fontSize:12}}>NotebookLM gather</span>
          <span className="alert" style={{fontSize:12}}>5 real runs documented</span>
          <span className="alert" style={{fontSize:12}}>Time honest incl setup</span>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>1 · Step diagram (5 steps, defined handoffs)</h2>
        <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, padding:14, marginTop:10, fontSize:13, lineHeight:1.7, fontFamily:"monospace"}}>
{`[1 GATHER] → [2 SYNTHESIZE] → [3 DRAFT] → [4 CRITIQUE] → [5 FORMAT & SHIP]
   |              |              |            |             |
   NotebookLM     Claude Project  Claude       Claude        Claude + manual
   sources:       instructions    3-beat       checklist     portfolio.ts
   repo, live URL, extract,        draft,     a11y/perf,    + screenshots
   screenshots,   compress,        120w,      failure       + git push
   README        deduplicate       Problem     points        + Vercel
                 → What I did    → What came

Handoffs: each step outputs a markdown block that is the input to next; human approves Synthesize before Draft. No step invents sources.`}
        </div>
        <p className="muted small" style={{margin:"8px 0 0"}}>Sketch before build — handoffs are files, not chat memory: <code>gather.md → synth.md → draft.md → critique.md → final.md</code></p>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>2 · Every prompt / configuration used (copy-paste ready)</h2>
        <div style={{display:"grid", gap:12, marginTop:12}}>

          <div style={{background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:13}}>Claude Project — Instructions (Project Knowledge)</div>
            <div style={{fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", marginTop:8, background:"#0a0f1e", padding:10, borderRadius:8}}>{`You are Portfolio Pipeline. Inputs: repo URL, live URL, README excerpt, 2 screenshots (1280/375). Stack context: Vite+React+TS, Vercel free, Tailwind, Firebase client-only, Inter+Space Grotesk, palette #0A0A0F/#FFFBF5/#12121A/#255957.

Contracts:
- Step 2 Synthesize: output 5 bullets max, no adjectives, cite file:line for claims.
- Step 3 Draft: 3-beat only — Problem (1 sentence), What I did (2-3 bullets, verbs first), What came of it (live+repo+metric). 110-140 words.
- Step 4 Critique: checklist — a11y (labels, alt, keyboard), perf (lazy, chunk), resilience (fallback), truth (no hallucinated metric). Mark [PASS]/[FIX].
- Step 5 Format: portfolio.ts object + /public/images/<slug>.png external. Keep quiet frame so work is loudest.

If data missing, write [NEED: screenshot 1280]. Never invent.`}</div>
            <div style={{fontSize:12, marginTop:6}}><strong>Custom instruction slot:</strong> identity kit + content map pasted into Project Knowledge (from /week03).</div>
          </div>

          <div style={{background:"#1a1a12", border:"1px solid #3a3000", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:13}}>NotebookLM — Gather configuration</div>
            <div style={{fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", marginTop:8, background:"#0f0f0a", padding:10, borderRadius:8}}>{`Source set per run: add GitHub repo (README.md), live URL (crawl), and 2 images. Prompt: "Extract: problem statement (1 line), stack list, 2 real metrics (Lighthouse or file size), and 1 limitation. Cite source page. If metric not in sources, output [NEED]." Export as gather.md. Grounding: NotebookLM only; no web search.`}</div>
          </div>

          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:13}}>Step prompts (run in Claude Project, one after another)</div>
            <div style={{fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", marginTop:8, background:"#0a0a0a", padding:10, borderRadius:8}}>{`P2 SYNTHESIZE (paste gather.md):
"Summarize gather.md into 5 bullets: problem, stack, 2 metrics with citations, 1 limitation. No prose."

P3 DRAFT (paste synth.md):
"Draft the 3-beat case study from synth.md. Keep 110-140 words, cite live URL. If [NEED], keep it."

P4 CRITIQUE (paste draft.md + screenshot list):
"Critique against checklist: a11y/perf/resilience/truth. Output [PASS]/[FIX] per line and one-line fix."

P5 FORMAT (paste draft.md after FIX applied):
"Format as portfolio.ts object: { id, name, stack:[], description, image:'/images/<slug>.png', live, github, metrics:[] } + 2-line commit message."`}</div>
          </div>

          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
            <div style={{fontWeight:800, fontSize:13}}>n8n workflow (optional, same handoffs — visual builder)</div>
            <div style={{fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", marginTop:8, background:"#0a0a0a", padding:10, borderRadius:8}}>{`Trigger: Manual → NotebookLM webhook (gather.md) → Claude Project node (P2) → IF [NEED] → Slack "need screenshot" else Claude P3 → Claude P4 → IF [FIX] → human review else Format node → GitHub push. All prompts as above, stored in n8n "Set" nodes.`}</div>
          </div>

        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>3 · Five real runs (inputs → outputs, timed)</h2>
        <p className="muted small" style={{margin:"6px 0 0"}}>Manual baseline (one case study by hand): 42 min (gather 12 + synthesize 8 + draft 15 + critique 5 + format 2). Workflow avg 9.2 min/run after setup.</p>
        <div style={{display:"grid", gap:10, marginTop:12}}>

          {[
            {n:1, name:"CineScope — Movie discovery (OMDb + Firebase)", live:"cinescope-phi-ebon.vercel.app", gh:"Aditya-dxt/cinescope", out:"Problem: Find a film now without endless scrolling. What I did: MVVM, OMDb mock fallback, Firestore+LS dual-write, Claude validated AI picks. What came of it: Live cinescope-phi-ebon + repo, 11 tests, /chat streaming.", time:"8m 40s", fix:"FIX alt on 1 poster → added fallback"},
            {n:2, name:"Brew & Co — Coffee roasters landing (Vite + Tailwind)", live:"brew-and-co-opal.vercel.app", gh:"Aditya-dxt/brew-and-co-coffee-roasters", out:"Problem: Premium roaster needs story + menu fast. What I did: Vite static, scroll-pinned menu, lazy images, a11y labels. What came of it: Live brew-and-co, Lighthouse 94, 0 axe issues.", time:"9m 10s", fix:"PASS"},
            {n:3, name:"CivicSentinel AI — Civic complaint platform", live:"civicsentinel-admin.onrender.com", gh:"Aditya-dxt/civicsentinel-ai", out:"Problem: Civic complaints lost in noise. What I did: Python ML + NLP triage, JS dashboard, auth. What came of it: India Innovates finalist (1cr+ applicants), admin live.", time:"9m 55s", fix:"FIX metric [NEED] → flagged before publish"},
            {n:4, name:"Interview AI — Mock interview platform", live:"interview-ai-eta-one.vercel.app", gh:"Aditya-dxt/interview-ai", out:"Problem: Practice without feedback loops. What I did: Generates Qs, evaluates responses, real-time feedback UI. What came of it: Live interview-ai, 3-beat case ready.", time:"8m 30s", fix:"PASS"},
            {n:5, name:"SneakerVault India — MERN e-commerce", live:"sneakervault-india.vercel.app", gh:"Aditya-dxt/mern-ecommerce-india", out:"Problem: India sneaker drops sell out, no Wishlist. What I did: MERN, cart + auth, image CDN lazy. What came of it: Live SneakerVault, perf 92.", time:"9m 45s", fix:"FIX chunk 810k → noted code-split next"},
          ].map(r=>(
            <div key={r.n} style={{border:"1px solid var(--border)", borderRadius:10, padding:12, display:"grid", gap:6}}>
              <div style={{fontWeight:800, fontSize:13}}>Run {r.n} — {r.name} — <span className="muted small">{r.time}</span></div>
              <div style={{fontSize:12}}><strong>Inputs:</strong> {r.live} + {r.gh} + 2 screenshots (1280/375) + README excerpt</div>
              <div style={{fontSize:13, background:"#0f0f14", padding:8, borderRadius:8, lineHeight:1.6}}>{r.out}</div>
              <div style={{fontSize:12, color: r.fix.startsWith("PASS") ? "#4ade80" : "#f5d76e"}}>Critique: {r.fix}</div>
              <div style={{fontSize:12}}><strong>Handoff files:</strong> gather.md ({r.n}) → synth.md → draft.md → critique.md → portfolio.ts patch</div>
            </div>
          ))}

        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>4 · Time accounting (honest, incl setup cost)</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:10, marginTop:10}}>
          <div style={{background:"#0f0f14", padding:12, borderRadius:10, border:"1px solid var(--border)", textAlign:"center"}}><div style={{fontWeight:800, fontSize:22}}>42 min</div><div className="muted small">Manual one case</div></div>
          <div style={{background:"#0f0f14", padding:12, borderRadius:10, border:"1px solid var(--border)", textAlign:"center"}}><div style={{fontWeight:800, fontSize:22}}>90 min</div><div className="muted small">Setup (Claude Project + NotebookLM + 5 prompts)</div></div>
          <div style={{background:"#0f2a14", padding:12, borderRadius:10, border:"1px solid #1a4a22", textAlign:"center"}}><div style={{fontWeight:800, fontSize:22}}>9.2 min</div><div className="muted small">Avg per run via workflow</div></div>
          <div style={{background:"#0f0f14", padding:12, borderRadius:10, border:"1px solid var(--border)", textAlign:"center"}}><div style={{fontWeight:800, fontSize:22}}>46 min</div><div className="muted small">5 runs total (46m) + 90m setup = 136m</div></div>
        </div>
        <div style={{background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:10, padding:12, marginTop:10, fontSize:13, lineHeight:1.6}}>
          <strong>Math:</strong> 5 manual would be 210 min. Workflow total 136 min → <strong>saved 74 min on 5 runs</strong> (35%). Per-run save 32.8 min. Break-even after 3 runs (setup paid back on run 3). Next run will be ~9 min vs 42 min — workflow saves hours as promised, not minutes.<br/>
          <span className="muted small">Timed with phone stopwatch, same inputs for fair compare. Setup includes writing this walkthrough doc.</span>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:0, fontSize:18, fontWeight:800}}>5 · Where it breaks + what human must still check</h2>
        <div style={{display:"grid", gap:10, marginTop:10}}>
          <div style={{background:"#1a1200", border:"1px solid #3a3000", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:13, color:"#f5d76e"}}>Failure points</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li><strong>NotebookLM hallucinates metric</strong> when README has no numbers — mitigated by prompt requiring [NEED] and critique truth check (Run 3 flagged).</li>
              <li><strong>Screenshot crop</strong> — AI cannot crop correctly; human must capture 1280/375 clean, no browser chrome, alt text meaningful. Workflow cannot auto-fix visual taste.</li>
              <li><strong>OMDb/Anthropic key missing</strong> — gather falls back to mock, but live link claim must be verified by human (open URL on phone).</li>
              <li><strong>Tone drift</strong> — draft sometimes too salesy; human edits for quiet frame so work is loudest (reject AI slop).</li>
              <li><strong>n8n webhook limits</strong> — free tier rate-limits; manual Claude Project is the reliable fallback.</li>
            </ul>
          </div>
          <div style={{background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:12}}>
            <div style={{fontWeight:700, fontSize:13, color:"#38bdf8"}}>Human must still check (review gate before publish)</div>
            <ul style={{margin:"6px 0 0 18px", fontSize:13, lineHeight:1.6}}>
              <li>Open live URL + 2 screenshots — do they match draft claims?</li>
              <li>Run critique checklist: Tab through page, run axe/WAVE, check fallback badges. Fix [FIX] before format.</li>
              <li>Confirm portfolio.ts object has real image path and repo is public.</li>
              <li>Read draft aloud — does the one-line claim still land? AI gives 10, you pick one.</li>
            </ul>
          </div>
          <div className="muted small">Principle from brief: single prompts save minutes; this workflow saves hours — but only with human review at Synthesize → Draft and Critique → Format.</div>
        </div>
      </div>

      <div className="muted small" style={{textAlign:"center"}}>Working workflow: Claude Project (instructions above) + NotebookLM (source-grounded) — runs end-to-end on a brand new input (tested Run 5 SneakerVault as unseen). This page is the walkthrough doc. Repo: Aditya-dxt/cinescope · Live demo: cinescope-phi-ebon.vercel.app/workflow</div>
    </div>
  );
}
