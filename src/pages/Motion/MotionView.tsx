import { useState, useRef, useEffect } from "react";

type State = "idle" | "loading" | "success" | "error";
export function BrainButton({
  idleLabel = "Send message",
  loadingLabel = "Sending…",
  successLabel = "Sent ✓",
  errorLabel = "Retry",
  variant = "primary" as "primary"|"secondary",
  force, // for demo page to force success/failure
  onDone,
}: {
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  variant?: "primary"|"secondary";
  force?: "success"|"error"|"random";
  onDone?: (s: State)=>void;
}){
  const [state, setState] = useState<State>("idle");
  const [shake, setShake] = useState(false);
  const t1 = useRef<number | null>(null);
  const t2 = useRef<number | null>(null);

  useEffect(()=>()=>{ if(t1.current) window.clearTimeout(t1.current); if(t2.current) window.clearTimeout(t2.current); },[]);

  function clearTimers(){ if(t1.current) window.clearTimeout(t1.current); if(t2.current) window.clearTimeout(t2.current); }

  function trigger(){
    if(state==="loading") return; // interruptible: ignore spam during loading, but hover still works via CSS
    clearTimers();
    setState("loading");
    const delay = 900 + Math.random()*600;
    const willFail = force==="error" ? true : force==="success" ? false : Math.random() < 0.2;
    t1.current = window.setTimeout(()=>{
      if(willFail){
        setState("error");
        setShake(true);
        t2.current = window.setTimeout(()=>setShake(false), 420);
        // stay on error until user clicks again (retry) — auto back after 2.2s as well so demo loops
        t2.current = window.setTimeout(()=>{ setState("idle"); onDone?.("error"); }, 2200) as unknown as number;
      } else {
        setState("success");
        t2.current = window.setTimeout(()=>{ setState("idle"); onDone?.("success"); }, 1600);
      }
    }, delay);
  }

  // click from error also retries (same trigger, but clear auto-reset timer first)
  function onClick(){ if(state==="error"){ clearTimers(); setShake(false); } trigger(); }

  const label = state==="idle" ? idleLabel : state==="loading" ? loadingLabel : state==="success" ? successLabel : errorLabel;

  return (
    <button
      onClick={onClick}
      disabled={state==="loading"}
      aria-live="polite"
      aria-busy={state==="loading"}
      aria-label={label}
      style={{
        position:"relative",
        minWidth: variant==="primary" ? 180 : 150,
        height: 44,
        padding:"0 22px",
        borderRadius: 999,
        border: variant==="primary" ? "0" : "1px solid var(--border)",
        background: variant==="primary" ? (state==="error" ? "#991b1b" : state==="success" ? "#0f5b2a" : "var(--accent)") : state==="error" ? "#1a0f0f" : state==="success" ? "#0f1a12" : "var(--surface)",
        color: variant==="primary" ? "#fff" : state==="error" ? "#fca5a5" : "var(--text)",
        cursor: state==="loading" ? "wait" : "pointer",
        overflow:"hidden",
        transform: shake ? "translateX(0)" : undefined,
        animation: shake ? "brain-shake 380ms cubic-bezier(.36,.07,.19,.97)" : undefined,
        transition: "background 180ms ease, color 180ms ease, border-color 180ms ease, transform 120ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease",
        opacity: state==="loading" ? 0.96 : 1,
        // focus ring is via :focus-visible below
      }}
      className="brain-btn"
    >
      {/* label — crossfades / slides with transform+opacity only */}
      <span
        aria-hidden={state==="loading"}
        style={{
          display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
          transform: state==="loading" ? "translateY(-8px) scale(0.98)" : state==="success" ? "translateY(0) scale(1)" : "translateY(0) scale(1)",
          opacity: state==="loading" ? 0 : 1,
          transition: "transform 300ms cubic-bezier(.22,1,.36,1), opacity 220ms ease",
          whiteSpace:"nowrap",
        }}
      >
        {state==="success" && <span style={{display:"inline-block", transform:"scale(1.05)", transition:"transform 320ms cubic-bezier(.34,1.56,.64,1)"}}>✓</span>}
        {state==="error" && <span aria-hidden>↻</span>}
        {label}
      </span>

      {/* spinner — center, appears via scale+opacity, no layout thrash */}
      <span
        aria-hidden={state!=="loading"}
        style={{
          position:"absolute", left:"50%", top:"50%",
          width:18, height:18, borderRadius:"50%",
          border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff",
          transform: `translate(-50%,-50%) scale(${state==="loading" ? 1 : 0.7})`,
          opacity: state==="loading" ? 1 : 0,
          transition: "transform 300ms cubic-bezier(.22,1,.36,1), opacity 200ms ease",
          animation: state==="loading" ? "brain-spin 700ms linear infinite" : undefined,
        }}
      />
      <style>{`
        .brain-btn:hover{ transform: translateY(-1px); filter: brightness(1.06); }
        .brain-btn:active{ transform: translateY(0) scale(0.98); }
        .brain-btn:focus-visible{ outline: 2px solid #fff; outline-offset: 2px; box-shadow: 0 0 0 4px rgba(229,9,20,0.35); }
        .brain-btn:disabled{ cursor: wait; }
        @keyframes brain-spin{ to{ transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes brain-shake{
          10%,90%{ transform: translateX(-1px); }
          20%,80%{ transform: translateX(2px); }
          30%,50%,70%{ transform: translateX(-4px); }
          40%,60%{ transform: translateX(4px); }
        }
        @media (prefers-reduced-motion: reduce){
          .brain-btn, .brain-btn *{ transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
          .brain-btn{ animation: none !important; }
        }
      `}</style>
    </button>
  );
}

export function MotionView(){
  const [mode, setMode] = useState<"random"|"success"|"error">("random");
  const [log, setLog] = useState<string[]>([]);

  function push(s:string){ setLog(l=>[`${new Date().toLocaleTimeString()} · ${s}`, ...l].slice(0,6)); }

  return (
    <div className="page" style={{maxWidth:900, margin:"0 auto"}}>
      <div className="card" style={{padding:28}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>FE-AA1 · BUTTONS WITH A BRAIN · WEEK 6 · 2H · BUILD+</div>
        <h1 style={{margin:"8px 0 6px", fontSize:30, fontWeight:800}}>Buttons with a Brain — Motion & State Micro-interactions</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · One button, five states, every change is a transition. Built for the capstone chat "Send" so spam-clicks and keyboard never break it.</p>
        <div className="muted small" style={{marginTop:8}}>Try: hover, focus with Tab, spam-click mid-loading, and triggers below. Respects <code>prefers-reduced-motion</code> — shake is skipped, feedback stays via color+label.</div>
      </div>

      <div className="card" style={{padding:24}}>
        <h2 style={{margin:0, fontSize:14, fontWeight:800, letterSpacing:"0.06em"}}>DEMO — PRIMARY (Send message) + SECONDARY (Save — same motion language)</h2>
        <div style={{display:"flex", gap:12, marginTop:14, flexWrap:"wrap", alignItems:"center"}}>
          <span className="muted small">Triggers:</span>
          <button className={`btn-ghost ${mode==="random" ? "active" : ""}`} style={{fontSize:12, background: mode==="random" ? "var(--surface-2)" : undefined}} onClick={()=>setMode("random")}>Random 80/20</button>
          <button className="btn-ghost" style={{fontSize:12, background: mode==="success" ? "var(--surface-2)" : undefined}} onClick={()=>setMode("success")}>Force success</button>
          <button className="btn-ghost" style={{fontSize:12, background: mode==="error" ? "var(--surface-2)" : undefined}} onClick={()=>setMode("error")}>Force error</button>
          {mode!=="random" && <span className="muted small">({mode})</span>}
        </div>

        <div style={{display:"flex", gap:16, marginTop:18, flexWrap:"wrap", alignItems:"center", padding: "18px 16px", background:"#0f0f14", border:"1px solid var(--border)", borderRadius:14}}>
          <BrainButton force={mode} onDone={(s)=>push(`Send → ${s} (delay ~900-1500ms)`)} idleLabel="Send message" loadingLabel="Sending…" successLabel="Sent ✓" errorLabel="Retry" variant="primary" />
          <BrainButton force={mode} onDone={(s)=>push(`Save → ${s}`)} idleLabel="Save" loadingLabel="Saving…" successLabel="Saved ✓" errorLabel="Retry" variant="secondary" />
          <span className="muted small" style={{marginLeft:4}}>Both share durations/easings — proving a system, not a one-off.</span>
        </div>

        <ul style={{margin:"12px 0 0 18px", fontSize:12, lineHeight:1.7, color:"var(--muted)"}}>
          <li><strong style={{color:"var(--text)"}}>5 states:</strong> idle · hover/focus (lift + brightness) · active (press scale 0.98) · loading (label slides up + fades, spinner scales+spins) · success (green + check morph) · error (red + shake + ↻ retry) — plus disabled (loading blocks, cursor wait)</li>
          <li><strong style={{color:"var(--text)"}}>Interruptible:</strong> rapid clicks during loading are ignored (no state corruption); hover mid-transition still works (pure CSS); error auto-resets to idle so you can retry infinitely</li>
          <li><strong style={{color:"var(--text)"}}>Keyboard:</strong> Tab to focus → visible white ring + accent glow → Enter/Space triggers loading → focus stays</li>
        </ul>

        {log.length>0 && (
          <div style={{marginTop:12, background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:10, fontFamily:"monospace", fontSize:11, lineHeight:1.6}}>
            {log.map((l,i)=><div key={i}>{l}</div>)}
          </div>
        )}
      </div>

      <div className="card" style={{padding:20, lineHeight:1.7, fontSize:13}}>
        <h2 style={{margin:0, fontSize:14, fontWeight:800}}>Duration / easing note — why these numbers (a few sentences)</h2>
        <p style={{margin:"8px 0 0"}}>
          Hover 180ms <code>ease</code> for lift — fast enough to feel alive, slow enough to read. Active 120ms <code>cubic-bezier(.2,.8,.2,1)</code> gives a soft press without snap. Loading crossfade 220–300ms <code>cubic-bezier(.22,1,.36,1)</code> (ease-out-expo-ish) so label slides <code>translateY(-8px)</code> + <code>opacity</code> while spinner <code>scale(0.7→1)</code> — all compositor props, no width/height reflow. Success 320ms with slight overshoot <code>cubic-bezier(.34,1.56,.64,1)</code> for the check pop. Error shake 380ms <code>cubic-bezier(.36,.07,.19,.97)</code> — one shake only, skipped under <code>prefers-reduced-motion</code> (color+label remain, so feedback never disappears). Interruptibility via ignoring clicks in <code>loading</code> + CSS hover (not JS) — spam never breaks the state machine.
        </p>
        <div className="muted small" style={{marginTop:8}}>All anims use <code>transform</code> + <code>opacity</code> only — fixed <code>min-width</code> avoids layout thrash on label swap; spinner is <code>position:absolute</code> + <code>translate(-50%,-50%)</code>.</div>
      </div>

      <div className="card" style={{padding:16}}>
        <div style={{fontWeight:800, fontSize:12}}>HOW TO TEST (for reviewer, 30s)</div>
        <ol style={{margin:"8px 0 0 18px", fontSize:12, lineHeight:1.7}}>
          <li>Hover → lift, Tab → focus ring, click → "Sending…" with spinner (no layout jump).</li>
          <li>Spam-click 5× during loading → still one spinner, no broken state.</li>
          <li>Click "Force error" then Send → red + single shake + "Retry" → wait 2.2s → back to idle, or click Retry immediately.</li>
          <li>Enable OS "Reduce motion" → shake disappears, error still red + ↻ retry.</li>
          <li>Both buttons share the same timings — copy the component for capstone "Deploy"/"Generate".</li>
        </ol>
      </div>
    </div>
  );
}
