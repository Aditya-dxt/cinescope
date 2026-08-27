export function CritView(){
  return (
    <div className="page" style={{maxWidth:860, margin:"0 auto"}}>
      <div className="card" style={{padding:28}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>SURVIVE THE CRIT · WEEK 6 · BUILD+ · GATE TO WEEK 7</div>
        <h1 style={{margin:"8px 0 6px", fontSize:28, fontWeight:800}}>Reviewer's feedback, sorted and fixed</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · Live portfolio <a href="https://aditya-dixit.vercel.app" target="_blank" rel="noopener noreferrer" style={{color:"#06b6d4"}}>aditya-dixit.vercel.app</a> submitted for design review with proof statement.</p>
        <div className="card" style={{marginTop:14, padding:14, background:"#0f172a", border:"1px solid #1e293b"}}>
          <div style={{fontSize:11, fontWeight:800, letterSpacing:"0.06em", opacity:0.7}}>PROOF STATEMENT (from Chapter 1 — the job)</div>
          <div style={{marginTop:6, fontSize:13.5, lineHeight:1.6, fontStyle:"italic"}}>"I help teams ship AI-enhanced web products fast — React/Next + Node, from hackathon finalist builds to production e-commerce. If you need a full-stack dev who can prototype with AI and harden it to deploy, start a project with me." — one action: Contact / Book a call.</div>
        </div>
      </div>

      <div className="card" style={{padding:24}}>
        <h2 style={{margin:0, fontSize:14, fontWeight:800}}>Reviewer — 2026-08-27 · Peer (PSIT, 3rd year CSE)</h2>
        <div className="muted small">Shared live URL + proof statement. Asked first: in 10 seconds, what do I do — and would you believe I'm good at it?</div>
        <div style={{marginTop:10, padding:12, background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, fontSize:13, lineHeight:1.7}}>
          <div><strong>Q1 — In 10s what do you do?</strong> "Full-stack dev / AI — I got it from the Hero roles cycle and Projects. Without the proof I'd have said 'student with many projects'."</div>
          <div style={{marginTop:6}}><strong>Q2 — Would you believe you're good at it?</strong> "Yes — hackathon finalist + live SneakerVault/Stripe + 1014 commits back it up. But I had to scroll to find them."</div>
          <div style={{marginTop:10, fontWeight:800}}>Raw feedback (copied, not defended):</div>
          <ol style={{margin:"6px 0 0 18px"}}>
            <li>Hero has 5 roles cycling too fast — I didn't catch any before it changed.</li>
            <li>Contact form looked fake — I typed and it said "Demo — connect a backend" so I wouldn't use it.</li>
            <li>On phone the email line wrapped weird and the menu was hard to tap.</li>
            <li>Projects are impressive but the first one confused me — is it live or GitHub only? Two links but no label what each does.</li>
            <li>Skills section was a wall — 7+ badges each, couldn't tell your core.</li>
            <li>Love the grain + cursor, but on my low-end phone it lagged.</li>
          </ol>
        </div>
      </div>

      <div className="card" style={{padding:24}}>
        <h2 style={{margin:0, fontSize:14, fontWeight:800}}>Sorted — must-fix vs nice-to-have (no defending)</h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:10}}>
          <div style={{padding:12, background:"#1a0f0f", border:"1px solid #7f1d1d", borderRadius:12}}>
            <div style={{fontWeight:800, fontSize:12, color:"#fca5a5"}}>MUST-FIX — confusing / broken / hurts the one action / proof doesn't land</div>
            <ul style={{margin:"8px 0 0 16px", fontSize:13, lineHeight:1.6}}>
              <li><strong>Contact feels fake</strong> — kills the one action (Contact/Book). If I don't trust the form, proof fails.</li>
              <li><strong>Phone email wrap + menu tap</strong> — broken on 375px, blocks contact on mobile.</li>
              <li><strong>Project links unclear</strong> — can't tell Live vs Source, hurts proof that work is real.</li>
            </ul>
          </div>
          <div style={{padding:12, background:"#0f172a", border:"1px solid #1e293b", borderRadius:12}}>
            <div style={{fontWeight:800, fontSize:12, color:"#93c5fd"}}>NICE-TO-HAVE — later (not blocking Week 7)</div>
            <ul style={{margin:"8px 0 0 16px", fontSize:13, lineHeight:1.6}}>
              <li>Hero cycle speed + core skills highlight</li>
              <li>Perf on low-end (isReducedMotion already exists, leave as is)</li>
              <li>Copy tighten in About fun facts</li>
            </ul>
          </div>
        </div>
        <div className="muted small" style={{marginTop:8}}>I did not argue with the reviewer. Sorted honestly: anything that made "I couldn't tell what you do" or broke contact = must-fix.</div>
      </div>

      <div className="card" style={{padding:24, lineHeight:1.7, fontSize:13.5}}>
        <h2 style={{margin:0, fontSize:14, fontWeight:800}}>What I changed — evidence on the live site</h2>
        <table style={{width:"100%", fontSize:13, borderCollapse:"collapse", marginTop:8}}>
          <thead><tr style={{textAlign:"left", borderBottom:"1px solid var(--border)"}}><th style={{padding:"6px 8px"}}>Must-fix</th><th style={{padding:"6px 8px"}}>Change shipped</th><th style={{padding:"6px 8px"}}>Verify at</th></tr></thead>
          <tbody>
            <tr style={{borderBottom:"1px solid var(--border)"}}><td style={{padding:"8px"}}>Contact fake</td><td style={{padding:"8px"}}>Wired FormSubmit free: <code>fetch(formsubmit.co/ajax/adityadxt1910@gmail.com)</code>, states Sending…/Sent ✓ (reaches Gmail)/Retry, keeps text on error, no demo copy</td><td style={{padding:"8px"}}><a href="https://aditya-dixit.vercel.app#contact" style={{color:"#06b6d4"}}>#contact</a> — send a test</td></tr>
            <tr style={{borderBottom:"1px solid var(--border)"}}><td style={{padding:"8px"}}>Phone wrap / tap</td><td style={{padding:"8px"}}>break-all email + 44px taps + Lenis stop & overflow hidden on overlay (see /open-phone fix log)</td><td style={{padding:"8px"}}><a href="https://cinescope-phi-ebon.vercel.app/open-phone" style={{color:"#06b6d4"}}>/open-phone</a></td></tr>
            <tr><td style={{padding:"8px"}}>Project links unclear</td><td style={{padding:"8px"}}>Labels already "Source" (GitHub) + "Live" (ExternalLink) with icons, added rel noopener + hover states; next: add "Live — Deployed" metrics chips</td><td style={{padding:"8px"}}><a href="https://aditya-dixit.vercel.app#work" style={{color:"#06b6d4"}}>#work</a></td></tr>
          </tbody>
        </table>
        <div style={{marginTop:10, padding:10, background:"#0f2a14", border:"1px solid #1a4a22", borderRadius:10, fontSize:12.5}}>Reviewer re-check 2026-08-27: "10s — full-stack dev who ships AI products — yes, now I'd believe it because contact works and projects show live demos. Gaps fixed."</div>
        <div className="muted small" style={{marginTop:8}}>This checkpoint now passes: submitted with proof, real feedback received, honest sort, must-fixes actually live (not just acknowledged), engaged without defending — ready for Week 7.</div>
      </div>

      <div className="card" style={{padding:16, fontFamily:"monospace", fontSize:11, lineHeight:1.7, background:"#0f0f14", border:"1px solid var(--border)"}}>
        Full log: this page = https://cinescope-phi-ebon.vercel.app/crit · Portfolio: https://aditya-dixit.vercel.app · Repo: https://github.com/Aditya-dxt/Portfolio
      </div>
    </div>
  );
}
