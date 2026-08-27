import { useHomeViewModel } from "./useHomeViewModel";
import { MovieCard } from "../../components/MovieCard/MovieCard";
import { hasOmdbKey } from "../../services/omdbService";
import { useEffect } from "react";

export function HomeView() {
  const { query, setQuery, movies, loading, initialLoading, error, favFeedback, handleSearch, handleFavourite, clearSearch } = useHomeViewModel();

  // expose search state to header via custom event - header reads from this view model's state via prop drilling in App
  // Instead we use window dispatch for header sync (alternative: lift state - done in App)
  useEffect(() => {
    // no-op
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <h1 className="hero-title">Discover films you’ll love</h1>
        <p className="hero-sub">Search across OMDb • Save favourites per account • Minimal, fast, built with MVVM</p>
        {!hasOmdbKey() && (
          <div className="banner">
            Demo mode — add <code>VITE_OMDB_API_KEY</code> to <code>.env</code> for live OMDb search. Showing curated titles.
          </div>
        )}
      </section>

      <div className="toolbar">
        <p className="toolbar-count">{initialLoading ? "Loading…" : `${movies.length} titles`}</p>
        {query && <button className="btn-ghost" onClick={clearSearch}>Clear search → Show random</button>}
      </div>

      {/* local search controls for accessibility (header is primary) */}
      <form className="local-search" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <input className="search-input" placeholder="Search movies…" value={query} onChange={e => setQuery(e.target.value)} />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Searching…" : "Search"}</button>
      </form>

      {favFeedback && <div className="toast">{favFeedback}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading">Searching…</div>}
      {initialLoading && (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}
        </div>
      )}

      {!initialLoading && !loading && movies.length === 0 && !error && (
        <div className="empty">No movies found. Try another keyword.</div>
      )}

      {!initialLoading && movies.length > 0 && (
        <div className="grid">
          {movies.map(m => (
            <MovieCard key={m.imdbID} movie={m} onFavourite={handleFavourite} />
          ))}
        </div>
      )}
    </div>
  );
}
