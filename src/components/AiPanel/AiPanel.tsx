import { useState } from "react";
import type { Movie } from "../../types";
import { getAiRecommendations, hasAnthropicKey, type AiResult } from "../../services/aiService";

export function AiPanel({ movies }: { movies: Movie[] }) {
  const [mood, setMood] = useState("cozy weekend, light and uplifting");
  const [result, setResult] = useState<AiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!movies.length) return;
    setLoading(true); setError(null);
    try {
      const r = await getAiRecommendations(movies, mood);
      setResult(r);
    } catch (e) { setError(e instanceof Error ? e.message : "AI failed."); }
    finally { setLoading(false); }
  }

  return (
    <section className="card" style={{padding:16, marginBottom:16, borderLeft: "3px solid #06b6d4"}} aria-labelledby="ai-heading">
      <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap", alignItems:"center"}}>
        <div>
          <h2 id="ai-heading" style={{margin:0, fontSize:16, fontWeight:800}}>AI Picks for you</h2>
          <p className="muted small" style={{margin:"4px 0 0"}}>Mood → 3 structured picks from your current results. {hasAnthropicKey() ? "Claude live" : "Fallback without key"} · Validated JSON, no hallucinated titles.</p>
        </div>
        <span className="alert" style={{fontSize:11, background: hasAnthropicKey() ? "#0f2a14" : "#1a1a12"}}>{hasAnthropicKey() ? "Claude haiku" : "Fallback"}</span>
      </div>
      <form onSubmit={e=>{e.preventDefault(); run();}} style={{display:"flex", gap:8, marginTop:12}}>
        <label htmlFor="ai-mood" className="sr-only">Mood or goal</label>
        <input id="ai-mood" className="search-input" style={{flex:1}} value={mood} onChange={e=>setMood(e.target.value)} placeholder="e.g. late-night thriller, family-friendly, 90s nostalgia" aria-label="Mood or goal" />
        <button type="submit" className="btn-primary" disabled={loading || !movies.length} aria-busy={loading}>{loading ? "Thinking…" : "Ask AI"}</button>
      </form>
      {error && <div className="alert alert-error" role="alert" style={{marginTop:10}}>{error}</div>}
      {result && (
        <div style={{marginTop:12, display:"grid", gap:10}}>
          <p style={{margin:0, fontSize:13, fontStyle:"italic"}}>"{result.insight}" <span className="muted small">— {result.provider === "claude" ? "Claude" : `Fallback (${result.fallbackReason})`}</span></p>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))"}}>
            {result.recommendations.map(r=>(
              <div key={r.imdbID} className="card" style={{padding:12}}>
                <div style={{fontWeight:700}}>{r.Title} <span className="muted small">({r.Year})</span></div>
                <div className="muted small" style={{marginTop:6}}><strong>Why:</strong> {r.reason}</div>
                <div className="muted small" style={{marginTop:4}}><em>{r.moodFit}</em></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
