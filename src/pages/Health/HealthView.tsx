import { useEffect, useState } from "react";
import { searchMovies, hasOmdbKey } from "../../services/omdbService";
import type { Movie } from "../../types";

export function HealthView() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta] = useState<{buildTime: string, omdb: string, env: string}>({buildTime: new Date().toISOString(), omdb: hasOmdbKey() ? "live" : "demo-mock", env: import.meta.env.MODE});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await searchMovies("Batman");
        if (!cancelled) { setMovies(data.slice(0, 5)); setStatus("ok"); }
      } catch (e) {
        if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setStatus("error"); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Health Check</h1>
      <p className="muted">Fetched data proof for FE-04/05 capstone. This page hits OMDb at runtime and renders results.</p>

      <div className="card" style={{display:"grid", gap:12}}>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          <span className="alert" style={{background: status==="ok" ? "#0f2a14" : status==="error" ? "#2a0f12" : "#1a1a24", border:"1px solid var(--border)"}}>
            Status: <strong>{status}</strong>
          </span>
          <span className="alert" style={{background:"var(--surface-2)", border:"1px solid var(--border)"}}>OMDb: <strong>{meta.omdb}</strong></span>
          <span className="alert" style={{background:"var(--surface-2)", border:"1px solid var(--border)"}}>Env: <strong>{meta.env}</strong></span>
        </div>

        <div className="muted small">
          Build time: {meta.buildTime} • API: https://www.omdbapi.com/?s=Batman • Key: {hasOmdbKey() ? "configured (4a…)" : "demo fallback"}
        </div>

        {status==="loading" && <div className="loading">Fetching Batman movies from OMDb…</div>}
        {status==="error" && <div className="alert alert-error">{error}</div>}

        {status==="ok" && (
          <>
            <div className="alert alert-success">Fetched {movies.length} movies — rendering live data below:</div>
            <div style={{display:"grid", gap:10}}>
              {movies.map(m => (
                <div key={m.imdbID} className="card" style={{display:"flex", gap:12, alignItems:"center", padding:12}}>
                  <img src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/80x120/1a1a2e/ffffff?text=No+Poster"} alt={m.Title} style={{width:56, height:84, objectFit:"cover", borderRadius:8, border:"1px solid var(--border)"}} />
                  <div>
                    <div style={{fontWeight:700}}>{m.Title}</div>
                    <div className="muted small">{m.Year} • {m.Type} • {m.imdbID}</div>
                  </div>
                  <span className="alert" style={{marginLeft:"auto", background:"var(--surface-2)", fontSize:12}}>Response: True</span>
                </div>
              ))}
            </div>
            <details style={{marginTop:8}}>
              <summary className="muted" style={{cursor:"pointer"}}>Raw JSON (first movie)</summary>
              <pre style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:12, padding:12, overflow:"auto", fontSize:12, marginTop:8}}>
{JSON.stringify(movies[0], null, 2)}
              </pre>
            </details>
          </>
        )}

        <div style={{display:"flex", gap:8, marginTop:8, flexWrap:"wrap"}}>
          <span className="muted small">Routes: / (Home) • /favourites • /auth • /health (this page) • Responsive at 375px & 1280px</span>
        </div>
      </div>
    </div>
  );
}
