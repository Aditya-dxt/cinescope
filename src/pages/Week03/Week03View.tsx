export function Week03View(){
  return (
    <div className="page" style={{maxWidth:980, margin:"0 auto"}}>
      {/* Header */}
      <div className="card" style={{padding:24, background:"var(--surface)", border:"1px solid var(--border)"}}>
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:8}}>
          <div style={{width:40, height:40, borderRadius:12, background:"#0A0A0F", color:"#FFFBF5", display:"grid", placeItems:"center", fontWeight:800, letterSpacing:"0.06em", border:"1px solid #23232f"}}>AD</div>
          <div>
            <div style={{fontWeight:800, letterSpacing:"0.04em"}}>Aditya Dixit — Frontend AI Engineering</div>
            <div className="muted small">Week 3 · Consistency, Not Talent (Frame, Not Upstage) · 90 min · Foundations</div>
          </div>
          <span className="alert" style={{marginLeft:"auto", background:"#0f2a14", border:"1px solid #1a4a22", fontSize:12}}>Pass-ready deliverable</span>
        </div>
        <div className="muted small">Public deliverable for CUSTOM-MQWZZ5MU-01C90211 · One URL to paste in Deliverables · Fits on one scroll with anchored sections</div>
      </div>

      {/* 1. ONE-LINE CLAIM */}
      <section className="card" style={{padding:22}}>
        <div style={{display:"flex", gap:10, alignItems:"center", marginBottom:6}}>
          <span style={{width:28, height:28, borderRadius:999, background:"#255957", color:"#fff", display:"grid", placeItems:"center", fontWeight:800, fontSize:13}}>1</span>
          <h2 style={{margin:0, fontSize:18}}>One-line claim</h2>
          <span className="muted small" style={{marginLeft:"auto"}}>AI gave 10, I chose 1</span>
        </div>
        <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, padding:16, marginTop:12}}>
          <div className="muted small" style={{marginBottom:6}}>CHOSEN — single, memorable</div>
          <div style={{fontSize:22, fontWeight:800, letterSpacing:"-0.02em", lineHeight:1.2}}>Ship-ready React frontends that feel premium and load fast.</div>
          <div className="muted small" style={{marginTop:8}}>Positioning: Frontend builder for founders/teams who want purchasable, production-grade React UI — not demos. Proof: CineScope, Brew & Co.</div>
        </div>
        <details style={{marginTop:12}}>
          <summary className="muted" style={{cursor:"pointer", fontSize:13}}>10 AI options (and why #3 won)</summary>
          <ol style={{margin:"10px 0 0 18px", color:"var(--muted)", fontSize:13, lineHeight:1.6}}>
            <li>React frontends that ship fast and sell. — too salesy</li>
            <li>Clean code, fast sites, ready to launch. — generic</li>
            <li><strong style={{color:"var(--text)"}}>Ship-ready React frontends that feel premium and load fast. — chosen: concrete, premium + speed, remembers</strong></li>
            <li>From Figma to live in days, not weeks. — time promise, risky</li>
            <li>Frontend that looks award-site, builds like a system. — too inside-baseball</li>
            <li>Your idea, as a fast React product. — vague</li>
            <li>Design that frames your work, not upstages it. — meta, not client benefit</li>
            <li>Performance-first React for real revenue. — jargon heavy</li>
            <li>Templates that become products. — niche to Gumroad</li>
            <li>Calm, consistent UI that converts. — abstract</li>
          </ol>
        </details>
      </section>

      {/* 2. CONTENT MAP */}
      <section className="card" style={{padding:22}}>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <span style={{width:28, height:28, borderRadius:999, background:"#255957", color:"#fff", display:"grid", placeItems:"center", fontWeight:800, fontSize:13}}>2</span>
          <h2 style={{margin:0, fontSize:18}}>Content map — pages, sections, cases, CTAs</h2>
        </div>
        <p className="muted small" style={{margin:"8px 0 0 0"}}>One action they all ladder to: <strong style={{color:"var(--text)"}}>Start your build → Email adityadxt1910@gmail.com</strong> (from Week 1). Every CTA sends to this.</p>

        <div style={{display:"grid", gap:12, marginTop:14}}>
          {[
            {page:"Home (/) — first impression", order:["Hero: claim + 1-line proof + primary CTA", "Selected Work (3 cards, lead with CineScope)", "How I work (3 steps)", "Social proof / stack", "Final CTA banner"], cta:"Start your build → email", notes:"Lead with CineScope (strongest, live OMDb proof)."},
            {page:"Work (/work) — proof", order:["CineScope — Movie Discovery (lead, live + repo)", "Brew & Co — Coffee roaster template", "Flagship-01 / Archive", "Process note (MVVM, AI-assisted, manual fixes)"], cta:"View live demo → then Start your build", notes:"Order by recency + proof strength."},
            {page:"About (/about) — trust", order:["Photo + 2-line bio", "Stack & track (Frontend AI Engineering)", "Principles: frame, not upstage", "Timeline"], cta:"Read my identity note → Start your build", notes:"Real photo here, not AI."},
            {page:"Contact (/contact) — conversion", order:["Short form (email, budget, timeline)", "Direct email + Gumroad link", "Response time note"], cta:"Send brief → Start your build (primary)", notes:"Single form, no clutter."},
          ].map(s => (
            <div key={s.page} style={{border:"1px solid var(--border)", borderRadius:12, padding:14, background:"var(--surface-2)"}}>
              <div style={{fontWeight:700, fontSize:14}}>{s.page}</div>
              <ol style={{margin:"8px 0 0 18px", fontSize:13, lineHeight:1.6, color:"var(--muted)"}}>
                {s.order.map(o => <li key={o} style={{color:"var(--text)"}}>{o}</li>)}
              </ol>
              <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
                <span className="alert" style={{background:"#0f0f14", fontSize:12, border:"1px solid var(--border)"}}>CTA: <strong>{s.cta}</strong></span>
                <span className="muted small">{s.notes}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:16, background:"#1a1a12", border:"1px solid #3a3000", borderRadius:12, padding:12}}>
          <div style={{fontWeight:700, fontSize:13}}>Still need to gather — honest list so build week isn’t blocked</div>
          <ul style={{margin:"8px 0 0 18px", fontSize:13, color:"#c9b86a", lineHeight:1.7}}>
            <li>Clean screenshots: CineScope at 1280px + 375px, Brew & Co hero (cropped, legible) — capture this week</li>
            <li>Demo links + repos: CineScope Vercel + GitHub already have; Brew & Co needs redeploy link</li>
            <li>Numbers: Lighthouse perf for CineScope (run once deployed with env), Gumroad sales count</li>
            <li>Testimonial: 1 short quote from mentor/first user — request by Fri</li>
            <li>Real photo: headshot on neutral background — shoot on phone, daylight</li>
          </ul>
        </div>
      </section>

      {/* 3. IDENTITY KIT */}
      <section className="card" style={{padding:22}}>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <span style={{width:28, height:28, borderRadius:999, background:"#255957", color:"#fff", display:"grid", placeItems:"center", fontWeight:800, fontSize:13}}>3</span>
          <h2 style={{margin:0, fontSize:18}}>Identity kit — decide once, repeat everywhere</h2>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12, marginTop:14}}>
          <div style={{border:"1px solid var(--border)", borderRadius:12, padding:14}}>
            <div className="muted small" style={{fontWeight:700}}>Fonts — 1 family, 2 weights (calm)</div>
            <div style={{marginTop:8, fontSize:28, fontWeight:800, fontFamily:"Inter, sans-serif"}}>Inter</div>
            <div className="muted small">Heading: Inter 700 · Body: Inter 400 · Labels: Inter 600 12px · One font, intentional</div>
            <div style={{marginTop:8, fontSize:12, color:"var(--muted)"}}>Free on Google Fonts. Why: neutral, highly legible, lets screenshots be the color.</div>
          </div>
          <div style={{border:"1px solid var(--border)", borderRadius:12, padding:14}}>
            <div className="muted small" style={{fontWeight:700}}>Palette — 4 colors, quiet frame</div>
            <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
              {[
                {hex:"#0A0A0F", label:"Near-black text"},
                {hex:"#FFFBF5", label:"Warm white bg", text:"#0A0A0F"},
                {hex:"#12121A", label:"Surface"},
                {hex:"#255957", label:"Accent (CTA only)"},
              ].map(c => (
                <div key={c.hex} style={{display:"flex", alignItems:"center", gap:8, border:"1px solid var(--border)", borderRadius:999, padding:"6px 10px", background:c.hex, color:c.text || "#FFFBF5", fontSize:12, fontWeight:700}}>
                  <span style={{width:14, height:14, borderRadius:999, background:c.hex, border:"1px solid rgba(0,0,0,0.15)"}} /> {c.hex}
                  <span style={{fontWeight:500, opacity:0.9}}>{c.label}</span>
                </div>
              ))}
            </div>
            <div className="muted small" style={{marginTop:8}}>Contrast: #0A0A0F on #FFFBF5 passes readability in sunlight; accent used only for links/CTAs so work stays loudest.</div>
          </div>
          <div style={{border:"1px solid var(--border)", borderRadius:12, padding:14, display:"grid", placeItems:"center", textAlign:"center"}}>
            <div className="muted small" style={{fontWeight:700}}>Logo / Favicon</div>
            <div style={{width:72, height:72, borderRadius:16, background:"#0A0A0F", color:"#FFFBF5", display:"grid", placeItems:"center", fontWeight:800, fontSize:22, letterSpacing:"0.06em", marginTop:10, border:"1px solid #23232f"}}>AD</div>
            <div style={{width:16, height:16, borderRadius:4, background:"#0A0A0F", color:"#FFFBF5", display:"grid", placeItems:"center", fontWeight:800, fontSize:8, marginTop:8}}>AD</div>
            <div className="muted small" style={{marginTop:6}}>16×16 favicon preview · Simple AD monogram, no decoration</div>
          </div>
        </div>

        <div style={{marginTop:12, background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, padding:12}}>
          <div style={{fontWeight:700, fontSize:13}}>Two-line style note — paste to AI every build</div>
          <div style={{fontFamily:"monospace", fontSize:12, marginTop:6, lineHeight:1.6, color:"#c9d1c9"}}>
            Fonts: Inter 700 headings / Inter 400 body, 12px labels 600. Colors: text #0A0A0F, bg #FFFBF5, surface #12121A, accent #255957 (CTAs only). Mood: quiet, confident frame — generous whitespace, work is the color; reject anything that upstages screenshots.
          </div>
        </div>
      </section>

      {/* 4. IMAGES */}
      <section className="card" style={{padding:22}}>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <span style={{width:28, height:28, borderRadius:999, background:"#255957", color:"#fff", display:"grid", placeItems:"center", fontWeight:800, fontSize:13}}>4</span>
          <h2 style={{margin:0, fontSize:18}}>Image set — real work, one style for tissue, rejected on purpose</h2>
        </div>

        <div style={{display:"grid", gap:12, marginTop:14}}>
          <div style={{border:"1px solid var(--border)", borderRadius:12, padding:14}}>
            <div style={{fontWeight:700, fontSize:13}}>What the portfolio actually needs (mapped to content)</div>
            <ul style={{margin:"8px 0 0 18px", fontSize:13, lineHeight:1.7}}>
              <li><strong>Real captures (work proof):</strong> CineScope Home grid at 1280/375, CineScope Health fetch, Brew & Co hero — clean, cropped, legible, no browser chrome</li>
              <li><strong>Connective tissue (AI, one style):</strong> subtle grain/noise divider + dotted grid background — both in same muted, low-contrast style, never hero</li>
              <li><strong>You:</strong> real photo, neutral wall, daylight — no AI portrait</li>
            </ul>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10, marginTop:12}}>
              <div style={{border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", background:"#0f0f14"}}>
                <div style={{aspectRatio:"16/10", background:"#12121A", display:"grid", placeItems:"center", color:"var(--muted)", fontSize:12}}>CineScope — real capture</div>
                <div style={{padding:10, fontSize:12}}><strong>CineScope grid</strong> <span className="muted">· Home at 1280px · real screenshot beats AI</span></div>
              </div>
              <div style={{border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", background:"#0f0f14"}}>
                <div style={{aspectRatio:"16/10", background:"#12121A", display:"grid", placeItems:"center", color:"var(--muted)", fontSize:12}}>Brew & Co — real capture</div>
                <div style={{padding:10, fontSize:12}}><strong>Brew & Co hero</strong> <span className="muted">· template proof · cropped</span></div>
              </div>
              <div style={{border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", background:"#0f0f14"}}>
                <div style={{aspectRatio:"1/1", background:"#FFFBF5", display:"grid", placeItems:"center", color:"#0A0A0F", fontSize:12}}>Your photo — real</div>
                <div style={{padding:10, fontSize:12}}><strong>Real headshot</strong> <span className="muted">· you, not generated</span></div>
              </div>
            </div>
          </div>

          <div style={{border:"1px solid #4a1a1f", background:"#2a0f12", borderRadius:12, padding:14}}>
            <div style={{fontWeight:700, fontSize:13, color:"#ffb3b8"}}>Rejected — and why (judgment)</div>
            <div style={{marginTop:8, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap"}}>
              <div style={{width:140, height:90, borderRadius:10, background:"linear-gradient(135deg, #ff6b6b, #8b5cf6, #06b6d4)", border:"1px solid rgba(255,255,255,0.2)", display:"grid", placeItems:"center", color:"#fff", fontSize:11, fontWeight:700, textAlign:"center", padding:8}}>Generated abstract hero — fake glass / melted gradient</div>
              <div style={{flex:1, minWidth:240}}>
                <div style={{fontSize:13, lineHeight:1.6, color:"#ffb3b8"}}>
                  Generated 3 abstract heroes in same prompt. All had that melted fake-glass AI slop — glossy, over-saturated, no meaning. <strong>Rejected all three on purpose:</strong> they upstaged the case studies and made CineScope screenshots feel smaller. Kept a clean title over whitespace instead — quiet frame, work is the color. Exactly the Iris move from the brief.
                </div>
                <div className="muted small" style={{marginTop:6, color:"#c9a0a6"}}>Consistent style kept for tissue: grain divider only, same low-contrast, never competes.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="muted small" style={{textAlign:"center", padding:"6px 0"}}>Deliverable for https://aifluency.flyrank.ai/week-03.html · Submit this URL in Deliverables · Files: attach favicon PNG + 2 screenshots · Notes: context below</div>
    </div>
  );
}
