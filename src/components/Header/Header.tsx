import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

interface HeaderProps {
  query?: string;
  setQuery?: (v: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
}

export function Header({ query = "", setQuery, onSearch, onClear }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSearch, setMobileSearch] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (location.pathname !== "/") navigate("/");
    onSearch?.();
    setMobileSearch(false);
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={onClear} aria-label="CineScope home">
          <span className="logo-icon" aria-hidden="true">◆</span> CINESCOPE
          <span className="logo-sub">Discover • Favourite • Watch</span>
        </Link>

        <form className="search-form" onSubmit={handleSubmit} role="search" aria-label="Movie search">
          <label htmlFor="header-search" className="sr-only">Search movies</label>
          <input
            id="header-search"
            className="search-input"
            placeholder="Search movies… (e.g. Inception, Batman)"
            value={query}
            onChange={e => setQuery?.(e.target.value)}
            aria-label="Search movies"
            autoComplete="off"
            type="search"
          />
          <button type="submit" className="btn-search" aria-label="Search">Search</button>
          {query && <button type="button" className="btn-clear" onClick={() => { setQuery?.(""); onClear?.(); }} aria-label="Clear search">✕</button>}
        </form>

        <nav className="nav" aria-label="Primary">
          <Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>Home</Link>
          <Link to="/favourites" className={location.pathname === "/favourites" ? "nav-link active" : "nav-link"}>
            Favourites
          </Link>
          <Link to="/health" className={location.pathname === "/health" ? "nav-link active" : "nav-link"}>Health</Link>
          {user ? (
            <>
              <span className="nav-user" title={user.email ?? ""}>{user.email?.split("@")[0]}</span>
              <button className="btn-ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">Sign In</Link>
          )}
        </nav>

        <button className="hamburger" onClick={() => setMobileSearch(v => !v)} aria-label="Toggle search" aria-expanded={mobileSearch} aria-controls="mobile-search-form">⌕</button>
      </div>

      {mobileSearch && (
        <form id="mobile-search-form" className="search-form-mobile" onSubmit={handleSubmit} role="search" aria-label="Movie search mobile">
          <label htmlFor="mobile-search" className="sr-only">Search movies</label>
          <input id="mobile-search" className="search-input" placeholder="Search movies…" value={query} onChange={e => setQuery?.(e.target.value)} autoFocus aria-label="Search movies" type="search" />
          <button type="submit" className="btn-search" aria-label="Search">Go</button>
        </form>
      )}
    </header>
  );
}
