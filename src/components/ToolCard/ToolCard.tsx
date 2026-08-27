import type { LookupMovieOutput, GetWatchScoreOutput } from "../../tools/movieTools";

export type ToolPart =
  | { tool: "lookupMovie"; state: "input-streaming"; input?: Partial<{ title: string }> }
  | { tool: "lookupMovie"; state: "input-available"; input: { title: string } }
  | { tool: "lookupMovie"; state: "output-available"; input: { title: string }; output: LookupMovieOutput }
  | { tool: "lookupMovie"; state: "output-error"; input: { title: string }; error: string }
  | { tool: "getWatchScore"; state: "input-streaming"; input?: Partial<{ title: string; vibe: string }> }
  | { tool: "getWatchScore"; state: "input-available"; input: { title: string; vibe: string } }
  | { tool: "getWatchScore"; state: "output-available"; input: { title: string; vibe: string }; output: GetWatchScoreOutput }
  | { tool: "getWatchScore"; state: "output-error"; input: { title: string; vibe: string }; error: string };

export function ToolPartView({ part }: { part: ToolPart }) {
  const base: React.CSSProperties = { borderRadius:10, padding:12, margin:"8px 0", transition:"all 200ms ease", fontSize:13, lineHeight:1.5 };

  if (part.state === "input-streaming") {
    return (
      <div style={{...base, background:"#0f0f14", border:"1px dashed var(--border)", color:"var(--muted)"}} aria-live="polite" aria-busy={true}>
        <div style={{fontWeight:700, fontSize:12, letterSpacing:"0.06em"}}>TOOL · {part.tool} · resolving input…</div>
        <div style={{marginTop:6, display:"flex", gap:6, alignItems:"center"}}><span className="pulse" style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/> <span>Parsing "{(part.input as Record<string,string>)?.title || "…"}" </span><span className="dots">● ● ●</span></div>
        <div className="muted small" style={{marginTop:4}}>Question: what is it doing? → choosing a tool and streaming its input.</div>
      </div>
    );
  }
  if (part.state === "input-available") {
    return (
      <div style={{...base, background:"#0f172a", border:"1px solid #1e293b"}}>
        <div style={{fontWeight:700, fontSize:12, color:"#38bdf8"}}>TOOL · {part.tool} · input ready</div>
        <div style={{fontFamily:"monospace", fontSize:12, background:"#0a0f1e", padding:8, borderRadius:8, marginTop:6, whiteSpace:"pre-wrap"}}>{JSON.stringify(part.input, null, 2)}</div>
        <div className="muted small" style={{marginTop:4}}>Question: with what input? → validated by Zod, about to execute.</div>
      </div>
    );
  }
  if (part.state === "output-error") {
    return (
      <div style={{...base, background:"#1a0f0f", border:"1px solid #7f1d1d"}} role="alert">
        <div style={{fontWeight:800, fontSize:12, color:"#fca5a5"}}>TOOL · {part.tool} · failed — not a crash</div>
        <div style={{marginTop:6, background:"#2a1111", padding:8, borderRadius:8, fontFamily:"monospace", fontSize:12}}>{part.error}</div>
        <div className="muted small" style={{marginTop:6}}>Question: what went wrong? → designed error state. Retry or change title.</div>
      </div>
    );
  }
  // output-available — render as component, not JSON dump
  if (part.tool === "lookupMovie") {
    const o = part.output as LookupMovieOutput;
    return (
      <div style={{...base, background:"#0f2a14", border:"1px solid #1a4a22"}}>
        <div style={{fontWeight:800, fontSize:12, color:"#4ade80"}}>TOOL · lookupMovie · result</div>
        <div style={{display:"grid", gridTemplateColumns:"64px 1fr", gap:10, marginTop:8}}>
          <div style={{width:64, height:96, background:"#111", borderRadius:6, display:"grid", placeItems:"center", fontSize:10, color:"var(--muted)", border:"1px solid var(--border)"}}>{o.Poster && o.Poster !== "N/A" ? <img src={o.Poster} alt={o.Title} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:6}}/> : "No poster"}</div>
          <div>
            <div style={{fontWeight:800}}>{o.Title} <span className="muted small">· {o.Year} · {o.Rated}</span></div>
            <div className="muted small">{o.Genre} · {o.Runtime} · ★ {o.imdbRating} · {o.Source === "mock" ? "mock" : "omdb"}</div>
            <div style={{marginTop:6, fontSize:12, lineHeight:1.5}}>{o.Plot}</div>
          </div>
        </div>
        <div className="muted small" style={{marginTop:6}}>Output-available as card — not text. Source: {o.Source}.</div>
      </div>
    );
  }
  // getWatchScore
  const o = part.output as GetWatchScoreOutput;
  return (
    <div style={{...base, background:"#0f2a14", border:"1px solid #1a4a22"}}>
      <div style={{fontWeight:800, fontSize:12, color:"#4ade80"}}>TOOL · getWatchScore · watch card</div>
      <div style={{display:"flex", gap:12, alignItems:"center", marginTop:8}}>
        <div style={{minWidth:56, height:56, borderRadius:28, background:"#111", border:"2px solid #4ade80", display:"grid", placeItems:"center", fontWeight:800, fontSize:18}}>{o.score}</div>
        <div>
          <div style={{fontWeight:800}}>{o.title} · {o.vibe} <span className="muted small">— {o.verdict}</span></div>
          <div style={{display:"flex", gap:6, marginTop:6}}>
            {(["story","rewatch","vibeFit"] as const).map(k=>(
              <div key={k} style={{background:"#111", padding:"4px 8px", borderRadius:6, fontSize:11}}><span className="muted small">{k}</span> <strong>{o.breakdown[k]}/10</strong></div>
            ))}
          </div>
          <svg width={180} height={40} style={{marginTop:8, display:"block"}} aria-label="score breakdown chart">
            {(["story","rewatch","vibeFit"] as const).map((k,i)=>(
              <g key={k}>
                <rect x={i*60+4} y={30 - o.breakdown[k]*2.5} width={28} height={o.breakdown[k]*2.5} rx={3} fill={i===2 ? "#4ade80" : "#38bdf8"} />
                <text x={i*60+18} y={38} textAnchor="middle" fontSize={8} fill="#9ca3af">{k}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="muted small" style={{marginTop:6}}>Output-available as score card + chart — structured data rendered as UI.</div>
    </div>
  );
}
