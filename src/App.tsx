import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/Header/Header";
import { FavouritesView } from "./pages/Favourites/FavouritesView";
import { AuthView } from "./pages/Auth/AuthView";
import { HealthView } from "./pages/Health/HealthView";
import { Week03View } from "./pages/Week03/Week03View";
import { LaunchPlanView } from "./pages/LaunchPlan/LaunchPlanView";
import { PlaygroundView } from "./playground/PlaygroundView";
import { ChatView } from "./pages/Chat/ChatView";
import { StackChoiceView } from "./pages/StackChoice/StackChoiceView";
import { Fl05View } from "./pages/Fl05/Fl05View";
import { WorkflowView } from "./pages/Workflow/WorkflowView";
import { ExplainView } from "./pages/Explain/ExplainView";
import { AgentSpecView } from "./pages/AgentSpec/AgentSpecView";
import { AgentRunView } from "./pages/AgentRun/AgentRunView";
import { DnsView } from "./pages/Dns/DnsView";
import { MotionView } from "./pages/Motion/MotionView";
import { MakeItDoView } from "./pages/MakeItDo/MakeItDoView";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { AiPanel } from "./components/AiPanel/AiPanel";
import { useState, useEffect } from "react";

// Lift search state so Header and Home share it
function AppShell() {
  const [query, setQuery] = useState("");
  void useLocation();

  // We keep Home's own query in HomeViewModel; Header's query is mirrored via custom event
  // Simpler: share query via window event bus
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setQuery(detail);
    };
    window.addEventListener("cinescope:query", handler as EventListener);
    return () => window.removeEventListener("cinescope:query", handler as EventListener);
  }, []);

  // Sync header query changes back to Home via event? Home reads its own state.
  // For now Header owns Search navigation; HomeView will listen to header search.
  // We'll bridge by dispatching search trigger.
  const [searchTrigger, setSearchTrigger] = useState(0);

  function handleSearch() {
    window.dispatchEvent(new CustomEvent("cinescope:search", { detail: query }));
    setSearchTrigger(x => x + 1);
  }
  function handleClear() {
    setQuery("");
    window.dispatchEvent(new CustomEvent("cinescope:clear"));
  }

  // Patch HomeView to react to header events via effect override — done inside HomeView by listening
  // We keep App simple.

  return (
    <>
      <Header query={query} setQuery={setQuery} onSearch={handleSearch} onClear={handleClear} />
      <main className="main">
        <Routes>
          <Route path="/" element={<ErrorBoundary label="Home"><HomeViewWrapper headerQuery={query} headerSearchTrigger={searchTrigger} /></ErrorBoundary>} />
          <Route path="/favourites" element={<FavouritesView />} />
          <Route path="/auth" element={<AuthView />} />
          <Route path="/health" element={<HealthView />} />
          <Route path="/week03" element={<Week03View />} />
          <Route path="/identity" element={<Week03View />} />
          <Route path="/next-case" element={<LaunchPlanView />} />
          <Route path="/launch-plan" element={<LaunchPlanView />} />
          <Route path="/playground" element={<PlaygroundView />} />
          <Route path="/chat" element={<ErrorBoundary label="Chat"><ChatView /></ErrorBoundary>} />
          <Route path="/stack" element={<StackChoiceView />} />
          <Route path="/workflow" element={<WorkflowView />} />
          <Route path="/fl05" element={<Fl05View />} />
          <Route path="/mcp" element={<Fl05View />} />
          <Route path="/explain" element={<ExplainView />} />
          <Route path="/agent" element={<AgentSpecView />} />
          <Route path="/scout" element={<AgentRunView />} />
          <Route path="/dns" element={<DnsView />} />
          <Route path="/motion" element={<MotionView />} />
          <Route path="/make-it-do" element={<MakeItDoView />} />
          <Route path="/NOTES.md" element={<PlaygroundView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>CineScope — FlyRank AI Internship • Frontend AI Engineering • Week 3 • Built with React + AI</span>
        <span className="muted small">OMDb + Firebase • MVVM • Independent build — not a clone</span>
      </footer>
    </>
  );
}

// Wrapper that bridges header query into HomeViewModel
import { useHomeViewModel } from "./pages/Home/useHomeViewModel";
import { MovieCard } from "./components/MovieCard/MovieCard";
import { hasOmdbKey } from "./services/omdbService";

function HomeViewWrapper({ headerQuery, headerSearchTrigger }: { headerQuery: string; headerSearchTrigger: number }) {
  const vm = useHomeViewModel();

  // keep header query in sync (header is source of truth for top search)
  // reflect Home's query to header on mount
  useEffect(() => {
    if (headerQuery !== vm.query) {
      // only sync when header changes externally
    }
  }, [headerQuery]);

  // When header triggers search, execute Home search with header value
  useEffect(() => {
    if (headerSearchTrigger === 0) return;
    // Use headerQuery value for search
    const q = headerQuery.trim();
    if (!q) { vm.clearSearch(); return; }
    vm.setQuery(headerQuery);
    // defer to next tick so state updates
    setTimeout(() => vm.handleSearch(), 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerSearchTrigger]);

  // Also listen to custom events for direct dispatch
  useEffect(() => {
    const onSearch = (e: Event) => {
      const q = (e as CustomEvent).detail as string;
      vm.setQuery(q);
      setTimeout(() => vm.handleSearch(), 0);
    };
    const onClear = () => vm.clearSearch();
    window.addEventListener("cinescope:search", onSearch as EventListener);
    window.addEventListener("cinescope:clear", onClear as EventListener);
    return () => {
      window.removeEventListener("cinescope:search", onSearch as EventListener);
      window.removeEventListener("cinescope:clear", onClear as EventListener);
    };
  }, [vm]);

  return (
    <div className="page">
      <section className="hero">
        <h1 className="hero-title">Discover films you’ll love</h1>
        <p className="hero-sub">Search OMDb • Save favourites per account • Fast, minimal, MVVM</p>
        {!hasOmdbKey() && (
          <div className="banner">Demo mode — add <code>VITE_OMDB_API_KEY</code> in <code>.env</code> for live search. Showing curated titles.</div>
        )}
      </section>

      <div className="toolbar">
        <p className="toolbar-count">{vm.initialLoading ? "Loading…" : `${vm.movies.length} titles`}</p>
        {vm.query && <button className="btn-ghost" onClick={vm.clearSearch}>Clear → random</button>}
      </div>

      {vm.favFeedback && <div className="toast">{vm.favFeedback}</div>}
      {vm.error && <div className="alert alert-error">{vm.error}</div>}
      {vm.loading && <div className="loading">Searching…</div>}
      {vm.initialLoading && <div className="grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}</div>}

      {!vm.initialLoading && !vm.loading && vm.movies.length === 0 && !vm.error && (
        <div className="empty">No movies found. Try another keyword.</div>
      )}

      {!vm.initialLoading && vm.movies.length > 0 && (
        <>
          <AiPanel movies={vm.movies} />
          <div style={{marginBottom:16, marginTop:12}}>
            <a href="/playground" style={{fontSize:12, color:"#06b6d4"}}>FE-05 Playground: Dialog · Tabs · Disclosure →</a>
          </div>
          <div className="grid">
            {vm.movies.map(m => <MovieCard key={m.imdbID} movie={m} onFavourite={vm.handleFavourite} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
