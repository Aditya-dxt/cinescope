import { useState } from "react";
import { PlaygroundDialog, PlaygroundTabs, PlaygroundDisclosure } from "./PlaygroundComponents";

export function PlaygroundView() {
  const [open, setOpen] = useState(false);
  return (
    <div className="page" style={{maxWidth:900, margin:"0 auto", paddingBottom:40}}>
      <div className="card" style={{padding:24}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>FE-05 · ACCESSIBLE COMPONENT FUNDAMENTALS · PLAYGROUND</div>
        <h1 style={{margin:"8px 0 6px", fontSize:28, fontWeight:800}}>Playground — Dialog, Tabs, Disclosure</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>Hand-built in React + TS, no component libraries. W3C ARIA APG patterns: correct roles, keyboard, focus. See NOTES.md for shadcn comparison.</p>
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <span className="alert" style={{fontSize:12}}>TypeScript: no any in props</span>
          <span className="alert" style={{fontSize:12}}>Keyboard: Tab / Esc / Arrows / Home / End</span>
          <a href="/NOTES.md" style={{fontSize:12, color:"#06b6d4"}} target="_blank">NOTES.md</a>
          <a href="https://github.com/Aditya-dxt/cinescope/blob/main/src/playground/PlaygroundComponents.tsx" style={{fontSize:12, color:"#06b6d4"}} target="_blank">Source</a>
        </div>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:"0 0 8px", fontSize:16, fontWeight:800}}>1 · Modal Dialog (APG Dialog pattern)</h2>
        <p className="muted small">Focus trap + return, Esc closes, overlay click closes, aria-modal, labelledby.</p>
        <button className="btn-primary" onClick={() => setOpen(true)}>Open dialog</button>
        <PlaygroundDialog open={open} onClose={() => setOpen(false)} title="CineScope dialog">
          <p style={{margin:0}}>This dialog traps focus (Tab cycles between buttons), closes on Escape or overlay click, and returns focus to the trigger. Try keyboard only: Tab → Enter → Esc.</p>
          <ul style={{margin:"8px 0 0 18px"}}><li>role="dialog" aria-modal="true"</li><li>Focus on open, restore on close</li><li>Tab loop + Esc handler</li></ul>
        </PlaygroundDialog>
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:"0 0 8px", fontSize:16, fontWeight:800}}>2 · Tabs (APG Tabs pattern — manual activation)</h2>
        <p className="muted small">Roving tabindex, ArrowRight/Left, Home/End, aria-selected/controls.</p>
        <PlaygroundTabs items={[
          { id:"a", label:"Overview", panel:<p style={{margin:0}}>Overview panel — accessible via arrows. Tab moves focus out of tablist; arrows move between tabs.</p> },
          { id:"b", label:"AI picks", panel:<p style={{margin:0}}>AI Picks — this playground proves keyboard works without mouse.</p> },
          { id:"c", label:"Details", panel:<p style={{margin:0}}>Details — each tabpanel is labelledby its tab.</p> },
        ]} defaultId="a" />
      </div>

      <div className="card" style={{padding:20}}>
        <h2 style={{margin:"0 0 8px", fontSize:16, fontWeight:800}}>3 · Disclosure (APG Disclosure pattern)</h2>
        <p className="muted small">Button aria-expanded + aria-controls, region labelledby, Enter/Space native.</p>
        <PlaygroundDisclosure summary="Show implementation notes">
          <p style={{margin:0}}>Disclosure is a single toggle — simpler than accordion. Button controls the region; no focus trap needed. Keyboard: Tab to button → Enter or Space toggles → Tab into revealed content.</p>
          <p style={{margin:"8px 0 0"}}><strong>Why separate from details/summary:</strong> explicit aria-expanded/controls works in all AT, and we control styling/animation.</p>
        </PlaygroundDisclosure>
        <div style={{marginTop:12}}>
          <PlaygroundDisclosure summary="Another disclosure (independent state)">
            <p style={{margin:0}}>Second instance — state is local, no global glitch.</p>
          </PlaygroundDisclosure>
        </div>
      </div>

      <div className="muted small" style={{textAlign:"center"}}>Keyboard test: unplug mouse → Tab through all three, Esc closes dialog, arrows move tabs, Enter toggles disclosure. Build: src/playground/</div>
    </div>
  );
}
